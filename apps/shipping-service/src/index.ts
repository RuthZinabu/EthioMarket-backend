import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { successResponse, formatErrorResponse, logger } from '@emacare/shared-utils';
import shipmentDal from './dal/shipment.dal';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;
const MONGO_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/emacare';

app.use(express.json());

interface CreateShipmentRequest {
  orderId: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientCountry: string;
  weight?: number;
}

// Create shipment
app.post('/', async (req: express.Request<{}, {}, CreateShipmentRequest>, res: express.Response): Promise<any> => {
  try {
    const { orderId, recipientName, recipientAddress, recipientCity, recipientCountry, weight } = req.body;

    if (!orderId || !recipientName || !recipientAddress) {
      return res.status(400).json(formatErrorResponse({ message: 'Missing required fields: orderId, recipientName, recipientAddress' }, 400));
    }

    const trackingNumber = `DHL${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const shipment = await shipmentDal.createShipment({
      orderId,
      carrier: 'DHL',
      trackingNumber,
      recipient: {
        name: recipientName,
        address: recipientAddress,
        city: recipientCity || 'Addis Ababa',
        country: recipientCountry || 'Ethiopia',
      },
      weight: weight || 1.0,
      status: 'picked_up',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      updates: [
        {
          status: 'picked_up',
          location: 'Origin Sorting Hub',
          timestamp: new Date(),
          description: 'Shipment picked up by DHL',
        },
      ],
    });

    if (!shipment) {
      return res.status(500).json(formatErrorResponse({ message: 'Failed to create shipment' }, 500));
    }

    return res.status(201).json(successResponse({
      ...(typeof (shipment as any).toObject === 'function' ? (shipment as any).toObject() : shipment),
      message: 'Shipment created successfully with DHL',
    }, 201));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Get shipment tracking
app.get('/track/:trackingNumber', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const shipment = await shipmentDal.getShipmentByTrackingNumber(req.params.trackingNumber);

    if (!shipment) {
      return res.status(404).json(formatErrorResponse({ message: 'Shipment not found' }, 404));
    }

    return res.json(successResponse({
      trackingNumber: shipment.trackingNumber,
      carrier: shipment.carrier,
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery,
      updates: shipment.updates,
    }));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Get shipment by order
app.get('/order/:orderId', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const shipment = await shipmentDal.getShipmentByOrderId(req.params.orderId);

    if (!shipment) {
      return res.status(404).json(formatErrorResponse({ message: 'Shipment not found' }, 404));
    }

    return res.json(successResponse(shipment));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Update shipment status
app.patch('/:id/status', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { status, location, description } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json(formatErrorResponse({ message: 'status field is required' }, 400));
    }

    const shipment = await shipmentDal.updateShipmentStatus(id, status, location, description);

    if (!shipment) {
      return res.status(404).json(formatErrorResponse({ message: 'Shipment not found' }, 404));
    }

    return res.json(successResponse(shipment));
  } catch (error: any) {
    return res.status(500).json(formatErrorResponse(error));
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Shipping Service is running', dhlIntegration: 'configured' });
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    logger.info('Connected to MongoDB for Shipping Service');
  } catch (err) {
    logger.warn('Could not connect to MongoDB for Shipping Service', err);
  }

  app.listen(PORT, () => {
    logger.info(`🚚 Shipping Service running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
