import { useEffect, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import {
  TrendingUp, DollarSign, ShoppingCart, Package,
  Users, AlertTriangle, CreditCard, Wallet, BarChart2
} from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const fallback = {
  kpis: {
    totalVendas: 0, faturamentoMensal: 0, ticketMedio: 0,
    produtosVendidos: 0, clientesCadastrados: 0, produtosEstoqueBaixo: 0,
    contasReceber: 0, contasPagar: 0, lucroBruto: 0
  },
  charts: { faturamentoPorMes: [], evolucaoClientes: [] }
};

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--text)'
};

export function DashboardPage() {
  const [data, setData]     = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.get()
      .then(setData)
      .catch(() => setData(fallback))
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: 'Faturamento mensal', value: currency.format(data.kpis.faturamentoMensal), icon: DollarSign,   color: 'kpi-blue',   sub: 'Mês atual' },
    { label: 'Lucro bruto',        value: currency.format(data.kpis.lucroBruto),        icon: TrendingUp,   color: 'kpi-green',  sub: 'Acumulado' },
    { label: 'Total de vendas',    value: currency.format(data.kpis.totalVendas),       icon: ShoppingCart, color: 'kpi-indigo', sub: 'Histórico' },
    { label: 'Ticket médio',       value: currency.format(data.kpis.ticketMedio),       icon: BarChart2,    color: 'kpi-purple', sub: 'Por venda' },
    { label: 'Produtos vendidos',  value: data.kpis.produtosVendidos,                  icon: Package,      color: 'kpi-cyan',   sub: 'Unidades' },
    { label: 'Clientes',           value: data.kpis.clientesCadastrados,               icon: Users,        color: 'kpi-teal',   sub: 'Cadastrados' },
    { label: 'Contas a receber',   value: currency.format(data.kpis.contasReceber),    icon: CreditCard,   color: 'kpi-amber',  sub: 'Pendente' },
    { label: 'Contas a pagar',     value: currency.format(data.kpis.contasPagar),      icon: Wallet,       color: 'kpi-red',    sub: 'Pendente' },
    { label: 'Estoque baixo',      value: data.kpis.produtosEstoqueBaixo,              icon: AlertTriangle, color: 'kpi-pink',  sub: 'Produtos' }
  ];

  if (loading) {
    return (
      <section className="page">
        <div style={{ color: 'var(--text-2)', marginTop: 40, textAlign: 'center' }}>Carregando dashboard...</div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard executivo</h1>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="kpi-grid">
        {kpis.map(({ label, value, icon: Icon, color, sub }) => (
          <article className={`kpi-card ${color}`} key={label}>
            <div className="kpi-header">
              <span className="kpi-label">{label}</span>
              <div className="kpi-icon"><Icon size={18} /></div>
            </div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-sub">{sub}</div>
          </article>
        ))}
      </div>

      <div className="grid-2">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Faturamento por mês</div>
            <div className="chart-sub">Evolução mensal de receita</div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.charts.faturamentoPorMes} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4f6ef7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} width={60}
                  tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => currency.format(v)} />
                <Area type="monotone" dataKey="valor" stroke="#4f6ef7" strokeWidth={2} fill="url(#gradBlue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Evolução de clientes</div>
            <div className="chart-sub">Novos clientes por mês</div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.charts.evolucaoClientes} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="valor" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
