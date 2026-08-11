import mongoose, { Schema } from "mongoose";
import { OrderDocument } from "../types/order";

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  vendorId: { type: String, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, required: true, index: true },
    items: [OrderItemSchema],
    subtotal: { type: Number },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      phone: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentId: { type: String },
    shipmentId: { type: String },
  },
  { timestamps: true }
);

const OrderModel =
  (mongoose.models.Order as mongoose.Model<OrderDocument>) ||
  mongoose.model<OrderDocument>("Order", OrderSchema);
export default OrderModel;
