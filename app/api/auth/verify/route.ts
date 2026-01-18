import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMagicLink, generateAuthToken } from "@/lib/auth";


export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const email = await verifyMagicLink(token);

    if (!email) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, credits: true, language: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const authToken = generateAuthToken(user.id);

    return NextResponse.json({
      success: true,
      token: authToken,
      user,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
