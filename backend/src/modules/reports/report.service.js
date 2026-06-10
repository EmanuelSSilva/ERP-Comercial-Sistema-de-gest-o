import { reportRepository } from './report.repository.js';

export const reportService = {
  async get(type, format = 'json') {
    const loaders = {
      sales: reportRepository.sales,
      financial: reportRepository.financial,
      inventory: reportRepository.inventory,
      customers: reportRepository.customers,
      suppliers: reportRepository.suppliers,
      products: reportRepository.products
    };

    const data = await loaders[type]();
    return {
      type,
      format,
      generatedAt: new Date(),
      data,
      exportHint: 'Use o payload JSON para geração PDF/Excel no frontend ou em um worker dedicado.'
    };
  }
};
