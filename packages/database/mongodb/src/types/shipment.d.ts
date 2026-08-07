import { Document } from "mongoose";
export type ShipmentStatus = "created" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "failed";
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
export interface ShipmentDocument extends IShipment, Document {
}
//# sourceMappingURL=shipment.d.ts.map