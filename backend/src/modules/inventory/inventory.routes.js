import { Router } from 'express';
import { inventoryController } from './inventory.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { authorize } from '../../shared/middlewares/authorize.js';
import { validate } from '../../shared/middlewares/validate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { createInventoryMovementSchema } from './inventory.schema.js';

export const inventoryRoutes = Router();

inventoryRoutes.use(authenticate);
inventoryRoutes.get('/', authorize('inventory:read'), inventoryController.inventory);
inventoryRoutes.get('/movements', authorize('inventory:read'), inventoryController.list);
inventoryRoutes.post('/movements', authorize('inventory:write'), validate(createInventoryMovementSchema), audit('CREATE', 'InventoryMovement'), inventoryController.create);
