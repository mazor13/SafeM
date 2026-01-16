import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login'; // CORRECT PATH FOUND
import AdminDashboard from './pages/admin/CommandCenter';
import ClientList from './pages/admin/ClientList';
import Client360 from './pages/admin/Client360';
import EquipmentPage from './pages/admin/equipment/EquipmentPage';
import EquipmentFormPage from './pages/admin/equipment/EquipmentFormPage';
import InspectionRunner from './pages/admin/inspections/InspectionRunner';
import TemplateManager from './pages/admin/templates/TemplateManager';
import TemplateEditor from './pages/admin/templates/TemplateEditor';
import GlobalCatalog from './pages/admin/GlobalCatalog';
import AdminLayout from './layouts/AdminLayout';
import AuthProvider, { useAuth } from './providers/AuthProvider';

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
          
          {/* Clients */}
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/:clientId" element={<Client360 />} />
          
          {/* Equipment */}
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="equipment/new" element={<EquipmentFormPage />} />
          <Route path="equipment/:equipmentId" element={<EquipmentFormPage />} />
          
          {/* Catalog */}
          <Route path="products" element={<GlobalCatalog />} />

          {/* Inspections */}
          <Route path="inspections" element={<InspectionRunner />} />
          
          {/* Templates */}
          <Route path="templates" element={<TemplateManager />} />
          <Route path="templates/new" element={<TemplateEditor />} />
          <Route path="templates/:templateId" element={<TemplateEditor />} />
          
          {/* Catch all */}
          <Route path="*" element={<div className="p-10 text-white">עמוד לא נמצא (404)</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
