import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@erp:accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('@erp:refreshToken');

      if (refreshToken) {
        const { data } = await api.post('/auth/refresh', { refreshToken });
        localStorage.setItem('@erp:accessToken', data.accessToken);
        localStorage.setItem('@erp:refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
