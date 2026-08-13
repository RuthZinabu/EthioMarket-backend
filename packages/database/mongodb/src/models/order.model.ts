import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { OrderDocument, OrderStatus } from "../types";

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
    customerId: { type: String, index: true },
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
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      required: true,
      index: true,
    },
    paymentId: { type: String },
    shipmentId: { type: String },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OrderSchema.plugin(paginator);

const OrderModel = mongoose.model<OrderDocument, mongoose.PaginateModel<OrderDocument>>("Order", OrderSchema);

export default OrderModel;
