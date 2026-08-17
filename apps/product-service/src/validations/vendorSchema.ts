import { z } from "zod";
import { VendorStatus, PayoutMethod, Currency } from "@emacare/mongo/types";

export const VendorPayoutBankDetailsSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  swiftOrRoutingCode: z.string().optional(),
  currency: z.nativeEnum(Currency).default(Currency.ETB).optional(),
});

export const VendorBusinessDetailSchema = z.object({
  tinNumber: z.string().optional(),
  businessLicense: z.string().optional(),
  taxId: z.string().optional(),
});

export const CreateVendorSchema = z.object({
  storeName: z.string().trim().optional(),
  ownerName: z.string().trim().optional(),
  slug: z.string().lowercase().trim().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  bannerImage: z.string().optional(),
  contactEmail: z.string().email("Invalid email address").trim().optional(),
  contactPhone: z.string().min(1, "Contact phone is required").trim(),
  country: z.string().default("ET"),
  address: z.string().optional(),
  status: z.nativeEnum(VendorStatus).default(VendorStatus.PENDING).optional(),
  isVerified: z.boolean().default(false).optional(),
  commissionRate: z.number().nonnegative().default(0.10).optional(),
  payoutMethod: z.nativeEnum(PayoutMethod).default(PayoutMethod.BANK_TRANSFER).optional(),
  payoutBankDetails: VendorPayoutBankDetailsSchema.optional(),
  businessDetail: VendorBusinessDetailSchema.optional(),
  enabled: z.boolean().default(false).optional(),
});

export const UpdateVendorSchema = CreateVendorSchema.partial();

export const ApproveVendorSchema = z.object({
  status: z.nativeEnum(VendorStatus),
  rejectedReason: z.string().optional(),
});

export const VendorQuerySchema = z.object({
  status: z.nativeEnum(VendorStatus).optional(),
  country: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CreateVendorInput = z.infer<typeof CreateVendorSchema>;
export type UpdateVendorInput = z.infer<typeof UpdateVendorSchema>;
export type ApproveVendorInput = z.infer<typeof ApproveVendorSchema>;
export type VendorQueryInput = z.infer<typeof VendorQuerySchema>;
