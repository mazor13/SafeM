import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // הורדנו את BrowserRouter
import Login from './pages/auth/Login';
import AdminLayout from './layouts/AdminLayout';
import AuthProvider from './providers/AuthProvider';

// Admin Pages
import DashboardBI from './pages/admin/DashboardBI';
import CommandCenter from './pages/admin/CommandCenter';
import Clients from './pages/admin/Clients';
import CreateClient from './pages/admin/CreateClient';
import Client360 from './pages/admin/Client360';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<CommandCenter />} />
          <Route path="dashboard-bi" element={<DashboardBI />} />
          
          {/* Clients Module */}
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:clientId" element={<Client360 />} />
          <Route path="create-client" element={<CreateClient />} />
          
          {/* Placeholders */}
          <Route path="templates" element={<div className="p-10 text-slate-400">Knowledge Base (Coming Soon)</div>} />
          <Route path="finance" element={<div className="p-10 text-slate-400">Finance Module (Coming Soon)</div>} />
          <Route path="products" element={<div className="p-10 text-slate-400">Products Module (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-10 text-slate-400">System Settings (Coming Soon)</div>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
