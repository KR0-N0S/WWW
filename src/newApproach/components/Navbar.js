// src/newApproach/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/images/logo.png';

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Stan określający, czy navbar jest "zescrollowany" (zmniejszony)
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  // Sprawdź, czy user jest zalogowany (ma token w localStorage)
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  useEffect(() => {
    // Funkcja ustawia isMobile wg szerokości ekranu
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);

    // Funkcja sprawdza scrollY, by zmniejszyć/powiększyć navbar
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      // Jeśli jesteś u góry (<5px), a scrolled jest true, przestaw na false
      if (currentScroll < 5 && scrolled) {
        setScrolled(false);
      } 
      // Jeśli zjechałeś poniżej 30px, a scrolled jest false, przestaw na true
      else if (currentScroll > 30 && !scrolled) {
        setScrolled(true);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // posprzątanie eventListenerów przy odmontowaniu
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]); 
  // [scrolled] - bo handleScroll korzysta z aktualnej wartości scrolled

  // Klik hamburgera (mobile)
  const handleHamburgerClick = () => {
    setMenuOpen(!menuOpen);
  };

  // Klik logo / nazwa "AmicusApp"
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  // Zaloguj, Rejestracja
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Wylogowanie
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // W klasie .navbar-container dodajemy "scrolled" lub "not-scrolled"
  const navbarClass = scrolled ? 'navbar-container scrolled' : 'navbar-container not-scrolled';

  return (
    <header className={navbarClass}>
      {/* Lewa sekcja: Logo i tekst, klikalne */}
      <div className="navbar-left" style={{ cursor: 'pointer' }} onClick={handleLogoClick}>
        <img
          src={logo}
          alt="Logo"
          className="navbar-logo"
        />
        <span className="navbar-logo-text">AmicusApp</span>
      </div>

      {isMobile ? (
        // WIDOK MOBILE
        <div className="navbar-right-mobile">
          <div className="hamburger-icon" onClick={handleHamburgerClick}>
            <div />
            <div />
            <div />
          </div>

          {menuOpen && (
            <div className="mobile-menu">
              <button className="mobile-link">Funkcje ▼</button>
              <button className="mobile-link">Integracje</button>
              <button className="mobile-link">Cennik</button>
              <button className="mobile-link">Więcej ▼</button>
              <button className="mobile-link">Polski ▼</button>

              {isAuthenticated ? (
                <>
                  <button className="mobile-button" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </button>
                  <button className="mobile-button register" onClick={handleLogout}>
                    Wyloguj
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleLoginClick} className="mobile-button">
                    Zaloguj
                  </button>
                  <button onClick={handleRegisterClick} className="mobile-button register">
                    Wypróbuj za darmo
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        // WIDOK DESKTOP
        <div className="navbar-right-desktop">
          <nav className="desktop-menu">
            <button className="menu-button">Funkcje ▼</button>
            <button className="menu-button">Integracje</button>
            <button className="menu-button">Cennik</button>
            <button className="menu-button">Więcej ▼</button>
            <span className="language">Polski ▼</span>
          </nav>

          {isAuthenticated ? (
            <>
              <button className="login-btn" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <button className="register-btn" onClick={handleLogout}>
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={handleLoginClick}>
                Zaloguj
              </button>
              <button className="register-btn" onClick={handleRegisterClick}>
                Wypróbuj za darmo
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
