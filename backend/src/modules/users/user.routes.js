import { Router } from 'express';
import { userController } from './user.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { idParamSchema, listQuerySchema } from '../../shared/utils/schema.js';
import { createUserSchema, updateUserSchema } from './user.schema.js';
import { audit } from '../../shared/middlewares/audit.js';

export const userRoutes = Router();

userRoutes.use(authenticate, authorize('*'));
userRoutes.get('/', validate(listQuerySchema, 'query'), userController.list);
userRoutes.get('/:id', validate(idParamSchema, 'params'), userController.getById);
userRoutes.post('/', validate(createUserSchema), audit('CREATE', 'User'), userController.create);
userRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updateUserSchema), audit('UPDATE', 'User'), userController.update);
userRoutes.delete('/:id', validate(idParamSchema, 'params'), audit('DELETE', 'User'), userController.remove);
