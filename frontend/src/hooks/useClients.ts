import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '../firebase';

export interface ClientData {
  id: string;
  name: string;
  logoUrl?: string;
  domain?: string;
  status: 'active' | 'suspended' | 'onboarding';
  plan: 'enterprise' | 'pro' | 'starter';
  usersCount: number;
  usersLimit: number;
  healthScore: number;
  lastActive: string; // ISO Date
  contactPerson?: string;
}

export const useClients = () => {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const clientsRef = collection(firestore, 'tenants');
        const q = query(clientsRef, orderBy('createdAt', 'desc')); // Show newest first
        const snapshot = await getDocs(q);

        const clients: ClientData[] = snapshot.docs.map(doc => {
            const raw = doc.data();
            return {
                id: doc.id,
                name: raw.name || 'Unknown Client',
                logoUrl: raw.logoUrl,
                domain: raw.domain || 'pending-setup',
                status: raw.status || 'onboarding',
                plan: raw.plan || 'starter',
                usersCount: raw.usersCount || 0,
                usersLimit: raw.usersLimit || 10,
                healthScore: raw.healthScore || 100,
                lastActive: raw.lastActive || new Date().toISOString(),
                contactPerson: raw.contactPerson || 'Not Assigned'
            };
        });

        setData(clients);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
        setError("שגיאה בטעינת נתוני לקוחות");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { data, loading, error };
};
