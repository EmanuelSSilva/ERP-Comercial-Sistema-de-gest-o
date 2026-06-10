import { createService } from '../../shared/utils/crudFactory.js';
import { categoryRepository } from './category.repository.js';

export const categoryService = createService(categoryRepository, { softDelete: true, defaultWhere: { ativo: true } });
