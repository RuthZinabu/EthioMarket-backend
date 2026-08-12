import { type Express } from 'express';
import paymentRoutes from './payment.routes';
import { routePrefix } from '@emacare/shared-utils';

export default function initRoutes(app: Express): void {
  app.use(`${routePrefix}/payments`, paymentRoutes);
  app.use('/', paymentRoutes);
}
export { paymentRoutes };
