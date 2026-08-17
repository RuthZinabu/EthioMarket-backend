import { z } from "zod";

export const AddToCartSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
