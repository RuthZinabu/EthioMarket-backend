import { Router } from "express";
import type { Request, Response } from 'express';
import authController from "../controllers/auth.controller";

const router: Router = Router();

// CRUD
router.get('/health-check',authController.healthCheck);

export default router;

