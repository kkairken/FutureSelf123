/**
 * Check payment status and apply credits if payment confirmed by FreedomPay
 *
 * GET /api/v1/payments/status?order_id=xxx - check status
 * POST /api/v1/payments/status - verify with FreedomPay and apply credits
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { getConfig, checkPaymentStatus } from "@/lib/freedompay";
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
    });
  } catch (error) {
    console.error("[Payment Status] Error:", error);
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 });
  }
}

// POST to verify payment with FreedomPay and apply credits
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

    // Find payment in our database
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

    // Already completed - return current state
    if (payment.status === "completed" && payment.creditsAdded > 0) {
      return NextResponse.json({
        message: "Already completed",
        creditsAdded: payment.creditsAdded,
        status: payment.status,
      });
    }

    // SECURITY: Verify payment status with FreedomPay API
    let config;
    try {
      config = getConfig();
    } catch (error) {
      console.error("[Payment Status] Config error:", error);
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 });
    }

    console.log("[Payment Status] Checking with FreedomPay:", {
      orderId: payment.pgOrderId,
      paymentId: payment.pgPaymentId,
    });

    const fpStatus = await checkPaymentStatus(config, {
      orderId: payment.pgOrderId || undefined,
      paymentId: payment.pgPaymentId || undefined,
    });

    console.log("[Payment Status] FreedomPay response:", fpStatus);

    // Check if payment is actually successful in FreedomPay
    const isSuccess =
      fpStatus.status === "ok" &&
      (fpStatus.paymentStatus === "success" || fpStatus.paymentStatus === "ok");

    if (!isSuccess) {
      // Update payment status if it failed
      if (fpStatus.paymentStatus === "failed" || fpStatus.paymentStatus === "error") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "failed" },
        });
      }

      return NextResponse.json({
        message: "Payment not confirmed by FreedomPay",
        fpStatus: fpStatus.status,
        fpPaymentStatus: fpStatus.paymentStatus,
        status: payment.status,
      });
    }

    // Payment confirmed - mark as completed and apply credits
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

    console.log("[Payment Status] Credits applied:", {
      paymentId: payment.id,
      creditsAdded: updatedPayment?.creditsAdded,
      totalCredits: updatedUser?.credits,
    });

    return NextResponse.json({
      message: "Payment verified and credits applied",
      creditsAdded: updatedPayment?.creditsAdded,
      totalCredits: updatedUser?.credits,
      status: "completed",
    });
  } catch (error) {
    console.error("[Payment Status] Error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
