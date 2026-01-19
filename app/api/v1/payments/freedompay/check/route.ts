/**
 * FreedomPay Check Callback Handler
 *
 * POST /api/v1/payments/freedompay/check
 *
 * Called by FreedomPay BEFORE accepting payment to verify the order is valid.
 * This is optional - if not configured, FreedomPay will skip this step.
 *
 * Must respond with XML containing pg_status: "ok", "rejected", or "error"
 *
 * Response meanings:
 * - "ok": Order is valid, proceed with payment
 * - "rejected": Order is invalid, cancel payment
 * - "error": Server error, FreedomPay will retry
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildResponseXml,
  getScriptNameFromPath,
  verifySig,
  getConfig,
} from "@/lib/freedompay";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  let secretKey: string;

  try {
    const config = getConfig();
    secretKey = config.secretKey;
  } catch (error) {
    console.error("[FreedomPay Check] Config error:", error);
    return new NextResponse("Server configuration error", { status: 500 });
  }

  // 1. Parse request
  const params = await parseFormData(request);

  console.log("[FreedomPay Check] Received callback:", {
    pg_order_id: params.pg_order_id,
    pg_amount: params.pg_amount,
  });

  // 2. Get script name for signature verification
  const pathname = new URL(request.url).pathname;
  const scriptName = getScriptNameFromPath(pathname);

  // 3. Verify signature
  if (!verifySig(scriptName, params, secretKey)) {
    console.error("[FreedomPay Check] Invalid signature");
    const xml = buildResponseXml(scriptName, "error", "Invalid signature", secretKey);
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  // 4. Extract order info
  const orderId = params.pg_order_id;
  if (!orderId) {
    console.error("[FreedomPay Check] Missing order ID");
    const xml = buildResponseXml(scriptName, "error", "Missing order ID", secretKey);
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  // 5. Check if payment exists in database
  const payment = await prisma.payment.findUnique({
    where: { pgOrderId: orderId },
  });

  if (!payment) {
    // Payment not found - this might be OK if using direct payment links
    // In that case, we accept the payment and create record in result callback
    console.log("[FreedomPay Check] Payment not found, accepting anyway");
    const xml = buildResponseXml(scriptName, "ok", "Order accepted", secretKey);
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  // 6. Check payment status
  if (payment.status === "completed") {
    // Already paid - reject to prevent double payment
    console.warn("[FreedomPay Check] Order already completed, rejecting");
    const xml = buildResponseXml(scriptName, "rejected", "Order already paid", secretKey);
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  if (payment.status === "failed") {
    // Failed payment - allow retry
    console.log("[FreedomPay Check] Previous attempt failed, allowing retry");
  }

  // 7. Verify amount matches (optional but recommended)
  const expectedAmount = payment.amount / 100; // Convert from cents
  const receivedAmount = Number(params.pg_amount || 0);

  if (receivedAmount > 0 && Math.abs(expectedAmount - receivedAmount) > 1) {
    console.error("[FreedomPay Check] Amount mismatch:", {
      expected: expectedAmount,
      received: receivedAmount,
    });
    const xml = buildResponseXml(scriptName, "rejected", "Amount mismatch", secretKey);
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  // 8. Order is valid
  console.log("[FreedomPay Check] Order verified OK");
  const xml = buildResponseXml(scriptName, "ok", "Order available", secretKey);
  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
