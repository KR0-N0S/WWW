// src/newApproach/pages/RegisterPage.js
import React, { useState } from 'react';
import api from '../services/api';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', response.data.token);
      // Po udanej rejestracji:
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Błąd rejestracji. Spróbuj inny email.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Imię:</label><br/>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Email:</label><br/>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Hasło:</label><br/>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Zarejestruj się</button>
      </form>
    </div>
  );
}

export default RegisterPage;
