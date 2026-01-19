import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildResponseXml,
  getScriptNameFromPath,
  verifySig,
} from "@/lib/freedompay";
import { applyCreditsIfNeeded } from "@/lib/payments";

export const runtime = "nodejs";

function normalizeStatus(params: Record<string, string>) {
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

export async function POST(request: Request) {
  const secretKey = process.env.FREEDOMPAY_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "FreedomPay not configured" }, { status: 500 });
  }

  const form = await request.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    params[key] = String(value);
  }

  const pathname = new URL(request.url).pathname;
  const scriptName = getScriptNameFromPath(pathname);

  if (!verifySig(scriptName, params, secretKey)) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const orderId = params.pg_order_id || null;
  const pgPaymentId = params.pg_payment_id || null;
  const status = normalizeStatus(params);
  const recurringProfile = params.pg_recurring_profile || null;
  const recurringExpiry = params.pg_recurring_profile_expiry_date || null;

  let payment = await prisma.payment.findFirst({
    where: {
      provider: "freedompay",
      OR: [
        pgPaymentId ? { pgPaymentId } : undefined,
        orderId ? { pgOrderId: orderId } : undefined,
      ].filter(Boolean) as any,
    },
  });

  if (!payment) {
    const userId = params.user_id || null;
    if (userId) {
      payment = await prisma.payment.create({
        data: {
          userId,
          amount: Math.round(Number(params.pg_amount || 0) * 100) || 0,
          currency: params.pg_currency || "KZT",
          status,
          productType: params.product_type || "freedompay",
          creditsAdded: 0,
          provider: "freedompay",
          pgOrderId: orderId,
          pgPaymentId,
          pgRecurringProfile: recurringProfile,
          rawPayload: params,
        },
      });
    }
  } else {
    if (payment.status === "completed" || payment.status === "failed") {
      const xml = buildResponseXml(scriptName, "ok", "Already processed", secretKey);
      return new NextResponse(xml, { status: 200, headers: { "Content-Type": "text/xml" } });
    }

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

  if (payment && status === "completed") {
    await applyCreditsIfNeeded(payment.id, payment.userId, payment.productType);
  }

  if (payment?.userId && recurringProfile) {
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

  const xml = buildResponseXml(scriptName, "ok", "Order processed", secretKey);
  return new NextResponse(xml, { status: 200, headers: { "Content-Type": "text/xml" } });
}
