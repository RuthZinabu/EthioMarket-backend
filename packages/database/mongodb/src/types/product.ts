import { Document, Types } from "mongoose";
import { ProductCategory } from "./enum";

export interface IProduct {
  name: string;
  vendorId?: Types.ObjectId;
  category: ProductCategory;
  description?: string;
  price: number;
  discountPrice?: number;
  currency?: string;
  stock: number;
  sku?: string;
  image?: string;
  images?: string[];
  origin?: string;
  tags?: string[];
  rating?: number;
  numReviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
  enabled?: boolean;
  isDeleted?: boolean;
}

export interface ProductDocument extends IProduct, Document {}
