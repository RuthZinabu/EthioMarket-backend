import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { successResponse, formatErrorResponse, logger } from '@emacare/shared-utils';
import { OrderModel } from '@emacare/mongo/models';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/emacare';

app.use(express.json());

interface CreateOrderRequest {
  userId: string;
  items: Array<{ productId: string; name: string; quantity: number; price: number; image?: string }>;
  totalAmount: number;
  currency?: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode: string;
    phone?: string;
  };
}

// Create order
app.post('/', async (req: express.Request<{}, {}, CreateOrderRequest>, res: express.Response): Promise<any> => {
  try {
    const { userId, items, totalAmount, currency, shippingAddress } = req.body;

    if (!userId || !items || items.length === 0 || !totalAmount || !shippingAddress) {
      return res.status(400).json(formatErrorResponse({ message: 'Missing required fields: userId, items, totalAmount, shippingAddress' }, 400));
    }

    const order = await OrderModel.create({
      userId,
      items,
      totalAmount,
      currency: currency || 'USD',
      shippingAddress,
      status: 'pending',
    });

    return res.status(201).json(successResponse(order, 201));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Get order by ID
app.get('/:id', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    let order: any = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await OrderModel.findById(id);
    } else {
      order = await OrderModel.findOne({ _id: id });
    }

    if (!order) {
      return res.status(404).json(formatErrorResponse({ message: 'Order not found' }, 404));
    }

    return res.json(successResponse(order));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Get user orders
app.get('/user/:userId', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const userOrders = await OrderModel.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.json(successResponse(userOrders));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Update order status
app.patch('/:id/status', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { status, paymentId, shipmentId } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json(formatErrorResponse({ message: 'status field is required' }, 400));
    }

    const updateFields: Record<string, any> = { status, updatedAt: new Date() };
    if (paymentId) updateFields.paymentId = paymentId;
    if (shipmentId) updateFields.shipmentId = shipmentId;

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!order) {
      return res.status(404).json(formatErrorResponse({ message: 'Order not found' }, 404));
    }

    return res.json(successResponse(order));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Order Service is running' });
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    logger.info('Connected to MongoDB for Order Service');
  } catch (err) {
    logger.warn('Could not connect to MongoDB for Order Service', err);
  }

  app.listen(PORT, () => {
    logger.info(`📋 Order Service running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
