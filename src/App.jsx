import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { RestaurantList } from './pages/restaurants/RestaurantList';
import { RestaurantWizard } from './pages/restaurants/RestaurantWizard';
import { RestaurantDetails } from './pages/restaurants/RestaurantDetails';
import { AssignAdminWizard } from './pages/staff/AssignAdminWizard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        
        {/* Protected Routes inside MainLayout */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="restaurants" element={<RestaurantList />} />
          <Route path="restaurants/new" element={<RestaurantWizard />} />
          <Route path="restaurants/:id" element={<RestaurantDetails />} />
          <Route path="restaurants/:id/onboard-admin" element={<AssignAdminWizard />} />
          <Route path="analytics" element={
            <div style={{ padding: '2rem' }}>
              <h1 style={{ marginBottom: '0.5rem' }}>Analytics</h1>
              <p style={{ color: 'var(--on-surface-variant)' }}>Enterprise analytics dashboard coming soon.</p>
            </div>
          } />
          <Route path="settings" element={
            <div style={{ padding: '2rem' }}>
              <h1 style={{ marginBottom: '0.5rem' }}>Settings</h1>
              <p style={{ color: 'var(--on-surface-variant)' }}>System configuration and preferences coming soon.</p>
            </div>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
