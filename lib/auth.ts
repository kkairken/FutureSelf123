import { prisma } from "./prisma";

function base64Encode(value: string) {
  // Use Web API for edge runtime compatibility
  return btoa(value);
}

function base64Decode(value: string) {
  // Use Web API for edge runtime compatibility
  return atob(value);
}

async function randomHex(bytes: number) {
  // Web Crypto API is always available in edge runtime
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Web Crypto API is not available");
  }

  const array = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Password hashing using Web Crypto API (PBKDF2)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await globalThis.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashArray = new Uint8Array(derivedBits);
  const saltHex = Array.from(salt, (b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(hashArray, (b) => b.toString(16).padStart(2, "0")).join("");

  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;

  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)));
  const encoder = new TextEncoder();

  const keyMaterial = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await globalThis.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashArray = new Uint8Array(derivedBits);
  const computedHashHex = Array.from(hashArray, (b) => b.toString(16).padStart(2, "0")).join("");

  return computedHashHex === hashHex;
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
