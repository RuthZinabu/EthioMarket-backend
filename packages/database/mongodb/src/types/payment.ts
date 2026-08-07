import { Document, Types } from "mongoose";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface IPayment {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  transactionId?: string;
  cardLast4?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentDocument extends IPayment, Document {}
