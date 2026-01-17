#!/bin/bash

echo "🔗 Rewiring App.tsx - CONNECTING ALL EXISTING PAGES..."

cat > frontend/src/App.tsx << 'EOF'
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './providers/AuthProvider';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';

// --- ניהול לקוחות ---
import AdminDashboard from './pages/admin/CommandCenter';
import ClientList from './pages/admin/ClientList';
import Client360 from './pages/admin/Client360';
import CreateClient from './pages/admin/CreateClient';
import ClientSettings from './pages/admin/ClientSettings';

// --- CRM ---
import LeadsPage from './pages/admin/crm/LeadsPage';
import LeadDetailPage from './pages/admin/crm/LeadDetailPage';

// --- ניהול ומסמכים ---
import AuditLedger from './pages/admin/AuditLedger';
import BrandingSettings from './pages/admin/BrandingSettings';
import GlobalInfra from './pages/admin/GlobalInfra';
import InfrastructureSettings from './pages/admin/InfrastructureSettings';
import SystemSettings from './pages/admin/SystemSettings';
import CloudHub from './pages/admin/CloudHub'; // נוסף
import RuleBuilder from './pages/admin/RuleBuilder'; // נוסף
import DocumentsListPage from './pages/admin/documents/DocumentsListPage';
import DocumentEditorPage from './pages/admin/documents/DocumentEditorPage';

// --- קטלוג ומוצרים ---
import GlobalCatalog from './pages/admin/GlobalCatalog'; 
import ProductManagement from './pages/admin/ProductManagement';

// --- בטיחות ודוחות ---
import SafetyFilesPage from './pages/admin/safety/SafetyFilesPage';
import AnalyticsPage from './pages/admin/reports/AnalyticsPage';
import CompliancePage from './pages/admin/reports/CompliancePage';
import InspectionHistoryPage from './pages/admin/reports/InspectionHistoryPage';
import DashboardBI from './pages/admin/DashboardBI';

// --- תפעול ובדיקות ---
import InspectionRunner from './pages/admin/inspections/InspectionRunner';
import FilledFormPage from './pages/admin/forms/FilledFormPage';
import FormsListPage from './pages/admin/forms/FormsListPage';

// --- ציוד ---
import EquipmentPage from './pages/admin/equipment/EquipmentPage';
import EquipmentFormPage from './pages/admin/equipment/EquipmentFormPage';
import FindingsPage from './pages/admin/equipment/FindingsPage';
import InspectionsPage from './pages/admin/equipment/InspectionsPage';
import Finance from './pages/admin/Finance';
import PendingApprovals from './pages/admin/PendingApprovals';

// --- תבניות ---
import TemplateManager from './pages/admin/templates/TemplateManager';
import TemplateEditor from './pages/admin/templates/TemplateEditor';
import AIPdfImportPage from './pages/admin/templates/AIPdfImportPage'; // נוסף

// Placeholder
function ComingSoon({ title }: { title: string }) {
  return <div className="p-10 text-white text-center text-xl">🚧 {title} - בקרוב</div>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white">טוען...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          {/* דף הבית */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard-bi" element={<DashboardBI />} />
          <Route path="cloud-hub" element={<CloudHub />} />
          
          {/* --- לקוחות --- */}
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/:clientId" element={<Client360 />} />
          <Route path="create-client" element={<CreateClient />} />
          <Route path="client-settings" element={<ClientSettings />} />

          {/* --- CRM --- */}
          <Route path="crm/leads" element={<LeadsPage />} />
          <Route path="crm/leads/:id" element={<LeadDetailPage />} />
          <Route path="crm/contacts" element={<ComingSoon title="אנשי קשר" />} />
          <Route path="crm/opportunities" element={<ComingSoon title="הזדמנויות" />} />

          {/* --- ציוד ומוצרים --- */}
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="equipment/new" element={<EquipmentFormPage />} />
          <Route path="equipment/:equipmentId" element={<EquipmentFormPage />} />
          <Route path="products" element={<GlobalCatalog />} />
          <Route path="product-management" element={<ProductManagement />} />
          <Route path="findings" element={<FindingsPage />} />
          <Route path="pending-approvals" element={<PendingApprovals />} />

          {/* --- בטיחות --- */}
          <Route path="safety/files" element={<SafetyFilesPage />} />
          
          {/* --- תפעול ודוחות --- */}
          <Route path="inspections" element={<InspectionRunner />} />
          <Route path="inspections-list" element={<InspectionsPage />} />
          <Route path="forms" element={<FormsListPage />} />
          <Route path="forms/:formId" element={<FilledFormPage />} />
          
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports/history" element={<InspectionHistoryPage />} />
          <Route path="reports/compliance" element={<CompliancePage />} />

          {/* --- ניהול והגדרות --- */}
          <Route path="templates" element={<TemplateManager />} />
          <Route path="templates/new" element={<TemplateEditor />} />
          <Route path="templates/:templateId" element={<TemplateEditor />} />
          <Route path="templates/import" element={<AIPdfImportPage />} />
          
          <Route path="rules" element={<RuleBuilder />} />
          <Route path="audit" element={<AuditLedger />} />
          <Route path="infra-global" element={<GlobalInfra />} />
          <Route path="infra-settings" element={<InfrastructureSettings />} />
          <Route path="finance" element={<Finance />} />
          <Route path="documents" element={<DocumentsListPage />} />
          <Route path="documents/:docId" element={<DocumentEditorPage />} />
          <Route path="branding" element={<BrandingSettings />} />
          <Route path="settings" element={<SystemSettings />} />
          
          {/* Catch all */}
          <Route path="*" element={<div className="p-10 text-white">404 - דף לא נמצא בניתוב</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
EOF

echo "🚀 Router fully connected. Building..."
cd frontend && npm run build
