// Plik: /var/www/amicus-frontend/src/dashboard/pages/ClientsListPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientsListPage.css'; // plik ze stylami (opcjonalnie)

const ClientsListPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Po załadowaniu komponentu pobieramy listę klientów z API
    // Poniżej przykładowy fetch - dostosuj do swojego endpointu:
    fetch('/api/clients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Jeśli używasz JWT:
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Błąd pobierania klientów');
        return res.json();
      })
      .then(data => setClients(data))
      .catch(err => console.error('Błąd:', err));
  }, []);

  const handleAddClient = () => {
    // Przejście do strony z formularzem dodawania klienta
    navigate('/dashboard/clients/add'); 
    // (Zakładam, że zdefiniujesz route="/dashboard/clients/add" -> <AddClientPage />)
  };

  return (
    <div className="clients-list-container">
      <div className="clients-header">
        <h2>Lista klientów</h2>
        <button className="btn-add-client" onClick={handleAddClient}>
          Dodaj klienta
        </button>
      </div>

      {/* Tabela / kafelek w stylu Baselinkera */}
      <div className="clients-table">
        <table>
          <thead>
            <tr>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Miasto</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.first_name}</td>
                <td>{client.last_name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsListPage;
