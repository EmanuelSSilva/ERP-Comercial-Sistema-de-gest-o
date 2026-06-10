import { createService } from '../../shared/utils/crudFactory.js';
import { payableRepository } from './accounts-payable.repository.js';

export const payableService = createService(payableRepository, { include: { supplier: true, purchase: true } });
