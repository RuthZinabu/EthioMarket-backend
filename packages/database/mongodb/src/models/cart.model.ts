import mongoose, { Schema } from "mongoose";
import { CartDocument } from "../types/cart";

const CartItemSchema = new Schema({
  productId: { type: String, required: true },
  vendorId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String },
});

const CartSchema = new Schema<CartDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: [CartItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
    totalQuantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const CartModel =
  (mongoose.models.Cart as mongoose.Model<CartDocument>) ||
  mongoose.model<CartDocument>("Cart", CartSchema);

export default CartModel;
