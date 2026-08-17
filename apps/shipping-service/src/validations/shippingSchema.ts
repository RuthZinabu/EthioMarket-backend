import { z } from "zod";

export const CreateShipmentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  shippingAddress: z.object({
    fullName: z.string(),
    street: z.string(),
    city: z.string(),
    country: z.string(),
    zipCode: z.string(),
  }),
});

export type CreateShipmentInput = z.infer<typeof CreateShipmentSchema>;
