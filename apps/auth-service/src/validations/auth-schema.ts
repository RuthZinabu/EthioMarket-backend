import { OTPFor } from "@emacare/mongo/types";
import z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const PreSignInSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    phone_number: z.string().min(9, "Invalid phone number").optional(),
  })
  .refine((data) => data.email || data.phone_number, {
    message: "Either email or phone_number is required",
  });

export const ResendOtpSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    phone_number: z.string().min(9, "Invalid phone number").optional(),
    otp_for: z.nativeEnum(OTPFor),
  })
  .refine((data) => data.email || data.phone_number, {
    message: "Either email or phone_number is required",
  });

export const LoginSchema = z.object({
  password: z.string().max(20, { message: "password must be at most 20 characters" }),
});

export const VerifyPreSignInOtpSchema = z.object({
  user_name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z]+$/, { message: "Username must be one word and contain only letters" }),
  code: z
    .string()
    .min(6, { message: "code must be 6 digit long" })
    .max(6, { message: "code must be 6 digit long" }),
});

export const VerifyOtpSchema = z.object({
  code: z
    .string()
    .min(6, { message: "code must be 6 digit long" })
    .max(6, { message: "code must be 6 digit long" }),
  otp_for: z.nativeEnum(OTPFor),
});

export const SetNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters required")
      .max(20, {
        message: "password must be at most 20 characters",
      })
      .regex(
        passwordRegex,
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
      ),
    confirm_password: z.string().min(8, "Password must be at least 8 characters required"),
    isForgotPassword: z.boolean().optional(),
    isSetPassword: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

export const ChangePasswordSchema = z.object({
  old_password: z.string().min(8, "old password must be at least 8 characters required"),
  new_password: z
    .string()
    .min(8, "New Password must be at least 8 characters required")
    .max(20, {
      message: "password must be at most 20 characters",
    })
    .regex(
      passwordRegex,
      "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
    ),
});

export type AppPreSignInType = z.infer<typeof PreSignInSchema>;
export type ResendOtpType = z.infer<typeof ResendOtpSchema> & { otp_for: OTPFor };
export type verifyPreSignInOtpType = z.infer<typeof VerifyPreSignInOtpSchema>;
export type VerifyOtpType = z.infer<typeof VerifyOtpSchema>;
export type SetNewPasswordType = z.infer<typeof SetNewPasswordSchema>;
export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
export type AppPinLoginType = z.infer<typeof LoginSchema>;
export type AppVerifyOtpType = z.infer<typeof VerifyOtpSchema>;

export const UssdLoginSchema = z.object({
  phone_number: z.string().min(9, "Invalid phone number"),
  ussd_pin: z.string().min(4, "USSD PIN must be at least 4 digits"),
});

export type UssdLoginType = z.infer<typeof UssdLoginSchema>;

export const BranchLoginSchema = z.object({
  agent_id: z.string().min(1, "Agent ID is required"),
  branch_token: z.string().min(1, "Branch token is required"),
  timestamp: z.string().min(1, "Timestamp is required"),
});

export type BranchLoginType = z.infer<typeof BranchLoginSchema>;
