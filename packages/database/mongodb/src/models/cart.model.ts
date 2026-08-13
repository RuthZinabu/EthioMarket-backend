import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { CartDocument } from "../types/cart";
import { Status } from "../types/enum";

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
    userId: { type: String, sparse: true, index: true },
    customerId: { type: String, index: true },
    items: [CartItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
    totalQuantity: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      required: true,
    },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CartSchema.plugin(paginator);

const CartModel = mongoose.model<CartDocument, mongoose.PaginateModel<CartDocument>>("Cart", CartSchema);

export default CartModel;
