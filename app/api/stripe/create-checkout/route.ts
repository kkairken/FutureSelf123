import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { createCheckoutSession, PRICING } from "@/lib/stripe";

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

    const { productType } = await request.json();

    if (!PRICING[productType as keyof typeof PRICING]) {
      return NextResponse.json({ error: "Invalid product type" }, { status: 400 });
    }

    const session = await createCheckoutSession(
      user.id,
      productType as keyof typeof PRICING,
      user.email
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
