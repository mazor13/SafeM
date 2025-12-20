import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import InspectionsDashboard from './pages/InspectionsDashboard';
import Clients from './pages/Clients';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import useRequireAuth from './hooks/useRequireAuth';

export default function App() {
  const authWrapper = useRequireAuth();

  return (
    <Routes>
      <Route element={authWrapper(<AppShell />)}>
        <Route index element={<Dashboard />} />
        <Route path="inspections" element={<InspectionsDashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
