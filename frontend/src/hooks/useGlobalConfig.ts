import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase';

export interface GlobalConfig {
  branding: {
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
    logoUrl: string;
  };
  infrastructure: {
    defaultRegion: string;
    maintenanceMode: boolean;
  };
}

export function useGlobalConfig() {
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const configDoc = doc(firestore, 'system_config', 'global');

  // האזנה לשינויים בזמן אמת
  useEffect(() => {
    const unsub = onSnapshot(configDoc, (snap) => {
      if (snap.exists()) {
        setConfig(snap.data() as GlobalConfig);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // פונקציית עדכון
  const updateConfig = async (newConfig: Partial<GlobalConfig>) => {
    try {
      await setDoc(configDoc, newConfig, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error updating global config:", error);
      return { success: false, error };
    }
  };

  return { config, updateConfig, loading };
}
