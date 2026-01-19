import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import {
  buildSig,
  normalizeParams,
  postForm,
  randomSalt,
} from "@/lib/freedompay";

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
    const reservationIdRaw = String(body.reservation_id || "").trim();
    let reservationId = reservationIdRaw.replace(/\D/g, "");
    if (!reservationId) {
      reservationId = `${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;
    }
    const amount = Number(body.amount);
    const description =
      String(body.description || "").trim() || `Payment for ${reservationId}`;
    const successUrl = String(body.success_url || "").trim();
    const failureUrl = String(body.failure_url || "").trim();
    const productType = String(body.product_type || "freedompay").trim();

    if (!Number.isFinite(amount) || amount <= 0) {
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
    const pg_check_url =
      process.env.FREEDOMPAY_CHECK_URL || `${appUrl}/api/v1/payments/freedompay/check`;

    const pg_salt = randomSalt();

    // Параметры для FreedomPay API (участвуют в подписи)
    const paymentParams = normalizeParams({
      pg_merchant_id: merchantId,
      pg_order_id: reservationId,
      pg_amount: amount.toFixed(2),
      pg_currency: "KZT",
      pg_description: description,
      pg_result_url,
      pg_check_url,
      pg_salt,
      // Опционально: если нужны recurring платежи
      ...(body.pg_recurring_start && { pg_recurring_start: body.pg_recurring_start }),
      ...(body.pg_recurring_lifetime && { pg_recurring_lifetime: body.pg_recurring_lifetime }),
      // Опционально: URL для редиректов (если поддерживаются FreedomPay)
      ...(successUrl && { pg_success_url: successUrl }),
      ...(failureUrl && { pg_failure_url: failureUrl }),
    });

    const pg_sig = buildSig("init_payment.php", paymentParams, secretKey);
    const payload = { ...paymentParams, pg_sig };

    console.log("FreedomPay init request:", {
      url: `${baseUrl}/init_payment.php`,
      params: Object.keys(payload),
      pg_order_id: payload.pg_order_id,
      pg_amount: payload.pg_amount,
    });

    const response = await postForm(baseUrl, "init_payment.php", payload);
    const pg_status = response.parsed.pg_status;

    if (!response.ok || pg_status !== "ok") {
      console.error("FreedomPay init failed:", {
        ok: response.ok,
        status: response.status,
        parsed: response.parsed,
        raw: response.raw,
      });
      return NextResponse.json(
        { error: "FreedomPay init failed", details: response.parsed },
        { status: 502 }
      );
    }

    const pg_payment_id = response.parsed.pg_payment_id;
    const redirect_url = response.parsed.pg_redirect_url;

    if (redirect_url) {
      await prisma.payment.create({
        data: {
          userId: user.id,
          amount: Math.round(amount * 100),
          currency: "KZT",
          status: "pending",
          productType,
          creditsAdded: 0,
          provider: "freedompay",
          pgOrderId: reservationId,
          pgPaymentId: pg_payment_id || null,
          rawPayload: {
            ...response.parsed,
            // Сохраняем метаданные для внутреннего использования
            internal_user_id: user.id,
            internal_product_type: productType,
            internal_success_url: successUrl,
            internal_failure_url: failureUrl,
          },
        },
      });

      console.log("Payment record created:", {
        userId: user.id,
        pgOrderId: reservationId,
        pgPaymentId: pg_payment_id,
        amount,
      });
    }

    return NextResponse.json({
      pg_payment_id,
      redirect_url,
    });
  } catch (error) {
    console.error("FreedomPay init error:", error);
    return NextResponse.json({ error: "Failed to init payment" }, { status: 500 });
  }
}
