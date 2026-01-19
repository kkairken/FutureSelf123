import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMagicLink } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, locale } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Create user if doesn't exist
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
    }

    const normalizedLocale = ["en", "ru", "kz"].includes(locale) ? locale : null;
    if (normalizedLocale && user.language !== normalizedLocale) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { language: normalizedLocale },
      });
    }

    // Generate and send magic link
    const token = await generateMagicLink(email);
    const emailLocale = normalizedLocale || (user.language as any) || "en";
    await sendMagicLinkEmail(email, token, emailLocale);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json({ error: "Failed to send magic link" }, { status: 500 });
  }
}
