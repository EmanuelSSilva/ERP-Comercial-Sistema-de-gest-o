import { cashflowRepository } from './cashflow.repository.js';

export const cashflowService = {
  list: () => cashflowRepository.list(),
  open: (data, user) => cashflowRepository.open(user.id, data.saldoInicial),
  close: (id, data) => cashflowRepository.close(id, data.saldoFinal),
  movement: (id, data) => cashflowRepository.movement(id, data)
};
