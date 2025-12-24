import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore as db } from '../firebase'; // שינוי נתיב ושם משתנה
import { Client } from '../types';

interface ClientContextType {
  client: Client | null;
  loading: boolean;
  error: string | null;
}

const ClientContext = createContext<ClientContextType>({ client: null, loading: true, error: null });

export const useClient = () => useContext(ClientContext);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) return;
      
      try {
        setLoading(true);
        // שימוש ב-db שהוא בעצם ה-firestore מהקובץ שלך
        const docRef = doc(db, 'clients', clientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClient({ id: docSnap.id, ...docSnap.data() } as Client);
        } else {
          setError('לקוח לא נמצא');
        }
      } catch (err) {
        console.error("Error fetching client:", err);
        setError('שגיאה בטעינת נתוני לקוח');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  return (
    <ClientContext.Provider value={{ client, loading, error }}>
      {children}
    </ClientContext.Provider>
  );
};
