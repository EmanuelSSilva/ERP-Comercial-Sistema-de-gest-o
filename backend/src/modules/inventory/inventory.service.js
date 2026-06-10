import { inventoryRepository } from './inventory.repository.js';
import { AppError } from '../../shared/errors/AppError.js';

export const inventoryService = {
  list: (query) => inventoryRepository.list(query),
  inventory: () => inventoryRepository.inventory(),
  async create(data, user) {
    try {
      return await inventoryRepository.createMovement({ ...data, usuarioId: user.id });
    } catch (error) {
      throw new AppError(error.message || 'Falha ao movimentar estoque.', 400);
    }
  }
};
