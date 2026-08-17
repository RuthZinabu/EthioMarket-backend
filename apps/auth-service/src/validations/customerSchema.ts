import { z } from "zod";
import { CustomerSex, CustomerStatus } from "@emacare/mongo/types";

export const CustomerAddressSchema = z.object({
  label: z.string().default("Home").optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().default("ET"),
  zipCode: z.string().optional(),
  isDefault: z.boolean().default(false).optional(),
});

export const CreateCustomerSchema = z.object({
  customerCode: z.string().optional(),
  fullName: z.string().min(1, "Full name is required").trim(),
  email: z.string().email("Invalid email").optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  avatar: z.string().optional(),
  sex: z.nativeEnum(CustomerSex).optional(),
  birthDate: z.coerce.date().optional(),
  nationality: z.string().optional(),
  addresses: z.array(CustomerAddressSchema).optional(),
  preferredCurrency: z.string().default("USD").optional(),
  status: z.nativeEnum(CustomerStatus).default(CustomerStatus.ACTIVE).optional(),
  enabled: z.boolean().default(true).optional(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export const CustomerQuerySchema = z.object({
  status: z.nativeEnum(CustomerStatus).optional(),
  search: z.string().optional(),
  phoneNumber: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CustomerAddressInput = z.infer<typeof CustomerAddressSchema>;
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;
export type CustomerQueryInput = z.infer<typeof CustomerQuerySchema>;
