import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';

export interface GlobalConfig {
  // Platform Details
  systemName: string;
  supportEmail: string;
  
  // Branding
  branding: {
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
    logoUrl: string;
  };
  
  // Infrastructure
  infrastructure: {
    defaultRegion: string;
    maintenanceMode: boolean;
  };
  
  // AI Settings
  ai: {
    enabled: boolean;
    model: string;
    maxTokens: number;
    provider: 'anthropic' | 'openai';
  };
  
  // Metadata
  updatedAt?: any;
  updatedBy?: string;
}

const DEFAULT_CONFIG: GlobalConfig = {
  systemName: 'AEGIS Safety Platform',
  supportEmail: 'support@aegis-app.com',
  branding: {
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
    companyName: 'AEGIS',
    logoUrl: '',
  },
  infrastructure: {
    defaultRegion: 'me-west1',
    maintenanceMode: false,
  },
  ai: {
    enabled: true,
    model: 'claude-3-sonnet',
    maxTokens: 2000,
    provider: 'anthropic',
  },
};

export function useGlobalConfig() {
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const configDoc = doc(firestore, 'system_config', 'global');

  useEffect(() => {
    const unsub = onSnapshot(configDoc, (snap) => {
      if (snap.exists()) {
        setConfig({ ...DEFAULT_CONFIG, ...snap.data() } as GlobalConfig);
      } else {
        setDoc(configDoc, { ...DEFAULT_CONFIG, updatedAt: serverTimestamp() });
        setConfig(DEFAULT_CONFIG);
      }
      setLoading(false);
    }, (err) => {
      console.error('Error loading config:', err);
      setError('שגיאה בטעינת ההגדרות');
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateConfig = async (newConfig: Partial<GlobalConfig>, userId?: string) => {
    setSaving(true);
    setError(null);
    try {
      await setDoc(configDoc, {
        ...newConfig,
        updatedAt: serverTimestamp(),
        updatedBy: userId || 'system',
      }, { merge: true });
      setSaving(false);
      return { success: true };
    } catch (err) {
      console.error("Error updating global config:", err);
      setError('שגיאה בשמירת ההגדרות');
      setSaving(false);
      return { success: false, error: err };
    }
  };

  return { config, updateConfig, loading, saving, error };
}
