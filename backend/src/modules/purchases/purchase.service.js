import { purchaseRepository } from './purchase.repository.js';
import { AppError } from '../../shared/errors/AppError.js';

export const purchaseService = {
  list: () => purchaseRepository.list(),
  async getById(id) {
    const purchase = await purchaseRepository.findById(id);
    if (!purchase) throw new AppError('Compra não encontrada.', 404);
    return purchase;
  },
  async create(data, user) {
    try {
      return await purchaseRepository.create(data, user);
    } catch (error) {
      throw new AppError(error.message || 'Falha ao registrar compra.', 400);
    }
  }
};
