import { api } from './api';
export const cashflowService = {
  list: () => api.get('/cashflow').then((response) => response.data),
  open: (payload) => api.post('/cashflow/open', payload).then((response) => response.data)
};
