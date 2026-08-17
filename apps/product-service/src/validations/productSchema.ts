import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().optional(),
  stock: z.number().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
