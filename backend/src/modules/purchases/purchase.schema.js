import { z } from 'zod';
import { moneySchema } from '../../shared/utils/schema.js';

export const createPurchaseSchema = z.object({
  fornecedorId: z.string().uuid(),
  status: z.enum(['PENDENTE', 'RECEBIDA', 'CANCELADA']).default('PENDENTE'),
  vencimento: z.coerce.date().optional(),
  items: z.array(z.object({
    produtoId: z.string().uuid(),
    quantidade: z.coerce.number().int().positive(),
    valorUnitario: moneySchema
  })).min(1)
});
