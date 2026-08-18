import { vendorRepository } from "@emacare/mongo/repository";
import type { IVendor, VendorDocument } from "@emacare/mongo/types";
import mongoose, { FilterQuery, QueryOptions } from "mongoose";

function generateSlug(storeName: string): string {
  return storeName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createVendor(data: Partial<IVendor>): Promise<VendorDocument | null> {
  if (data.storeName && !data.slug) {
    data.slug = generateSlug(data.storeName);
  }
  const result = await vendorRepository.create(data as any);
  return result as unknown as VendorDocument | null;
}

export async function getVendorById(id: string | mongoose.Types.ObjectId): Promise<VendorDocument | null> {
  if (!id) return null;
  const idStr = String(id).trim();
  const isObjId = mongoose.Types.ObjectId.isValid(idStr);
  const filter = isObjId
    ? {
        $or: [
          { _id: new mongoose.Types.ObjectId(idStr) },
          { slug: idStr },
        ],
        isDeleted: { $ne: true },
      }
    : { slug: idStr, isDeleted: { $ne: true } };
  const result = await vendorRepository.findOne(filter);
  return result as unknown as VendorDocument | null;
}

export async function getVendorByEmail(email: string): Promise<VendorDocument | null> {
  const result = await vendorRepository.findOne({ contactEmail: email.toLowerCase().trim(), isDeleted: false });
  return result as unknown as VendorDocument | null;
}

export async function getVendorsFiltered(query: FilterQuery<VendorDocument>): Promise<VendorDocument[]> {
  const filter = { ...query, isDeleted: false };
  const docs = await vendorRepository.find(filter);
  return (docs as unknown as VendorDocument[]) || [];
}

export async function getVendorsPaginated(
  query: FilterQuery<VendorDocument>,
  page: number = 1,
  limit: number = 10,
  options?: QueryOptions
): Promise<{ total: number; docs: VendorDocument[]; page: number; limit: number; totalPages: number }> {
  const filter = { ...query, isDeleted: false };
  const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
  const result = await vendorRepository.getPaginated(filter, { skip, limit }, options);
  const totalPages = Math.ceil(result.total / limit) || 1;
  return {
    total: result.total,
    docs: (result.docs as unknown as VendorDocument[]) || [],
    page,
    limit,
    totalPages,
  };
}

export async function updateVendor(
  id: string,
  updateData: Partial<IVendor>
): Promise<VendorDocument | null> {
  if (updateData.storeName && !updateData.slug) {
    updateData.slug = generateSlug(updateData.storeName);
  }
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id), isDeleted: false }
    : { slug: id, isDeleted: false };

  const result = await vendorRepository.findOneAndUpdate(filter, { $set: updateData });
  return result as unknown as VendorDocument | null;
}

export async function softDeleteVendor(id: string): Promise<VendorDocument | null> {
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id) }
    : { slug: id };

  const result = await vendorRepository.deleteOne(filter);
  return result as unknown as VendorDocument | null;
}

export default {
  createVendor,
  getVendorById,
  getVendorByEmail,
  getVendorsFiltered,
  getVendorsPaginated,
  updateVendor,
  softDeleteVendor,
};
