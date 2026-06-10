import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { logger } from '../logger/logger.js';

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(422).json({
      message: 'Dados inválidos.',
      errors: error.issues
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
  }

  logger.error(error);

  return res.status(500).json({
    message: 'Erro interno do servidor.'
  });
}
