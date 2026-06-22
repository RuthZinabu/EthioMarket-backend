import process from "node:process";
// Configuration for all services - centralized setup
export const serviceConfig = {
  apiGateway: {
    port: process.env.API_GATEWAY_PORT || 3000,
    name: 'API Gateway',
  },
  authService: {
    port: process.env.AUTH_SERVICE_PORT || 3001,
    name: 'Auth Service',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  },
  productService: {
    port: process.env.PRODUCT_SERVICE_PORT || 3002,
    name: 'Product Service',
  },
  orderService: {
    port: process.env.ORDER_SERVICE_PORT || 3003,
    name: 'Order Service',
  },
  cartService: {
    port: process.env.CART_SERVICE_PORT || 3004,
    name: 'Cart Service',
  },
  paymentService: {
    port: process.env.PAYMENT_SERVICE_PORT || 3005,
    name: 'Payment Service',
    stripeKey: process.env.STRIPE_SECRET_KEY,
  },
  shippingService: {
    port: process.env.SHIPPING_SERVICE_PORT || 3006,
    name: 'Shipping Service',
    dhlApiKey: process.env.DHL_API_KEY,
  },
  notificationService: {
    port: process.env.NOTIFICATION_SERVICE_PORT || 3007,
    name: 'Notification Service',
  },
};

export const databaseConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/emacare',
    user: process.env.MONGODB_USER || 'admin',
    password: process.env.MONGODB_PASSWORD || 'password',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
};

export const environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'debug',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
