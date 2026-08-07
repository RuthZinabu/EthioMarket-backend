import mongoose, { Schema } from "mongoose";
import { ShipmentDocument } from "../types/shipment";

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
      enum: ["created", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"],
      default: "created",
      index: true,
    },
    estimatedDelivery: { type: Date },
    updates: [ShipmentUpdateSchema],
  },
  { timestamps: true }
);

const ShipmentModel = mongoose.model<ShipmentDocument>("Shipment", ShipmentSchema);
export default ShipmentModel;
