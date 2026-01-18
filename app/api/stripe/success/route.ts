import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleSuccessfulPayment } from "@/lib/stripe";


export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payments are disabled" },
        { status: 503 }
      );
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const paymentData = await handleSuccessfulPayment(sessionId);

    if (!paymentData) {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Check if already processed
    const existingPayment = await prisma.payment.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (existingPayment) {
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    // Add credits to user
    await prisma.user.update({
      where: { id: paymentData.userId },
      data: { credits: { increment: paymentData.credits } },
    });

    // Record payment
    await prisma.payment.create({
      data: {
        userId: paymentData.userId!,
        amount: 0, // Will be updated by webhook
        currency: "usd",
        status: "completed",
        stripeSessionId: sessionId,
        productType: paymentData.productType!,
        creditsAdded: paymentData.credits,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment success error:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
