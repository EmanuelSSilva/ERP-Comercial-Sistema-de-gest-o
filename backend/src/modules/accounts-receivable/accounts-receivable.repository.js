import { prisma } from '../../shared/database/prisma.js';
import { createRepository } from '../../shared/utils/crudFactory.js';

export const receivableRepository = createRepository('accountReceivable', { prisma });
