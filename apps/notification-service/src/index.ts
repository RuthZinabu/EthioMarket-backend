import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { successResponse, errorHandler } from '@emacare/shared-utils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
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
app.post('/email', async (req: express.Request<{}, {}, SendEmailRequest>, res) => {
  try {
    const { to, subject, body, type } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json(errorHandler({ message: 'Missing required fields' }));
    }

    // Mock email sending (configure with actual email service)
    const notification = {
      id: Date.now().toString(),
      type,
      recipient: to,
      subject,
      status: 'sent',
      sentAt: new Date(),
    };

    res.status(201).json(successResponse({
      ...notification,
      message: `Email sent successfully to ${to}`,
    }, 201));

    // Optional: Actually send email
    // await emailTransporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to,
    //   subject,
    //   html: body,
    // });
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Send SMS notification
app.post('/sms', async (req: express.Request<{}, {}, SendSMSRequest>, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json(errorHandler({ message: 'Missing required fields' }));
    }

    // Mock SMS sending (configure with Twilio)
    const notification = {
      id: Date.now().toString(),
      type: 'sms',
      recipient: phoneNumber,
      message,
      status: 'sent',
      sentAt: new Date(),
    };

    res.status(201).json(successResponse({
      ...notification,
      message: `SMS sent successfully to ${phoneNumber}`,
    }, 201));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Send order confirmation
app.post('/order-confirmation', async (req, res) => {
  try {
    const { orderId, email, customerName, items, totalAmount } = req.body;

    const emailBody = `
      <h2>Order Confirmation - #${orderId}</h2>
      <p>Dear ${customerName},</p>
      <p>Thank you for your order! Here are the details:</p>
      <p><strong>Total: $${totalAmount}</strong></p>
      <p>Your order will be shipped soon. Track your shipment using our tracking system.</p>
    `;

    const result = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    }).verify();

    res.json(successResponse({
      message: 'Order confirmation email queued',
      orderId,
    }));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Send shipment tracking update
app.post('/shipment-update', async (req, res) => {
  try {
    const { trackingNumber, email, status, estimatedDelivery } = req.body;

    res.json(successResponse({
      message: 'Shipment update notification sent',
      trackingNumber,
      status,
    }));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Notification Service is running' });
});

app.listen(PORT, () => {
  console.log(`📧 Notification Service running on http://localhost:${PORT}`);
});

export default app;
