import { prisma } from '../../shared/database/prisma.js';

export const authRepository = {
  findUserByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  findUserById: (id) => prisma.user.findUnique({ where: { id } }),
  updateUser: (id, data) => prisma.user.update({ where: { id }, data }),
  createRefreshToken: (data) => prisma.refreshToken.create({ data }),
  findRefreshToken: (tokenHash) => prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } }),
  revokeRefreshToken: (id) => prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } })
};
