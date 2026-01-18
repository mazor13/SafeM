import { useState, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp, 
  orderBy 
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { Equipment } from '../types/equipment.types';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // שליפת ציוד (עם פילטרים אופציונליים)
  const fetchEquipment = useCallback(async (filters?: { siteId?: string; clientId?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const collectionRef = collection(firestore, 'equipment');
      let q = query(collectionRef, orderBy('createdAt', 'desc'));

      // בניית שאילתה דינמית
      if (filters?.siteId) {
        q = query(collectionRef, where('siteId', '==', filters.siteId), orderBy('createdAt', 'desc'));
      } else if (filters?.clientId) {
        q = query(collectionRef, where('clientId', '==', filters.clientId), orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Equipment[];

      setEquipment(data);
    } catch (err: any) {
      console.error('Error fetching equipment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // הוספת ציוד חדש
  const addEquipment = useCallback(async (data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newEquipment = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(firestore, 'equipment'), newEquipment);
      const addedItem = { id: docRef.id, ...newEquipment } as Equipment;
      
      setEquipment(prev => [addedItem, ...prev]);
      return docRef.id;
    } catch (err: any) {
      console.error('Error adding equipment:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // עדכון ציוד
  const updateEquipment = useCallback(async (id: string, data: Partial<Equipment>) => {
    setLoading(true);
    try {
      const docRef = doc(firestore, 'equipment', id);
      const updateData = { ...data, updatedAt: Timestamp.now() };
      
      await updateDoc(docRef, updateData);
      
      setEquipment(prev => prev.map(item => 
        item.id === id ? { ...item, ...updateData } as Equipment : item
      ));
    } catch (err: any) {
      console.error('Error updating equipment:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    equipment,
    loading,
    error,
    fetchEquipment,
    addEquipment,
    updateEquipment
  };
};
