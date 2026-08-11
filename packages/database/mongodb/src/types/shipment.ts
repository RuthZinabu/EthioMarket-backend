import { Document, Types } from "mongoose";

export enum ShipmentStatus {
  CREATED = "created",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  FAILED = "failed",
}

export interface IShipmentUpdate {
  status: ShipmentStatus;
  location: string;
  timestamp: Date;
  description?: string;
}

export interface IShipment {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  recipient: {
    name: string;
    address: string;
    city: string;
    country: string;
    zipCode?: string;
    phone?: string;
  };
  weight: number;
  status: ShipmentStatus;
  estimatedDelivery?: Date;
  updates: IShipmentUpdate[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShipmentDocument extends IShipment, Document { }
