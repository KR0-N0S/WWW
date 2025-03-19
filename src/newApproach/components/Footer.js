// src/newApproach/components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#333',
      color: '#fff',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <a href="#features" style={{ color: '#fff', marginRight: '10px' }}>Funkcje</a>
        <a href="#integrations" style={{ color: '#fff', marginRight: '10px' }}>Integracje</a>
        <a href="#pricing" style={{ color: '#fff', marginRight: '10px' }}>Cennik</a>
        <a href="#contact" style={{ color: '#fff' }}>Kontakt</a>
      </div>
      <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
        © 2025 Twoja Firma. Wszelkie prawa zastrzeżone.
      </p>
    </footer>
  );
}

export default Footer;
