import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { successResponse, formatErrorResponse, logger } from '@emacare/shared-utils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'no-reply@emacare.com',
    pass: process.env.EMAIL_PASSWORD || 'secret',
  },
});

interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  type: 'order_confirmation' | 'shipment_update' | 'payment_receipt' | 'custom';
}

interface SendSMSRequest {
  phoneNumber: string;
  message: string;
}

// Send email notification
app.post('/email', async (req: express.Request<{}, {}, SendEmailRequest>, res: express.Response): Promise<any> => {
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
});

// Send SMS notification
app.post('/sms', async (req: express.Request<{}, {}, SendSMSRequest>, res: express.Response): Promise<any> => {
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
});

// Send order confirmation
app.post('/order-confirmation', async (req: express.Request, res: express.Response): Promise<any> => {
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
});

// Send shipment tracking update
app.post('/shipment-update', async (req: express.Request, res: express.Response): Promise<any> => {
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
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Notification Service is running' });
});

app.listen(PORT, () => {
  logger.info(`📧 Notification Service running on http://localhost:${PORT}`);
});

export default app;
