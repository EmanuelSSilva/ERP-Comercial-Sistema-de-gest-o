import { createController } from '../../shared/utils/crudFactory.js';
import { customerService } from './customer.service.js';

export const customerController = createController(customerService);
