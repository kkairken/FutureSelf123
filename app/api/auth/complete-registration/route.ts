import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMagicLink, hashPassword, generateAuthToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { token, name, password, language } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const email = await verifyMagicLink(token);

    if (!email) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Update user with name and password
    const normalizedLocale = ["en", "ru", "kz"].includes(language) ? language : "en";

    const user = await prisma.user.update({
      where: { email },
      data: {
        name: name.trim(),
        password: hashedPassword,
        language: normalizedLocale,
      },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        language: true,
      },
    });

    const authToken = generateAuthToken(user.id);

    return NextResponse.json({
      success: true,
      token: authToken,
      user,
    });
  } catch (error) {
    console.error("Complete registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
