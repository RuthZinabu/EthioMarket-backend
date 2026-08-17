import { z } from "zod";
import { Status } from "@emacare/mongo/types";

export const CartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  vendorId: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  price: z.number().nonnegative("Price must be non-negative"),
  quantity: z.number().int().positive("Quantity must be a positive integer").default(1),
  image: z.string().optional(),
});

export const AddToCartSchema = z.object({
  userId: z.string().optional(),
  customerId: z.string().optional(),
  item: CartItemSchema,
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
});

export const SyncCartSchema = z.object({
  userId: z.string().optional(),
  customerId: z.string().optional(),
  items: z.array(CartItemSchema),
});

export const CartQuerySchema = z.object({
  userId: z.string().optional(),
  customerId: z.string().optional(),
  status: z.nativeEnum(Status).optional(),
});

export type CartItemInput = z.infer<typeof CartItemSchema>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
export type SyncCartInput = z.infer<typeof SyncCartSchema>;
