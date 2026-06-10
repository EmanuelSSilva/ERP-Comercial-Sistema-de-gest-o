import { api } from './api';
export const inventoryService = {
  list: () => api.get('/inventory').then((response) => response.data),
  movements: () => api.get('/inventory/movements').then((response) => response.data),
  createMovement: (payload) => api.post('/inventory/movements', payload).then((response) => response.data)
};
