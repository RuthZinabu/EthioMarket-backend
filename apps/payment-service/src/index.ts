import express from 'express';
import dotenv from 'dotenv';
import { successResponse, formatErrorResponse, logger } from '@emacare/shared-utils';
import { PaymentStatus } from '@emacare/prisma';
import paymentDal from './dal/payment.dal';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

interface PaymentRequest {
  orderId: string;
  userId: string;
  amount: number;
  currency?: string;
  serviceFee?: number;
  vat?: number;
  drrf?: number;
  totalAmount?: number;
  paidAmount?: number;
  paymentMethod?: string;
  paymentDetails?: any;
  cardToken?: string;
  cardLast4?: string;
}

// Process payment
app.post('/process', async (req: express.Request<{}, {}, PaymentRequest>, res: express.Response): Promise<any> => {
  try {
    const {
      orderId,
      userId,
      amount,
      currency,
      serviceFee,
      vat,
      drrf,
      totalAmount,
      paidAmount,
      paymentMethod,
      paymentDetails,
      cardLast4,
    } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json(formatErrorResponse({ message: 'Missing required fields: orderId, amount' }, 400));
    }

    const payment = await paymentDal.createPayment({
      orderId,
      userId: userId || 'anonymous',
      amount,
      currency: (currency || 'ETB').toUpperCase(),
      serviceFee: serviceFee || 0,
      vat: vat || 0,
      drrf: drrf || 0,
      totalAmount: totalAmount || amount,
      paidAmount: paidAmount || amount,
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

function startServer() {
  app.listen(PORT, () => {
    logger.info(`💳 Payment Service running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
