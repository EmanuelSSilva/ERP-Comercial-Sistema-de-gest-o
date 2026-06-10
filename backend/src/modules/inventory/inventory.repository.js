import { prisma } from '../../shared/database/prisma.js';

export const inventoryRepository = {
  list: (query = {}) => prisma.inventoryMovement.findMany({
    where: query.produtoId ? { produtoId: query.produtoId } : undefined,
    include: { product: true, user: { select: { id: true, nome: true } } },
    orderBy: { createdAt: 'desc' },
    take: Number(query.limit || 50)
  }),
  createMovement: (data) => prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: data.produtoId } });
    const nextStock = data.tipo === 'AJUSTE'
      ? data.quantidade
      : product.estoqueAtual + (data.tipo === 'ENTRADA' ? data.quantidade : -data.quantidade);

    if (nextStock < 0) throw new Error('Estoque insuficiente.');

    await tx.product.update({ where: { id: data.produtoId }, data: { estoqueAtual: nextStock } });
    return tx.inventoryMovement.create({ data });
  }),
  inventory: () => prisma.product.findMany({
    where: { ativo: true },
    include: { category: true },
    orderBy: { nome: 'asc' }
  })
};
