import { prisma } from '../../shared/database/prisma.js';
import { createRepository } from '../../shared/utils/crudFactory.js';

export const supplierRepository = createRepository('supplier', { prisma, searchFields: ['razaoSocial', 'cpfCnpj', 'email'] });
