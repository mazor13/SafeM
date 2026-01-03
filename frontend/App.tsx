import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminLayout from './layouts/AdminLayout';
import AuthProvider from './providers/AuthProvider';

// Admin Pages
import DashboardBI from './pages/admin/DashboardBI';
import CommandCenter from './pages/admin/CommandCenter';
import FilledFormPage from './pages/admin/forms/FilledFormPage';
import Clients from './pages/admin/Clients';
import CreateClient from './pages/admin/CreateClient';
import Client360 from './pages/admin/Client360';
import GlobalInfra from './pages/admin/GlobalInfra';
import Finance from './pages/admin/Finance';
import ProductManagement from './pages/admin/ProductManagement';
import AuditLedger from './pages/admin/AuditLedger';
import FormsListPage from './pages/admin/forms/FormsListPage';
import DocumentsListPage from './pages/admin/documents/DocumentsListPage';
import DocumentEditorPage from './pages/admin/documents/DocumentEditorPage';
import AIPdfImportPage from './pages/admin/templates/AIPdfImportPage';

// CRM Pages
import { LeadsPage, LeadDetailPage } from './pages/admin/crm';

// Safety Pages
import { SafetyFilesPage } from './pages/admin/safety';

// Templates Pages (Phase 2)
import TemplatesListPage from './pages/admin/templates/TemplatesListPage';
import TemplateDesigner from './pages/admin/templates/TemplateDesigner';
import TemplatePreview from './pages/admin/templates/TemplatePreview';

// ============================================
// Phase 4 - Equipment Management Pages
// ============================================
import EquipmentPage from './pages/admin/equipment/EquipmentPage';
import EquipmentFormPage from './pages/admin/equipment/EquipmentFormPage';
import LocationsPage from './pages/admin/equipment/LocationsPage';
import InspectionsPage from './pages/admin/equipment/InspectionsPage';
import InspectionExecutionPage from './pages/admin/equipment/InspectionExecutionPage';
import FindingsPage from './pages/admin/equipment/FindingsPage';

// ============================================
// Phase 5 - Reports & Analytics Pages
// ============================================
import AnalyticsPage from './pages/admin/reports/AnalyticsPage';
import ReportsPage from './pages/admin/reports/ReportsPage';
import InspectionHistoryPage from './pages/admin/reports/InspectionHistoryPage';
import CompliancePage from './pages/admin/reports/CompliancePage';

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
          <Route path="forms" element={<FormsListPage />} />
          <Route path="forms/new" element={<FilledFormPage />} />
          <Route path="forms/:formId" element={<FilledFormPage />} />
          <Route path="documents" element={<DocumentsListPage />} />
          <Route path="documents/new" element={<DocumentEditorPage />} />
          <Route path="documents/:documentId" element={<DocumentEditorPage />} />
          <Route path="templates/import-pdf" element={<AIPdfImportPage />} />
          
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
          
          {/* Safety Routes (Legacy) */}
          <Route path="safety/files" element={<SafetyFilesPage />} />
          <Route path="safety/files/new" element={<div className="p-10 text-slate-400">Create Safety File (Coming Soon)</div>} />
          <Route path="safety/files/:id" element={<div className="p-10 text-slate-400">Safety File Detail (Coming Soon)</div>} />
          <Route path="safety/surveys" element={<div className="p-10 text-slate-400">Surveys (Coming Soon)</div>} />
          <Route path="safety/training" element={<div className="p-10 text-slate-400">Training (Coming Soon)</div>} />
          
          {/* ============================================ */}
          {/* Phase 4 - Equipment Management Routes */}
          {/* ============================================ */}
          
          {/* Equipment */}
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="equipment/new" element={<EquipmentFormPage />} />
          <Route path="equipment/:equipmentId" element={<EquipmentFormPage />} />
          <Route path="equipment/:equipmentId/edit" element={<EquipmentFormPage />} />
          
          {/* Locations */}
          <Route path="locations" element={<LocationsPage />} />
          
          {/* Inspections */}
          <Route path="inspections" element={<InspectionsPage />} />
          <Route path="inspections/execute/:equipmentId" element={<InspectionExecutionPage />} />
          <Route path="inspections/:inspectionId" element={<InspectionExecutionPage />} />
          
          {/* Findings */}
          <Route path="findings" element={<FindingsPage />} />
          
          {/* ============================================ */}
          {/* Phase 5 - Reports & Analytics Routes */}
          {/* ============================================ */}
          
          {/* Analytics Dashboard */}
          <Route path="analytics" element={<AnalyticsPage />} />
          
          {/* Reports */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/history" element={<InspectionHistoryPage />} />
          <Route path="reports/compliance" element={<CompliancePage />} />
          
          {/* Templates Routes (Phase 2) */}
          <Route path="templates" element={<TemplatesListPage tenantId="system" />} />
          <Route path="templates/:templateId/edit" element={<TemplateDesigner />} />
          <Route path="templates/new" element={<TemplateDesigner />} />
          <Route path="templates/:templateId/preview" element={<TemplatePreview />} />
          
          <Route path="settings" element={<div className="p-10 text-slate-400">System Settings (Coming Soon)</div>} />
          <Route path="products" element={<ProductManagement />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
