import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ResourcePage } from '../pages/ResourcePage';
import { InventoryPage } from '../pages/InventoryPage';
import { SalesPage } from '../pages/SalesPage';
import { PurchasesPage } from '../pages/PurchasesPage';
import { FinancialPage } from '../pages/FinancialPage';
import { ReportsPage } from '../pages/ReportsPage';
import { customerService } from '../services/customer.service';
import { supplierService } from '../services/supplier.service';
import { productService } from '../services/product.service';
import { userService } from '../services/user.service';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/clientes" element={<ResourcePage title="Clientes" service={customerService} fields={['nome', 'cpfCnpj', 'email', 'telefone']} />} />
          <Route path="/fornecedores" element={<ResourcePage title="Fornecedores" service={supplierService} fields={['razaoSocial', 'cpfCnpj', 'email', 'telefone']} />} />
          <Route path="/produtos" element={<ResourcePage title="Produtos" service={productService} fields={['codigo', 'nome', 'precoCompra', 'precoVenda', 'estoqueMinimo']} />} />
          <Route path="/usuarios" element={<ResourcePage title="Usuários" service={userService} fields={['nome', 'email', 'senha', 'role']} />} />
          <Route path="/estoque" element={<InventoryPage />} />
          <Route path="/vendas" element={<SalesPage />} />
          <Route path="/compras" element={<PurchasesPage />} />
          <Route path="/financeiro" element={<FinancialPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
