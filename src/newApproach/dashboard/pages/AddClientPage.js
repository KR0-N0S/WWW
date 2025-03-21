import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddClientPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hasCompany: false,
    orgName: '',
    orgStreet: '',
    orgCity: '',
    orgPostalCode: '',
    orgTaxId: '',
    herdId: ''
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    // Jeśli to checkbox:
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // Przygotuj dane do wysłania:
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        hasCompany: formData.hasCompany, // bool
        orgName: formData.orgName,
        orgStreet: formData.orgStreet,
        orgCity: formData.orgCity,
        orgPostalCode: formData.orgPostalCode,
        orgTaxId: formData.orgTaxId,
        herd_id: formData.herdId
      };

      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Token JWT, jeśli potrzebny
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        // Obsługa błędów
        if (res.status === 409) {
          // np. konflikt: stado już istnieje
          const errData = await res.json();
          setErrorMsg(errData.message || 'Stado o tym numerze już istnieje!');
          return;
        } else if (res.status === 400) {
          const errData = await res.json();
          setErrorMsg(errData.message || 'Błąd walidacji danych');
          return;
        }
        throw new Error('Błąd tworzenia klienta');
      }

      // Jeśli OK
      const data = await res.json();
      console.log('Utworzono klienta:', data);

      // Przekierowanie np. do listy klientów
      navigate('/dashboard/clients/list');

    } catch (error) {
      console.error(error);
      setErrorMsg('Wystąpił błąd podczas tworzenia klienta');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/clients/list');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
      <h2>Dodawanie nowego klienta</h2>
      {errorMsg && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        {/* Dane osobowe */}
        <div>
          <label>Imię:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nazwisko:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>E-mail:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Telefon:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Checkbox: czy posiadasz firmę */}
        <div>
          <label>
            <input
              type="checkbox"
              name="hasCompany"
              checked={formData.hasCompany}
              onChange={handleChange}
            />
            Posiadam firmę (organizację)
          </label>
        </div>

        {/* Pola firmowe (tylko jeśli hasCompany = true) */}
        {formData.hasCompany && (
          <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
            <h4>Dane organizacji</h4>
            <div>
              <label>Nazwa firmy:</label>
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                required={formData.hasCompany}
              />
            </div>
            <div>
              <label>Ulica / nr:</label>
              <input
                type="text"
                name="orgStreet"
                value={formData.orgStreet}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Miasto:</label>
              <input
                type="text"
                name="orgCity"
                value={formData.orgCity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Kod pocztowy:</label>
              <input
                type="text"
                name="orgPostalCode"
                value={formData.orgPostalCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>NIP / Tax ID:</label>
              <input
                type="text"
                name="orgTaxId"
                value={formData.orgTaxId}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Nr siedziby stada (opcjonalne) */}
        <div>
          <label>Numer siedziby stada (herd_id):</label>
          <input
            type="text"
            name="herdId"
            value={formData.herdId}
            onChange={handleChange}
          />
        </div>

        {/* Przyciski */}
        <div style={{ marginTop: '20px' }}>
          <button type="button" onClick={handleCancel}>
            Anuluj
          </button>
          <button type="submit" style={{ marginLeft: '10px' }}>
            Dodaj klienta
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddClientPage;
