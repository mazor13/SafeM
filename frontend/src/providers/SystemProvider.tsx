import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { firestore as db } from '../firebase';

export interface SystemModule {
  id: string; // מזהה ייחודי (laser, fire)
  label: string; // שם לתצוגה (בטיחות לייזר)
  iconKey: string; // שם האייקון למיפוי (bolt, fire)
  description?: string;
  isActive: boolean; // האם המודול פעיל במערכת בכלל
}

interface SystemContextType {
  modules: SystemModule[];
  loading: boolean;
}

const SystemContext = createContext<SystemContextType>({ modules: [], loading: true });

export const useSystem = () => useContext(SystemContext);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [loading, setLoading] = useState(true);

  // פונקציה חד פעמית לאתחול המערכת (במקרה שהדאטה בייס ריק)
  const seedDatabase = async () => {
    const defaults: SystemModule[] = [
      { id: 'safety', label: 'בטיחות כללית', iconKey: 'wrench', isActive: true },
      { id: 'laser', label: 'בטיחות לייזר', iconKey: 'bolt', isActive: true },
      { id: 'fire', label: 'כיבוי אש', iconKey: 'fire', isActive: true },
      // בעתיד תוכל להוסיף כאן מודולים נוספים והם יטענו אוטומטית
    ];

    for (const mod of defaults) {
      await setDoc(doc(db, 'system_modules', mod.id), mod);
    }
    return defaults;
  };

  useEffect(() => {
    const fetchSystemConfig = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'system_modules'));
        
        if (querySnapshot.empty) {
          // הפעלה ראשונה - זריעת נתונים
          const seeded = await seedDatabase();
          setModules(seeded);
        } else {
          const loadedModules = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as SystemModule[];
          
          // מיון: בטיחות כללית תמיד ראשון
          loadedModules.sort((a, b) => {
             if (a.id === 'safety') return -1;
             if (b.id === 'safety') return 1;
             return a.label.localeCompare(b.label);
          });
          
          setModules(loadedModules);
        }
      } catch (error) {
        console.error("Error loading system config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemConfig();
  }, []);

  return (
    <SystemContext.Provider value={{ modules, loading }}>
      {children}
    </SystemContext.Provider>
  );
};
