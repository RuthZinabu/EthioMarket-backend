import mongoose, { Schema } from "mongoose";
import { ProductDocument } from "../types/product";

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", index: true },
    category: { type: String, required: true, index: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    currency: { type: String, default: "USD" },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, trim: true },
    image: { type: String },
    images: [{ type: String }],
    origin: { type: String },
    tags: [{ type: String }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

const productModel =
  (mongoose.models.Product as mongoose.Model<ProductDocument>) ||
  mongoose.model<ProductDocument>("Product", ProductSchema);

export default productModel;
