import { Router } from 'express';
import { z } from 'zod';
import { reportController } from './report.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';

const reportParamSchema = z.object({
  type: z.enum(['sales', 'financial', 'inventory', 'customers', 'suppliers', 'products'])
});

export const reportRoutes = Router();

reportRoutes.get('/:type', authenticate, authorize('report:read'), validate(reportParamSchema, 'params'), reportController.get);
