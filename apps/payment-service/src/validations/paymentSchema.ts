import { z } from "zod";

export const CreatePaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("ETB"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
