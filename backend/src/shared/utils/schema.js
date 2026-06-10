import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().uuid()
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional()
});

export const moneySchema = z.coerce.number().nonnegative();
export const dateSchema = z.coerce.date();
