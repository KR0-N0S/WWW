// src/dashboard/DashboardLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {/* Lewy pasek */}
      <Sidebar />

      {/* Prawa część: top navbar + treść */}
      <div className="dashboard-main">
        <TopNavbar />
        <div className="dashboard-content">
          {/* Tu wchodzą podstrony, np. /dashboard/pages/strony_zmienne */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
