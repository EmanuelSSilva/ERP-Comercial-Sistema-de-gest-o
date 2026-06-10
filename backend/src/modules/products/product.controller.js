import { createController } from '../../shared/utils/crudFactory.js';
import { productService } from './product.service.js';

export const productController = createController(productService);
