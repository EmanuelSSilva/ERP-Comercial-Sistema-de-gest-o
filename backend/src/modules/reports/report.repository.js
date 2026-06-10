import { prisma } from '../../shared/database/prisma.js';

export const reportRepository = {
  sales: () => prisma.sale.findMany({ include: { customer: true, seller: true, items: { include: { product: true } } } }),
  financial: () => Promise.all([
    prisma.accountReceivable.findMany({ include: { customer: true } }),
    prisma.accountPayable.findMany({ include: { supplier: true } })
  ]),
  inventory: () => prisma.product.findMany({ include: { category: true, inventoryMovements: true } }),
  customers: () => prisma.customer.findMany({ include: { sales: true } }),
  suppliers: () => prisma.supplier.findMany({ include: { purchases: true } }),
  products: () => prisma.product.findMany({ include: { category: true, saleItems: true, purchaseItems: true } })
};
