import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged,
  getIdTokenResult 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // הוספנו
import { auth, firestore } from '../firebase'; // הוספנו firestore

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // 1. שליפת ה-Role
        const token = await getIdTokenResult(currentUser);
        const userRole = (token.claims.role as string) || 'inspector'; // ברירת מחדל
        setRole(userRole);

        // 2. וידוא שהמשתמש קיים בטבלת users (כדי שנוכל לבחור אותו ברשימות)
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        
        // אם המשתמש לא קיים או שאין לו שם מעודכן, נעדכן אותו
        if (!userSnap.exists()) {
          await setDoc(userDocRef, {
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email?.split('@')[0],
            role: userRole,
            uid: currentUser.uid,
            createdAt: new Date()
          });
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
