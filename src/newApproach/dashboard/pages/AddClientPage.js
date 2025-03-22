// Last modified: 2025-03-21 20:47:36 by KR0-N0S
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FancySwitch } from '../../components/FancySwitch';
import './AddClientPage.css';

const AddClientPage = () => {
  const navigate = useNavigate();
  
  // Referencje do elementów formularza dla przewijania
  const errorRefs = {
    first_name: useRef(null),
    last_name: useRef(null),
    orgName: useRef(null),
    orgTaxId: useRef(null),
    city: useRef(null),
    street: useRef(null),
    house_number: useRef(null),
    postal_code: useRef(null),
    herd_id: useRef(null),
    phone: useRef(null),
    email: useRef(null)
  };
  
  // Inicjalizacja stanu z wartością domyślną PL
  const initialFormState = {
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
    herd_id: 'PL',
    street: '',
    house_number: '',
    city: '',
    postal_code: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Efekt przewijania do pierwszego błędu
  useEffect(() => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      if (errorRefs[firstErrorField] && errorRefs[firstErrorField].current) {
        // Przewiń do pierwszego błędu z offsetem
        const yOffset = -100; // 100px powyżej elementu
        const y = errorRefs[firstErrorField].current.getBoundingClientRect().top + 
                  window.pageYOffset + yOffset;
        
        window.scrollTo({top: y, behavior: 'smooth'});
        
        // Opcjonalnie: dodaj focus do elementu z błędem
        const inputElement = errorRefs[firstErrorField].current.querySelector('input');
        if (inputElement) {
          setTimeout(() => {
            inputElement.focus();
          }, 500);
        }
      }
    }
  }, [errors]);

  // Efekt do automatycznego usuwania komunikatu sukcesu po czasie
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000); // Ukryj komunikat po 5 sekundach
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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

  const validatePhone = (value) => {
    // Sprawdź czy telefon ma dokładnie 9 cyfr
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(value.replace(/\s+/g, '')); // Usuń spacje przed walidacją
  };

  // Uproszczona i naprawiona funkcja walidacji NIP
  const validateTaxId = (value) => {
    if (!value) return false;
    
    // Wyodrębnij tylko cyfry z wartości
    const digits = value.replace(/\D/g, '');
    
    // NIP musi mieć dokładnie 10 cyfr
    return digits.length === 10;
  };

  const validatePostalCode = (value) => {
    // Format kodu pocztowego: 00-000
    const postalCodeRegex = /^\d{2}-\d{3}$/;
    return postalCodeRegex.test(value);
  };

  // Uproszczona funkcja formatowania NIP
  const formatTaxId = (input) => {
    if (!input) return '';
    
    // Usuń wszystkie znaki niebędące cyframi lub literami 'P', 'L'
    let result = '';
    
    // Jeśli zaczyna się od 'PL', zachowaj to
    if (input.toUpperCase().startsWith('PL')) {
      result = 'PL';
      // Następnie dodaj tylko cyfry, maksymalnie 10
      const digits = input.substring(2).replace(/\D/g, '');
      result += digits.substring(0, 10);
    } else {
      // W przeciwnym razie dodaj tylko cyfry, maksymalnie 10
      const digits = input.replace(/\D/g, '');
      result = digits.substring(0, 10);
    }
    
    return result;
  };

  const formatPostalCode = (input) => {
    // Usuń wszystkie nie-cyfry
    const digits = input.replace(/\D/g, '');
    
    // Format: 00-000
    if (digits.length <= 2) {
      return digits;
    } else {
      return `${digits.substring(0, 2)}-${digits.substring(2, 5)}`;
    }
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

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'herd_id') {
      const formattedValue = formatHerdId(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'phone') {
      // Usuń wszystkie nie-cyfry
      const formattedValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'orgTaxId') {
      // Formatuj NIP
      const formattedValue = formatTaxId(value);
      console.log('NIP formatted:', value, '->', formattedValue); // Pomocniczy log
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'postal_code') {
      // Formatuj kod pocztowy
      const formattedValue = formatPostalCode(value);
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
    
    // Usuń błąd dla pola, które jest właśnie edytowane
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClientTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      hasCompany: value === 'company'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Podstawowa walidacja
    if (!formData.first_name.trim()) newErrors.first_name = 'Imię jest wymagane';
    if (!formData.last_name.trim()) newErrors.last_name = 'Nazwisko jest wymagane';
    if (!formData.city.trim()) newErrors.city = 'Miejscowość jest wymagana';
    if (!formData.house_number.trim()) newErrors.house_number = 'Nr domu jest wymagany';
    
    // Walidacja kodu pocztowego
    if (!formData.postal_code) {
      newErrors.postal_code = 'Kod pocztowy jest wymagany';
    } else if (!validatePostalCode(formData.postal_code)) {
      newErrors.postal_code = 'Nieprawidłowy format kodu pocztowego (wymagany format: 00-000)';
    }
    
    // Walidacja telefonu - musi mieć 9 cyfr
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon jest wymagany';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Nieprawidłowy numer telefonu. Wymagane dokładnie 9 cyfr';
    }
    
    // Walidacja email tylko jeśli został podany
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format adresu email (np. nazwa@domena.pl)';
    }

    // Walidacja numeru siedziby stada
    if (!formData.herd_id || formData.herd_id === 'PL') {
      newErrors.herd_id = 'Numer siedziby stada jest wymagany';
    } else if (!validateHerdId(formData.herd_id)) {
      newErrors.herd_id = 'Nieprawidłowy format numeru siedziby stada. Wymagany format: PL999999999-999';
    }

    // Walidacja danych firmy
    if (formData.hasCompany) {
      if (!formData.orgName.trim()) newErrors.orgName = 'Nazwa firmy jest wymagana';
      if (!formData.orgTaxId.trim()) {
        newErrors.orgTaxId = 'NIP jest wymagany';
      } else if (!validateTaxId(formData.orgTaxId)) {
        newErrors.orgTaxId = 'Nieprawidłowy NIP. Wymagane dokładnie 10 cyfr.';
      } else {
        // Dodatkowy log do debugowania
        console.log('NIP validation passed:', formData.orgTaxId);
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/clients', formData);
      console.log('Success:', response.data);
      
      // Zapisz imię i nazwisko przed resetem formularza
      const clientName = `${formData.first_name} ${formData.last_name}`;
      
      // Najpierw resetuj formularz
      resetForm();
      
      // Następnie wyświetl komunikat sukcesu
      setSuccessMessage(`Dodano nowego klienta: ${clientName}`);
      
      // Bezpośrednio przewiń stronę do góry
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
      
    } catch (error) {
      console.error('Error details:', error);
      
      // Wyświetl dokładną treść błędu do diagnostyki
      if (error.response?.data) {
        console.error('API Error response:', JSON.stringify(error.response.data));
      }
      
      // Ręczne sprawdzenie tekstu błędu
      const errorText = error.response?.data?.error || '';
      console.log('Error text:', errorText);
      
      // Sprawdź różne warianty błędów - w tym przypadku zawartość tekstu
      if (error.response?.status === 401) {
        setErrors({
          submit: 'Sesja wygasła. Proszę zalogować się ponownie.'
        });
      } 
      // Prosta, bezpośrednia weryfikacja duplikatu adresu email
      else if (errorText.includes('duplicate key') && errorText.includes('users_email_key')) {
        setErrors({
          email: 'Ten adres email jest już używany w systemie',
          submit: 'Ten adres email jest już używany w systemie. Proszę użyć innego adresu.'
        });
      }
      // Ogólne błędy
      else {
        // Konwertuj techniczne komunikaty na przyjazne dla użytkownika
        let userMessage = 'Wystąpił błąd podczas zapisywania klienta';
        
        if (errorText.includes('duplicate key')) {
          userMessage = 'Podane dane już istnieją w systemie';
        }
        
        setErrors({
          submit: userMessage
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="client-card-container">
      <h2 className="client-card-title">Dodawanie nowego klienta</h2>
      
      {successMessage && (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="client-card">
        <form onSubmit={handleSubmit} className="client-form">
          <div className="switch-container">
            <FancySwitch 
              options={[
                { value: 'individual', label: 'Klient indywidualny' },
                { value: 'company', label: 'Firma' }
              ]}
              value={formData.hasCompany ? 'company' : 'individual'}
              onChange={handleClientTypeChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group" ref={errorRefs.first_name}>
              <label className="form-label"><span className="required">*</span>Imię:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={`form-input ${errors.first_name ? 'input-error' : ''}`}
                required
              />
              {errors.first_name && <p className="error-message">{errors.first_name}</p>}
            </div>

            <div className="form-group" ref={errorRefs.last_name}>
              <label className="form-label"><span className="required">*</span>Nazwisko:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={`form-input ${errors.last_name ? 'input-error' : ''}`}
                required
              />
              {errors.last_name && <p className="error-message">{errors.last_name}</p>}
            </div>
          </div>

          {formData.hasCompany && (
            <div className="form-section-company">
              <div className="form-row">
                <div className="form-group" ref={errorRefs.orgName}>
                  <label className="form-label"><span className="required">*</span>Nazwa firmy:</label>
                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.orgName ? 'input-error' : ''}`}
                    required={formData.hasCompany}
                  />
                  {errors.orgName && <p className="error-message">{errors.orgName}</p>}
                </div>

                <div className="form-group-half" ref={errorRefs.orgTaxId}>
                  <label className="form-label"><span className="required">*</span>NIP:</label>
                  <input
                    type="text"
                    name="orgTaxId"
                    value={formData.orgTaxId}
                    onChange={handleInputChange}
                    className={`form-input ${errors.orgTaxId ? 'input-error' : ''}`}
                    required={formData.hasCompany}
                  />
                  {errors.orgTaxId && <p className="error-message">{errors.orgTaxId}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group-full" ref={errorRefs.city}>
              <label className="form-label"><span className="required">*</span>Miejscowość:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`form-input ${errors.city ? 'input-error' : ''}`}
                required
              />
              {errors.city && <p className="error-message">{errors.city}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" ref={errorRefs.street}>
              <label className="form-label">Ulica:</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className={`form-input ${errors.street ? 'input-error' : ''}`}
              />
              {errors.street && <p className="error-message">{errors.street}</p>}
            </div>

            <div className="form-group" ref={errorRefs.house_number}>
              <label className="form-label"><span className="required">*</span>Nr domu:</label>
              <input
                type="text"
                name="house_number"
                value={formData.house_number}
                onChange={handleInputChange}
                className={`form-input ${errors.house_number ? 'input-error' : ''}`}
                required
              />
              {errors.house_number && <p className="error-message">{errors.house_number}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" ref={errorRefs.postal_code}>
              <label className="form-label"><span className="required">*</span>Kod pocztowy:</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                className={`form-input ${errors.postal_code ? 'input-error' : ''}`}
                required
                placeholder="00-000"
                maxLength="6"
              />
              {errors.postal_code && <p className="error-message">{errors.postal_code}</p>}
            </div>

            <div className="form-group" ref={errorRefs.herd_id}>
              <label className="form-label"><span className="required">*</span>Nr siedziby stada:</label>
              <input
                type="text"
                name="herd_id"
                value={formData.herd_id}
                onChange={handleInputChange}
                placeholder="PL999999999-999"
                className={`form-input ${errors.herd_id ? 'input-error' : ''}`}
                required
              />
              {errors.herd_id && <p className="error-message">{errors.herd_id}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" ref={errorRefs.phone}>
              <label className="form-label"><span className="required">*</span>Telefon:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                maxLength="9"
                required
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

            <div className="form-group" ref={errorRefs.email}>
              <label className="form-label">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
          </div>

          {errors.submit && (
            <div className="error-container">
              {errors.submit}
            </div>
          )}

          <div className="button-container">
            <button
              type="button"
              onClick={() => navigate('/dashboard/clients')}
              className="button button-secondary"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="button button-primary"
            >
              {isLoading ? 'Dodawanie...' : 'Dodaj klienta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientPage;