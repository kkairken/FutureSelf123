import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { applyCreditsIfNeeded } from "@/lib/payments";
import { buildSig, normalizeParams, postForm, randomSalt } from "@/lib/freedompay";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const recurringProfile = String(body.pg_recurring_profile || "").trim();
    const amount = Number(body.amount);
    const description = String(body.description || "").trim() || "Recurring payment";
    const productType = String(body.product_type || "subscription_100").trim();
    const orderId = String(body.order_id || `recurring_${Date.now()}`).trim();

    if (!recurringProfile || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const merchantId = process.env.FREEDOMPAY_MERCHANT_ID;
    const secretKey = process.env.FREEDOMPAY_SECRET_KEY;
    const baseUrl =
      process.env.FREEDOMPAY_GATEWAY_BASE || "https://api.freedompay.kz";

    if (!merchantId || !secretKey) {
      return NextResponse.json({ error: "FreedomPay not configured" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const pg_result_url =
      process.env.FREEDOMPAY_RESULT_URL || `${appUrl}/api/v1/payments/freedompay/result`;

    const pg_salt = randomSalt();
    const params = normalizeParams({
      pg_merchant_id: merchantId,
      pg_recurring_profile: recurringProfile,
      pg_amount: amount.toFixed(2),
      pg_currency: "KZT",
      pg_description: description,
      pg_result_url,
      pg_salt,
      pg_order_id: orderId,
    });

    const pg_sig = buildSig("make_recurring_payment", params, secretKey);
    const payload = { ...params, pg_sig };

    const response = await postForm(baseUrl, "make_recurring_payment", payload);
    const pg_status = response.parsed.pg_status;

    if (!response.ok || pg_status !== "ok") {
      return NextResponse.json(
        { error: "FreedomPay recurring failed", details: response.parsed },
        { status: 502 }
      );
    }

    const pgPaymentId = response.parsed.pg_payment_id || null;
    const status = response.parsed.pg_payment_status?.toLowerCase() === "success" ? "completed" : "pending";

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount: Math.round(amount * 100),
        currency: "KZT",
        status,
        productType,
        creditsAdded: 0,
        provider: "freedompay",
        pgOrderId: orderId,
        pgPaymentId,
        pgRecurringProfile: recurringProfile,
        rawPayload: response.parsed,
      },
    });

    if (status === "completed") {
      await applyCreditsIfNeeded(payment.id, payment.userId, payment.productType);
    }

    return NextResponse.json({
      pg_payment_id: pgPaymentId,
      status: pg_status,
      payment_status: response.parsed.pg_payment_status || null,
    });
  } catch (error) {
    console.error("FreedomPay recurring error:", error);
    return NextResponse.json({ error: "Failed to process recurring payment" }, { status: 500 });
  }
}
