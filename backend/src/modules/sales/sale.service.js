import { saleRepository } from './sale.repository.js';
import { AppError } from '../../shared/errors/AppError.js';

export const saleService = {
  list: () => saleRepository.list(),
  async getById(id) {
    const sale = await saleRepository.findById(id);
    if (!sale) throw new AppError('Venda não encontrada.', 404);
    return sale;
  },
  async create(data, user) {
    try {
      return await saleRepository.create(data, user);
    } catch (error) {
      throw new AppError(error.message || 'Falha ao registrar venda.', 400);
    }
  }
};
