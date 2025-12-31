import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminLayout from './layouts/AdminLayout';
import AuthProvider from './providers/AuthProvider';

// Admin Pages
import DashboardBI from './pages/admin/DashboardBI';
import CommandCenter from './pages/admin/CommandCenter';
import Clients from './pages/admin/Clients';
import CreateClient from './pages/admin/CreateClient';
import Client360 from './pages/admin/Client360';
import GlobalInfra from './pages/admin/GlobalInfra';
import Finance from './pages/admin/Finance';
import ProductManagement from './pages/admin/ProductManagement';
import AuditLedger from './pages/admin/AuditLedger';

// CRM Pages
import { LeadsPage, LeadDetailPage } from './pages/admin/crm';

// Safety Pages
import { SafetyFilesPage } from './pages/admin/safety';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<CommandCenter />} />
          <Route path="command" element={<CommandCenter />} />
          <Route path="dashboard-bi" element={<DashboardBI />} />
          <Route path="infra-global" element={<GlobalInfra />} />
          <Route path="finance" element={<Finance />} />
          <Route path="product-management" element={<ProductManagement />} />
          <Route path="audit" element={<AuditLedger />} />
          
          {/* Clients */}
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:clientId" element={<Client360 />} />
          <Route path="create-client" element={<CreateClient />} />
          
          {/* CRM Routes */}
          <Route path="crm/leads" element={<LeadsPage />} />
          <Route path="crm/leads/:id" element={<LeadDetailPage />} />
          <Route path="crm/contacts" element={<div className="p-10 text-slate-400">Contacts (Coming Soon)</div>} />
          <Route path="crm/accounts" element={<div className="p-10 text-slate-400">Accounts (Coming Soon)</div>} />
          <Route path="crm/opportunities" element={<div className="p-10 text-slate-400">Opportunities (Coming Soon)</div>} />
          <Route path="crm/activities" element={<div className="p-10 text-slate-400">Activities (Coming Soon)</div>} />
          
          {/* Safety Routes */}
          <Route path="safety/files" element={<SafetyFilesPage />} />
          <Route path="safety/files/new" element={<div className="p-10 text-slate-400">Create Safety File (Coming Soon)</div>} />
          <Route path="safety/files/:id" element={<div className="p-10 text-slate-400">Safety File Detail (Coming Soon)</div>} />
          <Route path="safety/surveys" element={<div className="p-10 text-slate-400">Surveys (Coming Soon)</div>} />
          <Route path="safety/training" element={<div className="p-10 text-slate-400">Training (Coming Soon)</div>} />
          <Route path="safety/equipment" element={<div className="p-10 text-slate-400">Equipment (Coming Soon)</div>} />
          
          <Route path="templates" element={<div className="p-10 text-slate-400">Knowledge Base (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-10 text-slate-400">System Settings (Coming Soon)</div>} />
          <Route path="products" element={<ProductManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
