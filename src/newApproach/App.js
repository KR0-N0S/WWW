// src/newApproach/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';        // <-- Import Navbar
import HomePage from './pages/HomePage';
import LoginPage from './pages/Loginpage';
import RegisterPage from './pages/Registerpage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './routes/PrivateRoute'; 

function App() {
  return (
    <Router>
      {/* Navbar wstawiony nad <Routes>, będzie widoczny na każdej stronie */}
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Trasa chroniona */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

