import { prisma } from "./prisma";
import * as crypto from "crypto";

export async function generateMagicLink(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.magicLink.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function verifyMagicLink(token: string): Promise<string | null> {
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
  });

  if (!magicLink || magicLink.used || magicLink.expiresAt < new Date()) {
    return null;
  }

  await prisma.magicLink.update({
    where: { token },
    data: { used: true },
  });

  return magicLink.email;
}

export function generateAuthToken(userId: string): string {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function verifyAuthToken(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString());

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload.userId;
  } catch {
    return null;
  }
}

export async function getUserFromToken(token: string) {
  const userId = verifyAuthToken(token);

  if (!userId) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      language: true,
      credits: true,
    },
  });
}
