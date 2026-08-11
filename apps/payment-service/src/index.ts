import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { successResponse, formatErrorResponse, logger } from '@emacare/shared-utils';
import paymentDal from './dal/payment.dal';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;
const MONGO_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/emacare';

app.use(express.json());

interface PaymentRequest {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  cardToken?: string;
  cardLast4?: string;
}

// Process payment
app.post('/process', async (req: express.Request<{}, {}, PaymentRequest>, res: express.Response): Promise<any> => {
  try {
    const { orderId, userId, amount, currency, paymentMethod, cardLast4 } = req.body;

    if (!orderId || !amount || !currency) {
      return res.status(400).json(formatErrorResponse({ message: 'Missing required fields: orderId, amount, currency' }, 400));
    }

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const payment = await paymentDal.createPayment({
      orderId,
      userId: userId || 'anonymous',
      amount,
      currency: currency.toUpperCase(),
      paymentMethod: paymentMethod || 'credit_card',
      status: 'completed',
      transactionId,
      cardLast4: cardLast4 || '4242',
    });

    if (!payment) {
      return res.status(500).json(formatErrorResponse({ message: 'Failed to process payment' }, 500));
    }

    return res.status(201).json(successResponse({
      ...(typeof (payment as any).toObject === 'function' ? (payment as any).toObject() : payment),
      message: 'Payment processed successfully',
    }, 201));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Get payment by ID
app.get('/:paymentId', async (req: express.Request, res: express.Response): Promise<any> => {
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
});

// Get payments by order
app.get('/order/:orderId', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const orderPayments = await paymentDal.getPaymentsByOrderId(req.params.orderId);
    return res.json(successResponse(orderPayments));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Payment Service is running' });
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    logger.info('Connected to MongoDB for Payment Service');
  } catch (err) {
    logger.warn('Could not connect to MongoDB for Payment Service', err);
  }

  app.listen(PORT, () => {
    logger.info(`💳 Payment Service running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
