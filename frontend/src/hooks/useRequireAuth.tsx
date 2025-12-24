import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export default function useRequireAuth() {
  const { user, loading } = useAuth();

  return (element: React.ReactElement) => {
    if (loading) {
      return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }
    
    if (!user) { 
        return <LoginRedirect />;
    }
    
    return element;
  };
}

function LoginRedirect() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/login');
    }, [navigate]);
    return null;
}
