import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { buildSig, randomSalt } from "@/lib/freedompay";

export const runtime = "nodejs";

// Product configuration
const PRODUCTS: Record<string, { amount: number; credits: number }> = {
  "1_chapter": { amount: 1000, credits: 7 },
  "5_chapters": { amount: 2000, credits: 20 },
  "10_chapters": { amount: 5000, credits: 40 },
  "subscription_100": { amount: 6000, credits: 100 },
};

// Product names by language
const PRODUCT_NAMES: Record<string, Record<string, string>> = {
  "1_chapter": {
    en: "7 chapters",
    ru: "7 кредитов",
    kz: "7 тарау",
  },
  "5_chapters": {
    en: "20 chapters",
    ru: "20 глав",
    kz: "20 тарау",
  },
  "10_chapters": {
    en: "40 chapters",
    ru: "40 глав",
    kz: "40 тарау",
  },
  "subscription_100": {
    en: "100 chapters monthly",
    ru: "100 глав ежемесячно",
    kz: "Ай сайын 100 тарау",
  },
};

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
    const productType = String(body.product_type || "").trim();
    const language = String(body.language || "ru").trim();

    const product = PRODUCTS[productType];
    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const merchantId = process.env.FREEDOMPAY_MERCHANT_ID;
    const secretKey = process.env.FREEDOMPAY_SECRET_KEY;
    const baseUrl = process.env.FREEDOMPAY_GATEWAY_BASE || "https://api.freedompay.kz";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!merchantId || !secretKey) {
      return NextResponse.json({ error: "FreedomPay not configured" }, { status: 500 });
    }

    const pg_salt = randomSalt();
    const pg_result_url = `${appUrl}/api/v1/payments/freedompay/result`;
    const pg_success_url = `${appUrl}/payment/success?status=success`;
    const pg_failure_url = `${appUrl}/payment/success?status=failed`;
    const productName = PRODUCT_NAMES[productType]?.[language] || PRODUCT_NAMES[productType]?.en || productType;

    // Generate unique order ID
    const pg_order_id = `${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

    // FreedomPay language code mapping
    const pgLanguage = language === "kz" ? "kz" : language === "ru" ? "ru" : "en";

    // Parameters for payment.php
    // Custom parameters (without pg_ prefix) will be passed to check_url and result_url
    const params: Record<string, string> = {
      pg_amount: String(product.amount),
      pg_currency: "KZT",
      pg_description: productName,
      pg_failure_url,
      pg_language: pgLanguage,
      pg_merchant_id: merchantId,
      pg_order_id,
      pg_result_url,
      pg_salt,
      pg_success_url,
      // Custom parameters for callback identification
      product_type: productType,
      user_id: user.id,
    };

    // Build signature
    const pg_sig = buildSig("payment.php", params, secretKey);

    // Build URL
    const urlParams = new URLSearchParams({ ...params, pg_sig });
    const paymentUrl = `${baseUrl}/payment.php?${urlParams.toString()}`;

    console.log("FreedomPay payment link generated:", {
      userId: user.id,
      productType,
      amount: product.amount,
      language: pgLanguage,
      pg_order_id,
      paymentUrl,
    });

    return NextResponse.json({ payment_url: paymentUrl });
  } catch (error) {
    console.error("FreedomPay link error:", error);
    return NextResponse.json({ error: "Failed to generate payment link" }, { status: 500 });
  }
}
