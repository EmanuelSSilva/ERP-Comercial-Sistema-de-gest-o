import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { saleService } from '../services/sale.service';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function SalesPage() {
  const [rows, setRows]     = useState([]);
  const [loading, setLoading] = useState(false);

  function load() {
    setLoading(true);
    saleService.list()
      .then((r) => setRows(Array.isArray(r) ? r : r.data ?? []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Vendas</h1>
        <button className="btn btn-secondary" onClick={load}><RefreshCw size={15} /> Atualizar</button>
      </div>
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Pedidos e orçamentos</span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{rows.length} registro(s)</span>
        </div>
        <DataTable loading={loading} columns={[
          { key: 'customer',      label: 'Cliente',    render: (row) => row.customer?.nome || 'Consumidor' },
          { key: 'seller',        label: 'Vendedor',   render: (row) => row.seller?.nome },
          { key: 'valorTotal',    label: 'Total',      render: (row) => currency.format(row.valorTotal) },
          { key: 'formaPagamento',label: 'Pagamento' },
          { key: 'status',        label: 'Status' },
          { key: 'createdAt',     label: 'Data',       render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR') }
        ]} rows={rows} />
      </div>
    </section>
  );
}
