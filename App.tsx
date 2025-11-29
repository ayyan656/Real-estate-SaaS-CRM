
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Properties } from './pages/Properties';
import { Leads } from './pages/Leads';
import { Landing } from './pages/Landing';
import { Plans } from './pages/Plans';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LeadsProvider } from './context/LeadsContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Landing />} />
      <Route path="/plans" element={<Plans />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LeadsProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </LeadsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
