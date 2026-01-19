import { prisma } from "@/lib/prisma";

const CREDIT_MAP: Record<string, number> = {
  "1_chapter": 7,
  "5_chapters": 20,
  "10_chapters": 40,
  "subscription_100": 100,
};

export function creditsForProductType(productType?: string) {
  if (!productType) return 0;
  return CREDIT_MAP[productType] || 0;
}

export async function applyCreditsIfNeeded(paymentId: string, userId: string, productType?: string) {
  const credits = creditsForProductType(productType);
  if (credits <= 0) return;

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.creditsAdded > 0) return;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: credits } },
    }),
    prisma.payment.update({
      where: { id: paymentId },
      data: { creditsAdded: credits },
    }),
  ]);
}
