import { z } from "zod";
import { PayoutStatus, PayoutMethod, Currency } from "@emacare/mongo/types";

export const PayoutBankDetailsSchema = z.object({
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  swiftOrRoutingCode: z.string().optional(),
  currency: z.nativeEnum(Currency).optional(),
});

export const CreateVendorPayoutSchema = z.object({
  vendorId: z.string().min(1, "Vendor ID is required"),
  payoutReference: z.string().min(1, "Payout reference is required"),
  grossAmount: z.number().positive("Gross amount must be positive"),
  commissionFee: z.number().nonnegative().default(0),
  netAmount: z.number().nonnegative("Net amount must be non-negative"),
  currency: z.nativeEnum(Currency).default(Currency.ETB),
  status: z.nativeEnum(PayoutStatus).default(PayoutStatus.PENDING).optional(),
  payoutMethod: z.nativeEnum(PayoutMethod).default(PayoutMethod.BANK_TRANSFER).optional(),
  bankDetails: PayoutBankDetailsSchema.optional(),
  periodStart: z.coerce.date().optional(),
  periodEnd: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const UpdateVendorPayoutStatusSchema = z.object({
  status: z.nativeEnum(PayoutStatus),
  transactionReference: z.string().optional(),
  processedAt: z.coerce.date().optional(),
  rejectedReason: z.string().optional(),
  notes: z.string().optional(),
});

export const VendorPayoutQuerySchema = z.object({
  vendorId: z.string().optional(),
  status: z.nativeEnum(PayoutStatus).optional(),
  payoutMethod: z.nativeEnum(PayoutMethod).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CreateVendorPayoutInput = z.infer<typeof CreateVendorPayoutSchema>;
export type UpdateVendorPayoutStatusInput = z.infer<typeof UpdateVendorPayoutStatusSchema>;
export type VendorPayoutQueryInput = z.infer<typeof VendorPayoutQuerySchema>;
