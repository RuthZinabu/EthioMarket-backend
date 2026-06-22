import express from 'express';
import dotenv from 'dotenv';
import { successResponse, errorHandler } from '@emacare/shared-utils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

// Mock payment records
const payments: any[] = [];

interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  cardToken?: string;
}

// Process payment
app.post('/process', (req: express.Request<{}, {}, PaymentRequest>, res) => {
  try {
    const { orderId, amount, currency, paymentMethod } = req.body;

    if (!orderId || !amount || !currency) {
      return res.status(400).json(errorHandler({ message: 'Missing required fields' }));
    }

    // Mock payment processing (replace with Stripe integration)
    const payment = {
      id: Date.now().toString(),
      orderId,
      amount,
      currency,
      paymentMethod,
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
      createdAt: new Date(),
    };

    payments.push(payment);

    res.status(201).json(successResponse({
      ...payment,
      message: 'Payment processed successfully',
    }, 201));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Get payment by ID
app.get('/:paymentId', (req, res) => {
  try {
    const payment = payments.find(p => p.id === req.params.paymentId);

    if (!payment) {
      return res.status(404).json(errorHandler({ message: 'Payment not found' }));
    }

    res.json(successResponse(payment));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Get payments by order
app.get('/order/:orderId', (req, res) => {
  try {
    const orderPayments = payments.filter(p => p.orderId === req.params.orderId);
    res.json(successResponse(orderPayments));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Payment Service is running' });
});

app.listen(PORT, () => {
  console.log(`💳 Payment Service running on http://localhost:${PORT}`);
});

export default app;
