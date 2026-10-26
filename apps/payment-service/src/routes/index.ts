import { type Express } from 'express';
import paymentRoutes from './payment.routes';
import { routePrefix } from '@emacare/shared-utils';

export default function router(app: Express): void {
  app.use(`${routePrefix}/payments`, paymentRoutes);
}
