import { useEffect, useMemo, useState, useCallback } from 'react';
import { Search, RefreshCw, Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { ResourceForm } from '../components/ResourceForm';

export function ResourcePage({ title, service, fields }) {
  const [rows,      setRows]      = useState([]);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(false);
  const [editRecord, setEditRecord] = useState(null);   // null = criar, obj = editar
  const [showForm,  setShowForm]  = useState(false);

  const columns = useMemo(() =>
    fields
      .filter((f) => !['senha'].includes(f))
      .map((f) => ({
        key: f,
        label: f.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim()
      })),
    [fields]
  );

  const load = useCallback(async (q = search) => {
    setLoading(true);
    try {
      const result = await service.list(q ? { search: q } : {});
      setRows(Array.isArray(result) ? result : result.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [service, search]);

  useEffect(() => { load(''); }, [service]);

  async function handleSubmit(values) {
    if (editRecord) {
      await service.update(editRecord.id, values);
    } else {
      await service.create(values);
    }
    setEditRecord(null);
    setShowForm(false);
    await load();
  }

  async function handleDelete(row) {
    if (!window.confirm(`Excluir "${row.nome || row.razaoSocial || row.codigo || row.email}"?`)) return;
    await service.remove(row.id);
    await load();
  }

  function handleEdit(row) {
    setEditRecord(row);
    setShowForm(true);
  }

  function handleNew() {
    setEditRecord(null);
    setShowForm(true);
  }

  function handleCancel() {
    setEditRecord(null);
    setShowForm(false);
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <div className="page-actions">
          <div className="search-box">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              placeholder="Buscar e pressione Enter"
            />
          </div>
          <button className="btn btn-secondary" onClick={() => load()} title="Recarregar">
            <RefreshCw size={15} />
          </button>
          <button className="btn btn-primary" onClick={handleNew}>
            <Plus size={15} /> Novo
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        {showForm && (
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">{editRecord ? 'Editar registro' : 'Novo registro'}</span>
            </div>
            <div className="panel-body">
              <ResourceForm
                fields={fields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
                editRecord={editRecord}
              />
            </div>
          </div>
        )}

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">{title}</span>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{rows.length} registro(s)</span>
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </section>
  );
}
