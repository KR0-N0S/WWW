import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HerdIdInput from '../components/HerdIdInput';

const AddClientPage = () => {
  const navigate = useNavigate();
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
    herd_id: 'PL'  // Dodane pole herd_id z domyślną wartością 'PL'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Nowa funkcja do obsługi zmiany numeru stada
  const handleHerdIdChange = (value) => {
    setFormData(prev => ({
      ...prev,
      herd_id: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Istniejące walidacje
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Imię jest wymagane';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Nazwisko jest wymagane';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format adresu email';
    }
    if (formData.hasCompany && !formData.orgName.trim()) {
      newErrors.orgName = 'Nazwa firmy jest wymagana';
    }

    // Nowa walidacja dla numeru siedziby stada
    if (formData.herd_id && formData.herd_id !== 'PL') {
      const herdIdRegex = /^PL[0-9]{9}-[0-9]{3}$/;
      if (!herdIdRegex.test(formData.herd_id)) {
        newErrors.herd_id = 'Nieprawidłowy format numeru siedziby stada (PL999999999-999)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/clients', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data && response.data.rawPassword) {
        setGeneratedPassword(response.data.rawPassword);
        setShowPassword(true);
      }

      // Czekaj 2 sekundy przed przekierowaniem
      setTimeout(() => {
        navigate('/dashboard/clients');
      }, 2000);

    } catch (error) {
      console.error('Błąd podczas tworzenia klienta:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Wystąpił błąd podczas tworzenia klienta'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Dodaj nowego klienta</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dane podstawowe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Imię</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nazwisko</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefon</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Nowe pole dla numeru siedziby stada */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Numer siedziby stada
              </label>
              <HerdIdInput
                value={formData.herd_id}
                onChange={handleHerdIdChange}
                error={errors.herd_id}
              />
            </div>
          </div>

          {/* Sekcja firmy */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="hasCompany"
                checked={formData.hasCompany}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm font-medium">
                Posiada firmę
              </label>
            </div>

            {formData.hasCompany && (
              <div className="space-y-4 p-4 bg-gray-50 rounded">
                <div>
                  <label className="block text-sm font-medium mb-1">Nazwa firmy</label>
                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleInputChange}
                    className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.orgName && <p className="text-red-500 text-sm mt-1">{errors.orgName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ulica</label>
                    <input
                      type="text"
                      name="orgStreet"
                      value={formData.orgStreet}
                      onChange={handleInputChange}
                      className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Miasto</label>
                    <input
                      type="text"
                      name="orgCity"
                      value={formData.orgCity}
                      onChange={handleInputChange}
                      className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Kod pocztowy</label>
                    <input
                      type="text"
                      name="orgPostalCode"
                      value={formData.orgPostalCode}
                      onChange={handleInputChange}
                      className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">NIP</label>
                    <input
                      type="text"
                      name="orgTaxId"
                      value={formData.orgTaxId}
                      onChange={handleInputChange}
                      className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/clients')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? 'Dodawanie...' : 'Dodaj klienta'}
            </button>
          </div>
        </form>

        {/* Modal z hasłem */}
        {showPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-bold mb-4">Hasło dla nowego klienta</h3>
              <p className="mb-4">
                Hasło: <span className="font-mono bg-gray-100 p-1 rounded">{generatedPassword}</span>
              </p>
              <button
                onClick={() => setShowPassword(false)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Zamknij
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddClientPage;