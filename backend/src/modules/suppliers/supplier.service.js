import { createService } from '../../shared/utils/crudFactory.js';
import { supplierRepository } from './supplier.repository.js';

export const supplierService = createService(supplierRepository, {
  softDelete: true,
  defaultWhere: { ativo: true },
  include: { purchases: { take: 5, orderBy: { createdAt: 'desc' } } }
});
