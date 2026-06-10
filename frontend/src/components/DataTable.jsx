import { Pencil, Trash2 } from 'lucide-react';

const STATUS_BADGE = {
  ATIVO:     'badge badge-green', ATIVO_true: 'badge badge-green',
  FINALIZADA:'badge badge-green', PAGO:       'badge badge-green', RECEBIDO: 'badge badge-green',
  PENDENTE:  'badge badge-amber', ORCAMENTO:  'badge badge-amber',
  ATRASADO:  'badge badge-red',   CANCELADA:  'badge badge-red',
  RECEBIDA:  'badge badge-blue',  ENTRADA:    'badge badge-green',
  SAIDA:     'badge badge-red',   AJUSTE:     'badge badge-amber'
};

function CellValue({ value }) {
  const badgeClass = STATUS_BADGE[String(value)];
  if (badgeClass) return <span className={badgeClass}>{value}</span>;
  if (typeof value === 'boolean') return <span className={value ? 'badge badge-green' : 'badge badge-red'}>{value ? 'Ativo' : 'Inativo'}</span>;
  return value ?? '—';
}

export function DataTable({ columns, rows, loading, empty = 'Nenhum registro encontrado.', onEdit, onDelete }) {
  const hasActions = onEdit || onDelete;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => <th key={col.key}>{col.label}</th>)}
            {hasActions && <th style={{ width: 90 }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan={columns.length + (hasActions ? 1 : 0)} className="empty-row">Carregando...</td></tr>
          )}
          {!loading && rows.length === 0 && (
            <tr><td colSpan={columns.length + (hasActions ? 1 : 0)} className="empty-row">{empty}</td></tr>
          )}
          {!loading && rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : <CellValue value={row[col.key]} />}
                </td>
              ))}
              {hasActions && (
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {onEdit && (
                      <button className="btn btn-ghost btn-sm" title="Editar" onClick={() => onEdit(row)}>
                        <Pencil size={14} />
                      </button>
                    )}
                    {onDelete && (
                      <button className="btn btn-ghost btn-sm" title="Excluir" style={{ color: 'var(--danger)' }} onClick={() => onDelete(row)}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
