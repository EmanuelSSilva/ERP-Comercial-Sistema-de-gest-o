import { z } from 'zod';
import { moneySchema } from '../../shared/utils/schema.js';

export const openCashRegisterSchema = z.object({
  saldoInicial: moneySchema
});

export const closeCashRegisterSchema = z.object({
  saldoFinal: moneySchema
});

export const cashMovementSchema = z.object({
  tipo: z.enum(['SANGRIA', 'SUPRIMENTO']),
  valor: moneySchema,
  descricao: z.string().optional().nullable()
});
