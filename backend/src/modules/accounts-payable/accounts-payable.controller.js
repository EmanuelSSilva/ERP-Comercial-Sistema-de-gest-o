import { createController } from '../../shared/utils/crudFactory.js';
import { payableService } from './accounts-payable.service.js';

export const payableController = createController(payableService);
