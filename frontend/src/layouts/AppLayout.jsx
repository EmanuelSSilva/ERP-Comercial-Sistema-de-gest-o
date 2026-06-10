import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3, Banknote, Boxes, Building2, ChevronLeft, ChevronRight,
  FileText, LayoutDashboard, LogOut, Moon, Package, Receipt,
  ShoppingCart, Sun, Users, Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navSections = [
  {
    label: 'Principal',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    label: 'Cadastros',
    items: [
      { to: '/clientes',     label: 'Clientes',     icon: Users },
      { to: '/fornecedores', label: 'Fornecedores',  icon: Building2 },
      { to: '/produtos',     label: 'Produtos',      icon: Package }
    ]
  },
  {
    label: 'Operações',
    items: [
      { to: '/estoque', label: 'Estoque',  icon: Boxes },
      { to: '/vendas',  label: 'Vendas',   icon: ShoppingCart },
      { to: '/compras', label: 'Compras',  icon: Receipt }
    ]
  },
  {
    label: 'Gestão',
    items: [
      { to: '/financeiro', label: 'Financeiro', icon: Banknote },
      { to: '/relatorios', label: 'Relatórios', icon: FileText },
      { to: '/usuarios',   label: 'Usuários',   icon: BarChart3 }
    ]
  }
];

const allItems = navSections.flatMap((s) => s.items);

function getPageTitle(pathname) {
  if (pathname === '/') return 'Dashboard';
  const match = allItems.find((item) => item.to !== '/' && pathname.startsWith(item.to));
  return match?.label || '';
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const initials = user?.nome?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className={`app${collapsed ? ' collapsed' : ''}${dark ? ' dark' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">EC</div>
          <div>
            <div className="brand-name">ERP Comercial</div>
            <div className="brand-sub">Sistema de gestão</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  title={item.label}
                >
                  <item.icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.nome}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button className="icon-btn sidebar-toggle" title="Recolher menu" onClick={() => setCollapsed((v) => !v)}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn" title="Menu" onClick={() => setCollapsed((v) => !v)}>
              <Menu size={18} />
            </button>
            <span className="breadcrumb">
              ERP Comercial &nbsp;/&nbsp; <strong>{pageTitle}</strong>
            </span>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" title="Alternar tema" onClick={() => setDark((v) => !v)}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-btn" title="Sair" onClick={logout}>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
