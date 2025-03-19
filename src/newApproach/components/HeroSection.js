// src/newApproach/components/HeroSection.js
import React from 'react';

function HeroSection() {
  return (
    <section style={{
      padding: '60px 20px',
      textAlign: 'center',
      backgroundColor: '#ffffff'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Najlepsze narzędzie do zarządzania e-commerce w jednym miejscu
      </h1>
      <p style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
        Zamówienia, przesyłki, integracje, automatyzacja – wszystko, czego potrzebujesz,
        aby usprawnić swoją sprzedaż online.
      </p>
      <button style={{ padding: '12px 24px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>
        Wypróbuj za darmo
      </button>
      <p style={{ marginTop: '1rem' }}>
        <a href="#learn-more" style={{ color: '#007bff' }}>
          Sprawdź, ile możesz zyskać
        </a>
      </p>
    </section>
  );
}

export default HeroSection;
