import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Layouts ---
import AdminLayout from './layouts/AdminLayout';

// --- Pages (Admin) ---
import Login from './pages/auth/Login';
import CommandCenter from "./pages/admin/CommandCenter";
import DashboardBI from "./pages/admin/DashboardBI";
import CreateClient from './pages/admin/CreateClient';
import AuditLedger from './pages/admin/AuditLedger';
import FinancialDashboard from "./pages/admin/FinancialDashboard";
import BrandingSettings from "./pages/admin/BrandingSettings";
import CloudHub from "./pages/admin/CloudHub";
import RuleBuilder from "./pages/admin/RuleBuilder";
import InfrastructureSettings from './pages/admin/InfrastructureSettings';

// --- Missing Pages (Adding them now) ---
import Clients from './pages/admin/Clients';
import ProductManagement from './pages/admin/ProductManagement';
import Settings from './pages/admin/Settings';
import Templates from './pages/admin/Templates'; // ניהול ידע

// --- Components ---
import ImpersonationBanner from './components/admin/ImpersonationBanner';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-right font-sans" dir="rtl">
      <ImpersonationBanner />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
            
            {/* Main Hub */}
            <Route index element={<CommandCenter />} />
            
            {/* Core Modules */}
            <Route path="dashboard-bi" element={<DashboardBI />} />
            <Route path="finance" element={<FinancialDashboard />} />
            <Route path="branding" element={<BrandingSettings />} />
            <Route path="cloud-hub" element={<CloudHub />} />
            <Route path="audit" element={<AuditLedger />} />
            
            {/* Operational Modules */}
            <Route path="clients" element={<Clients />} />
            <Route path="create-client" element={<CreateClient />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="templates" element={<Templates />} />
            <Route path="rules" element={<RuleBuilder />} />
            <Route path="settings" element={<Settings />} />
            <Route path="infrastructure/:tenantId" element={<InfrastructureSettings />} />
            
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
