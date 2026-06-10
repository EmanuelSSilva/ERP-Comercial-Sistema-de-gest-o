import { Router } from 'express';
import { customerController } from './customer.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { idParamSchema, listQuerySchema } from '../../shared/utils/schema.js';
import { createCustomerSchema, updateCustomerSchema } from './customer.schema.js';

export const customerRoutes = Router();

customerRoutes.use(authenticate);
customerRoutes.get('/', authorize('customer:write', 'sale:write'), validate(listQuerySchema, 'query'), customerController.list);
customerRoutes.get('/:id', authorize('customer:write', 'sale:write'), validate(idParamSchema, 'params'), customerController.getById);
customerRoutes.post('/', authorize('customer:write'), validate(createCustomerSchema), audit('CREATE', 'Customer'), customerController.create);
customerRoutes.put('/:id', authorize('customer:write'), validate(idParamSchema, 'params'), validate(updateCustomerSchema), audit('UPDATE', 'Customer'), customerController.update);
customerRoutes.delete('/:id', authorize('customer:write'), validate(idParamSchema, 'params'), audit('DELETE', 'Customer'), customerController.remove);
