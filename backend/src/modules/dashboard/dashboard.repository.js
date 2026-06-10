import { prisma } from '../../shared/database/prisma.js';

const monthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const dashboardRepository = {
  async summary() {
    const [sales, monthlySales, customers, products, receivables, payables, purchaseItems, saleItems] = await Promise.all([
      prisma.sale.aggregate({ where: { status: 'FINALIZADA' }, _sum: { valorTotal: true }, _count: true }),
      prisma.sale.aggregate({ where: { status: 'FINALIZADA', createdAt: { gte: monthStart() } }, _sum: { valorTotal: true }, _count: true }),
      prisma.customer.count({ where: { ativo: true } }),
      prisma.product.findMany({ where: { ativo: true }, select: { estoqueAtual: true, estoqueMinimo: true } }),
      prisma.accountReceivable.aggregate({ where: { status: 'PENDENTE' }, _sum: { valor: true } }),
      prisma.accountPayable.aggregate({ where: { status: 'PENDENTE' }, _sum: { valor: true } }),
      prisma.purchaseItem.aggregate({ _sum: { valorUnitario: true } }),
      prisma.saleItem.aggregate({ _sum: { valorUnitario: true, quantidade: true } })
    ]);

    const faturamentoMensal = Number(monthlySales._sum.valorTotal || 0);
    const totalVendas = Number(sales._sum.valorTotal || 0);

    return {
      totalVendas,
      faturamentoMensal,
      ticketMedio: sales._count ? totalVendas / sales._count : 0,
      produtosVendidos: Number(saleItems._sum.quantidade || 0),
      clientesCadastrados: customers,
      produtosEstoqueBaixo: products.filter((product) => product.estoqueAtual <= product.estoqueMinimo).length,
      contasReceber: Number(receivables._sum.valor || 0),
      contasPagar: Number(payables._sum.valor || 0),
      lucroBruto: totalVendas - Number(purchaseItems._sum.valorUnitario || 0)
    };
  },
  async charts() {
    const [sales, topProducts, categories, customers] = await Promise.all([
      prisma.sale.findMany({ where: { status: 'FINALIZADA' }, select: { createdAt: true, valorTotal: true }, orderBy: { createdAt: 'asc' } }),
      prisma.saleItem.groupBy({ by: ['produtoId'], _sum: { quantidade: true }, orderBy: { _sum: { quantidade: 'desc' } }, take: 8 }),
      prisma.product.findMany({ include: { category: true, saleItems: true } }),
      prisma.customer.findMany({ select: { createdAt: true }, orderBy: { createdAt: 'asc' } })
    ]);

    return { sales, topProducts, categories, customers };
  }
};
