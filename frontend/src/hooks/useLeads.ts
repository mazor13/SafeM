import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  Timestamp,
  where,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { Lead, LeadStatus } from '../types/crm';

interface UseLeadsOptions {
  status?: LeadStatus;
  limit?: number;
  realtime?: boolean;
}

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    unqualified: number;
    converted: number;
  };
  createLead: (data: Partial<Lead>) => Promise<string>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  convertLead: (id: string, tenantData: any) => Promise<string>;
  refresh: () => Promise<void>;
}

export function useLeads(options: UseLeadsOptions = {}): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const leadsRef = collection(firestore, 'leads');
      let q = query(leadsRef, orderBy('createdAt', 'desc'));

      if (options.status) {
        q = query(leadsRef, where('status', '==', options.status), orderBy('createdAt', 'desc'));
      }

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const snapshot = await getDocs(q);
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];

      setLeads(leadsData);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [options.status, options.limit]);

  // Real-time subscription
  useEffect(() => {
    if (options.realtime) {
      const leadsRef = collection(firestore, 'leads');
      let q = query(leadsRef, orderBy('createdAt', 'desc'));

      if (options.status) {
        q = query(leadsRef, where('status', '==', options.status), orderBy('createdAt', 'desc'));
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const leadsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lead[];
        setLeads(leadsData);
        setLoading(false);
      }, (err) => {
        console.error('Error in leads subscription:', err);
        setError(err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      fetchLeads();
    }
  }, [fetchLeads, options.realtime, options.status]);

  // Calculate stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    unqualified: leads.filter(l => l.status === 'unqualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  // Create lead
  const createLead = async (data: Partial<Lead>): Promise<string> => {
    const docRef = await addDoc(collection(firestore, 'leads'), {
      ...data,
      status: data.status || 'new',
      rating: data.rating || 'warm',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    if (!options.realtime) {
      await fetchLeads();
    }
    
    return docRef.id;
  };

  // Update lead
  const updateLead = async (id: string, data: Partial<Lead>): Promise<void> => {
    await updateDoc(doc(firestore, 'leads', id), {
      ...data,
      updatedAt: Timestamp.now(),
    });
    
    if (!options.realtime) {
      await fetchLeads();
    }
  };

  // Delete lead
  const deleteLead = async (id: string): Promise<void> => {
    await deleteDoc(doc(firestore, 'leads', id));
    
    if (!options.realtime) {
      await fetchLeads();
    }
  };

  // Convert lead to tenant
  const convertLead = async (id: string, tenantData: any): Promise<string> => {
    // Get the lead
    const leadDoc = leads.find(l => l.id === id);
    if (!leadDoc) throw new Error('Lead not found');

    // Create tenant
    const tenantRef = await addDoc(collection(firestore, 'clients'), {
      name: tenantData.name || leadDoc.company || `${leadDoc.firstName} ${leadDoc.lastName}`,
      domain: tenantData.domain,
      plan: tenantData.plan || 'basic',
      status: 'active',
      healthScore: 100,
      usersCount: 1,
      usersLimit: tenantData.usersLimit || 5,
      createdAt: Timestamp.now(),
      convertedFromLeadId: id,
    });

    // Create primary contact
    await addDoc(collection(firestore, 'contacts'), {
      firstName: leadDoc.firstName,
      lastName: leadDoc.lastName,
      email: leadDoc.email,
      phone: leadDoc.phone,
      mobile: leadDoc.mobile,
      title: leadDoc.title,
      tenantId: tenantRef.id,
      tenantName: tenantData.name,
      isPrimary: true,
      status: 'active',
      createdAt: Timestamp.now(),
    });

    // Update lead status
    await updateDoc(doc(firestore, 'leads', id), {
      status: 'converted',
      convertedAt: Timestamp.now(),
      convertedToTenantId: tenantRef.id,
      updatedAt: Timestamp.now(),
    });

    if (!options.realtime) {
      await fetchLeads();
    }

    return tenantRef.id;
  };

  return {
    leads,
    loading,
    error,
    stats,
    createLead,
    updateLead,
    deleteLead,
    convertLead,
    refresh: fetchLeads,
  };
}

// Hook for single lead
export function useLead(id: string | undefined) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(firestore, 'leads', id),
      (doc) => {
        if (doc.exists()) {
          setLead({ id: doc.id, ...doc.data() } as Lead);
        } else {
          setLead(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching lead:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  return { lead, loading, error };
}
