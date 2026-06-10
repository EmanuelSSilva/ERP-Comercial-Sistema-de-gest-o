import { Router } from 'express';
import { payableController } from './accounts-payable.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { idParamSchema, listQuerySchema } from '../../shared/utils/schema.js';
import { createPayableSchema, updatePayableSchema } from './accounts-payable.schema.js';

export const payableRoutes = Router();

payableRoutes.use(authenticate, authorize('financial:write'));
payableRoutes.get('/', validate(listQuerySchema, 'query'), payableController.list);
payableRoutes.get('/:id', validate(idParamSchema, 'params'), payableController.getById);
payableRoutes.post('/', validate(createPayableSchema), audit('CREATE', 'AccountPayable'), payableController.create);
payableRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updatePayableSchema), audit('UPDATE', 'AccountPayable'), payableController.update);
payableRoutes.delete('/:id', validate(idParamSchema, 'params'), audit('DELETE', 'AccountPayable'), payableController.remove);
