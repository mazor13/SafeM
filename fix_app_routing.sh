#!/bin/bash

echo "🔗 Rewiring App.tsx to connect all existing pages..."

cat > frontend/src/App.tsx << 'EOF'
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './providers/AuthProvider';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';

// --- דפים קיימים (לפי הסריקה) ---
import AdminDashboard from './pages/admin/CommandCenter';
import ClientList from './pages/admin/ClientList';
import Client360 from './pages/admin/Client360';
import CreateClient from './pages/admin/CreateClient';

// CRM
import LeadsPage from './pages/admin/crm/LeadsPage';
import LeadDetailPage from './pages/admin/crm/LeadDetailPage';

// Equipment & Catalog
import EquipmentPage from './pages/admin/equipment/EquipmentPage';
import EquipmentFormPage from './pages/admin/equipment/EquipmentFormPage';
import GlobalCatalog from './pages/admin/GlobalCatalog';
import FindingsPage from './pages/admin/equipment/FindingsPage';
import PendingApprovals from './pages/admin/PendingApprovals';

// Safety
import SafetyFilesPage from './pages/admin/safety/SafetyFilesPage';

// Inspections
import InspectionRunner from './pages/admin/inspections/InspectionRunner';
import InspectionHistoryPage from './pages/admin/reports/InspectionHistoryPage';

// Reports
import AnalyticsPage from './pages/admin/reports/AnalyticsPage';
import CompliancePage from './pages/admin/reports/CompliancePage';

// Templates
import TemplateManager from './pages/admin/templates/TemplateManager';
import TemplateEditor from './pages/admin/templates/TemplateEditor';

// Settings & Management
import AuditLedger from './pages/admin/AuditLedger';
import GlobalInfra from './pages/admin/GlobalInfra';
import Finance from './pages/admin/Finance';
import ProductManagement from './pages/admin/ProductManagement';
import DocumentsListPage from './pages/admin/documents/DocumentsListPage';
import BrandingSettings from './pages/admin/BrandingSettings';
import SystemSettings from './pages/admin/SystemSettings';

// Placeholder (עבור דפים שאולי חסרים)
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
          <Route index element={<AdminDashboard />} />
          
          {/* --- לקוחות --- */}
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/:clientId" element={<Client360 />} />
          <Route path="create-client" element={<CreateClient />} />

          {/* --- CRM --- */}
          <Route path="crm/leads" element={<LeadsPage />} />
          <Route path="crm/leads/:id" element={<LeadDetailPage />} />
          <Route path="crm/contacts" element={<ComingSoon title="אנשי קשר" />} />
          <Route path="crm/opportunities" element={<ComingSoon title="הזדמנויות" />} />
          <Route path="crm/activities" element={<ComingSoon title="פעילויות" />} />

          {/* --- ציוד ומוצרים --- */}
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="equipment/new" element={<EquipmentFormPage />} />
          <Route path="equipment/:equipmentId" element={<EquipmentFormPage />} />
          <Route path="products" element={<GlobalCatalog />} />
          <Route path="findings" element={<FindingsPage />} />
          <Route path="pending-approvals" element={<PendingApprovals />} />

          {/* --- בטיחות --- */}
          <Route path="safety/files" element={<SafetyFilesPage />} />
          <Route path="safety/surveys" element={<ComingSoon title="סקרים" />} />
          <Route path="safety/training" element={<ComingSoon title="הדרכות" />} />

          {/* --- תפעול ודוחות --- */}
          <Route path="inspections" element={<InspectionRunner />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports/history" element={<InspectionHistoryPage />} />
          <Route path="reports/compliance" element={<CompliancePage />} />

          {/* --- ניהול --- */}
          <Route path="templates" element={<TemplateManager />} />
          <Route path="templates/new" element={<TemplateEditor />} />
          <Route path="templates/:templateId" element={<TemplateEditor />} />
          
          <Route path="audit" element={<AuditLedger />} />
          <Route path="infra-global" element={<GlobalInfra />} />
          <Route path="finance" element={<Finance />} />
          <Route path="product-management" element={<ProductManagement />} />
          <Route path="documents" element={<DocumentsListPage />} />
          <Route path="branding" element={<BrandingSettings />} />
          <Route path="automation" element={<ComingSoon title="אוטומציות" />} />
          <Route path="settings" element={<SystemSettings />} />
          
          {/* Catch all */}
          <Route path="*" element={<div className="p-10 text-white">404 - דף לא נמצא</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
EOF

echo "🚀 App.tsx Updated. Building..."
cd frontend && npm run build
