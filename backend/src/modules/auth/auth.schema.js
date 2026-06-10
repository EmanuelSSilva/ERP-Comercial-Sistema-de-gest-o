import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const changePasswordSchema = z.object({
  senhaAtual: z.string().min(6),
  novaSenha: z.string().min(6)
});
