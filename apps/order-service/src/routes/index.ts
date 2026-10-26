import { type Express } from 'express';
import orderRoutes from './order.routes';
import { routePrefix } from '@emacare/shared-utils';

export default function router(app: Express): void {
  app.use(`${routePrefix}/orders`, orderRoutes);
}
