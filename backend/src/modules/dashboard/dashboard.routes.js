import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';

export const dashboardRoutes = Router();

dashboardRoutes.get('/', authenticate, authorize('dashboard:read'), dashboardController.get);
