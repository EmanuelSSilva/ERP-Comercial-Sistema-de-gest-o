import { z } from 'zod';

const roleSchema = z.enum(['ADMIN', 'GERENTE', 'VENDEDOR', 'ESTOQUISTA', 'FINANCEIRO']);

export const createUserSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
  role: roleSchema.default('VENDEDOR'),
  ativo: z.boolean().optional()
});

export const updateUserSchema = createUserSchema.partial().omit({ senha: true }).extend({
  senha: z.string().min(6).optional()
});
