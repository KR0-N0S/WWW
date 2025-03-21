import React, { useState, useEffect, useRef } from 'react';
import './TopNavbar.css';

const TopNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Funkcja wylogowania (np. usuwa token i przekierowuje na stronę główną)
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // 1) Obsługa kliknięcia poza dropdown (zamykanie menu)
  useEffect(() => {
    function handleClickOutside(event) {
      // Jeśli klik był poza obszarem dropdownRef, to zamknij menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="top-navbar">
      {/* Przykładowy lewy blok z wyszukiwarką */}
      <div className="search-bar">
        <input type="text" placeholder="Szukaj..." />
      </div>

      {/* Prawa część: "Moje konto" + rozwijana lista */}
      <div className="user-info" ref={dropdownRef}>
        {/* Kliknięcie w tekst otwiera/zamyka dropdown */}
        <span onClick={() => setShowDropdown(!showDropdown)}>
          Moje konto
        </span>

        {showDropdown && (
          <ul className="user-dropdown">
            <li>Ustawienia</li>
            <li>Profile pracowników</li>
            <li>Abonament i płatności</li>
            <li onClick={handleLogout}>Wyloguj</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;
