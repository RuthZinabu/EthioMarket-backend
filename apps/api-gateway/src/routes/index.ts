import { type Express } from 'express';
import gatewayRoutes from './gateway.routes';
import { routePrefix } from '@emacare/shared-utils';

export default function router(app: Express): void {
  app.use(`${routePrefix}/gateway`, gatewayRoutes);
}
export { gatewayRoutes };
