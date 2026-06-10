import { api } from './api';
export const reportService = {
  get: (type, format = 'json') => api.get(`/reports/${type}`, { params: { format } }).then((response) => response.data)
};
