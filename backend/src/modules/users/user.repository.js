import { prisma } from '../../shared/database/prisma.js';
import { createRepository } from '../../shared/utils/crudFactory.js';

export const userRepository = createRepository('user', { prisma, searchFields: ['nome', 'email'] });
