import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Po załadowaniu, możemy pobrać dane z API, np. /api/animals
    // Token jest w localStorage i auto-dodawany w nagłówku przez interceptora (jeśli tak skonfigurowałeś)
    api.get('/api/animals')
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        console.error('Błąd pobrania danych', err);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel Zarządzania (Dashboard)</h2>
      <p>Witaj, możesz zarządzać zwierzętami, buhajami, inseminacjami itp.</p>

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
}

export default DashboardPage;
