import { z } from "zod";
import { ShipmentStatus } from "@emacare/mongo/types";

export const ShipmentRecipientSchema = z.object({
  name: z.string().min(1, "Recipient name is required"),
  address: z.string().min(1, "Recipient address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
});

export const ShipmentUpdateSchema = z.object({
  status: z.nativeEnum(ShipmentStatus),
  location: z.string().min(1, "Location is required"),
  timestamp: z.coerce.date().default(() => new Date()),
  description: z.string().optional(),
});

export const CreateShipmentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  carrier: z.string().default("DHL").optional(),
  trackingNumber: z.string().min(1, "Tracking number is required"),
  recipient: ShipmentRecipientSchema,
  weight: z.number().positive("Weight must be positive").default(1.0).optional(),
  status: z.nativeEnum(ShipmentStatus).default(ShipmentStatus.CREATED).optional(),
  estimatedDelivery: z.coerce.date().optional(),
});

export const UpdateShipmentStatusSchema = z.object({
  status: z.nativeEnum(ShipmentStatus),
  location: z.string().optional(),
  description: z.string().optional(),
  estimatedDelivery: z.coerce.date().optional(),
});

export const ShipmentQuerySchema = z.object({
  orderId: z.string().optional(),
  trackingNumber: z.string().optional(),
  status: z.nativeEnum(ShipmentStatus).optional(),
  carrier: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CreateShipmentInput = z.infer<typeof CreateShipmentSchema>;
export type UpdateShipmentStatusInput = z.infer<typeof UpdateShipmentStatusSchema>;
export type ShipmentQueryInput = z.infer<typeof ShipmentQuerySchema>;
