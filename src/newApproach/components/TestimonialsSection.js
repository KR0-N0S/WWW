// src/newApproach/components/TestimonialsSection.js
import React from 'react';

function TestimonialsSection() {
  const testimonials = [
    { company: 'Firma ABC', quote: 'Dzięki temu narzędziu zaoszczędziliśmy mnóstwo czasu!' },
    { company: 'Sklep XYZ', quote: 'Integracje działają bez zarzutu, polecamy!' },
  ];

  return (
    <section style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '2rem' }}>Opinie klientów</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {testimonials.map((t, idx) => (
          <div key={idx} style={{ maxWidth: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }}>
            <p style={{ fontStyle: 'italic' }}>"{t.quote}"</p>
            <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>{t.company}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
