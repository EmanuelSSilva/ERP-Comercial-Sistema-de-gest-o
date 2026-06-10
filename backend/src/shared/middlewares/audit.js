import { prisma } from '../database/prisma.js';
import { logger } from '../logger/logger.js';

export function audit(action, entity) {
  return async (req, _res, next) => {
    resOnFinish(req, action, entity);
    next();
  };
}

function resOnFinish(req, action, entity) {
  req.res.on('finish', async () => {
    if (req.res.statusCode >= 400) return;

    try {
      await prisma.auditLog.create({
        data: {
          userId: req.user?.id,
          action,
          entity,
          entityId: req.params?.id,
          metadata: { body: req.body, query: req.query },
          ip: req.ip
        }
      });
    } catch (error) {
      logger.warn({ message: 'Falha ao registrar auditoria', error });
    }
  });
}
