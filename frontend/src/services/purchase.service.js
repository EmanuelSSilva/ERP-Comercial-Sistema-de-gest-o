import { api } from './api';
export const purchaseService = {
  list: () => api.get('/purchases').then((response) => response.data),
  create: (payload) => api.post('/purchases', payload).then((response) => response.data)
};
