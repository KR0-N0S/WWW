import React, { useState, useEffect } from 'react';

const HerdIdInput = ({ value, onChange, error }) => {
  const [inputValue, setInputValue] = useState(value || 'PL');

  // Formatuj numer siedziby stada
  const formatHerdId = (input) => {
    // Usuń wszystkie nie-alfanumeryczne znaki oprócz myślnika
    let cleaned = input.replace(/[^\w-]/g, '');
    
    // Zawsze zaczynaj od PL
    if (!cleaned.startsWith('PL')) {
      cleaned = 'PL' + cleaned.replace(/^PL/i, '');
    }

    // Usuń wszystkie litery po PL
    cleaned = 'PL' + cleaned.slice(2).replace(/[^\d-]/g, '');

    // Ogranicz do maksymalnej długości (PL + 9 cyfr + myślnik + 3 cyfry = 15 znaków)
    cleaned = cleaned.slice(0, 15);

    // Automatycznie dodaj myślnik po 11 znakach (PL + 9 cyfr)
    if (cleaned.length > 11) {
      const beforeDash = cleaned.slice(0, 11);
      const afterDash = cleaned.slice(11).replace(/-/g, '');
      cleaned = beforeDash + '-' + afterDash;
    }

    return cleaned;
  };

  // Obsługa zmiany wartości
  const handleChange = (e) => {
    const formatted = formatHerdId(e.target.value);
    setInputValue(formatted);
    onChange(formatted);
  };

  // Obsługa wklejania
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatHerdId(pastedText);
    setInputValue(formatted);
    onChange(formatted);
  };

  // Aktualizuj wartość, gdy zmienia się props value
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || 'PL');
    }
  }, [value]);

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder="PL999999999-999"
        maxLength={15}
        className="px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default HerdIdInput;