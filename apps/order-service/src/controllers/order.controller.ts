import type { Request, Response } from 'express';
import { successResponse, formatErrorResponse } from '@emacare/shared-utils';
import { Currency, OrderStatus } from '@emacare/mongo/types';
import { CreateOrderRequestSchema, type CreateOrderInput } from '../validations/orderSchema';
import orderDal from '../dal/order.dal';

export async function createOrder(
  req: Request<{}, {}, CreateOrderInput>,
  res: Response
): Promise<any> {
  try {
    const parseResult = CreateOrderRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: 'Validation failed', errors: parseResult.error.issues },
          400
        )
      );
    }

    const { customerId, items, totalAmount, currency, shippingAddress } = parseResult.data;

    const order = await orderDal.createOrder({
      customerId,
      items,
      totalAmount,
      currency: (currency as Currency) || Currency.ETB,
      shippingAddress,
      status: OrderStatus.PENDING,
    });

    return res.status(201).json(successResponse(order, 201));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getOrderById(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;
    const order = await orderDal.getOrderById(id);

    if (!order) {
      return res.status(404).json(formatErrorResponse({ message: 'Order not found' }, 404));
    }

    return res.json(successResponse(order));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getOrdersByUserId(req: Request, res: Response): Promise<any> {
  try {
    const userOrders = await orderDal.getOrdersByUserId(req.params.userId);
    return res.json(successResponse(userOrders));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getOrdersByVendorId(req: Request, res: Response): Promise<any> {
  try {
    const vendorOrders = await orderDal.getOrdersByVendorId(req.params.vendorId);
    return res.json(successResponse(vendorOrders));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<any> {
  try {
    const { status, paymentId, shipmentId } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json(formatErrorResponse({ message: 'status field is required' }, 400));
    }

    const order = await orderDal.updateOrderStatus(id, { status, paymentId, shipmentId });

    if (!order) {
      return res.status(404).json(formatErrorResponse({ message: 'Order not found' }, 404));
    }

    return res.json(successResponse(order));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export function healthCheck(_req: Request, res: Response): void {
  res.json({ status: 'Order Service is running' });
}

export default {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getOrdersByVendorId,
  updateOrderStatus,
  healthCheck,
};
