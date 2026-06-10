import { prisma } from '../../shared/database/prisma.js';

export const cashflowRepository = {
  list: () => prisma.cashRegister.findMany({ include: { user: true, movements: true }, orderBy: { dataAbertura: 'desc' } }),
  open: (userId, saldoInicial) => prisma.cashRegister.create({ data: { usuarioId: userId, saldoInicial } }),
  close: (id, saldoFinal) => prisma.cashRegister.update({
    where: { id },
    data: { saldoFinal, status: 'FECHADO', dataFechamento: new Date() }
  }),
  movement: (cashRegisterId, data) => prisma.cashMovement.create({ data: { cashRegisterId, ...data } })
};
