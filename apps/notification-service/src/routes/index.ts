import { type Express } from 'express';
import notificationRoutes from './notification.routes';
import { routePrefix } from '@emacare/shared-utils';

export default function initRoutes(app: Express): void {
  app.use(`${routePrefix}/notifications`, notificationRoutes);
  app.use('/', notificationRoutes);
}
export { notificationRoutes };
