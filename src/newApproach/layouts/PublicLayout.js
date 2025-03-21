import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PublicLayout = () => {
  return (
    <>
      {/* Stary navbar tylko dla stron publicznych */}
      <Navbar />
      {/* Outlet – tu renderują się podstrony */}
      <Outlet />
    </>
  );
};

export default PublicLayout;
