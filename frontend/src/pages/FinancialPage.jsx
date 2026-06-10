import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { accountsPayableService, accountsReceivableService } from '../services/financial.service';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const columns = [
  { key: 'valor',      label: 'Valor',      render: (row) => currency.format(row.valor) },
  { key: 'vencimento', label: 'Vencimento', render: (row) => new Date(row.vencimento).toLocaleDateString('pt-BR') },
  { key: 'status',     label: 'Status' }
];

export function FinancialPage() {
  const [payables,    setPayables]    = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [loading, setLoading] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([
      accountsPayableService.list().catch(() => []),
      accountsReceivableService.list().catch(() => [])
    ]).then(([pay, rec]) => {
      setPayables(Array.isArray(pay) ? pay : pay.data ?? []);
      setReceivables(Array.isArray(rec) ? rec : rec.data ?? []);
    }).finally(() => setLoading(false));
  }

  useEffect(load, []);

  const totalRec = receivables.filter((r) => r.status === 'PENDENTE').reduce((s, r) => s + Number(r.valor), 0);
  const totalPay = payables.filter((p) => p.status === 'PENDENTE').reduce((s, p) => s + Number(p.valor), 0);

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Financeiro</h1>
        <button className="btn btn-secondary" onClick={load}>
          <RefreshCw size={15} /> Atualizar
        </button>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <article className="kpi-card kpi-green">
          <div className="kpi-header">
            <span className="kpi-label">A receber (pendente)</span>
          </div>
          <div className="kpi-value">{currency.format(totalRec)}</div>
          <div className="kpi-sub">{receivables.filter((r) => r.status === 'PENDENTE').length} títulos</div>
        </article>
        <article className="kpi-card kpi-red">
          <div className="kpi-header">
            <span className="kpi-label">A pagar (pendente)</span>
          </div>
          <div className="kpi-value">{currency.format(totalPay)}</div>
          <div className="kpi-sub">{payables.filter((p) => p.status === 'PENDENTE').length} títulos</div>
        </article>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Contas a receber</span>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{receivables.length} título(s)</span>
          </div>
          <DataTable loading={loading} columns={columns} rows={receivables} />
        </div>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Contas a pagar</span>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{payables.length} título(s)</span>
          </div>
          <DataTable loading={loading} columns={columns} rows={payables} />
        </div>
      </div>
    </section>
  );
}
