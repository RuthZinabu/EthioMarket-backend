import { z } from "zod";

export const SendNotificationSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["EMAIL", "SMS", "PUSH"]),
});

export type SendNotificationInput = z.infer<typeof SendNotificationSchema>;
