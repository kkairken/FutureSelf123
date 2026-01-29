/**
 * Payment Initialization Endpoint
 *
 * POST /api/v1/payments/init
 *
 * Supports:
 * - One-time payments (default)
 * - Recurring payments (subscription_100 product type)
 *
 * Request body:
 * {
 *   product_type: "1_chapter" | "5_chapters" | "10_chapters" | "subscription_100"
 *   language?: "en" | "ru" | "kz"
 * }
 *
 * Response:
 * {
 *   redirect_url: string  // URL to redirect user to FreedomPay payment page
 *   pg_payment_id?: string
 *   pg_order_id: string
 * }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import {
  getConfig,
  validateConfig,
  initPayment,
  generateOrderId,
  getErrorDescription,
  parseXmlToObject,
} from "@/lib/freedompay";

export const runtime = "nodejs";

// =============================================================================
// PRODUCT CONFIGURATION
// =============================================================================

interface Product {
  amountKZT: number;
  credits: number;
  isSubscription: boolean;
  recurringLifetime?: number; // months
}

const PRODUCTS: Record<string, Product> = {
  "1_chapter": {
    amountKZT: Number(process.env.PRICE_7_KZT) || 1000,
    credits: 7,
    isSubscription: false,
  },
  "5_chapters": {
    amountKZT: Number(process.env.PRICE_20_KZT) || 2000,
    credits: 20,
    isSubscription: false,
  },
  "10_chapters": {
    amountKZT: Number(process.env.PRICE_40_KZT) || 3900,
    credits: 40,
    isSubscription: false,
  },
  "subscription_100": {
    amountKZT: Number(process.env.PRICE_100_KZT) || 6000,
    credits: 100,
    isSubscription: true,
    recurringLifetime: 12, // 12 months
  },
};

// Currency exchange rates (KZT per 1 unit of foreign currency)
const EXCHANGE_RATES: Record<string, number> = {
  KZT: 1,
  USD: Number(process.env.NEXT_PUBLIC_RATE_USD) || 470,
  EUR: Number(process.env.NEXT_PUBLIC_RATE_EUR) || 510,
};

// Rounding steps for each currency
const ROUNDING: Record<string, number> = {
  KZT: Number(process.env.NEXT_PUBLIC_ROUND_KZT) || 10,
  USD: Number(process.env.NEXT_PUBLIC_ROUND_USD) || 1,
  EUR: Number(process.env.NEXT_PUBLIC_ROUND_EUR) || 1,
};

/**
 * Convert KZT amount to target currency
 */
function convertCurrency(amountKZT: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency] || 1;
  const step = ROUNDING[currency] || 1;
  const converted = amountKZT / rate;
  return Math.ceil(converted / step) * step;
}

// Product names by language (shown on FreedomPay payment page)
const PRODUCT_NAMES: Record<string, Record<string, string>> = {
  "1_chapter": {
    en: "7 chapters",
    ru: "7 глав",
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
    en: "Monthly subscription - 100 chapters",
    ru: "Месячная подписка - 100 глав",
    kz: "Айлық жазылым - 100 тарау",
  },
};

// =============================================================================
// HANDLER
// =============================================================================

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2. Parse request
    const body = await request.json();
    const productType = String(body.product_type || "").trim();
    const language = String(body.language || "ru").trim();
    const currency = ["KZT", "USD", "EUR"].includes(body.currency) ? body.currency : "KZT";

    // 3. Validate product
    const product = PRODUCTS[productType];
    if (!product) {
      return NextResponse.json(
        {
          error: "Invalid product",
          valid_products: Object.keys(PRODUCTS),
        },
        { status: 400 }
      );
    }

    // 4. Load and validate config
    let config;
    try {
      config = getConfig();
    } catch (error) {
      console.error("[Payment Init] Config error:", error);
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      );
    }

    // Log warnings about localhost URLs
    const warnings = validateConfig(config);
    if (warnings.length > 0) {
      console.warn("[Payment Init] Configuration warnings:", warnings);
    }

    // 5. Generate unique order ID
    const orderId = generateOrderId();

    // 6. Get product description
    const description =
      PRODUCT_NAMES[productType]?.[language] ||
      PRODUCT_NAMES[productType]?.en ||
      `Purchase: ${productType}`;

    // 7. Calculate amount in selected currency
    const amount = convertCurrency(product.amountKZT, currency);

    // 8. Create payment record in database (pending)
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount: Math.round(amount * 100), // Store in cents/tiyn
        currency: currency,
        status: "pending",
        productType,
        creditsAdded: 0,
        provider: "freedompay",
        pgOrderId: orderId,
      },
    });

    // 9. Initialize payment with FreedomPay
    console.log("[Payment Init] Starting payment:", {
      userId: user.id,
      productType,
      amount,
      currency,
      amountKZT: product.amountKZT,
      isSubscription: product.isSubscription,
      orderId,
    });

    const response = await initPayment(config, {
      orderId,
      amount,
      currency,
      description,
      language,
      userId: user.id, // Required for recurring payments (pg_user_id)
      recurringStart: product.isSubscription,
      recurringLifetime: product.recurringLifetime,
    });

    const parsed = response.parsed.pg_status
      ? response.parsed
      : parseXmlToObject(response.raw);

    // 10. Handle response
    const pg_status = parsed.pg_status;
    const pg_error_code = parsed.pg_error_code;
    const pg_error_description = parsed.pg_error_description;

    if (pg_status !== "ok") {
      console.error("[Payment Init] FreedomPay error:", {
        status: pg_status,
        errorCode: pg_error_code,
        errorDescription: pg_error_description,
        raw: response.raw,
      });

      // Provide helpful error message
      const errorMessage = pg_error_description || getErrorDescription(pg_error_code || "0");

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          rawPayload: parsed,
        },
      });

      return NextResponse.json(
        {
          error: "Payment initialization failed",
          details: {
            code: pg_error_code,
            message: errorMessage,
            hint:
              pg_error_code === "9998" || pg_error_description?.includes("null")
                ? "Check FREEDOMPAY_MERCHANT_ID and FREEDOMPAY_SECRET_KEY in .env"
                : undefined,
          },
        },
        { status: 502 }
      );
    }

    const pg_payment_id = parsed.pg_payment_id;
    const redirect_url = parsed.pg_redirect_url;

    if (!redirect_url) {
      console.error("[Payment Init] No redirect URL in response:", response.parsed);
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          rawPayload: parsed,
        },
      });
      return NextResponse.json(
        { error: "No redirect URL received from payment system" },
        { status: 502 }
      );
    }

    // 11. Update payment record with gateway response
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        pgPaymentId: pg_payment_id || null,
        rawPayload: parsed,
      },
    });

    console.log("[Payment Init] Success:", {
      paymentId: payment.id,
      pgOrderId: orderId,
      pgPaymentId: pg_payment_id,
      redirectUrl: redirect_url,
    });

    // 12. Return redirect URL
    return NextResponse.json({
      redirect_url,
      pg_payment_id,
      pg_order_id: orderId,
    });
  } catch (error) {
    console.error("[Payment Init] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
