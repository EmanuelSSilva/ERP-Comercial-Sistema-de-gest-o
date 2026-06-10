import { z } from 'zod';
import { dateSchema, moneySchema } from '../../shared/utils/schema.js';

export const createReceivableSchema = z.object({
  clienteId: z.string().uuid().optional().nullable(),
  valor: moneySchema,
  vencimento: dateSchema,
  status: z.enum(['PENDENTE', 'RECEBIDO', 'ATRASADO']).default('PENDENTE')
});

export const updateReceivableSchema = createReceivableSchema.partial();
