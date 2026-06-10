import { createController } from '../../shared/utils/crudFactory.js';
import { categoryService } from './category.service.js';

export const categoryController = createController(categoryService);
