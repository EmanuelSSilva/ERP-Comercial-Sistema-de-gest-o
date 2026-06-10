import { z } from 'zod';

export const createCategorySchema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional().nullable()
});

export const updateCategorySchema = createCategorySchema.partial();
