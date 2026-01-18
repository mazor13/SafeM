import { useState, useCallback } from 'react';
import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  orderBy 
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { Building, SiteArea } from '../types/site.types';

export const useSiteHierarchy = (siteId?: string) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [areas, setAreas] = useState<SiteArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // שליפת מבנים של אתר
  const fetchBuildings = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    try {
      const q = query(collection(firestore, `sites/${siteId}/buildings`), orderBy('name'));
      const snapshot = await getDocs(q);
      setBuildings(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Building)));
    } catch (err: any) {
      console.error('Error fetching buildings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  // שליפת אזורים של בניין (או כלליים לאתר)
  const fetchAreas = useCallback(async (buildingId?: string) => {
    if (!siteId) return;
    setLoading(true);
    try {
      // כאן אנו שומרים אזורים בקולקציה שטוחה תחת האתר לנוחות, עם הפניה לבניין
      const q = query(collection(firestore, `sites/${siteId}/areas`), orderBy('name'));
      const snapshot = await getDocs(q);
      const allAreas = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SiteArea));
      
      if (buildingId) {
        setAreas(allAreas.filter(a => a.buildingId === buildingId));
      } else {
        setAreas(allAreas);
      }
    } catch (err: any) {
      console.error('Error fetching areas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  // הוספת מבנה
  const addBuilding = useCallback(async (data: Omit<Building, 'id'>) => {
    if (!siteId) return;
    setLoading(true);
    try {
      await addDoc(collection(firestore, `sites/${siteId}/buildings`), {
        ...data,
        siteId,
        createdAt: Timestamp.now()
      });
      await fetchBuildings(); // רענון
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [siteId, fetchBuildings]);

  // הוספת אזור
  const addArea = useCallback(async (data: Omit<SiteArea, 'id'>) => {
    if (!siteId) return;
    setLoading(true);
    try {
      await addDoc(collection(firestore, `sites/${siteId}/areas`), {
        ...data,
        siteId,
        createdAt: Timestamp.now()
      });
      await fetchAreas(data.buildingId); // רענון
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [siteId, fetchAreas]);

  // מחיקת מבנה
  const deleteBuilding = useCallback(async (buildingId: string) => {
    if (!siteId) return;
    if (!window.confirm('האם למחוק את המבנה? כל הציוד והאזורים המשויכים יימחקו.')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(firestore, `sites/${siteId}/buildings`, buildingId));
      setBuildings(prev => prev.filter(b => b.id !== buildingId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  return {
    buildings,
    areas,
    loading,
    error,
    fetchBuildings,
    fetchAreas,
    addBuilding,
    addArea,
    deleteBuilding
  };
};
