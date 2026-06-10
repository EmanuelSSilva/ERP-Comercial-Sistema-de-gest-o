import { prisma } from '../../shared/database/prisma.js';

export const purchaseRepository = {
  list: () => prisma.purchase.findMany({
    include: { supplier: true, items: { include: { product: true } }, payable: true },
    orderBy: { createdAt: 'desc' }
  }),
  findById: (id) => prisma.purchase.findUnique({
    where: { id },
    include: { supplier: true, items: { include: { product: true } }, payable: true }
  }),
  create: (data, user) => prisma.$transaction(async (tx) => {
    const valorTotal = data.items.reduce((sum, item) => sum + item.quantidade * item.valorUnitario, 0);

    const purchase = await tx.purchase.create({
      data: {
        fornecedorId: data.fornecedorId,
        status: data.status,
        valorTotal,
        items: { create: data.items }
      },
      include: { items: true }
    });

    if (data.status === 'RECEBIDA') {
      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.produtoId } });
        await tx.product.update({ where: { id: item.produtoId }, data: { estoqueAtual: product.estoqueAtual + item.quantidade } });
        await tx.inventoryMovement.create({
          data: { produtoId: item.produtoId, tipo: 'ENTRADA', quantidade: item.quantidade, motivo: 'Compra recebida', usuarioId: user.id }
        });
      }
    }

    await tx.accountPayable.create({
      data: { fornecedorId: data.fornecedorId, purchaseId: purchase.id, valor: valorTotal, vencimento: data.vencimento || new Date() }
    });

    return purchase;
  })
};
