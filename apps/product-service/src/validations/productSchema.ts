import { z } from "zod";
import { ProductCategory, Status ,Currency} from "@emacare/mongo/types";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  vendorId: z.string().min(1, "Vendor ID is required"),
  category: z.nativeEnum(ProductCategory),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  discountPrice: z.coerce.number().nonnegative().optional(),
  currency: z.nativeEnum(Currency).default(Currency.ETB).optional(),
  stock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer").default(0),
  sku: z.string().trim().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  images: z.array(z.string()).optional(),
  origin: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.nativeEnum(Status).default(Status.PENDING).optional(),
  enabled: z.boolean().default(false).optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ApproveProductSchema = z.object({
  status: z.nativeEnum(Status),
  rejectedReason: z.string().optional(),
  approvedBy: z.string().optional(),
});

export const ProductQuerySchema = z.object({
  category: z.nativeEnum(ProductCategory).optional(),
  vendorId: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  status: z.nativeEnum(Status).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ApproveProductInput = z.infer<typeof ApproveProductSchema>;
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
