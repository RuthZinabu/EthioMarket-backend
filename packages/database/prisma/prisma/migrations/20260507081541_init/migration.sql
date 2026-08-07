-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('WALLET_TO_WALLET', 'WALLET_TOP_UP', 'BILL_PAYMENT', 'MERCHANT_PAYMENT', 'CASH_IN', 'CASH_OUT', 'BANK_TRANSFER', 'AIRTIME_TOPUP');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('FAILED', 'COMPLETED', 'PENDING');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "AuthorizationType" AS ENUM ('PIN', 'PIN_AND_OTP');

-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('USD', 'ETB');

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "senderName" TEXT,
    "senderPhone" TEXT,
    "senderId" TEXT,
    "beneficiaryName" TEXT,
    "beneficiaryPhone" TEXT,
    "beneficiaryId" TEXT,
    "paymentChannel" JSONB,
    "transactionType" "TransactionType",
    "currency" TEXT DEFAULT 'ETB',
    "serviceFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentDetails" JSONB,
    "billRefNo" TEXT,
    "invoiceURL" TEXT,
    "billReason" TEXT,
    "bankFTNo" TEXT,
    "walletFTNo" TEXT,
    "DRRF" TEXT,
    "authorizationType" "AuthorizationType" NOT NULL DEFAULT 'PIN',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "paidDate" TIMESTAMP(3),
    "billAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "institutionCode" TEXT DEFAULT 'DASHTETAA',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entry" (
    "id" TEXT NOT NULL,
    "ledgerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT,
    "transactionId" TEXT,
    "entryType" "EntryType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balanceAfter" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" "CurrencyType",
    "description" TEXT,
    "institutionCode" TEXT DEFAULT 'DASHTETAA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "currency" "CurrencyType" NOT NULL,
    "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "institutionCode" TEXT DEFAULT 'DASHTETAA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_billRefNo_key" ON "transaction"("billRefNo");

-- CreateIndex
CREATE INDEX "ledger_entry_userId_idx" ON "ledger_entry"("userId");

-- CreateIndex
CREATE INDEX "ledger_entry_walletId_idx" ON "ledger_entry"("walletId");

-- CreateIndex
CREATE INDEX "ledger_entry_institutionCode_idx" ON "ledger_entry"("institutionCode");

-- CreateIndex
CREATE INDEX "ledger_entry_createdAt_idx" ON "ledger_entry"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_walletId_key" ON "wallet"("walletId");

-- CreateIndex
CREATE INDEX "wallet_userId_idx" ON "wallet"("userId");

-- CreateIndex
CREATE INDEX "wallet_institutionCode_idx" ON "wallet"("institutionCode");

-- CreateIndex
CREATE INDEX "wallet_status_idx" ON "wallet"("status");

-- AddForeignKey
ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Manual Triggers (Fixed for lowercase names)
CREATE OR REPLACE FUNCTION update_wallet_balance_from_history()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."type" = 'CREDIT' THEN
    UPDATE wallet SET "walletBalance" = "walletBalance" + NEW."amount" WHERE "id" = NEW."walletId";
  ELSIF NEW."type" = 'DEBIT' THEN
    UPDATE wallet SET "walletBalance" = "walletBalance" - NEW."amount" WHERE "id" = NEW."walletId";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION prevent_direct_wallet_balance_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."walletBalance" IS DISTINCT FROM OLD."walletBalance" THEN
    IF pg_trigger_depth() = 0 THEN
      RAISE EXCEPTION 'Direct updates to walletBalance are strictly prohibited at the DB level. Please insert a WalletHistory entry instead.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied triggers to 'wallet' table
DROP TRIGGER IF EXISTS prevent_wallet_balance_update_trigger ON wallet;
CREATE TRIGGER prevent_wallet_balance_update_trigger
BEFORE UPDATE OF "walletBalance" ON wallet
FOR EACH ROW
EXECUTE FUNCTION prevent_direct_wallet_balance_update();
