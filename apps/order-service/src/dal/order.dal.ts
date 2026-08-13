import { orderRepository } from "@emacare/mongo/repository";
import type { IOrder, OrderDocument } from "@emacare/mongo/types";
import mongoose from "mongoose";

export async function createOrder(data: Partial<IOrder>): Promise<OrderDocument | null> {
  return orderRepository.create(data as any);
}

export async function getOrderById(id: string): Promise<OrderDocument | null> {
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id) }
    : { _id: id };
  return orderRepository.findOne(filter);
}

export async function getOrdersByUserId(userId: string): Promise<OrderDocument[]> {
  const docs = await orderRepository.find({ customerId: userId } as any);
  return (docs as OrderDocument[]) || [];
}

export async function getOrdersByVendorId(vendorId: string): Promise<OrderDocument[]> {
  const docs = await orderRepository.find({ "items.vendorId": vendorId });
  return (docs as OrderDocument[]) || [];
}

export async function updateOrderStatus(
  id: string,
  updates: { status: string; paymentId?: string; shipmentId?: string }
): Promise<OrderDocument | null> {
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id) }
    : { _id: id };

  const updateFields: Record<string, any> = {
    status: updates.status,
    updatedAt: new Date(),
  };
  if (updates.paymentId) updateFields.paymentId = updates.paymentId;
  if (updates.shipmentId) updateFields.shipmentId = updates.shipmentId;

  return orderRepository.findOneAndUpdate(filter, { $set: updateFields });
}

export default {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getOrdersByVendorId,
  updateOrderStatus,
};
