import { z } from 'zod';
import { moneySchema } from '../../shared/utils/schema.js';

export const createSaleSchema = z.object({
  clienteId: z.string().uuid().optional().nullable(),
  desconto: moneySchema.default(0),
  formaPagamento: z.enum(['PIX', 'DINHEIRO', 'CREDITO', 'DEBITO', 'BOLETO']),
  status: z.enum(['ORCAMENTO', 'FINALIZADA', 'CANCELADA']).default('ORCAMENTO'),
  vencimento: z.coerce.date().optional(),
  items: z.array(z.object({
    produtoId: z.string().uuid(),
    quantidade: z.coerce.number().int().positive(),
    valorUnitario: moneySchema
  })).min(1)
});

export const updateSaleStatusSchema = z.object({
  status: z.enum(['ORCAMENTO', 'FINALIZADA', 'CANCELADA'])
});
