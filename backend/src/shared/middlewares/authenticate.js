import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
import { prisma } from '../database/prisma.js';

export async function authenticate(req, _res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Token de acesso não informado.', 401);
  }

  const token = header.replace('Bearer ', '');
  const payload = jwt.verify(token, env.jwtAccessSecret);
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, nome: true, email: true, role: true, ativo: true }
  });

  if (!user || !user.ativo) {
    throw new AppError('Usuário não autorizado.', 401);
  }

  req.user = user;
  next();
}
