// src/newApproach/components/IntegrationsSection.js
import React from 'react';

function IntegrationsSection() {
  return (
    <section id="integrations" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '2rem' }}>Zintegrowane z 1300+ platform i narzędziami</h2>
      <p>Obsługujemy Allegro, eBay, Amazon i wiele więcej...</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '1rem' }}>
        {/* Przykładowe logotypy */}
        <img src="https://via.placeholder.com/80x40?text=Allegro" alt="Allegro" />
        <img src="https://via.placeholder.com/80x40?text=eBay" alt="eBay" />
        <img src="https://via.placeholder.com/80x40?text=Amazon" alt="Amazon" />
      </div>
    </section>
  );
}

export default IntegrationsSection;
