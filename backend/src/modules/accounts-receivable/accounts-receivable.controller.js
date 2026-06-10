import { createController } from '../../shared/utils/crudFactory.js';
import { receivableService } from './accounts-receivable.service.js';

export const receivableController = createController(receivableService);
