import type { Request, Response } from 'express';
import { successResponse, formatErrorResponse } from '@emacare/shared-utils';
import { PaymentStatus, Currency } from '@emacare/prisma';
import paymentDal from '../dal/payment.dal';

export interface PaymentRequest {
  orderId: string;
  customerId: string;
  amount: number;
  originalCurrency?: Currency;
  convertedCurrency?: Currency;
  serviceFee?: number;
  vat?: number;
  drrf?: number;
  totalAmount?: number;
  paidAmount?: number;
  billAmount?: number;
  paymentMethod?: string;
  paymentDetails?: any;
  cardToken?: string;
  cardLast4?: string;
}

export async function processPayment(
  req: Request<{}, {}, PaymentRequest>,
  res: Response
): Promise<any> {
  try {
    const {
      orderId,
      customerId,
      amount,
      originalCurrency,
      convertedCurrency,
      serviceFee,
      vat,
      drrf,
      totalAmount,
      paidAmount,
      billAmount,
      paymentMethod,
      paymentDetails,
      cardLast4,
    } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json(formatErrorResponse({ message: 'Missing required fields: orderId, amount' }, 400));
    }

    const payment = await paymentDal.createPayment({
      orderId,
      customerId: customerId || 'anonymous',
      amount,
      originalCurrency: originalCurrency || Currency.ETB,
      convertedCurrency: convertedCurrency || undefined,
      serviceFee: serviceFee || 0,
      vat: vat || 0,
      drrf: drrf || 0,
      totalAmount: totalAmount || amount,
      paidAmount: paidAmount || amount,
      billAmount: billAmount || 0,
      paymentMethod: paymentMethod || 'credit_card',
      paymentDetails: paymentDetails || null,
      status: PaymentStatus.COMPLETED,
      cardLast4: cardLast4 || '4242',
      paidDate: new Date(),
    });

    if (!payment) {
      return res.status(500).json(formatErrorResponse({ message: 'Failed to process payment' }, 500));
    }

    return res.status(201).json(successResponse({
      ...payment,
      message: 'Payment processed successfully',
    }, 201));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getPaymentById(req: Request, res: Response): Promise<any> {
  try {
    const { paymentId } = req.params;
    const payment = await paymentDal.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json(formatErrorResponse({ message: 'Payment not found' }, 404));
    }

    return res.json(successResponse(payment));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getPaymentsByOrderId(req: Request, res: Response): Promise<any> {
  try {
    const orderPayments = await paymentDal.getPaymentsByOrderId(req.params.orderId);
    return res.json(successResponse(orderPayments));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getPaymentsByCustomerId(req: Request, res: Response): Promise<any> {
  try {
    const customerPayments = await paymentDal.getPaymentsByCustomerId(req.params.customerId);
    return res.json(successResponse(customerPayments));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export function healthCheck(_req: Request, res: Response): void {
  res.json({ status: 'Payment Service is running' });
}

export default {
  processPayment,
  getPaymentById,
  getPaymentsByOrderId,
  getPaymentsByCustomerId,
  healthCheck,
};
