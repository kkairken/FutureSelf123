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

    if (!merchantId || !secretKey) {
      return NextResponse.json({ error: "FreedomPay not configured" }, { status: 500 });
    }

    const pg_salt = randomSalt();
    const productName = PRODUCT_NAMES[productType]?.[language] || PRODUCT_NAMES[productType]?.en || productType;

    // FreedomPay language code mapping
    const pgLanguage = language === "kz" ? "kz" : language === "ru" ? "ru" : "en";

    // Parameters for payment.php (sorted alphabetically for signature)
    const params: Record<string, string> = {
      pg_amount: String(product.amount),
      pg_currency: "KZT",
      pg_description: productName,
      pg_language: pgLanguage,
      pg_merchant_id: merchantId,
      pg_salt,
      // Custom parameter to identify user (will be passed to result_url)
      user_id: user.id,
      product_type: productType,
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
    });

    return NextResponse.json({ payment_url: paymentUrl });
  } catch (error) {
    console.error("FreedomPay link error:", error);
    return NextResponse.json({ error: "Failed to generate payment link" }, { status: 500 });
  }
}
