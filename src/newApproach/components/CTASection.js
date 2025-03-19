import React from 'react';

function CTASection() {
  return (
    <section className="cta-section">
      <h2>Ready to get started?</h2>
      <p>Sign up now and see how our app can help your farm.</p>
      <button className="cta-button">Sign Up</button>

      <div className="partners-logos">
        <img
          src="https://via.placeholder.com/100x50?text=Logo1"
          alt="Partner 1"
        />
        <img
          src="https://via.placeholder.com/100x50?text=Logo2"
          alt="Partner 2"
        />
        <img
          src="https://via.placeholder.com/100x50?text=Logo3"
          alt="Partner 3"
        />
      </div>
    </section>
  );
}

export default CTASection;
