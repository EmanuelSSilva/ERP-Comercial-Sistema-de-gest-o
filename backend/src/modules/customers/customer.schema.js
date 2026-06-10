import { z } from 'zod';

export const createCustomerSchema = z.object({
  nome: z.string().min(2),
  cpfCnpj: z.string().min(11),
  email: z.string().email().optional().nullable(),
  telefone: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  estado: z.string().max(2).optional().nullable(),
  observacoes: z.string().optional().nullable()
});

export const updateCustomerSchema = createCustomerSchema.partial();
