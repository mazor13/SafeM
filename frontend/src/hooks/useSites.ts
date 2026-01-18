import { useState, useCallback } from 'react';
import { 
  collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, orderBy 
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { Site } from '../types/site.types';

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = useCallback(async (clientId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const sitesRef = collection(firestore, 'sites');
      let q;
      if (clientId) {
        q = query(sitesRef, where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
      } else {
        q = query(sitesRef, orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);
      const sitesData = snapshot.docs.map(doc => {
        const data = doc.data() as any; // FIX: Cast to any to allow spread
        return { id: doc.id, ...data } as unknown as Site;
      });

      setSites(sitesData);
    } catch (err: any) {
      console.error('Error fetching sites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSite = useCallback(async (siteData: any) => {
    setLoading(true);
    try {
      const newSite = {
        ...siteData,
        tenantId: 'default',
        stats: {
          buildingsCount: 0,
          equipmentCount: 0,
          openFindingsCount: 0,
          complianceScore: 100
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(firestore, 'sites'), newSite);
      const addedSite = { id: docRef.id, ...newSite } as unknown as Site;
      setSites(prev => [addedSite, ...prev]);
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding site:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSite = useCallback(async (id: string, data: Partial<Site>) => {
    setLoading(true);
    try {
      const docRef = doc(firestore, 'sites', id);
      const updateData = { ...data, updatedAt: Timestamp.now() };
      await updateDoc(docRef, updateData);
      
      setSites(prev => prev.map(site => 
        site.id === id ? { ...site, ...updateData } as Site : site
      ));
    } catch (err: any) {
      console.error('Error updating site:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSite = useCallback(async (id: string) => {
    if (!window.confirm('האם למחוק את האתר?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(firestore, 'sites', id));
      setSites(prev => prev.filter(site => site.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { sites, loading, error, fetchSites, addSite, updateSite, deleteSite };
};
