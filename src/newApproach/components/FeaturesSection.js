// src/newApproach/components/FeaturesSection.js
import React from 'react';

function FeaturesSection() {
  const features = [
    { title: 'Integracje, których potrzebujesz', desc: 'Wiele platform i narzędzi w jednym miejscu' },
    { title: 'Zarządzanie z jednego panelu', desc: 'Pełna kontrola nad zamówieniami i stanami magazynowymi' },
    { title: 'Automatyzacja obsługi', desc: 'Oszczędność czasu dzięki inteligentnym regułom' },
    { title: 'Pełna kontrola stanów i cen', desc: 'Aktualizacje w czasie rzeczywistym' },
    { title: 'Oszczędność czasu', desc: 'Intuicyjny interfejs i proste procesy' },
  ];

  return (
    <section id="features" style={{ padding: '40px 20px', backgroundColor: '#f8f8f8' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Kluczowe funkcje i korzyści</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        {features.map((f, idx) => (
          <div key={idx} style={{ width: '200px', backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
