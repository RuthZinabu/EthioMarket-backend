import express from 'express';
import dotenv from 'dotenv';
import { successResponse, errorHandler } from '@emacare/shared-utils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// Mock orders database
const orders: any[] = [];

interface CreateOrderRequest {
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  shippingAddress: string;
}

// Create order
app.post('/', (req: express.Request<{}, {}, CreateOrderRequest>, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    if (!userId || !items || !totalAmount || !shippingAddress) {
      return res.status(400).json(errorHandler({ message: 'Missing required fields' }));
    }

    const order = {
      id: Date.now().toString(),
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(order);
    res.status(201).json(successResponse(order, 201));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Get order by ID
app.get('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json(errorHandler({ message: 'Order not found' }));
    }

    res.json(successResponse(order));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Get user orders
app.get('/user/:userId', (req, res) => {
  try {
    const userOrders = orders.filter(o => o.userId === req.params.userId);
    res.json(successResponse(userOrders));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Update order status
app.patch('/:id/status', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json(errorHandler({ message: 'Order not found' }));
    }

    const { status } = req.body;
    order.status = status;
    order.updatedAt = new Date();

    res.json(successResponse(order));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Order Service is running' });
});

app.listen(PORT, () => {
  console.log(`📋 Order Service running on http://localhost:${PORT}`);
});

export default app;
