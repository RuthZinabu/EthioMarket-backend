import { z } from "zod";

export const NotificationTypeEnum = z.enum(["EMAIL", "SMS", "PUSH"]);

export const SendEmailSchema = z.object({
  to: z.string().email("Invalid recipient email"),
  subject: z.string().min(1, "Email subject is required"),
  body: z.string().min(1, "Email body is required"),
  templateId: z.string().optional(),
  templateParams: z.record(z.string(), z.any()).optional(),
});

export const SendSmsSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "SMS message is required"),
});

export const PushNotificationSchema = z.object({
  pushToken: z.string().min(1, "Push token is required"),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Notification body is required"),
  data: z.record(z.string(), z.any()).optional(),
});

export const SendNotificationSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  type: NotificationTypeEnum,
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  payload: z.record(z.string(), z.any()).optional(),
});

export type SendEmailInput = z.infer<typeof SendEmailSchema>;
export type SendSmsInput = z.infer<typeof SendSmsSchema>;
export type PushNotificationInput = z.infer<typeof PushNotificationSchema>;
export type SendNotificationInput = z.infer<typeof SendNotificationSchema>;
