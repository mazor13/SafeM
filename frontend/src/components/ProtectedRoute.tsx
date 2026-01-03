import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { firestore as db } from '../firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [checkingRole, setCheckingRole] = React.useState(true);

  React.useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } catch (error) {
        console.error('Error checking role:', error);
      } finally {
        setCheckingRole(false);
      }
    };

    if (!loading) {
      checkRole();
    }
  }, [user, loading]);

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">טוען...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is empty, allow any authenticated user
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    // Redirect based on role
    if (userRole === 'inspector' || userRole === 'client_user') {
      return <Navigate to="/unauthorized" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
