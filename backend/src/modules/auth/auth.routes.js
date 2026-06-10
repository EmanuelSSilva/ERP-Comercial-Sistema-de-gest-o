import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../shared/middlewares/validate.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import { audit } from '../../shared/middlewares/audit.js';
import { changePasswordSchema, forgotPasswordSchema, loginSchema, refreshSchema } from './auth.schema.js';

export const authRoutes = Router();

authRoutes.post('/login', validate(loginSchema), audit('LOGIN', 'Auth'), authController.login);
authRoutes.post('/refresh', validate(refreshSchema), authController.refresh);
authRoutes.post('/logout', validate(refreshSchema), audit('LOGOUT', 'Auth'), authController.logout);
authRoutes.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
authRoutes.patch('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);
authRoutes.get('/me', authenticate, authController.me);
