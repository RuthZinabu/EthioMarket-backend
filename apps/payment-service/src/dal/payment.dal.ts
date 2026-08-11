import { paymentRepository } from "@emacare/mongo/repository";
import type { IPayment, PaymentDocument } from "@emacare/mongo/types";
import mongoose from "mongoose";

export async function createPayment(data: Partial<IPayment>): Promise<PaymentDocument | null> {
  return paymentRepository.create(data as any);
}

export async function getPaymentById(id: string): Promise<PaymentDocument | null> {
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id) }
    : { transactionId: id };
  return paymentRepository.findOne(filter);
}

export async function getPaymentsByOrderId(orderId: string): Promise<PaymentDocument[]> {
  const docs = await paymentRepository.find({ orderId });
  return (docs as PaymentDocument[]) || [];
}

export default {
  createPayment,
  getPaymentById,
  getPaymentsByOrderId,
};
