import express from 'express';
import dotenv from 'dotenv';
import { successResponse, errorHandler } from '@emacare/shared-utils';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

// Mock shipments database
const shipments: any[] = [];

// DHL API Integration (mock configuration)
const DHL_API_URL = process.env.DHL_API_URL || 'https://apis-sandbox.dhl.com';
const DHL_API_KEY = process.env.DHL_API_KEY || 'your-dhl-api-key';

interface CreateShipmentRequest {
  orderId: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientCountry: string;
  weight: number;
  items: Array<{ description: string; quantity: number; value: number }>;
}

// Create shipment
app.post('/', async (req: express.Request<{}, {}, CreateShipmentRequest>, res) => {
  try {
    const { orderId, recipientName, recipientAddress, recipientCity, recipientCountry, weight, items } = req.body;

    if (!orderId || !recipientName || !recipientAddress) {
      return res.status(400).json(errorHandler({ message: 'Missing required fields' }));
    }

    // Mock DHL shipment creation
    const shipment = {
      id: Date.now().toString(),
      orderId,
      carrier: 'DHL',
      trackingNumber: `${Date.now()}`,
      recipient: {
        name: recipientName,
        address: recipientAddress,
        city: recipientCity,
        country: recipientCountry,
      },
      weight,
      items,
      status: 'picked_up',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
      updates: [
        {
          status: 'picked_up',
          timestamp: new Date(),
          location: 'Pickup location',
        },
      ],
    };

    shipments.push(shipment);

    res.status(201).json(successResponse({
      ...shipment,
      message: 'Shipment created successfully with DHL',
    }, 201));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Get shipment tracking
app.get('/track/:trackingNumber', (req, res) => {
  try {
    const shipment = shipments.find(s => s.trackingNumber === req.params.trackingNumber);

    if (!shipment) {
      return res.status(404).json(errorHandler({ message: 'Shipment not found' }));
    }

    res.json(successResponse({
      trackingNumber: shipment.trackingNumber,
      carrier: shipment.carrier,
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery,
      updates: shipment.updates,
    }));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Get shipment by order
app.get('/order/:orderId', (req, res) => {
  try {
    const shipment = shipments.find(s => s.orderId === req.params.orderId);

    if (!shipment) {
      return res.status(404).json(errorHandler({ message: 'Shipment not found' }));
    }

    res.json(successResponse(shipment));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Update shipment status
app.patch('/:id/status', (req, res) => {
  try {
    const shipment = shipments.find(s => s.id === req.params.id);

    if (!shipment) {
      return res.status(404).json(errorHandler({ message: 'Shipment not found' }));
    }

    const { status, location } = req.body;
    shipment.status = status;
    shipment.updates.push({
      status,
      timestamp: new Date(),
      location: location || 'Unknown',
    });

    res.json(successResponse(shipment));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Shipping Service is running', dhlIntegration: 'configured' });
});

app.listen(PORT, () => {
  console.log(`🚚 Shipping Service running on http://localhost:${PORT}`);
  console.log('DHL Integration configured');
});

export default app;
