import { Router } from 'express';
import { cashflowController } from './cashflow.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { idParamSchema } from '../../shared/utils/schema.js';
import { cashMovementSchema, closeCashRegisterSchema, openCashRegisterSchema } from './cashflow.schema.js';

export const cashflowRoutes = Router();

cashflowRoutes.use(authenticate, authorize('cashflow:write'));
cashflowRoutes.get('/', cashflowController.list);
cashflowRoutes.post('/open', validate(openCashRegisterSchema), audit('OPEN', 'CashRegister'), cashflowController.open);
cashflowRoutes.patch('/:id/close', validate(idParamSchema, 'params'), validate(closeCashRegisterSchema), audit('CLOSE', 'CashRegister'), cashflowController.close);
cashflowRoutes.post('/:id/movements', validate(idParamSchema, 'params'), validate(cashMovementSchema), audit('CREATE', 'CashMovement'), cashflowController.movement);
