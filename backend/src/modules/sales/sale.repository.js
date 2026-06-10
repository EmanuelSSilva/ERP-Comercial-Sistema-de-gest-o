import { prisma } from '../../shared/database/prisma.js';

export const saleRepository = {
  list: () => prisma.sale.findMany({
    include: { customer: true, seller: { select: { id: true, nome: true } }, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  }),
  findById: (id) => prisma.sale.findUnique({
    where: { id },
    include: { customer: true, seller: { select: { id: true, nome: true } }, items: { include: { product: true } }, receivable: true }
  }),
  create: (data, user) => prisma.$transaction(async (tx) => {
    const totalItems = data.items.reduce((sum, item) => sum + item.quantidade * item.valorUnitario, 0);
    const valorTotal = totalItems - Number(data.desconto || 0);

    if (data.status === 'FINALIZADA') {
      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.produtoId } });
        if (!product || product.estoqueAtual < item.quantidade) throw new Error(`Estoque insuficiente para ${product?.nome || item.produtoId}.`);
        await tx.product.update({ where: { id: item.produtoId }, data: { estoqueAtual: product.estoqueAtual - item.quantidade } });
        await tx.inventoryMovement.create({
          data: { produtoId: item.produtoId, tipo: 'SAIDA', quantidade: item.quantidade, motivo: 'Venda finalizada', usuarioId: user.id }
        });
      }
    }

    const sale = await tx.sale.create({
      data: {
        clienteId: data.clienteId,
        vendedorId: user.id,
        desconto: data.desconto,
        formaPagamento: data.formaPagamento,
        status: data.status,
        valorTotal,
        items: { create: data.items }
      },
      include: { items: true }
    });

    if (data.status === 'FINALIZADA' && data.formaPagamento === 'BOLETO') {
      await tx.accountReceivable.create({
        data: { clienteId: data.clienteId, saleId: sale.id, valor: valorTotal, vencimento: data.vencimento || new Date() }
      });
    }

    return sale;
  })
};
