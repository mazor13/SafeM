// ===========================================
// AEGIS - useClients Hook (Extended)
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { 
  Tenant, 
  TenantStatus,
  Contact,
  EscalationSettings,
  DEFAULT_ESCALATION_SETTINGS,
  getContactsByLevel,
} from '../types/safety';
import { logAction, logUpdate, logStatusChange } from './useAuditLog';

// ===========================================
// TYPES
// ===========================================

interface UseClientsOptions {
  status?: TenantStatus;
  realtime?: boolean;
}

interface UseClientsReturn {
  clients: Tenant[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    active: number;
    suspended: number;
    onboarding: number;
  };
  createClient: (data: Partial<Tenant>) => Promise<string>;
  updateClient: (id: string, data: Partial<Tenant>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  updateEscalationSettings: (id: string, settings: EscalationSettings) => Promise<void>;
  refresh: () => Promise<void>;
}

interface UseClientReturn {
  client: Tenant | null;
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  updateClient: (data: Partial<Tenant>) => Promise<void>;
  updateEscalationSettings: (settings: EscalationSettings) => Promise<void>;
  // Contacts
  addContact: (data: Partial<Contact>) => Promise<string>;
  updateContact: (contactId: string, data: Partial<Contact>) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  // Helpers
  getContactsByLevel: (level: 1 | 2 | 3) => Contact[];
  refresh: () => Promise<void>;
}

// ===========================================
// HOOK: useClients (List)
// ===========================================

export function useClients(options: UseClientsOptions = {}): UseClientsReturn {
  const [clients, setClients] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status, realtime = false } = options;

  // Fetch clients
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const clientsRef = collection(firestore, 'tenants');
      let q = query(clientsRef, orderBy('createdAt', 'desc'));

      if (status) {
        q = query(clientsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure escalation settings exist
        escalationSettings: doc.data().escalationSettings || DEFAULT_ESCALATION_SETTINGS,
      })) as Tenant[];

      setClients(clientsData);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  // Real-time or one-time fetch
  useEffect(() => {
    if (realtime) {
      const clientsRef = collection(firestore, 'tenants');
      let q = query(clientsRef, orderBy('createdAt', 'desc'));

      if (status) {
        q = query(clientsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const clientsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            escalationSettings: doc.data().escalationSettings || DEFAULT_ESCALATION_SETTINGS,
          })) as Tenant[];
          setClients(clientsData);
          setLoading(false);
        },
        (err) => {
          console.error('Error in clients subscription:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      fetchClients();
    }
  }, [fetchClients, realtime, status]);

  // Calculate stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    suspended: clients.filter(c => c.status === 'suspended').length,
    onboarding: clients.filter(c => c.status === 'onboarding').length,
  };

  // Create client
  const createClient = async (data: Partial<Tenant>): Promise<string> => {
    const now = Timestamp.now();
    
    const clientData = {
      name: data.name || '',
      businessNumber: data.businessNumber || '',
      email: data.email || '',
      phone: data.phone || '',
      website: data.website || '',
      address: data.address || {},
      status: data.status || 'onboarding',
      plan: data.plan || 'starter',
      usersCount: data.usersCount || 0,
      usersLimit: data.usersLimit || 10,
      healthScore: data.healthScore || 100,
      branding: data.branding || {},
      billingSettings: data.billingSettings || {},
      notes: data.notes || '',
      tags: data.tags || [],
      // Default escalation settings
      escalationSettings: data.escalationSettings || DEFAULT_ESCALATION_SETTINGS,
      // Timestamps
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy || '',
    };

    const docRef = await addDoc(collection(firestore, 'tenants'), clientData);

    // Log action
    await logAction(
      {
        action: 'created',
        entityType: 'tenant',
        entityId: docRef.id,
        entityName: data.name,
      },
      null // TODO: pass current user
    );

    if (!realtime) {
      await fetchClients();
    }

    return docRef.id;
  };

  // Update client
  const updateClient = async (id: string, data: Partial<Tenant>): Promise<void> => {
    const clientRef = doc(firestore, 'tenants', id);
    
    // Get previous data for audit
    const prevDoc = await getDoc(clientRef);
    const prevData = prevDoc.data() as Tenant;

    await updateDoc(clientRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    // Log changes
    await logUpdate(
      'tenant',
      id,
      prevData?.name || '',
      prevData || {},
      data,
      null // TODO: pass current user
    );

    if (!realtime) {
      await fetchClients();
    }
  };

  // Delete client
  const deleteClient = async (id: string): Promise<void> => {
    const clientRef = doc(firestore, 'tenants', id);
    
    // Get name for audit
    const prevDoc = await getDoc(clientRef);
    const prevData = prevDoc.data();

    await deleteDoc(clientRef);

    // Log action
    await logAction(
      {
        action: 'deleted',
        entityType: 'tenant',
        entityId: id,
        entityName: prevData?.name,
      },
      null // TODO: pass current user
    );

    if (!realtime) {
      await fetchClients();
    }
  };

  // Update escalation settings
  const updateEscalationSettings = async (
    id: string, 
    settings: EscalationSettings
  ): Promise<void> => {
    const clientRef = doc(firestore, 'tenants', id);
    
    await updateDoc(clientRef, {
      escalationSettings: settings,
      updatedAt: Timestamp.now(),
    });

    // Log action
    await logAction(
      {
        action: 'updated',
        entityType: 'tenant',
        entityId: id,
        details: { notes: 'הגדרות אסקלציה עודכנו' },
      },
      null
    );

    if (!realtime) {
      await fetchClients();
    }
  };

  return {
    clients,
    loading,
    error,
    stats,
    createClient,
    updateClient,
    deleteClient,
    updateEscalationSettings,
    refresh: fetchClients,
  };
}

