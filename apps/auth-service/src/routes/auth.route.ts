import { Router } from "express";
import authController from "../controllers/auth.controller";

const router: Router = Router();

// Health Check
router.get('/health-check', authController.healthCheck);
// Public Customer Auth Endpoints (Persisted in CustomerModel)
router.post('/customer/register', authController.registerCustomer);
router.post('/customer/login', authController.login);

// System Admin / Staff Auth Endpoints (Persisted in UserModel)
router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login', authController.loginAdmin);

// Universal Auth Dispatcher Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Logout & Verification
router.post('/logout', authController.logout);
router.post('/customer/logout', authController.logout);
router.post('/admin/logout', authController.logout);

router.get('/me', authController.getMe);
router.get('/customer/me', authController.getMe);
router.get('/admin/me', authController.getMe);

export default router;
