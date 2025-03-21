// src/services/api.js

import axios from 'axios';

// Jeśli w .env ustawisz: REACT_APP_API_URL=http://83.150.236.135:4000/api
// to skrypt użyje tej zmiennej. W przeciwnym razie weźmie domyślny adres.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://83.150.236.135:4000/api'
});

// Interceptor – dołącza token z localStorage (o ile istnieje)
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
