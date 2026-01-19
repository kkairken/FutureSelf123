-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "pgOrderId" TEXT,
ADD COLUMN     "pgPaymentId" TEXT,
ADD COLUMN     "pgRecurringProfile" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'stripe',
ADD COLUMN     "rawPayload" JSONB;

-- CreateTable
CREATE TABLE "RecurringProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'freedompay',
    "profileId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "expiresAt" TIMESTAMP(3),
    "lastPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecurringProfile_profileId_key" ON "RecurringProfile"("profileId");

-- CreateIndex
CREATE INDEX "RecurringProfile_userId_idx" ON "RecurringProfile"("userId");

-- CreateIndex
CREATE INDEX "Payment_pgOrderId_idx" ON "Payment"("pgOrderId");

-- CreateIndex
CREATE INDEX "Payment_pgPaymentId_idx" ON "Payment"("pgPaymentId");

-- AddForeignKey
ALTER TABLE "RecurringProfile" ADD CONSTRAINT "RecurringProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
