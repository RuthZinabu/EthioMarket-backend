import { z } from "zod";

export const RouteRequestSchema = z.object({
  service: z.string().min(1, "Service name is required"),
  path: z.string().min(1, "Path is required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).optional(),
  headers: z.record(z.string(), z.string()).optional(),
});

export type RouteRequestInput = z.infer<typeof RouteRequestSchema>;
