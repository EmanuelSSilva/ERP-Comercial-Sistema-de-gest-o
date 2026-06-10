import { z } from 'zod';

export const createSupplierSchema = z.object({
  razaoSocial: z.string().min(2),
  cpfCnpj: z.string().min(11),
  email: z.string().email().optional().nullable(),
  telefone: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable()
});

export const updateSupplierSchema = createSupplierSchema.partial();
