import React, { useState } from 'react';
import axios from 'axios';

const LoginDebug = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('direct'); // 'direct' lub 'proxy'

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      let response;
      
      if (method === 'direct') {
        // Bezpośrednie żądanie do API bez proxy
        response = await axios.post('http://localhost:4000/auth/login', {
          username,
          password
        });
      } else {
        // Przez proxy Nginx
        response = await axios.post('/api/auth/login', {
          username,
          password
        });
      }
      
      // Zapisz token w localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      setResult(response.data);
    } catch (err) {
      setError({
        message: err.message,
        data: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{textAlign: 'center'}}>Debugowanie Logowania</h2>
      
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', marginBottom: '5px'}}>
          Nazwa użytkownika:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </label>
      </div>
      
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', marginBottom: '5px'}}>
          Hasło:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </label>
      </div>
      
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', marginBottom: '5px'}}>
          Metoda:
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="direct">Bezpośrednio do API</option>
            <option value="proxy">Przez proxy Nginx</option>
          </select>
        </label>
      </div>
      
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Logowanie...' : 'Zaloguj'}
      </button>
      
      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d4edda',
          borderRadius: '4px'
        }}>
          <h3>Sukces!</h3>
          <pre style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '4px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8d7da',
          borderRadius: '4px'
        }}>
          <h3>Błąd: {error.message}</h3>
          {error.status && <p>Status: {error.status}</p>}
          {error.data && (
            <pre style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px'
            }}>
              {JSON.stringify(error.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginDebug;
