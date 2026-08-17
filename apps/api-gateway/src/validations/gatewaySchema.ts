import { z } from "zod";

export const RouteRequestSchema = z.object({
  service: z.string().min(1, "Service name is required"),
  path: z.string().min(1, "Path is required"),
});

export type RouteRequestInput = z.infer<typeof RouteRequestSchema>;
