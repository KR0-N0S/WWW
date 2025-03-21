// src/newApproach/dashboard/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  // Stan przechowujący indeks aktualnie otwartego menu (lub null, gdy żadne)
  const [activeIndex, setActiveIndex] = useState(null);

  // Obsługa kliknięcia w tytuł sekcji z podmenu
  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Definicja menu
  const menuItems = [
    {
      label: 'Strona główna',
      path: '/dashboard/home',
    },
    {
      label: 'Klienci',
      subItems: [
        { label: 'Dodaj nowego klienta', path: '/dashboard/clients/add' },
        { label: 'Lista klientów', path: '/dashboard/clients/list' },
        { label: 'Strona_3', path: '/dashboard/clients/page3' },
        { label: 'Strona_4', path: '/dashboard/clients/page4' },
      ],
    },
    {
      label: 'Wizyty',
      subItems: [
        { label: 'Dodaj nową wizytę', path: '/dashboard/visits/add' },
        { label: 'Lista wizyt', path: '/dashboard/visits/list' },
        { label: 'Strona_3', path: '/dashboard/visits/page3' },
        { label: 'Strona_4', path: '/dashboard/visits/page4' },
      ],
    },
    {
      label: 'Inseminacja',
      subItems: [
        { label: 'Dodaj nowy zabieg', path: '/dashboard/insemination/add' },
        { label: 'Rejestr inseminacji', path: '/dashboard/insemination/registry' },
        // Tylko przy "Buhaje" pojawi się plusik
        { label: 'Buhaje', path: '/dashboard/insemination/bulls' },
        { label: 'Magazyn Nasienia', path: '/dashboard/insemination/semen-stock' },
        { label: 'Strona_5', path: '/dashboard/insemination/page5' },
        { label: 'Strona_6', path: '/dashboard/insemination/page6' },
      ],
    },
    {
      label: 'Rozród',
      subItems: [
        { label: 'Protokoły Synchronizacji', path: '/dashboard/reproduction/protocols' },
        { label: 'Badanie USG', path: '/dashboard/reproduction/usg' },
        { label: 'Strona_3', path: '/dashboard/reproduction/page3' },
        { label: 'Statystyki', path: '/dashboard/reproduction/stats' },
      ],
    },
    {
      label: 'Kalendarz',
      path: '/dashboard/calendar',
    },
    {
      label: 'Lista zadań',
      path: '/dashboard/todo',
    },
    {
      label: 'Produkty',
      path: '/dashboard/products',
    },
    {
      label: 'Ogłoszenia',
      path: '/dashboard/announcements',
    },
  ];

  return (
    <div className="sidebar">
      {/* Logo u góry */}
      <div className="sidebar-logo">
        <Link to="/dashboard">
          <img src="/assets/images/logo.png" alt="AmicusApp Logo" />
        </Link>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => {
            const hasSubmenu = item.subItems && item.subItems.length > 0;
            const isOpen = activeIndex === index;

            if (!hasSubmenu) {
              // Zwykły link (bez podmenu)
              return (
                <li key={index}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              );
            } else {
              // Element z podmenu
              return (
                <li
                  key={index}
                  className={`has-submenu ${isOpen ? 'open' : ''}`}
                >
                  {/* Kliknięcie w tytuł sekcji - otwiera/zamyka submenu */}
                  <div
                    className="submenu-title"
                    onClick={() => handleToggle(index)}
                  >
                    {item.label}
                    <span className="arrow">{isOpen ? '▼' : '▶'}</span>
                  </div>

                  {/* Podmenu rozwijane tylko, gdy isOpen === true */}
                  {isOpen && (
                    <ul className="submenu">
                      {item.subItems.map((subItem, subIndex) => {
                        // Sprawdzamy, czy to jest "Buhaje"
                        const isBuhaje = subItem.label === 'Buhaje';

                        return (
                          <li
                            key={subIndex}
                            className={`sidebar-subitem ${isBuhaje ? 'buhaje-row' : ''}`}
                          >
                            <Link to={subItem.path}>{subItem.label}</Link>

                            {/* Plusik pojawia się tylko dla "Buhaje" */}
                            {isBuhaje && (
                              <Link
                                to="/dashboard/insemination/bulls/add"
                                className="subitem-add-link"
                              >
                                +
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
