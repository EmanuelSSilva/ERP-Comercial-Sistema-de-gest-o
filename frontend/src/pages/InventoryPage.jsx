import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { inventoryService } from '../services/inventory.service';

export function InventoryPage() {
  const [products,  setProducts]  = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([
      inventoryService.list().catch(() => []),
      inventoryService.movements().catch(() => [])
    ]).then(([p, m]) => {
      setProducts(Array.isArray(p) ? p : p.data ?? []);
      setMovements(Array.isArray(m) ? m : m.data ?? []);
    }).finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Estoque</h1>
        <button className="btn btn-secondary" onClick={load}>
          <RefreshCw size={15} /> Atualizar
        </button>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Inventário</span>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{products.length} produto(s)</span>
          </div>
          <DataTable loading={loading} columns={[
            { key: 'codigo',       label: 'Código' },
            { key: 'nome',         label: 'Produto' },
            { key: 'estoqueAtual', label: 'Atual' },
            { key: 'estoqueMinimo',label: 'Mínimo' },
            { key: 'estoqueAtual', label: 'Status', render: (row) => (
              <span className={row.estoqueAtual <= row.estoqueMinimo ? 'badge badge-red' : 'badge badge-green'}>
                {row.estoqueAtual <= row.estoqueMinimo ? 'Baixo' : 'OK'}
              </span>
            )}
          ]} rows={products} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Movimentações</span>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{movements.length} movimento(s)</span>
          </div>
          <DataTable loading={loading} columns={[
            { key: 'tipo',      label: 'Tipo' },
            { key: 'quantidade',label: 'Qtd.' },
            { key: 'motivo',    label: 'Motivo' },
            { key: 'createdAt', label: 'Data', render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR') }
          ]} rows={movements} />
        </div>
      </div>
    </section>
  );
}
