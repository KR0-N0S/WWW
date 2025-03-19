// src/newApproach/components/ModulesSection.js
import React from 'react';

function ModulesSection() {
  const modules = [
    { name: 'Moduł 1', desc: 'Opis modułu 1' },
    { name: 'Moduł 2', desc: 'Opis modułu 2' },
    { name: 'Moduł 3', desc: 'Opis modułu 3' },
    { name: 'Moduł 4', desc: 'Opis modułu 4' },
    { name: 'Moduł 5', desc: 'Opis modułu 5' },
    { name: 'Moduł 6', desc: 'Opis modułu 6' },
    { name: 'Moduł 7', desc: 'Opis modułu 7' },
    { name: 'Moduł 8', desc: 'Opis modułu 8' },
    { name: 'Moduł 9', desc: 'Opis modułu 9' },
    { name: 'Moduł 10', desc: 'Opis modułu 10' },
  ];

  return (
    <section style={{ padding: '40px 20px', backgroundColor: '#f8f8f8' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Moduły systemu</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {modules.map((mod, idx) => (
          <div key={idx} style={{ width: '250px', backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{mod.name}</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>{mod.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ModulesSection;
