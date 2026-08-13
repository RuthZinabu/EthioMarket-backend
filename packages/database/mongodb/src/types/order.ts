import { Document, Types } from "mongoose";
import { OrderStatus } from "./enum";
export { OrderStatus };

export interface IOrderItem {
  productId: string;
  vendorId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder {
  customerId?: string | Types.ObjectId;
  items: IOrderItem[];
  subtotal?: number;
  shippingFee?: number;
  tax?: number;
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
  enabled?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderDocument extends IOrder, Document {}
