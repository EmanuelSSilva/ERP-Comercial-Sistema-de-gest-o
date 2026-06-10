import { z } from 'zod';

export const createInventoryMovementSchema = z.object({
  produtoId: z.string().uuid(),
  tipo: z.enum(['ENTRADA', 'SAIDA', 'AJUSTE']),
  quantidade: z.coerce.number().int().positive(),
  motivo: z.string().min(3)
});
