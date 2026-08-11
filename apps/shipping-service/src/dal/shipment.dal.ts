import { shipmentRepository } from "@emacare/mongo/repository";
import type { IShipment, ShipmentDocument } from "@emacare/mongo/types";
import mongoose from "mongoose";

export async function createShipment(data: Partial<IShipment>): Promise<ShipmentDocument | null> {
  return shipmentRepository.create(data as any);
}

export async function getShipmentByTrackingNumber(trackingNumber: string): Promise<ShipmentDocument | null> {
  return shipmentRepository.findOne({ trackingNumber });
}

export async function getShipmentByOrderId(orderId: string): Promise<ShipmentDocument | null> {
  return shipmentRepository.findOne({ orderId });
}

export async function getShipmentById(id: string): Promise<ShipmentDocument | null> {
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id) }
    : { trackingNumber: id };
  return shipmentRepository.findOne(filter);
}

export async function updateShipmentStatus(
  id: string,
  status: string,
  location?: string,
  description?: string
): Promise<ShipmentDocument | null> {
  const shipment = await getShipmentById(id);
  if (!shipment) return null;

  const updates = (shipment.updates as any[]) || [];
  updates.push({
    status,
    location: location || "Transit Hub",
    timestamp: new Date(),
    description: description || `Status updated to ${status}`,
  });

  return shipmentRepository.findOneAndUpdate(
    { _id: shipment._id },
    {
      $set: {
        status,
        updates,
        updatedAt: new Date(),
      },
    }
  );
}

export default {
  createShipment,
  getShipmentByTrackingNumber,
  getShipmentByOrderId,
  getShipmentById,
  updateShipmentStatus,
};
