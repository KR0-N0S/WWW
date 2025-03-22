import axios from 'axios';

// Zmiana na relatywny URL zamiast absolutnego
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

// Interceptor sprawdzający token w obu możliwych miejscach
api.interceptors.request.use(
  (config) => {
    // Najpierw sprawdź token bezpośrednio
    let token = localStorage.getItem('token');
    
    // Jeśli nie ma tokenu, sprawdź w obiekcie user
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          if (userData && userData.token) {
            token = userData.token;
          }
        } catch (e) {
          console.error("Błąd parsowania danych użytkownika:", e);
        }
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;