import { Document, Types } from "mongoose";

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  totalPrice: number;
  totalQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartDocument extends ICart, Document {}
