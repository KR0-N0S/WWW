// Plik: /var/www/amicus-frontend/src/dashboard/pages/ClientsListPage.js
import TokenDebug from './TokenDebug';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ClientsListPage.css';
import { FaPlus, FaSearch, FaTimes, FaFilter } from 'react-icons/fa';

const ClientsListPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

  // Kolumny do wyszukiwania (jeśli backend obsługuje)
  const searchColumns = [
    { value: 'all', label: 'Wszystkie pola' },
    { value: 'first_name', label: 'Imię' },
    { value: 'last_name', label: 'Nazwisko' },
    { value: 'organization_name', label: 'Nazwa firmy' },
    { value: 'phone', label: 'Telefon' },
    { value: 'city', label: 'Miejscowość' },
    { value: 'herd_id', label: 'Numer stada' },
    { value: 'orgTaxId', label: 'NIP' },
    { value: 'email', label: 'Email' }
  ];

  // Pobieranie klientów
  const fetchClients = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      
      if (searchTerm) {
        params.append('search', searchTerm);
        if (searchColumn !== 'all') {
          params.append('column', searchColumn);
        }
      }
      
      const response = await api.get(`/clients?${params.toString()}`);
      
      // Jeśli API zwraca tablicę klientów
      if (Array.isArray(response.data)) {
        setClients(response.data);
        setTotalPages(1);
      } else {
        // Jeśli API zwraca np. { clients: [...], totalPages: ... }
        setClients(response.data.clients || []);
        setTotalPages(response.data.totalPages || 1);
      }
      
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Nie udało się pobrać listy klientów. Spróbuj ponownie później.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(1);
  }, []);

  // Automatyczne usuwanie komunikatu sukcesu po 5 sekundach
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setShowSearchPopup(false);
    fetchClients(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchColumn('all');
    setShowSearchPopup(false);
    fetchClients(1);
  };

  const handleDeleteClient = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      try {
        await api.delete(`/clients/${id}`);
        setSuccessMessage('Klient został pomyślnie usunięty');
        fetchClients(currentPage);
      } catch (err) {
        console.error('Error deleting client:', err);
        setError('Nie udało się usunąć klienta. Spróbuj ponownie później.');
      }
    }
  };

  const handleChangePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchClients(page);
    }
  };

  const openClientDetails = (client) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  const closeClientDetails = () => {
    setShowClientDetails(false);
    setSelectedClient(null);
  };

  // Adres w formacie: "Miejscowość ul. Ulica nr-domu"
  const formatAddress = (client) => {
    if (!client.city && !client.street && !client.house_number) {
      return '-';
    }

    let address = '';

    if (client.city) {
      address += client.city;
    }
    if (client.street) {
      if (address) address += ' ';
      address += `ul. ${client.street}`;
    }
    if (client.house_number) {
      address += ` ${client.house_number}`;
    }

    return address;
  };

  // Paginacja
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handleChangePage(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="pagination">
        <button
          className="pagination-arrow"
          onClick={() => handleChangePage(1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        <button
          className="pagination-arrow"
          onClick={() => handleChangePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {pages}
        <button
          className="pagination-arrow"
          onClick={() => handleChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
        <button
          className="pagination-arrow"
          onClick={() => handleChangePage(totalPages)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </div>
    );
  };

  // Popup wyszukiwania
  const SearchPopup = () => (
    <div className="search-popup-overlay" onClick={() => setShowSearchPopup(false)}>
      <div className="search-popup" onClick={e => e.stopPropagation()}>
        <div className="search-popup-header">
          <h3>Wyszukaj klienta</h3>
          <button className="close-button" onClick={() => setShowSearchPopup(false)}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSearch}>
          <div className="search-row">
            <div className="search-input-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Wpisz szukaną frazę..."
                className="form-input search-input"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-input-button"
                  onClick={() => setSearchTerm('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <div className="search-column-selector">
              <FaFilter className="filter-icon" />
              <select
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                className="form-select"
              >
                {searchColumns.map(column => (
                  <option key={column.value} value={column.value}>
                    {column.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="search-popup-buttons">
            <button
              type="button"
              className="button button-secondary"
              onClick={clearSearch}
            >
              Wyczyść
            </button>
            <button type="submit" className="button button-primary">
              Wyszukaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Szczegóły klienta (modal)
  const ClientDetailsCard = () => {
    if (!selectedClient) return null;
    
    return (
      <div className="client-details-overlay" onClick={closeClientDetails}>
        <div className="client-details-card" onClick={e => e.stopPropagation()}>
          <div className="client-details-header">
            <h3>Szczegóły klienta</h3>
            <button className="close-button" onClick={closeClientDetails}>
              <FaTimes />
            </button>
          </div>
          
          <div className="client-details-content">
            <div className="client-details-section">
              <h4>Dane podstawowe</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Imię:</span>
                  <span className="detail-value">{selectedClient.first_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nazwisko:</span>
                  <span className="detail-value">{selectedClient.last_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Telefon:</span>
                  <span className="detail-value">{selectedClient.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedClient.email || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nr siedziby stada:</span>
                  <span className="detail-value">{selectedClient.herd_id || '-'}</span>
                </div>
              </div>
            </div>
            
            {/* Sekcja firmy: tylko jeśli user ma role = 'OWNER' i jest organization_name */}
            {selectedClient.role === 'OWNER' && selectedClient.organization_name && (
              <div className="client-details-section">
                <h4>Dane firmy</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nazwa firmy:</span>
                    <span className="detail-value">{selectedClient.organization_name}</span>
                  </div>
                  {/* Możesz tu dodać kolejne pola, np. org_tax_id */}
                </div>
              </div>
            )}
            
            <div className="client-details-section">
              <h4>Adres</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Ulica:</span>
                  <span className="detail-value">{selectedClient.street || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nr domu:</span>
                  <span className="detail-value">{selectedClient.house_number || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Kod pocztowy:</span>
                  <span className="detail-value">{selectedClient.postal_code || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Miejscowość:</span>
                  <span className="detail-value">{selectedClient.city || '-'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="client-details-footer">
            <button
              className="button button-secondary"
              onClick={closeClientDetails}
            >
              Zamknij
            </button>
            <button
              className="button button-primary"
              onClick={() => {
                closeClientDetails();
                navigate(`/dashboard/clients/edit/${selectedClient.id}`);
              }}
            >
              Edytuj klienta
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="client-card-container">
      <h2 className="client-card-title">Lista klientów</h2>
      
      {successMessage && (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="client-card">
        <div className="client-list-header">
          <button
            className="button button-secondary"
            onClick={() => setShowSearchPopup(true)}
          >
            <FaSearch className="button-icon" /> Wyszukaj
          </button>
          
          {searchTerm && (
            <div className="active-search">
              <span>Wyniki dla: <strong>{searchTerm}</strong></span>
              <button className="clear-search" onClick={clearSearch}>
                <FaTimes />
              </button>
            </div>
          )}
          
          <button
            className="button button-primary add-client-button"
            onClick={() => navigate('/dashboard/clients/add')}
          >
            <FaPlus className="button-icon" /> Dodaj klienta
          </button>
        </div>
        
        {error && <div className="error-container">{error}</div>}
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Ładowanie klientów...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="empty-list">
            <p>Brak klientów do wyświetlenia.</p>
            {searchTerm && (
              <p>
                Spróbuj zmienić kryteria wyszukiwania lub{' '}
                <button
                  className="clear-search-button"
                  onClick={clearSearch}
                >
                  wyczyść wyszukiwanie
                </button>
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Imię</th>
                    <th>Nazwisko</th>
                    <th>Nazwa</th>
                    <th>Adres</th>
                    <th>Telefon</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 
                    Dodajemy filtr, aby wyświetlać TYLKO tych, 
                    którzy mają role = 'OWNER'.
                  */}
                  {clients
                    .filter(client => client.role === 'OWNER')
                    .map((client) => (
                      <tr 
                        key={client.id} 
                        className="client-row"
                        onClick={() => openClientDetails(client)}
                      >
                        <td>{client.first_name}</td>
                        <td>{client.last_name}</td>
                        <td>{client.organization_name || '-'}</td>
                        <td>{formatAddress(client)}</td>
                        <td>{client.phone}</td>
                        <td 
                          className="actions-cell"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            className="button button-secondary action-button"
                            onClick={() => navigate(`/dashboard/clients/edit/${client.id}`)}
                            title="Edytuj klienta"
                          >
                            Edytuj
                          </button>
                          <button
                            className="button button-danger action-button"
                            onClick={(e) => handleDeleteClient(client.id, e)}
                            title="Usuń klienta"
                          >
                            Usuń
                          </button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </div>
      
      {showSearchPopup && <SearchPopup />}
      {showClientDetails && <ClientDetailsCard />}
    </div>
  );
};

export default ClientsListPage;
