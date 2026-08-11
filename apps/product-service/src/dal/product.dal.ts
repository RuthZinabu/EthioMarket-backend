import { productRepository } from "@emacare/mongo/repository";
import type { IProduct, ProductDocument } from "@emacare/mongo/types";
import mongoose, { FilterQuery, QueryOptions } from "mongoose";

export async function createProduct(data: Partial<IProduct>): Promise<ProductDocument | null> {
  return productRepository.create(data as any);
}

export async function getProductById(id: string): Promise<ProductDocument | null> {
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id), isDeleted: false }
    : { sku: id, isDeleted: false };
  return productRepository.findOne(filter);
}

export async function getProductsFiltered(query: FilterQuery<ProductDocument>): Promise<ProductDocument[]> {
  const filter = { ...query, isDeleted: false };
  const docs = await productRepository.find(filter);
  return (docs as ProductDocument[]) || [];
}

export async function getProductsPaginated(
  query: FilterQuery<ProductDocument>,
  page: number = 1,
  limit: number = 10,
  options?: QueryOptions
): Promise<{ total: number; docs: ProductDocument[]; page: number; limit: number; totalPages: number }> {
  const filter = { ...query, isDeleted: false };
  const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
  const result = await productRepository.getPaginated(filter, { skip, limit }, options);
  const totalPages = Math.ceil(result.total / limit) || 1;
  return {
    total: result.total,
    docs: (result.docs as ProductDocument[]) || [],
    page,
    limit,
    totalPages,
  };
}

export async function updateProduct(
  id: string,
  updateData: Partial<IProduct>
): Promise<ProductDocument | null> {
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id), isDeleted: false }
    : { sku: id, isDeleted: false };

  return productRepository.findOneAndUpdate(filter, { $set: updateData });
}

export async function softDeleteProduct(id: string): Promise<ProductDocument | null> {
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id) }
    : { sku: id };

  return productRepository.deleteOne(filter);
}

export default {
  createProduct,
  getProductById,
  getProductsFiltered,
  getProductsPaginated,
  updateProduct,
  softDeleteProduct,
};
