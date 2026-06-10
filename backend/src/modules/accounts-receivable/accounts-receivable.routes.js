import { Router } from 'express';
import { receivableController } from './accounts-receivable.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { idParamSchema, listQuerySchema } from '../../shared/utils/schema.js';
import { createReceivableSchema, updateReceivableSchema } from './accounts-receivable.schema.js';

export const receivableRoutes = Router();

receivableRoutes.use(authenticate, authorize('financial:write'));
receivableRoutes.get('/', validate(listQuerySchema, 'query'), receivableController.list);
receivableRoutes.get('/:id', validate(idParamSchema, 'params'), receivableController.getById);
receivableRoutes.post('/', validate(createReceivableSchema), audit('CREATE', 'AccountReceivable'), receivableController.create);
receivableRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updateReceivableSchema), audit('UPDATE', 'AccountReceivable'), receivableController.update);
receivableRoutes.delete('/:id', validate(idParamSchema, 'params'), audit('DELETE', 'AccountReceivable'), receivableController.remove);
