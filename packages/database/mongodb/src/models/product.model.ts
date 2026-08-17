import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { ProductDocument } from "../types/product";
import { Status } from "../types/enum";

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
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
    enabled: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

ProductSchema.plugin(paginator);

const productModel = mongoose.model<ProductDocument, mongoose.PaginateModel<ProductDocument>>("Product", ProductSchema);

export default productModel;
