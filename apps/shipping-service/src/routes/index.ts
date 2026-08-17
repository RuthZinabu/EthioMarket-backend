import { type Express } from 'express';
import shippingRoutes from './shipping.routes';
import { routePrefix } from '@emacare/shared-utils';

export default function router(app: Express): void {
  app.use(`${routePrefix}/shipping`, shippingRoutes);
  app.use('/', shippingRoutes);
}
export { shippingRoutes };
