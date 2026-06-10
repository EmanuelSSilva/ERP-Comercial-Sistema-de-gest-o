import { z } from 'zod';
import { dateSchema, moneySchema } from '../../shared/utils/schema.js';

export const createPayableSchema = z.object({
  fornecedorId: z.string().uuid().optional().nullable(),
  valor: moneySchema,
  vencimento: dateSchema,
  status: z.enum(['PENDENTE', 'PAGO', 'ATRASADO']).default('PENDENTE')
});

export const updatePayableSchema = createPayableSchema.partial();
