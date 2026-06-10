import { z } from 'zod';
import { moneySchema } from '../../shared/utils/schema.js';

export const createProductSchema = z.object({
  codigo: z.string().min(2),
  nome: z.string().min(2),
  descricao: z.string().optional().nullable(),
  categoriaId: z.string().uuid().optional().nullable(),
  precoCompra: moneySchema,
  precoVenda: moneySchema,
  estoqueAtual: z.coerce.number().int().min(0).default(0),
  estoqueMinimo: z.coerce.number().int().min(0).default(0),
  ativo: z.boolean().optional()
});

export const updateProductSchema = createProductSchema.partial();
