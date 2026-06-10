import { prisma } from '../../shared/database/prisma.js';
import { createRepository } from '../../shared/utils/crudFactory.js';

export const categoryRepository = createRepository('category', { prisma, searchFields: ['nome', 'descricao'] });
