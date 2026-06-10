import { dashboardRepository } from './dashboard.repository.js';

const monthKey = (date) => new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(new Date(date));

function groupByMonth(records, valueSelector = () => 1) {
  return Object.values(records.reduce((acc, item) => {
    const key = monthKey(item.createdAt);
    acc[key] ||= { mes: key, valor: 0 };
    acc[key].valor += Number(valueSelector(item));
    return acc;
  }, {}));
}

export const dashboardService = {
  async get() {
    const [summary, charts] = await Promise.all([dashboardRepository.summary(), dashboardRepository.charts()]);
    return {
      kpis: summary,
      charts: {
        vendasPorMes: groupByMonth(charts.sales),
        faturamentoPorMes: groupByMonth(charts.sales, (sale) => sale.valorTotal),
        produtosMaisVendidos: charts.topProducts,
        categoriasMaisVendidas: [],
        fluxoCaixa: [],
        evolucaoClientes: groupByMonth(charts.customers)
      }
    };
  }
};
