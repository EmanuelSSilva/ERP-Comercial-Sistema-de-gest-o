import { api } from './api';
export const saleService = {
  list: () => api.get('/sales').then((response) => response.data),
  create: (payload) => api.post('/sales', payload).then((response) => response.data)
};
