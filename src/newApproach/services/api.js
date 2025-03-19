import axios from 'axios';

// Adres Twojego backendu, np. http://83.150.236.135:4000
const api = axios.create({
  baseURL: 'http://83.150.236.135:4000'
});

// Interceptor dołączający token do nagłówka (Authorization: Bearer <token>)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
