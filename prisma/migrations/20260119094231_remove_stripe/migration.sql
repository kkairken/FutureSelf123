/*
  Warnings:

  - You are about to drop the column `stripePaymentId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSessionId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "Payment_stripeSessionId_idx";

-- DropIndex
DROP INDEX "Payment_stripeSessionId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "stripePaymentId",
DROP COLUMN "stripeSessionId",
ALTER COLUMN "currency" SET DEFAULT 'KZT',
ALTER COLUMN "provider" SET DEFAULT 'freedompay';

-- DropTable
DROP TABLE "Subscription";
