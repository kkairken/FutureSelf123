/*
  Warnings:

  - A unique constraint covering the columns `[pgOrderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_pgOrderId_key" ON "Payment"("pgOrderId");
