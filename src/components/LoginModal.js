// src/newApproach/components/LoginModal.js
import React, { useState } from 'react';
import api from '../services/api';

function LoginModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/login', { email, password });
      // Zakładamy, że backend zwraca { token: '...' }
      localStorage.setItem('token', response.data.token);

      // Poinformuj rodzica (Navbar), że się zalogowaliśmy
      onLoginSuccess();
      onClose();
    } catch (err) {
      console.error('Błąd logowania:', err);
      setError('Niepoprawne dane logowania');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <div style={{
        backgroundColor: '#fff', width: '300px', margin: '100px auto',
        padding: '20px', borderRadius: '5px'
      }}>
        <h2>Logowanie</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLoginSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Hasło:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ marginTop: '10px' }}>
            <button type="submit">Zaloguj się</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
