import { Router, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { routePrefix } from '@emacare/shared-utils';

export const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  products: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  orders: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:3004',
  payments: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  shipping: process.env.SHIPPING_SERVICE_URL || 'http://localhost:3006',
  notifications: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3007',
};

const router: Router = Router();

const serviceRoutes = [
  { path: 'auth', target: services.auth },
  { path: 'products', target: services.products },
  { path: 'orders', target: services.orders },
  { path: 'cart', target: services.cart },
  { path: 'payments', target: services.payments },
  { path: 'shipping', target: services.shipping },
  { path: 'notifications', target: services.notifications },
];

serviceRoutes.forEach(({ path, target }) => {
  // Mount proxy under base path `/ethio.commerce.api.v1`
  router.use(`${routePrefix}/${path}`, createProxyMiddleware({
    target,
    changeOrigin: true,
  }));

  // Mount fallback proxy under `/api`
  router.use(`/api/${path}`, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^/api/${path}`]: `${routePrefix}/${path}` },
  }));
});

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'API Gateway is running',
    routePrefix,
    timestamp: new Date(),
    services,
  });
});

export default router;
