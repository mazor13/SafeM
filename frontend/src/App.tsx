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
import { InspectionsPage } from './pages/admin/equipment';
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
          <Route index element={<Navigate to="/admin/tasks" replace />} />
          <Route path="clients" element={<Clients />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:taskId" element={<TaskDetails />} />
          <Route path="system" element={<SystemSettings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="inspections" element={<InspectionsPage />} />
        </Route>
        {/* Fallback */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
  );
}
export default App;
