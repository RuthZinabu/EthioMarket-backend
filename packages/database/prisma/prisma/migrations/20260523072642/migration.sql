/*
  Warnings:

  - The values [USD] on the enum `CurrencyType` will be removed. If these variants are still used in the database, this will fail.
  - The values [WALLET_TO_WALLET,MERCHANT_PAYMENT,BANK_TRANSFER] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `DRRF` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `bankFTNo` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `billAmount` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `paymentChannel` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `institutionCode` on the `wallet` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[walletFTNo]` on the table `transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `walletFTNo` on table `transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('Agent', 'SubAgent');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('Default', 'Bank', 'Wallet', 'MFI');

-- AlterEnum
BEGIN;
CREATE TYPE "CurrencyType_new" AS ENUM ('ETB');
ALTER TABLE "ledger_entry" ALTER COLUMN "currency" TYPE "CurrencyType_new" USING ("currency"::text::"CurrencyType_new");
ALTER TABLE "wallet" ALTER COLUMN "currency" TYPE "CurrencyType_new" USING ("currency"::text::"CurrencyType_new");
ALTER TYPE "CurrencyType" RENAME TO "CurrencyType_old";
ALTER TYPE "CurrencyType_new" RENAME TO "CurrencyType";
DROP TYPE "public"."CurrencyType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('WALLET_TOP_UP', 'BILL_PAYMENT', 'CASH_IN', 'CASH_OUT', 'AIRTIME_TOPUP');
ALTER TABLE "transaction" ALTER COLUMN "transactionType" TYPE "TransactionType_new" USING ("transactionType"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- DropIndex
DROP INDEX "wallet_institutionCode_idx";

-- DropIndex
DROP INDEX "wallet_userId_idx";

-- AlterTable
ALTER TABLE "ledger_entry" ADD COLUMN     "institutionName" TEXT;

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "DRRF",
DROP COLUMN "bankFTNo",
DROP COLUMN "billAmount",
DROP COLUMN "description",
DROP COLUMN "lastModified",
DROP COLUMN "paymentChannel",
ADD COLUMN     "beneficiaryAccountNumber" TEXT,
ADD COLUMN     "drrf" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ftNumber" TEXT,
ADD COLUMN     "institutionName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "walletFTNo" SET NOT NULL;

-- AlterTable
ALTER TABLE "wallet" DROP COLUMN "institutionCode",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "payable" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "senderDetail" JSONB,
    "beneficiaryDetail" JSONB,
    "ftNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payable_transactionId_key" ON "payable"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_walletFTNo_key" ON "transaction"("walletFTNo");

-- CreateIndex
CREATE INDEX "wallet_walletId_idx" ON "wallet"("walletId");
