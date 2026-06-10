import { prisma } from '../../shared/database/prisma.js';
import { createRepository } from '../../shared/utils/crudFactory.js';

export const productRepository = createRepository('product', { prisma, searchFields: ['codigo', 'nome', 'descricao'] });
