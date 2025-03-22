import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TokenDebug = () => {
  const [tokenInfo, setTokenInfo] = useState({ found: false, token: null });
  const [testApiResponse, setTestApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sprawdź token w localStorage
    let token = localStorage.getItem('token');
    let source = 'direct';
    
    // Jeśli nie ma tokenu bezpośrednio, sprawdź w obiekcie user
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          if (userData && userData.token) {
            token = userData.token;
            source = 'user object';
          }
        } catch (e) {
          console.error("Błąd parsowania danych użytkownika:", e);
        }
      }
    }
    
    setTokenInfo({
      found: !!token,
      token: token ? `${token.substring(0, 15)}...` : null,
      source: token ? source : 'not found'
    });
  }, []);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/clients?limit=2');
      setTestApiResponse({
        status: response.status,
        data: response.data
      });
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '15px',
      margin: '10px 0',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>API Token Debugger</h3>
      <p><strong>Token znaleziony:</strong> {tokenInfo.found ? '✅' : '❌'}</p>
      {tokenInfo.found && (
        <>
          <p><strong>Fragment tokenu:</strong> {tokenInfo.token}</p>
          <p><strong>Źródło tokenu:</strong> {tokenInfo.source}</p>
        </>
      )}
      
      <button 
        onClick={testApiConnection}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Testowanie...' : 'Testuj połączenie API'}
      </button>
      
      {testApiResponse && (
        <div style={{marginTop: '15px'}}>
          <h4>Wynik testu API:</h4>
          <p><strong>Status:</strong> {testApiResponse.status}</p>
          <pre style={{
            padding: '10px',
            backgroundColor: '#eee',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(testApiResponse.data, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px'
        }}>
          <h4>Błąd testu API:</h4>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TokenDebug;
