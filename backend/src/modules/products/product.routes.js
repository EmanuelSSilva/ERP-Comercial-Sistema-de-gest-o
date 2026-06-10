import { Router } from 'express';
import { productController } from './product.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { idParamSchema, listQuerySchema } from '../../shared/utils/schema.js';
import { createProductSchema, updateProductSchema } from './product.schema.js';

export const productRoutes = Router();

productRoutes.use(authenticate);
productRoutes.get('/', authorize('inventory:read'), validate(listQuerySchema, 'query'), productController.list);
productRoutes.get('/:id', authorize('inventory:read'), validate(idParamSchema, 'params'), productController.getById);
productRoutes.post('/', authorize('product:write'), validate(createProductSchema), audit('CREATE', 'Product'), productController.create);
productRoutes.put('/:id', authorize('product:write'), validate(idParamSchema, 'params'), validate(updateProductSchema), audit('UPDATE', 'Product'), productController.update);
productRoutes.delete('/:id', authorize('product:write'), validate(idParamSchema, 'params'), audit('DELETE', 'Product'), productController.remove);
