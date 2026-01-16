import { prisma } from "./prisma";

function base64Encode(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value).toString("base64");
  }
  return btoa(value);
}

function base64Decode(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64").toString();
  }
  return atob(value);
}

async function randomHex(bytes: number) {
  if (globalThis.crypto?.getRandomValues) {
    const array = new Uint8Array(bytes);
    globalThis.crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  const cryptoModule = await import("crypto");
  return cryptoModule.randomBytes(bytes).toString("hex");
}

export async function generateMagicLink(email: string): Promise<string> {
  const token = await randomHex(32);
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

  return base64Encode(JSON.stringify(payload));
}

export function verifyAuthToken(token: string): string | null {
  try {
    const payload = JSON.parse(base64Decode(token));

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
