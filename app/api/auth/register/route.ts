import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMagicLink } from "@/lib/auth";
import { sendRegistrationEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, locale } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check if user already exists with password
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser && existingUser.password) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create user if doesn't exist (without password - will be set after email verification)
    if (!existingUser) {
      await prisma.user.create({
        data: { email },
      });
    }

    // Generate and send registration link
    const token = await generateMagicLink(email);
    const emailLocale = ["en", "ru", "kz"].includes(locale) ? locale : "en";
    await sendRegistrationEmail(email, token, emailLocale);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to send registration link" }, { status: 500 });
  }
}
