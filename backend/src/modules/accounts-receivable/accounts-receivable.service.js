import { createService } from '../../shared/utils/crudFactory.js';
import { receivableRepository } from './accounts-receivable.repository.js';

export const receivableService = createService(receivableRepository, { include: { customer: true, sale: true } });
