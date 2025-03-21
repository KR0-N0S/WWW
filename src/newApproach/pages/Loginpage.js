// src/newApproach/pages/Loginpage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // jeśli używasz React Router
import api from '../services/api';  // plik axios
import './Loginpage.css';          // stylizacje

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Wywołanie endpointu logowania
      const response = await api.post('/api/auth/login', {
        email: email,
        password: password
      });
      localStorage.setItem('token', response.data.token);
	  // Dodaj zapis obiektu użytkownika (jeśli backend go zwraca)
    localStorage.setItem('user', JSON.stringify(response.data.user));

      // Po logowaniu przejście do /dashboard
      navigate('/dashboard');
    } catch (err) {
      alert('Błędne dane logowania lub inny problem.');
    }
  };

  const handleRegister = () => {
    navigate('/register'); // Przejście do rejestracji
  };

  return (
    <div className="login-page-container">
      
      {/* Lewa kolumna – baner/reklama */}
      <div className="login-left-column">
        <div className="login-left-content">
          <h3>Tu może być Twoja reklama</h3>
          <p>
            Dowolny tekst promocyjny. <br />
            Np. "Najlepsza cena <strong>InPost</strong> na rynku..."
          </p>
          <button>Załóż konto w BLPaczce</button>
        </div>
      </div>

      {/* Prawa kolumna – formularz */}
      <div className="login-right-column">
        
        {/* Górny pasek – logo i link rejestracji */}
        <div className="login-topbar">
          <div className="topbar-logo">
            {/* Wstaw własne logo */}
            <img 
              src="https://via.placeholder.com/100x40" 
              alt="Logo" 
            />
          </div>
          <div className="topbar-actions">
            <span>Nie masz konta?</span>
            <button className="register-link" onClick={handleRegister}>
              Zarejestruj się
            </button>
            <div className="lang-switch">PL ▼</div>
          </div>
        </div>
        
        {/* Formularz logowania */}
        <div className="login-form-container">
          <h2>Zaloguj się do panelu sprzedawcy</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <label>LOGIN</label>
            <input 
              type="text" 
              placeholder="Wpisz e-mail lub login" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-row">
              <label>HASŁO</label>
              <a href="/forgot" className="forgot-link">Przypomnij hasło</a>
            </div>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-button">Zaloguj się</button>
          </form>

          <div className="separator">lub</div>

          <button className="qr-button">
            Zaloguj za pomocą kodu QR
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
