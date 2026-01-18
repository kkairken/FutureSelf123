import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripeClient;
}

export const PRICING = {
  "1_chapter": {
    credits: 7,
    price: 1000, // KZT
    name: "7 Chapters",
  },
  "5_chapters": {
    credits: 20,
    price: 2000, // KZT
    name: "20 Chapters",
  },
  "10_chapters": {
    credits: 40,
    price: 5000, // KZT
    name: "40 Chapters",
  },
};

export async function createCheckoutSession(
  userId: string,
  productType: keyof typeof PRICING,
  userEmail: string
) {
  const stripe = getStripeClient();
  const product = PRICING[productType];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    customer_email: userEmail,
    client_reference_id: userId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: `${product.credits} chapter${product.credits > 1 ? "s" : ""}`,
          },
          unit_amount: product.price,
          ...(productType === "subscription" && { recurring: { interval: "month" } }),
        },
        quantity: 1,
      },
    ],
    mode: productType === "subscription" ? "subscription" : "payment",
    success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing`,
    metadata: {
      userId,
      productType,
      credits: product.credits.toString(),
    },
  };

  const session = await stripe.checkout.sessions.create(sessionConfig);

  return session;
}

export async function handleSuccessfulPayment(sessionId: string) {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid" || session.status === "complete") {
    return {
      userId: session.metadata?.userId,
      productType: session.metadata?.productType,
      credits: parseInt(session.metadata?.credits || "0"),
    };
  }

  return null;
}
