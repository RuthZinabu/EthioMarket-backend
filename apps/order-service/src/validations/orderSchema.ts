import { z } from "zod";
import { OrderStatus, Currency } from "@emacare/mongo/types";

export const OrderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  vendorId: z.string().optional(),
  name: z.string().min(1, "Item name is required"),
  price: z.number().nonnegative("Price must be non-negative"),
  quantity: z.number().int().positive("Quantity must be positive"),
  image: z.string().optional(),
});

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  phone: z.string().optional(),
});

export const CreateOrderRequestSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  items: z.array(OrderItemSchema).min(1, "Order must contain at least one item"),
  subtotal: z.number().nonnegative().optional(),
  shippingFee: z.number().nonnegative().default(0).optional(),
  tax: z.number().nonnegative().default(0).optional(),
  totalAmount: z.number().nonnegative("Total amount must be non-negative"),
  currency: z.nativeEnum(Currency).default(Currency.ETB).optional(),
  shippingAddress: ShippingAddressSchema,
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING).optional(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  paymentId: z.string().optional(),
  shipmentId: z.string().optional(),
});

export const OrderQuerySchema = z.object({
  customerId: z.string().optional(),
  vendorId: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CreateOrderInput = z.infer<typeof CreateOrderRequestSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof OrderQuerySchema>;
