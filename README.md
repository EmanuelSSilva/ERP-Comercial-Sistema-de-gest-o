# ERP Comercial — Sistema de Gestão Full Stack

ERP Comercial completo para portfólio profissional, com backend Node.js/Express + Prisma/PostgreSQL (Supabase) e frontend React/Vite.

## Funcionalidades

### Autenticação & Segurança
- Login com JWT (access token 15 min + refresh token 7 dias)
- Logout com revogação de refresh token
- Recuperação e alteração de senha
- RBAC com 5 perfis: **ADMIN**, **GERENTE**, **VENDEDOR**, **ESTOQUISTA**, **FINANCEIRO**
- Auditoria de ações (AuditLog) com IP e metadata
- Rate limiting, Helmet, CORS e sanitização de inputs

### Cadastros (CRUD completo — criar, editar, excluir, buscar)
- Usuários (com hash de senha e controle de perfil)
- Clientes (CPF/CNPJ, contato, endereço)
- Fornecedores (razão social, CPF/CNPJ, contato)
- Categorias de produtos
- Produtos (código, preços, estoque atual e mínimo)

### Estoque
- Movimentações: entradas, saídas e ajustes manuais
- Histórico de movimentos com filtro por produto
- Inventário geral com alerta de estoque baixo

### Compras
- Registro de compra com itens (produto, quantidade, valor unitário)
- Status: Pendente → Recebida → entrada automática no estoque
- Geração automática de conta a pagar ao registrar compra

### Vendas
- Registro de venda com itens e desconto
- Status: Orçamento → Finalizada → baixa automática no estoque
- Forma de pagamento: PIX, Dinheiro, Crédito, Débito, Boleto
- Geração automática de conta a receber para vendas em boleto

### Financeiro
- Caixa: abertura, fechamento, sangrias e suprimentos
- Contas a pagar (CRUD + vínculo com compras)
- Contas a receber (CRUD + vínculo com vendas)

### Dashboard Executivo
- KPIs: total de vendas, faturamento mensal, ticket médio, produtos vendidos, clientes cadastrados, estoque baixo, contas a receber/pagar, lucro bruto
- Gráficos: vendas por mês, faturamento por mês, evolução de clientes, produtos mais vendidos

### Relatórios
- Tipos: Vendas, Financeiro, Estoque, Clientes, Fornecedores, Produtos
- **Download real de PDF** (jsPDF + autotable) e **Excel** (xlsx) gerados no frontend
- Dados buscados via API e convertidos para arquivo diretamente no browser

### Interface
- Sidebar recolhível com navegação por seções
- Tema claro / escuro
- Tabelas com paginação, busca, loading e empty states
- Formulários com validação (React Hook Form + Zod)
- Responsivo para mobile

---

## Tecnologias

**Backend:** Node.js, Express 5, Prisma ORM, PostgreSQL (Supabase), JWT, Bcrypt, Zod, Winston, Helmet, CORS, Express Rate Limit, Morgan, Cookie Parser

**Frontend:** React 19, Vite 7, React Router DOM 7, Axios, React Hook Form, Zod, Recharts, Lucide React, jsPDF, jspdf-autotable, xlsx

---

## Arquitetura

### Backend — por feature

```
backend/src
  modules/
    auth/                  # login, refresh, logout, change-password
    users/                 # CRUD de usuários
    customers/             # CRUD de clientes
    suppliers/             # CRUD de fornecedores
    categories/            # CRUD de categorias
    products/              # CRUD de produtos
    inventory/             # movimentos de estoque + inventário
    sales/                 # vendas + itens + baixa estoque
    purchases/             # compras + itens + entrada estoque
    cashflow/              # caixa + movimentos
    accounts-payable/      # contas a pagar
    accounts-receivable/   # contas a receber
    dashboard/             # KPIs e gráficos
    reports/               # relatórios por tipo
  shared/
    config/                # variáveis de ambiente
    database/              # cliente Prisma
    errors/                # AppError
    logger/                # Winston
    middlewares/           # authenticate, authorize, validate, audit, errorHandler, sanitize
    utils/                 # asyncHandler, crudFactory, schema, sanitize
  app.js
  server.js
```

### Frontend — por responsabilidade

```
frontend/src
  components/    # DataTable, ResourceForm (reutilizáveis)
  contexts/      # AuthContext (JWT + refresh automático)
  layouts/       # AppLayout (sidebar + topbar)
  pages/         # DashboardPage, ResourcePage, InventoryPage,
                 # SalesPage, PurchasesPage, FinancialPage, ReportsPage, LoginPage
  routes/        # AppRoutes, ProtectedRoute
  services/      # chamadas HTTP isoladas por recurso
  utils/         # exportReport (PDF + Excel)
```

---

## Configuração local

### Pré-requisitos
- Node.js 18+
- Banco PostgreSQL (local ou Supabase)


```bash
# Tudo junto
npm run dev

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Renovar token |
| POST | `/api/auth/logout` | Logout |
| PATCH | `/api/auth/change-password` | Alterar senha |
| GET | `/api/auth/me` | Dados do usuário logado |
| GET/POST/PUT/DELETE | `/api/users` | Usuários |
| GET/POST/PUT/DELETE | `/api/customers` | Clientes |
| GET/POST/PUT/DELETE | `/api/suppliers` | Fornecedores |
| GET/POST/PUT/DELETE | `/api/categories` | Categorias |
| GET/POST/PUT/DELETE | `/api/products` | Produtos |
| GET | `/api/inventory` | Inventário atual |
| GET/POST | `/api/inventory/movements` | Movimentos de estoque |
| GET/POST | `/api/sales` | Vendas |
| GET/POST | `/api/purchases` | Compras |
| GET/POST | `/api/cashflow` | Caixas |
| POST | `/api/cashflow/open` | Abrir caixa |
| PATCH | `/api/cashflow/:id/close` | Fechar caixa |
| POST | `/api/cashflow/:id/movements` | Sangria / suprimento |
| GET/POST/PUT/DELETE | `/api/accounts-payable` | Contas a pagar |
| GET/POST/PUT/DELETE | `/api/accounts-receivable` | Contas a receber |
| GET | `/api/dashboard` | KPIs + gráficos |
| GET | `/api/reports/:type` | Relatório (sales/financial/inventory/customers/suppliers/products) |

---

## Deploy

- **Backend:** Railway, Render ou qualquer plataforma Node.js — configure as variáveis de ambiente e use `npm start`
- **Frontend:** Vercel — configure `VITE_API_URL` apontando para a URL do backend em produção
- **Banco:** Supabase (PostgreSQL gerenciado)

---

## Perfis de Acesso (RBAC)

| Perfil | Permissões |
|--------|-----------|
| ADMIN | Acesso total |
| GERENTE | Dashboard, cadastros, financeiro, estoque, compras, vendas, relatórios |
| VENDEDOR | Clientes, vendas, estoque (leitura), dashboard |
| ESTOQUISTA | Estoque, produtos, compras, dashboard |
| FINANCEIRO | Financeiro, caixa, dashboard, relatórios |
