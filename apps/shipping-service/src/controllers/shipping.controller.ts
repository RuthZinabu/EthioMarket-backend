import type { Request, Response } from 'express';
import { successResponse, formatErrorResponse } from '@emacare/shared-utils';
import { ShipmentStatus } from '@emacare/mongo/types';
import shipmentDal from '../dal/shipment.dal';

export interface CreateShipmentRequest {
  orderId: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientCountry: string;
  weight?: number;
}

export async function createShipment(
  req: Request<{}, {}, CreateShipmentRequest>,
  res: Response
): Promise<any> {
  try {
    const { orderId, recipientName, recipientAddress, recipientCity, recipientCountry, weight } = req.body;

    if (!orderId || !recipientName || !recipientAddress) {
      return res.status(400).json(formatErrorResponse({ message: 'Missing required fields: orderId, recipientName, recipientAddress' }, 400));
    }

    const trackingNumber = `DHL${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const shipment = await shipmentDal.createShipment({
      orderId,
      carrier: 'DHL',
      trackingNumber,
      recipient: {
        name: recipientName,
        address: recipientAddress,
        city: recipientCity || 'Addis Ababa',
        country: recipientCountry || 'Ethiopia',
      },
      weight: weight || 1.0,
      status: ShipmentStatus.PICKED_UP,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      updates: [
        {
          status: ShipmentStatus.PICKED_UP,
          location: 'Origin Sorting Hub',
          timestamp: new Date(),
          description: 'Shipment picked up by DHL',
        },
      ],
    });

    if (!shipment) {
      return res.status(500).json(formatErrorResponse({ message: 'Failed to create shipment' }, 500));
    }

    return res.status(201).json(successResponse({
      ...(typeof (shipment as any).toObject === 'function' ? (shipment as any).toObject() : shipment),
      message: 'Shipment created successfully with DHL',
    }, 201));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getShipmentByTracking(req: Request, res: Response): Promise<any> {
  try {
    const shipment = await shipmentDal.getShipmentByTrackingNumber(req.params.trackingNumber);

    if (!shipment) {
      return res.status(404).json(formatErrorResponse({ message: 'Shipment not found' }, 404));
    }

    return res.json(successResponse({
      trackingNumber: shipment.trackingNumber,
      carrier: shipment.carrier,
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery,
      updates: shipment.updates,
    }));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getShipmentByOrder(req: Request, res: Response): Promise<any> {
  try {
    const shipment = await shipmentDal.getShipmentByOrderId(req.params.orderId);

    if (!shipment) {
      return res.status(404).json(formatErrorResponse({ message: 'Shipment not found' }, 404));
    }

    return res.json(successResponse(shipment));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function updateShipmentStatus(req: Request, res: Response): Promise<any> {
  try {
    const { status, location, description } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json(formatErrorResponse({ message: 'status field is required' }, 400));
    }

    const shipment = await shipmentDal.updateShipmentStatus(id, status, location, description);

    if (!shipment) {
      return res.status(404).json(formatErrorResponse({ message: 'Shipment not found' }, 404));
    }

    return res.json(successResponse(shipment));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export function healthCheck(_req: Request, res: Response): void {
  res.json({ status: 'Shipping Service is running', dhlIntegration: 'configured' });
}

export default {
  createShipment,
  getShipmentByTracking,
  getShipmentByOrder,
  updateShipmentStatus,
  healthCheck,
};
