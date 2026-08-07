import mongoose, { Schema } from "mongoose";
import { ProductDocument } from '../types/product';

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  stock: { type: Number },
  image: { type: String },
  origin: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
});

const productModel = mongoose.model<ProductDocument>("Product", ProductSchema);

export default productModel;
