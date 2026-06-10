import { api } from './api';

export const authService = {
  login: (payload) => api.post('/auth/login', payload).then((response) => response.data),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }).then((response) => response.data),
  me: () => api.get('/auth/me').then((response) => response.data),
  changePassword: (payload) => api.patch('/auth/change-password', payload).then((response) => response.data)
};
