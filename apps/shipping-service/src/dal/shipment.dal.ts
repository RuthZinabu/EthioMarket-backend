import { shipmentRepository } from "@emacare/mongo/repository";
import type { IShipment, ShipmentDocument } from "@emacare/mongo/types";
import mongoose from "mongoose";

export async function createShipment(data: Partial<IShipment>): Promise<ShipmentDocument | null> {
  const result = await shipmentRepository.create(data as any);
  return result as unknown as ShipmentDocument | null;
}

export async function getShipmentByTrackingNumber(trackingNumber: string): Promise<ShipmentDocument | null> {
  const result = await shipmentRepository.findOne({ trackingNumber });
  return result as unknown as ShipmentDocument | null;
}

export async function getShipmentByOrderId(orderId: string): Promise<ShipmentDocument | null> {
  const result = await shipmentRepository.findOne({ orderId });
  return result as unknown as ShipmentDocument | null;
}

export async function getShipmentById(id: string): Promise<ShipmentDocument | null> {
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { _id: new mongoose.Types.ObjectId(id) }
    : { trackingNumber: id };
  const result = await shipmentRepository.findOne(filter);
  return result as unknown as ShipmentDocument | null;
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

  const result = await shipmentRepository.findOneAndUpdate(
    { _id: shipment._id },
    {
      $set: {
        status,
        updates,
        updatedAt: new Date(),
      },
    }
  );
  return result as unknown as ShipmentDocument | null;
}

export default {
  createShipment,
  getShipmentByTrackingNumber,
  getShipmentByOrderId,
  getShipmentById,
  updateShipmentStatus,
};

