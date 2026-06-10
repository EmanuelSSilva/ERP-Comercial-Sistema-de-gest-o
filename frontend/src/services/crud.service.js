import { api } from './api';

export const createCrudService = (resource) => ({
  list: (params) => api.get(resource, { params }).then((response) => response.data),
  get: (id) => api.get(`${resource}/${id}`).then((response) => response.data),
  create: (payload) => api.post(resource, payload).then((response) => response.data),
  update: (id, payload) => api.put(`${resource}/${id}`, payload).then((response) => response.data),
  remove: (id) => api.delete(`${resource}/${id}`).then((response) => response.data)
});
