import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripeClient } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  let stripe;

  try {
    stripe = getStripeClient();
  } catch (error) {
    console.error("Stripe config error:", error);
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;

        // Check if already processed
        const existingPayment = await prisma.payment.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (existingPayment) {
          break;
        }

        const userId = session.metadata?.userId;
        const credits = parseInt(session.metadata?.credits || "0");
        const productType = session.metadata?.productType;

        if (userId && credits > 0) {
          // Add credits
          await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: credits } },
          });

          // Record payment
          await prisma.payment.create({
            data: {
              userId,
              amount: session.amount_total || 0,
              currency: session.currency || "usd",
              status: "completed",
              stripeSessionId: session.id,
              stripePaymentId: session.payment_intent as string,
              productType: productType || "unknown",
              creditsAdded: credits,
            },
          });

          console.log(`Credits added: ${credits} for user ${userId}`);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: subscription.id },
            create: {
              userId,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              status: subscription.status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
            update: {
              status: subscription.status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });

          console.log(`Subscription updated for user ${userId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "canceled" },
        });

        console.log(`Subscription canceled: ${subscription.id}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscriptionId as string },
          });

          if (subscription) {
            // Add monthly credits for subscription
            await prisma.user.update({
              where: { id: subscription.userId },
              data: { credits: { increment: 3 } }, // 3 credits per month
            });

            console.log(`Monthly credits added for subscription ${subscriptionId}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
