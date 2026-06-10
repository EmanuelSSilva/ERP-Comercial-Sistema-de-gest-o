import { Router } from 'express';
import { purchaseController } from './purchase.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { idParamSchema } from '../../shared/utils/schema.js';
import { createPurchaseSchema } from './purchase.schema.js';

export const purchaseRoutes = Router();

purchaseRoutes.use(authenticate, authorize('purchase:write'));
purchaseRoutes.get('/', purchaseController.list);
purchaseRoutes.get('/:id', validate(idParamSchema, 'params'), purchaseController.getById);
purchaseRoutes.post('/', validate(createPurchaseSchema), audit('CREATE', 'Purchase'), purchaseController.create);
