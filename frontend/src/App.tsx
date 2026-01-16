import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useUIStore } from './store/uiStore';

// Pages
import Login from './pages/auth/Login';
import Clients from './pages/admin/Clients';
import SystemSettings from './pages/admin/SystemSettings';
import Tasks from './pages/Tasks';
import TaskDetails from './pages/tasks/TaskDetails';
import Notifications from './pages/Notifications';

// Equipment Pages
import { InspectionsPage, EquipmentPage, FindingsPage } from './pages/admin/equipment';
import EquipmentFormPage from './pages/admin/equipment/EquipmentFormPage';
import InspectionRunner from './pages/admin/inspections/InspectionRunner'; // NEW

// CRM Pages
import { LeadsPage, LeadDetailPage } from './pages/admin/crm';

// Safety Pages
import { SafetyFilesPage } from './pages/admin/safety';

// Reports Pages
import { AnalyticsPage, InspectionHistoryPage, CompliancePage } from './pages/admin/reports';

// Other Admin Pages
import DashboardBI from './pages/admin/DashboardBI';
import CommandCenter from './pages/admin/CommandCenter';
import PendingApprovals from './pages/admin/PendingApprovals';
import Finance from './pages/admin/Finance';
import BrandingSettings from './pages/admin/BrandingSettings';
import Templates from './pages/admin/Templates';
import Client360 from './pages/admin/Client360';
import CreateClient from './pages/admin/CreateClient';
import ProductManagement from './pages/admin/ProductManagement';

// Documents
import DocumentsListPage from './pages/admin/documents/DocumentsListPage';

// Templates
import TemplateDesigner from './pages/admin/templates/TemplateDesigner';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUIStore((state) => state.user);
  const loading = useUIStore((state) => state.loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const setUser = useUIStore((state) => state.setUser);
  const setLoading = useUIStore((state) => state.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Home - Command Center */}
          <Route index element={<CommandCenter />} />
          <Route path="dashboard-bi" element={<DashboardBI />} />
          
          {/* CRM */}
          <Route path="crm/leads" element={<LeadsPage />} />
          <Route path="crm/leads/:leadId" element={<LeadDetailPage />} />
          
          {/* Safety */}
          <Route path="safety/files" element={<SafetyFilesPage />} />
          
          {/* Equipment - Phase 4 */}
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="equipment/new" element={<EquipmentFormPage />} />
          <Route path="equipment/:equipmentId" element={<EquipmentFormPage />} />
          <Route path="findings" element={<FindingsPage />} />
          <Route path="findings/:findingId" element={<EquipmentFormPage />} /> {/* Temp placeholder for finding details */}
          <Route path="inspections" element={<InspectionsPage />} />
          <Route path="inspections/new" element={<InspectionRunner />} /> {/* NEW ROUTE */}
          <Route path="pending-approvals" element={<PendingApprovals />} />
          
          {/* Reports - Phase 5 */}
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports/history" element={<InspectionHistoryPage />} />
          <Route path="reports/compliance" element={<CompliancePage />} />
          
          {/* Clients */}
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<CreateClient />} />
          <Route path="clients/:clientId" element={<Client360 />} />
          
          {/* Tasks */}
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:taskId" element={<TaskDetails />} />
          
          {/* Templates */}
          <Route path="templates" element={<Templates />} />
          <Route path="templates/:templateId" element={<TemplateDesigner />} />
          
          {/* Documents */}
          <Route path="documents" element={<DocumentsListPage />} />
          
          {/* Products */}
          <Route path="products" element={<ProductManagement />} />
          
          {/* Settings */}
          <Route path="finance" element={<Finance />} />
          <Route path="branding" element={<BrandingSettings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="system" element={<SystemSettings />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
  );
}

export default App;
