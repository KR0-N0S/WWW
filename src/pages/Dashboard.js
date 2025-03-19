// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Panel Sterowania</h1>
      <p>Witaj w systemie AmicusApp!</p>
      {/* Przykładowe linki do innych sekcji, które dodasz w przyszłości */}
      <nav>
        <ul>
          <li><Link to="/animals">Zwierzęta</Link></li>
          {/* Dodaj kolejne linki do sekcji: Buhaje, Inseminacje itd. */}
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
