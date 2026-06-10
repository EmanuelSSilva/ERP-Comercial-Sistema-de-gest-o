import { useState } from 'react';
import { Download, BarChart2, DollarSign, Boxes, Users, Building2, Package } from 'lucide-react';
import { reportService } from '../services/report.service';
import { exportExcel, exportPDF } from '../utils/exportReport';

const reports = [
  { type: 'sales',      label: 'Vendas',       icon: BarChart2,  color: '#4f6ef7' },
  { type: 'financial',  label: 'Financeiro',   icon: DollarSign, color: '#22c55e' },
  { type: 'inventory',  label: 'Estoque',      icon: Boxes,      color: '#f59e0b' },
  { type: 'customers',  label: 'Clientes',     icon: Users,      color: '#06b6d4' },
  { type: 'suppliers',  label: 'Fornecedores', icon: Building2,  color: '#8b5cf6' },
  { type: 'products',   label: 'Produtos',     icon: Package,    color: '#ec4899' }
];

export function ReportsPage() {
  const [loading, setLoading] = useState('');
  const [error,   setError]   = useState('');

  async function download(type, format, label) {
    setLoading(`${type}-${format}`);
    setError('');
    try {
      const result = await reportService.get(type, format);
      const payload = result?.data ?? result;
      const filename = `relatorio-${type}-${new Date().toISOString().slice(0, 10)}`;
      if (format === 'excel') {
        exportExcel(payload, filename);
      } else {
        exportPDF(payload, `Relatório de ${label}`, filename);
      }
    } catch {
      setError(`Falha ao gerar relatório de ${label}.`);
    } finally {
      setLoading('');
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Relatórios</h1>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 16 }}>{error}</p>}

      <div className="report-grid">
        {reports.map(({ type, label, icon: Icon, color }) => (
          <article className="report-card" key={type}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: color + '20', color,
                display: 'grid', placeItems: 'center', flexShrink: 0
              }}>
                <Icon size={20} />
              </div>
              <span className="report-card-title">{label}</span>
            </div>
            <div className="report-card-actions">
              <button
                className="btn btn-secondary btn-sm"
                disabled={!!loading}
                onClick={() => download(type, 'pdf', label)}
              >
                <Download size={13} />
                {loading === `${type}-pdf` ? 'Gerando...' : 'PDF'}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={!!loading}
                onClick={() => download(type, 'excel', label)}
              >
                <Download size={13} />
                {loading === `${type}-excel` ? 'Gerando...' : 'Excel'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
