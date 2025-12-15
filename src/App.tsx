import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types/user.types';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Main App component with routing and RTL support
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole={UserRole.ORG_ADMIN}>
                  <div style={{ padding: '2rem' }}>
                    <h1>ניהול</h1>
                    <p>דף ניהול - נגיש למנהלי ארגון ומעלה</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="*"
              element={
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100vh',
                  direction: 'rtl'
                }}>
                  <div>
                    <h1>404 - הדף לא נמצא</h1>
                    <a href="/">חזור לדף הבית</a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
