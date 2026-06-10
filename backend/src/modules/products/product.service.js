import { createService } from '../../shared/utils/crudFactory.js';
import { productRepository } from './product.repository.js';

export const productService = createService(productRepository, {
  softDelete: true,
  defaultWhere: { ativo: true },
  include: { category: true }
});
