import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './providers/AuthProvider';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';

// Auth
import Login from './pages/auth/Login';

// Admin Pages
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import Analytics from './pages/admin/Analytics';
import Finance from './pages/admin/Finance';
import ProductManagement from './pages/admin/ProductManagement';
import Clients from './pages/admin/Clients';
import AdminSettings from './pages/admin/Settings';
import Templates from './pages/admin/Templates'; // Import החדש

// Client Pages
import InspectionsDashboard from './pages/client/InspectionsDashboard';
import Inspections from './pages/client/Inspections';
import NewInspection from './pages/client/NewInspection';
import InspectionDetails from './pages/client/InspectionDetails';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">טוען נתונים...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  const { user } = useAuth();

  const RootRedirect = () => {
    if (!user) return <Navigate to="/login" />;
    return user.role === 'super_admin' ? <Navigate to="/admin" /> : <Navigate to="/client" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* === ADMIN AREA === */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="templates" element={<Templates />} /> {/* Route החדש */}
          <Route path="finance" element={<Finance />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="clients" element={<Clients />} />
          <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* === CLIENT AREA === */}
      <Route path="/client" element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
          <Route index element={<InspectionsDashboard />} />
          <Route path="inspections" element={<Inspections />} />
          <Route path="inspections/:id" element={<InspectionDetails />} />
          <Route path="new-inspection" element={<NewInspection />} />
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
