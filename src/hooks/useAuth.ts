import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { subscribeToAuthState, getCurrentUserData } from '../services/auth.service';

/**
 * Hook to manage authentication state
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    clearAuth,
    hasRole,
    hasRoleLevel,
  } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getCurrentUserData(firebaseUser.uid);
          if (userData) {
            setUser(userData);
          } else {
            setError('משתמש לא נמצא במערכת');
            clearAuth();
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'שגיאה בטעינת נתוני משתמש');
          clearAuth();
        }
      } else {
        clearAuth();
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setError, clearAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    hasRole,
    hasRoleLevel,
  };
};
