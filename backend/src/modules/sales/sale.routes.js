import { Router } from 'express';
import { saleController } from './sale.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { idParamSchema } from '../../shared/utils/schema.js';
import { createSaleSchema } from './sale.schema.js';

export const saleRoutes = Router();

saleRoutes.use(authenticate, authorize('sale:write'));
saleRoutes.get('/', saleController.list);
saleRoutes.get('/:id', validate(idParamSchema, 'params'), saleController.getById);
saleRoutes.post('/', validate(createSaleSchema), audit('CREATE', 'Sale'), saleController.create);
