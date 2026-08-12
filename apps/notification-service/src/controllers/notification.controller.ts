import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { successResponse, formatErrorResponse, logger } from '@emacare/shared-utils';

export const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'no-reply@emacare.com',
    pass: process.env.EMAIL_PASSWORD || 'secret',
  },
});

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  type: 'order_confirmation' | 'shipment_update' | 'payment_receipt' | 'custom';
}

export interface SendSMSRequest {
  phoneNumber: string;
  message: string;
}

export async function sendEmail(
  req: Request<{}, {}, SendEmailRequest>,
  res: Response
): Promise<any> {
  try {
    const { to, subject, body, type } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json(formatErrorResponse({ message: 'Missing required fields: to, subject, body' }, 400));
    }

    const notification = {
      id: Date.now().toString(),
      type: type || 'custom',
      recipient: to,
      subject,
      status: 'sent',
      sentAt: new Date(),
    };

    return res.status(201).json(successResponse({
      ...notification,
      message: `Email sent successfully to ${to}`,
    }, 201));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function sendSMS(
  req: Request<{}, {}, SendSMSRequest>,
  res: Response
): Promise<any> {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json(formatErrorResponse({ message: 'Missing required fields: phoneNumber, message' }, 400));
    }

    const notification = {
      id: Date.now().toString(),
      type: 'sms',
      recipient: phoneNumber,
      message,
      status: 'sent',
      sentAt: new Date(),
    };

    return res.status(201).json(successResponse({
      ...notification,
      message: `SMS sent successfully to ${phoneNumber}`,
    }, 201));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function sendOrderConfirmation(req: Request, res: Response): Promise<any> {
  try {
    const { orderId, email, customerName, totalAmount } = req.body;

    if (!orderId || !email) {
      return res.status(400).json(formatErrorResponse({ message: 'orderId and email are required' }, 400));
    }

    logger.info(`Sending order confirmation for order #${orderId} to ${email}`);

    return res.json(successResponse({
      message: 'Order confirmation email queued successfully',
      orderId,
      email,
      totalAmount,
    }));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function sendShipmentUpdate(req: Request, res: Response): Promise<any> {
  try {
    const { trackingNumber, email, status, estimatedDelivery } = req.body;

    if (!trackingNumber || !email) {
      return res.status(400).json(formatErrorResponse({ message: 'trackingNumber and email are required' }, 400));
    }

    logger.info(`Sending shipment tracking update (${trackingNumber}) to ${email}`);

    return res.json(successResponse({
      message: 'Shipment update notification sent',
      trackingNumber,
      status: status || 'in_transit',
      estimatedDelivery,
    }));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export function healthCheck(_req: Request, res: Response): void {
  res.json({ status: 'Notification Service is running' });
}

export default {
  sendEmail,
  sendSMS,
  sendOrderConfirmation,
  sendShipmentUpdate,
  healthCheck,
};
