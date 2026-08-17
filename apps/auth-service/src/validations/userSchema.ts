import { z } from "zod";
import { Realm, UserRole, Status } from "@emacare/mongo/types";

export const CreateUserSchema = z.object({
  userCode: z.string().min(1, "User code is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  avatar: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  organization: z.string().optional(),
  realm: z.nativeEnum(Realm).optional(),
  role: z.nativeEnum(UserRole).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  status: z.nativeEnum(Status).default(Status.ACTIVE).optional(),
  enabled: z.boolean().default(true).optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const UserQuerySchema = z.object({
  realm: z.nativeEnum(Realm).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(Status).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserQueryInput = z.infer<typeof UserQuerySchema>;
