import { Document, Types } from "mongoose";
import z from "zod";

export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
  DISABLED = "DISABLED",
  LOCKED = "LOCKED",
  SUSPENDED = "SUSPENDED",
}

export enum CustomerSex {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export interface ICustomerAddress {
  label?: string; // e.g. "Home", "Work"
  street: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  isDefault?: boolean;
}

export interface ICustomer extends Document {
  userCode: string;
  customerCode?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  sex?: CustomerSex;
  birthDate?: Date;
  nationality?: string;

  addresses?: ICustomerAddress[];
  preferredCurrency?: string;

  realm: string; // "Member" / "Customer"
  password?: string;
  passwordHistory?: string[];
  passwordChangedAt?: Date;
  isSetPassword?: boolean;
  isVerified?: boolean;

  deviceId?: string;
  pushToken?: string;

  status: CustomerStatus;
  enabled: boolean;
  isDeleted: boolean;

  loginAttemptCount?: number;
  lastLoginAttempt?: Date;
  lastLogin?: Date | null;

  createdBy?: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createCustomerSchema = z.object({
  fullName: z.string().min(2, "Full name is required").trim(),
  phoneNumber: z.string().min(8, "Invalid phone number"),
  email: z.union([z.string().email({ message: "Invalid email" }), z.literal("")]).optional(),
  password: z.string().min(6).optional(),
});

export const updateCustomerProfileSchema = z.object({
  fullName: z.string().min(2, "Full name is required").trim().optional(),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  avatar: z.string().optional(),
  preferredCurrency: z.string().optional(),
});

export type CreateCustomerType = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerProfileType = z.infer<typeof updateCustomerProfileSchema>;
