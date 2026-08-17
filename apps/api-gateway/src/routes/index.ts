import { type Express } from 'express';
import gatewayRoutes from './gateway.routes';

export default function router(app: Express): void {
  app.use('/', gatewayRoutes);
}
export { gatewayRoutes };
