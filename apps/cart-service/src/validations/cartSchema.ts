import { z } from "zod";
import { Status } from "@emacare/mongo/types";

export const CartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  vendorId: z.string().optional(),
  name: z.string().optional(),
  price: z.coerce.number().nonnegative("Price must be non-negative").optional(),
  quantity: z.coerce.number().int().positive("Quantity must be a positive integer").default(1),
  image: z.string().optional(),
});

export const AddToCartSchema = z.object({
  customerId: z.string().optional(),
  productId: z.string().min(1, "Product ID is required").optional(),
  quantity: z.coerce.number().int().positive("Quantity must be a positive integer").default(1).optional(),
  item: CartItemSchema.optional(),
}).refine(data => data.productId || data.item?.productId, {
  message: "productId or item object with productId is required",
});

export const UpdateCartItemSchema = z.object({
  quantity: z.coerce.number().int().nonnegative("Quantity cannot be negative"),
});

export const SyncCartSchema = z.object({
  customerId: z.string().optional(),
  items: z.array(CartItemSchema),
});

export const CartQuerySchema = z.object({
  customerId: z.string().optional(),
  status: z.nativeEnum(Status).optional(),
});

export type CartItemInput = z.infer<typeof CartItemSchema>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
export type SyncCartInput = z.infer<typeof SyncCartSchema>;
