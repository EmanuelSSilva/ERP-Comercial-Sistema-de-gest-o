import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { purchaseService } from '../services/purchase.service';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function PurchasesPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(false);

  function load() {
    setLoading(true);
    purchaseService.list()
      .then((r) => setRows(Array.isArray(r) ? r : r.data ?? []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Compras</h1>
        <button className="btn btn-secondary" onClick={load}><RefreshCw size={15} /> Atualizar</button>
      </div>
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Histórico de compras</span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{rows.length} registro(s)</span>
        </div>
        <DataTable loading={loading} columns={[
          { key: 'supplier',   label: 'Fornecedor', render: (row) => row.supplier?.razaoSocial },
          { key: 'valorTotal', label: 'Total',      render: (row) => currency.format(row.valorTotal) },
          { key: 'status',     label: 'Status' },
          { key: 'createdAt',  label: 'Data',       render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR') }
        ]} rows={rows} />
      </div>
    </section>
  );
}
