import { z } from "zod";
import { PaymentStatus, Currency } from "@emacare/prisma";

export const CreatePaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  amount: z.number().positive("Amount must be positive"),
  originalCurrency: z.nativeEnum(Currency).default(Currency.ETB).optional(),
  convertedCurrency: z.nativeEnum(Currency).optional(),
  serviceFee: z.number().nonnegative().default(0).optional(),
  vat: z.number().nonnegative().default(0).optional(),
  drrf: z.number().nonnegative().default(0).optional(),
  totalAmount: z.number().nonnegative().default(0).optional(),
  paidAmount: z.number().nonnegative().default(0).optional(),
  billAmount: z.number().nonnegative().default(0).optional(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentDetails: z.record(z.string(), z.any()).optional(),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING).optional(),
  cardLast4: z.string().length(4).optional(),
});

export const UpdatePaymentStatusSchema = z.object({
  status: z.nativeEnum(PaymentStatus),
  paidAmount: z.number().nonnegative().optional(),
  paidDate: z.coerce.date().optional(),
  cardLast4: z.string().length(4).optional(),
  paymentDetails: z.record(z.string(), z.any()).optional(),
});

export const PaymentQuerySchema = z.object({
  orderId: z.string().optional(),
  customerId: z.string().optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof UpdatePaymentStatusSchema>;
export type PaymentQueryInput = z.infer<typeof PaymentQuerySchema>;
