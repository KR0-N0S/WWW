// src/newApproach/pages/HomePage.js
import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import IntegrationsSection from '../components/IntegrationsSection';
import ModulesSection from '../components/ModulesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <IntegrationsSection />
      <ModulesSection />
      <TestimonialsSection />
      <Footer />
    </>
  );
}

export default HomePage;
