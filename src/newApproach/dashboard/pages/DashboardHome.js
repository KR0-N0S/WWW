// src/newApproach/dashboard/pages/DashboardHome.js
import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Upewnij się, że ścieżka jest poprawna

const DashboardHome = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/api/animals')
      .then(response => setData(response.data))
      .catch(err => console.error('Błąd pobrania danych', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel Zarządzania (Dashboard)</h2>
      <p>Witaj, możesz zarządzać zwierzętami, inseminacjami itp.</p>
      {data ? (
        <div>
          <h3>Lista zwierząt:</h3>
          <ul>
            {data.map(animal => (
              <li key={animal.id}>
                {animal.name} - {animal.species}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Ładowanie danych...</p>
      )}
    </div>
  );
};

export default DashboardHome;
