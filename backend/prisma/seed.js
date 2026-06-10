import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@erp.com',
      senha: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    }
  });

  const category = await prisma.category.upsert({
    where: { nome: 'Geral' },
    update: {},
    create: { nome: 'Geral', descricao: 'Categoria padrão' }
  });

  await prisma.product.upsert({
    where: { codigo: 'PROD-001' },
    update: {},
    create: {
      codigo: 'PROD-001',
      nome: 'Produto Demonstrativo',
      descricao: 'Item inicial para testar estoque e vendas',
      categoriaId: category.id,
      precoCompra: 40,
      precoVenda: 75,
      estoqueAtual: 25,
      estoqueMinimo: 5
    }
  });

  await prisma.customer.upsert({
    where: { cpfCnpj: '00000000000' },
    update: {},
    create: { nome: 'Cliente Demonstração', cpfCnpj: '00000000000', email: 'cliente@erp.com' }
  });

  await prisma.supplier.upsert({
    where: { cpfCnpj: '11111111111' },
    update: {},
    create: { razaoSocial: 'Fornecedor Demonstração', cpfCnpj: '11111111111', email: 'fornecedor@erp.com' }
  });

  console.log(`Seed concluído. Admin: ${admin.email} / admin123`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
