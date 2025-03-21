// Last modified: 2025-03-21 14:04:03 by KR0-N0S
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddClientPage = () => {
  const navigate = useNavigate();
  
  // Inicjalizacja stanu z wartością domyślną PL
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    hasCompany: false,
    orgName: '',
    orgStreet: '',
    orgCity: '',
    orgPostalCode: '',
    orgTaxId: '',
    herd_id: 'PL'  // Domyślna wartość
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Efekt uruchamiany przy montowaniu komponentu
  useEffect(() => {
    if (!isInitialized) {
      setFormData(prev => ({
        ...prev,
        herd_id: 'PL'
      }));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const validateHerdId = (value) => {
    const herdIdRegex = /^PL\d{9}-\d{3}$/;
    if (!value || value === 'PL') return true; // Pozwól na pustą wartość lub samo PL
    return herdIdRegex.test(value);
  };

  const formatHerdId = (input) => {
    // Jeśli input jest pusty, zwróć PL
    if (!input) return 'PL';

    // Usuń wszystkie nie-alfanumeryczne znaki oprócz myślnika
    let cleaned = input.replace(/[^\w-]/g, '').toUpperCase();
    
    // Zawsze zaczynaj od PL
    if (!cleaned.startsWith('PL')) {
      cleaned = 'PL' + cleaned.replace(/^PL/i, '');
    }
    
    // Usuń wszystkie litery po PL
    cleaned = 'PL' + cleaned.slice(2).replace(/[^\d-]/g, '');
    
    // Ogranicz do maksymalnej długości
    cleaned = cleaned.slice(0, 15);
    
    // Automatycznie dodaj myślnik po 11 znakach
    if (cleaned.length > 11) {
      const beforeDash = cleaned.slice(0, 11);
      const afterDash = cleaned.slice(11).replace(/-/g, '');
      cleaned = `${beforeDash}-${afterDash}`;
    }
    
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'herd_id') {
      const formattedValue = formatHerdId(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Podstawowa walidacja
    if (!formData.first_name.trim()) newErrors.first_name = 'Imię jest wymagane';
    if (!formData.last_name.trim()) newErrors.last_name = 'Nazwisko jest wymagane';
    
    // Walidacja email tylko jeśli został podany
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    // Walidacja numeru siedziby stada
    if (formData.herd_id && !validateHerdId(formData.herd_id)) {
      newErrors.herd_id = 'Nieprawidłowy format numeru siedziby stada (PL999999999-999)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/clients', formData);
      console.log('Success:', response.data);
      navigate('/dashboard/clients');
    } catch (error) {
      console.error('Error:', error);
      setErrors({
        submit: error.response?.data?.message || 'Wystąpił błąd podczas zapisywania'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Dodawanie nowego klienta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Imię:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
          </div>

          <div>
            <label className="block mb-1">Nazwisko:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
          </div>

          <div>
            <label className="block mb-1">E-mail:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1">Telefon:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hasCompany"
              checked={formData.hasCompany}
              onChange={handleInputChange}
              className="form-checkbox"
            />
            <span>Posiadam firmę (organizację)</span>
          </label>
        </div>

        {formData.hasCompany && (
          <div className="space-y-4">
            <h3 className="font-medium">Dane organizacji</h3>
            <div>
              <label className="block mb-1">Nazwa firmy:</label>
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Ulica / nr:</label>
                <input
                  type="text"
                  name="orgStreet"
                  value={formData.orgStreet}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Miasto:</label>
                <input
                  type="text"
                  name="orgCity"
                  value={formData.orgCity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Kod pocztowy:</label>
                <input
                  type="text"
                  name="orgPostalCode"
                  value={formData.orgPostalCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">NIP / Tax ID:</label>
                <input
                  type="text"
                  name="orgTaxId"
                  value={formData.orgTaxId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block mb-1">Numer siedziby stada (herd_id):</label>
          <input
                        type="text"
            name="herd_id"
            value={formData.herd_id}
            onChange={handleInputChange}
            placeholder="PL999999999-999"
            className="w-full p-2 border rounded"
          />
          {errors.herd_id && <p className="text-red-500 text-sm">{errors.herd_id}</p>}
        </div>

        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/clients')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? 'Dodawanie...' : 'Dodaj klienta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClientPage;