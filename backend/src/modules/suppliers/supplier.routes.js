import { Router } from 'express';
import { supplierController } from './supplier.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { idParamSchema, listQuerySchema } from '../../shared/utils/schema.js';
import { createSupplierSchema, updateSupplierSchema } from './supplier.schema.js';

export const supplierRoutes = Router();

supplierRoutes.use(authenticate, authorize('purchase:write'));
supplierRoutes.get('/', validate(listQuerySchema, 'query'), supplierController.list);
supplierRoutes.get('/:id', validate(idParamSchema, 'params'), supplierController.getById);
supplierRoutes.post('/', validate(createSupplierSchema), audit('CREATE', 'Supplier'), supplierController.create);
supplierRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updateSupplierSchema), audit('UPDATE', 'Supplier'), supplierController.update);
supplierRoutes.delete('/:id', validate(idParamSchema, 'params'), audit('DELETE', 'Supplier'), supplierController.remove);
