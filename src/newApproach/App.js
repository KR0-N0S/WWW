// Przykład: src/newApproach/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/Loginpage';
import RegisterPage from './pages/Registerpage';
import PrivateRoute from './routes/PrivateRoute';

// Layouty
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './dashboard/DashboardLayout';

// Podstrony dashboardu
import DashboardHome from './dashboard/pages/DashboardHome';
import Orders from './dashboard/pages/Orders';
import Integrations from './dashboard/pages/Integrations';
import AddInseminationPage from './dashboard/pages/AddInseminationPage';

// **Importy do Klientów** - NAZWY plików jak na Twoim zrzucie ekranu:
import ClientsListPage from './dashboard/pages/ClientsListPage';
import AddClientPage from './dashboard/pages/AddClientPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout publiczny */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard (chroniony) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<Orders />} />
          <Route path="integrations" element={<Integrations />} />

          {/* Inseminacja */}
          <Route path="insemination/add" element={<AddInseminationPage />} />

          {/* Trasy dla Klientów */}
          <Route path="clients/list" element={<ClientsListPage />} />
          <Route path="clients/add" element={<AddClientPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
