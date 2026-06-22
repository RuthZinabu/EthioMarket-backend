import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Service endpoints configuration
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  products: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  orders: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:3004',
  payments: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  shipping: process.env.SHIPPING_SERVICE_URL || 'http://localhost:3006',
  notifications: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3007',
};

// Routes - API Gateway proxies requests to respective services
app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
}));

app.use('/api/products', createProxyMiddleware({
  target: services.products,
  changeOrigin: true,
  pathRewrite: { '^/api/products': '' },
}));

app.use('/api/orders', createProxyMiddleware({
  target: services.orders,
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '' },
}));

app.use('/api/cart', createProxyMiddleware({
  target: services.cart,
  changeOrigin: true,
  pathRewrite: { '^/api/cart': '' },
}));

app.use('/api/payments', createProxyMiddleware({
  target: services.payments,
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '' },
}));

app.use('/api/shipping', createProxyMiddleware({
  target: services.shipping,
  changeOrigin: true,
  pathRewrite: { '^/api/shipping': '' },
}));

app.use('/api/notifications', createProxyMiddleware({
  target: services.notifications,
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '' },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'API Gateway is running',
    timestamp: new Date(),
    services,
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Gateway Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  console.log('Connected services:', services);
});

export default app;
