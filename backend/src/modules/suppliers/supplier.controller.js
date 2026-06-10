import { createController } from '../../shared/utils/crudFactory.js';
import { supplierService } from './supplier.service.js';

export const supplierController = createController(supplierService);
