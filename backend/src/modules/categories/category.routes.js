import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { idParamSchema, listQuerySchema } from '../../shared/utils/schema.js';
import { createCategorySchema, updateCategorySchema } from './category.schema.js';

export const categoryRoutes = Router();

categoryRoutes.use(authenticate, authorize('product:write'));
categoryRoutes.get('/', validate(listQuerySchema, 'query'), categoryController.list);
categoryRoutes.get('/:id', validate(idParamSchema, 'params'), categoryController.getById);
categoryRoutes.post('/', validate(createCategorySchema), audit('CREATE', 'Category'), categoryController.create);
categoryRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updateCategorySchema), audit('UPDATE', 'Category'), categoryController.update);
categoryRoutes.delete('/:id', validate(idParamSchema, 'params'), audit('DELETE', 'Category'), categoryController.remove);
