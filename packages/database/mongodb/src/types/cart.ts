import { Document, Types } from "mongoose";
import { Status } from "./enum";

export interface ICartItem {
  productId: string;
  vendorId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICart {
  userId?: string;
  customerId?: string | Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  totalQuantity: number;
  status: Status | string;
  enabled?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartDocument extends ICart, Document {}
