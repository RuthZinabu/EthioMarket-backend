import { z } from "zod";

export const CreateOrderRequestSchema = z.object({
  customerId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      vendorId: z.string().optional(),
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
      image: z.string().optional(),
    })
  ),
  totalAmount: z.number(),
  currency: z.string().optional(),
  shippingAddress: z.object({
    fullName: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    country: z.string(),
    zipCode: z.string(),
    phone: z.string().optional(),
  }),
});

export type CreateOrderInput = z.infer<typeof CreateOrderRequestSchema>;
