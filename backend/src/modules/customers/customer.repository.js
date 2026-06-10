import { prisma } from '../../shared/database/prisma.js';
import { createRepository } from '../../shared/utils/crudFactory.js';

export const customerRepository = createRepository('customer', { prisma, searchFields: ['nome', 'cpfCnpj', 'email'] });
