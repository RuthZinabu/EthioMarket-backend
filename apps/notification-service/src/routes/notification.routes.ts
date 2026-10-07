import { Router } from 'express';
import notificationController from '../controllers/notification.controller';

const router: Router = Router();

router.post('/email', notificationController.sendEmail);
router.post('/sms', notificationController.sendSMS);
router.post('/order-confirmation', notificationController.sendOrderConfirmation);
router.post('/shipment-update', notificationController.sendShipmentUpdate);
router.get('/health-check', notificationController.healthCheck);

export default router;
