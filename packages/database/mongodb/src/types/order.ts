import { Document, Types } from "mongoose";

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  currency: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode: string;
    phone?: string;
  };
  status: OrderStatus;
  paymentId?: string;
  shipmentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderDocument extends IOrder, Document {}
