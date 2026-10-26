import { type Express } from 'express';
import notificationRoutes from './notification.routes';
import { routePrefix } from '@emacare/shared-utils';

export default function router(app: Express): void {
  app.use(`${routePrefix}/notifications`, notificationRoutes);
}
