import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { ShipmentDocument, ShipmentStatus } from "../types/shipment";

const ShipmentUpdateSchema = new Schema({
  status: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  description: { type: String },
});

const ShipmentSchema = new Schema<ShipmentDocument>(
  {
    orderId: { type: String, required: true, index: true },
    carrier: { type: String, required: true, default: "DHL" },
    trackingNumber: { type: String, required: true, unique: true, index: true },
    recipient: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String },
      phone: { type: String },
    },
    weight: { type: Number, required: true, default: 1.0 },
    status: {
      type: String,
      enum: Object.values(ShipmentStatus),
      default: ShipmentStatus.CREATED,
      required: true,
      index: true,
    },
    estimatedDelivery: { type: Date },
    updates: [ShipmentUpdateSchema],
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ShipmentSchema.plugin(paginator);

const ShipmentModel = mongoose.model<ShipmentDocument, mongoose.PaginateModel<ShipmentDocument>>("Shipment", ShipmentSchema);

export default ShipmentModel;
