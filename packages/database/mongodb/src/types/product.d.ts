import { Document } from "mongoose";
import { ProductCategory } from "./enum";
export interface IProduct {
    name: string;
    category: ProductCategory;
    description?: string;
    price?: number;
    stock?: number;
    image?: string;
    origin?: string;
    createdAt?: Date;
    updatedAt?: Date;
    enabled?: boolean;
    isDeleted?: boolean;
}
export interface ProductDocument extends IProduct, Document {
}
//# sourceMappingURL=product.d.ts.map