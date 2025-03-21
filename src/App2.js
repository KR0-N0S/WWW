// src/newApproach/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import komponentów i stron
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';        // Upewnij się, że nazwa pliku pokrywa się
import LoginPage from './pages/Loginpage';      // Albo './pages/LoginPage', zależnie od pliku
import RegisterPage from './pages/Registerpage';// Albo './pages/RegisterPage'
import PrivateRoute from './routes/PrivateRoute';// Jeśli masz plik src/newApproach/routes/PrivateRoute.js
// import DashboardPage from './pages/DashboardPage'; // Jeśli chcesz mieć /dashboard

function App() {
  return (
    <Router>
      {/* Navbar będzie widoczny na wszystkich stronach */}
      <Navbar />

      {/* Definiujemy trasy */}
      <Routes>
        {/* Strona główna */}
        <Route path="/" element={<HomePage />} />

        {/* Logowanie */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rejestracja */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Chroniony dashboard (opcjonalnie) */}
        {/* 
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        */}
      </Routes>
    </Router>
  );
}

export default App;
