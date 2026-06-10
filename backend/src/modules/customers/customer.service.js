import { createService } from '../../shared/utils/crudFactory.js';
import { customerRepository } from './customer.repository.js';

export const customerService = createService(customerRepository, { softDelete: true, defaultWhere: { ativo: true } });
