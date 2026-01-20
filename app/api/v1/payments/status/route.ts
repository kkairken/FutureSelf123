/**
 * Check payment status and manually apply credits if needed
 *
 * GET /api/v1/payments/status?order_id=xxx
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { applyCreditsIfNeeded } from "@/lib/payments";

export const runtime = "nodejs";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");
    const paymentId = searchParams.get("payment_id");

    if (!orderId && !paymentId) {
      return NextResponse.json({ error: "order_id or payment_id required" }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        userId: user.id,
        OR: [
          orderId ? { pgOrderId: orderId } : undefined,
          paymentId ? { pgPaymentId: paymentId } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      productType: payment.productType,
      creditsAdded: payment.creditsAdded,
      pgOrderId: payment.pgOrderId,
      pgPaymentId: payment.pgPaymentId,
      createdAt: payment.createdAt,
      rawPayload: payment.rawPayload,
    });
  } catch (error) {
    console.error("[Payment Status] Error:", error);
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 });
  }
}

// POST to manually complete payment and apply credits (for testing)
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
    const orderId = body.order_id;
    const paymentId = body.payment_id;

    if (!orderId && !paymentId) {
      return NextResponse.json({ error: "order_id or payment_id required" }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        userId: user.id,
        OR: [
          orderId ? { pgOrderId: orderId } : undefined,
          paymentId ? { pgPaymentId: paymentId } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "completed" && payment.creditsAdded > 0) {
      return NextResponse.json({
        message: "Already completed",
        creditsAdded: payment.creditsAdded,
      });
    }

    // Mark as completed and apply credits
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "completed" },
    });

    await applyCreditsIfNeeded(payment.id, payment.userId, payment.productType);

    const updatedPayment = await prisma.payment.findUnique({
      where: { id: payment.id },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      message: "Credits applied",
      creditsAdded: updatedPayment?.creditsAdded,
      totalCredits: updatedUser?.credits,
    });
  } catch (error) {
    console.error("[Payment Status] Error:", error);
    return NextResponse.json({ error: "Failed to apply credits" }, { status: 500 });
  }
}
