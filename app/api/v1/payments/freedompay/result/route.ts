/**
 * FreedomPay Result Callback Handler
 *
 * POST /api/v1/payments/freedompay/result
 *
 * Called by FreedomPay after payment is processed (success or failure).
 * FreedomPay will retry this endpoint every 30 minutes for 2 hours if unreachable.
 *
 * Must respond with XML containing pg_status: "ok", "rejected", or "error"
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildResponseXml,
  getScriptNameFromPath,
  verifySig,
  getConfig,
} from "@/lib/freedompay";
import { applyCreditsIfNeeded } from "@/lib/payments";

export const runtime = "nodejs";

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Normalize payment status from various FreedomPay fields
 */
function normalizeStatus(params: Record<string, string>): "completed" | "pending" | "failed" {
  const status = (params.pg_payment_status || params.pg_status || "").toLowerCase();
  const result = String(params.pg_result || "").toLowerCase();

  if (status === "success" || status === "ok" || result === "1") {
    return "completed";
  }
  if (status === "pending") {
    return "pending";
  }
  return "failed";
}

/**
 * Parse form data to object
 */
async function parseFormData(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") || "";
  const params: Record<string, string> = {};

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    for (const [key, value] of form.entries()) {
      params[key] = String(value);
    }
  } else {
    // Try to parse as JSON (some test tools might send JSON)
    try {
      const json = await request.json();
      for (const [key, value] of Object.entries(json)) {
        params[key] = String(value);
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  return params;
}

// =============================================================================
// HANDLER
// =============================================================================

export async function POST(request: Request) {
  let secretKey: string;

  try {
    const config = getConfig();
    secretKey = config.secretKey;
  } catch (error) {
    console.error("[FreedomPay Result] Config error:", error);
    return new NextResponse("Server configuration error", { status: 500 });
  }

  // 1. Parse request
  const params = await parseFormData(request);

  console.log("[FreedomPay Result] Received callback:", {
    pg_order_id: params.pg_order_id,
    pg_payment_id: params.pg_payment_id,
    pg_payment_status: params.pg_payment_status,
    pg_result: params.pg_result,
    pg_status: params.pg_status,
    all_params: JSON.stringify(params),
  });

  // 2. Get script name for signature verification
  const pathname = new URL(request.url).pathname;
  const scriptName = getScriptNameFromPath(pathname);

  // 3. Verify signature
  if (!verifySig(scriptName, params, secretKey)) {
    console.error("[FreedomPay Result] Invalid signature");
    const xml = buildResponseXml(scriptName, "error", "Invalid signature", secretKey);
    return new NextResponse(xml, {
      status: 200, // FreedomPay expects 200 even for errors
      headers: { "Content-Type": "text/xml" },
    });
  }

  // 4. Extract payment info
  const orderId = params.pg_order_id || null;
  const pgPaymentId = params.pg_payment_id || null;
  const status = normalizeStatus(params);
  const recurringProfile = params.pg_recurring_profile || null;
  const recurringExpiry = params.pg_recurring_profile_expiry_date || null;

  console.log("[FreedomPay Result] Normalized status:", status);

  // 5. Find existing payment record
  const payment = orderId
    ? await prisma.payment.findFirst({
        where: { pgOrderId: orderId },
      })
    : null;

  // 6. Create or update payment record
  if (!payment) {
    console.error("[FreedomPay Result] Payment not found for order:", orderId);
    const xml = buildResponseXml(scriptName, "error", "Payment not found", secretKey);
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } else {
    // Payment found - check if already processed
    if (payment.status === "completed" || payment.status === "failed") {
      console.log("[FreedomPay Result] Payment already processed:", payment.status);
      const xml = buildResponseXml(scriptName, "ok", "Already processed", secretKey);
      return new NextResponse(xml, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Update payment record
    console.log("[FreedomPay Result] Updating payment:", payment.id);
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        pgPaymentId,
        pgRecurringProfile: recurringProfile,
        rawPayload: params,
      },
    });
  }

  // 7. Apply credits if payment successful
  if (payment && status === "completed") {
    console.log("[FreedomPay Result] Applying credits for payment:", payment.id);
    await applyCreditsIfNeeded(payment.id, payment.userId, payment.productType);
  }

  // 8. Handle recurring profile
  if (payment?.userId && recurringProfile) {
    console.log("[FreedomPay Result] Saving recurring profile:", recurringProfile);
    await prisma.recurringProfile.upsert({
      where: { profileId: recurringProfile },
      create: {
        userId: payment.userId,
        profileId: recurringProfile,
        status: "active",
        expiresAt: recurringExpiry ? new Date(recurringExpiry) : null,
        lastPaymentId: payment.id,
      },
      update: {
        status: "active",
        expiresAt: recurringExpiry ? new Date(recurringExpiry) : null,
        lastPaymentId: payment.id,
      },
    });
  }

  // 9. Return success response
  console.log("[FreedomPay Result] Callback processed successfully");
  const xml = buildResponseXml(scriptName, "ok", "Order processed", secretKey);
  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
