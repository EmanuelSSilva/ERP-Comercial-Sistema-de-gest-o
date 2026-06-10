import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Normaliza qualquer payload do backend em linhas planas
// financial retorna [receivables[], payables[]] — trata array duplo
function flatten(data) {
  const raw = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  // array de arrays (financial)
  if (raw.length === 2 && Array.isArray(raw[0]) && Array.isArray(raw[1])) {
    return [
      ...raw[0].map((r) => ({ _tipo: 'A Receber', ...flattenObject(r) })),
      ...raw[1].map((r) => ({ _tipo: 'A Pagar',   ...flattenObject(r) }))
    ];
  }
  return raw.map((item) => flattenObject(item));
}

function flattenObject(obj, prefix = '') {
  return Object.entries(obj || {}).reduce((acc, [key, val]) => {
    const k = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      Object.assign(acc, flattenObject(val, k));
    } else if (Array.isArray(val)) {
      acc[k] = val.length;          // arrays viram contagem
    } else {
      acc[k] = val ?? '';
    }
    return acc;
  }, {});
}

export function exportExcel(data, filename) {
  const rows = flatten(data);
  if (!rows.length) return;
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportPDF(data, title, filename) {
  const rows = flatten(data);
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => headers.map((h) => String(r[h] ?? '')));

  const doc = new jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' });
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.setFontSize(9);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22);

  autoTable(doc, {
    head: [headers],
    body,
    startY: 28,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [79, 110, 247] }
  });

  doc.save(`${filename}.pdf`);
}