// ===========================================
// HOOK: useClient (Single)
// ===========================================

export function useClient(clientId: string | undefined): UseClientReturn {
  const [client, setClient] = useState<Tenant | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch client and contacts
  const fetchData = useCallback(async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch client
      const clientRef = doc(firestore, 'tenants', clientId);
      const clientDoc = await getDoc(clientRef);

      if (clientDoc.exists()) {
        setClient({
          id: clientDoc.id,
          ...clientDoc.data(),
          escalationSettings: clientDoc.data().escalationSettings || DEFAULT_ESCALATION_SETTINGS,
        } as Tenant);
      } else {
        setClient(null);
      }

      // Fetch contacts
      const contactsRef = collection(firestore, 'contacts');
      const contactsQuery = query(
        contactsRef,
        where('tenantId', '==', clientId),
        orderBy('escalationLevel', 'asc'),
        orderBy('firstName', 'asc')
      );
      const contactsSnapshot = await getDocs(contactsQuery);
      const contactsData = contactsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];

      setContacts(contactsData);
    } catch (err: any) {
      console.error('Error fetching client:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // Real-time subscription
  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    // Subscribe to client
    const clientRef = doc(firestore, 'tenants', clientId);
    const unsubClient = onSnapshot(
      clientRef,
      (doc) => {
        if (doc.exists()) {
          setClient({
            id: doc.id,
            ...doc.data(),
            escalationSettings: doc.data().escalationSettings || DEFAULT_ESCALATION_SETTINGS,
          } as Tenant);
        } else {
          setClient(null);
        }
      },
      (err) => {
        console.error('Error in client subscription:', err);
        setError(err.message);
      }
    );

    // Subscribe to contacts
    const contactsRef = collection(firestore, 'contacts');
    const contactsQuery = query(
      contactsRef,
      where('tenantId', '==', clientId)
    );
    const unsubContacts = onSnapshot(
      contactsQuery,
      (snapshot) => {
        const contactsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Contact[];
        
        // Sort by escalation level, then by name
        contactsData.sort((a, b) => {
          if (a.escalationLevel !== b.escalationLevel) {
            return a.escalationLevel - b.escalationLevel;
          }
          return a.firstName.localeCompare(b.firstName, 'he');
        });
        
        setContacts(contactsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error in contacts subscription:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubClient();
      unsubContacts();
    };
  }, [clientId]);

  // Update client
  const updateClient = async (data: Partial<Tenant>): Promise<void> => {
    if (!clientId || !client) return;

    const clientRef = doc(firestore, 'tenants', clientId);

    await updateDoc(clientRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    // Log changes
    await logUpdate(
      'tenant',
      clientId,
      client.name,
      client,
      data,
      null
    );
  };

  // Update escalation settings
  const updateEscalationSettings = async (settings: EscalationSettings): Promise<void> => {
    if (!clientId) return;

    const clientRef = doc(firestore, 'tenants', clientId);

    await updateDoc(clientRef, {
      escalationSettings: settings,
      updatedAt: Timestamp.now(),
    });

    await logAction(
      {
        action: 'updated',
        entityType: 'tenant',
        entityId: clientId,
        entityName: client?.name,
        details: { notes: 'הגדרות אסקלציה עודכנו' },
      },
      null
    );
  };

  // Add contact
  const addContact = async (data: Partial<Contact>): Promise<string> => {
    if (!clientId) throw new Error('Client ID is required');

    const now = Timestamp.now();

    const contactData = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      mobile: data.mobile || '',
      title: data.title || '',
      department: data.department || '',
      escalationLevel: data.escalationLevel || 1,
      status: data.status || 'active',
      isPrimary: data.isPrimary || false,
      tenantId: clientId,
      tenantName: client?.name || '',
      preferredContactMethod: data.preferredContactMethod || 'email',
      doNotCall: data.doNotCall || false,
      doNotEmail: data.doNotEmail || false,
      address: data.address || {},
      notes: data.notes || '',
      tags: data.tags || [],
      portalAccess: data.portalAccess || { enabled: false, role: 'viewer' },
      notificationPreferences: data.notificationPreferences || {
        email: true,
        whatsapp: true,
        sms: false,
        newFindings: true,
        findingReminders: true,
        reportReady: true,
        trainingReminders: true,
      },
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(firestore, 'contacts'), contactData);

    await logAction(
      {
        action: 'created',
        entityType: 'contact',
        entityId: docRef.id,
        entityName: `${data.firstName} ${data.lastName}`,
        tenantId: clientId,
      },
      null
    );

    return docRef.id;
  };

  // Update contact
  const updateContact = async (contactId: string, data: Partial<Contact>): Promise<void> => {
    const contactRef = doc(firestore, 'contacts', contactId);
    
    const prevDoc = await getDoc(contactRef);
    const prevData = prevDoc.data() as Contact;

    await updateDoc(contactRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    await logUpdate(
      'contact',
      contactId,
      `${prevData?.firstName} ${prevData?.lastName}`,
      prevData || {},
      data,
      null,
      clientId
    );
  };

  // Delete contact
  const deleteContact = async (contactId: string): Promise<void> => {
    const contactRef = doc(firestore, 'contacts', contactId);
    
    const prevDoc = await getDoc(contactRef);
    const prevData = prevDoc.data();

    await deleteDoc(contactRef);

    await logAction(
      {
        action: 'deleted',
        entityType: 'contact',
        entityId: contactId,
        entityName: `${prevData?.firstName} ${prevData?.lastName}`,
        tenantId: clientId,
      },
      null
    );
  };

  // Get contacts by escalation level
  const getContactsByLevelFn = (level: 1 | 2 | 3): Contact[] => {
    return getContactsByLevel(contacts, level);
  };

  return {
    client,
    contacts,
    loading,
    error,
    updateClient,
    updateEscalationSettings,
    addContact,
    updateContact,
    deleteContact,
    getContactsByLevel: getContactsByLevelFn,
    refresh: fetchData,
  };
}

// ===========================================
// HOOK: useContacts (Global)
// ===========================================

interface UseContactsOptions {
  tenantId?: string;
  escalationLevel?: 1 | 2 | 3;
  status?: 'active' | 'inactive';
}

export function useContacts(options: UseContactsOptions = {}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { tenantId, escalationLevel, status } = options;

  useEffect(() => {
    const contactsRef = collection(firestore, 'contacts');
    const constraints: any[] = [];

    if (tenantId) {
      constraints.push(where('tenantId', '==', tenantId));
    }
    if (escalationLevel) {
      constraints.push(where('escalationLevel', '==', escalationLevel));
    }
    if (status) {
      constraints.push(where('status', '==', status));
    }

    const q = query(contactsRef, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const contactsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Contact[];
        setContacts(contactsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching contacts:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tenantId, escalationLevel, status]);

  return { contacts, loading, error };
}
