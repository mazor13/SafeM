/**
 * AEGIS Equipment Hooks
 * React hooks for equipment management with Firebase
 */

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Equipment,
  EquipmentFilters,
  EquipmentStats,
  Location,
  LocationFilters,
  isInspectionOverdue,
  isInspectionDueSoon,
} from '../types/equipment.types';
import { SafetyDomain } from '../types/safety';

// ============================================
// 🔥 Collection Names
// ============================================

const EQUIPMENT_COLLECTION = 'equipment';
const LOCATIONS_COLLECTION = 'locations';

// ============================================
// 📦 useEquipment Hook
// ============================================

interface UseEquipmentOptions {
  clientId?: string;
  filters?: EquipmentFilters;
  realtime?: boolean;
}

interface UseEquipmentReturn {
  equipment: Equipment[];
  loading: boolean;
  error: Error | null;
  stats: EquipmentStats;
  addEquipment: (data: Partial<Equipment>) => Promise<string>;
  updateEquipment: (id: string, data: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useEquipment(options: UseEquipmentOptions = {}): UseEquipmentReturn {
  const { clientId, filters, realtime = true } = options;
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Build query constraints
  const buildConstraints = useCallback((): QueryConstraint[] => {
    const constraints: QueryConstraint[] = [];
    
    if (clientId) {
      constraints.push(where('clientId', '==', clientId));
    }
    if (filters?.domain) {
      constraints.push(where('domain', '==', filters.domain));
    }
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.locationId) {
      constraints.push(where('locationId', '==', filters.locationId));
    }
    if (filters?.equipmentTypeId) {
      constraints.push(where('equipmentTypeId', '==', filters.equipmentTypeId));
    }
    
    // Always filter out deleted
    constraints.push(where('isDeleted', '!=', true));
    
    // Order by name
    constraints.push(orderBy('name'));
    
    return constraints;
  }, [clientId, filters]);

  // Fetch equipment
  useEffect(() => {
    if (!clientId && !filters?.clientId) {
      setEquipment([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, EQUIPMENT_COLLECTION),
      ...buildConstraints()
    );

    if (realtime) {
      // Realtime subscription
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: Equipment[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
          } as Equipment));
          
          // Apply client-side filters
          let filtered = items;
          if (filters?.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(e =>
              e.name.toLowerCase().includes(term) ||
              e.serialNumber?.toLowerCase().includes(term) ||
              e.internalId?.toLowerCase().includes(term)
            );
          }
          if (filters?.inspectionOverdue) {
            filtered = filtered.filter(isInspectionOverdue);
          }
          if (filters?.inspectionDueSoon) {
            filtered = filtered.filter(e => 
              isInspectionDueSoon(e, filters.inspectionDueSoon)
            );
          }
          
          setEquipment(filtered);
          setLoading(false);
        },
        (err) => {
          console.error('Equipment fetch error:', err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [clientId, filters, buildConstraints, realtime, refreshKey]);

  // Calculate stats
  const stats: EquipmentStats = {
    total: equipment.length,
    byStatus: {} as Record<string, number>,
    byDomain: {} as Record<SafetyDomain, number>,
    inspectionOverdue: equipment.filter(isInspectionOverdue).length,
    inspectionDueSoon: equipment.filter(e => isInspectionDueSoon(e, 30)).length,
    requireingCertification: equipment.filter(e => !!e.certificateNumber).length,
  };

  equipment.forEach(e => {
    stats.byStatus[e.status] = (stats.byStatus[e.status] || 0) + 1;
    stats.byDomain[e.domain] = (stats.byDomain[e.domain] || 0) + 1;
  });

  // Add equipment
  const addEquipment = async (data: Partial<Equipment>): Promise<string> => {
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isDeleted: false,
    };
    
    const docRef = await addDoc(collection(db, EQUIPMENT_COLLECTION), docData);
    return docRef.id;
  };

  // Update equipment
  const updateEquipment = async (id: string, data: Partial<Equipment>): Promise<void> => {
    const docRef = doc(db, EQUIPMENT_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  // Delete equipment (soft delete)
  const deleteEquipment = async (id: string): Promise<void> => {
    const docRef = doc(db, EQUIPMENT_COLLECTION, id);
    await updateDoc(docRef, {
      isDeleted: true,
      updatedAt: serverTimestamp(),
    });
  };

  // Refresh
  const refresh = () => setRefreshKey(k => k + 1);

  return {
    equipment,
    loading,
    error,
    stats,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    refresh,
  };
}

// ============================================
// 📍 useLocations Hook
// ============================================

interface UseLocationsOptions {
  clientId?: string;
  parentId?: string;
  filters?: LocationFilters;
}

interface UseLocationsReturn {
  locations: Location[];
  loading: boolean;
  error: Error | null;
  addLocation: (data: Partial<Location>) => Promise<string>;
  updateLocation: (id: string, data: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  getLocationPath: (locationId: string) => string;
}

export function useLocations(options: UseLocationsOptions = {}): UseLocationsReturn {
  const { clientId, parentId, filters } = options;
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch locations
  useEffect(() => {
    if (!clientId) {
      setLocations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const constraints: QueryConstraint[] = [
      where('clientId', '==', clientId),
      where('isDeleted', '!=', true),
      orderBy('name'),
    ];

    if (parentId !== undefined) {
      constraints.splice(1, 0, where('parentId', '==', parentId || null));
    }
    
    if (filters?.level) {
      constraints.splice(1, 0, where('level', '==', filters.level));
    }

    const q = query(collection(db, LOCATIONS_COLLECTION), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Location[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data()),
        } as Location));
        
        // Apply search filter
        let filtered = items;
        if (filters?.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filtered = filtered.filter(l =>
            l.name.toLowerCase().includes(term) ||
            l.code?.toLowerCase().includes(term)
          );
        }
        
        setLocations(filtered);
        setLoading(false);
      },
      (err) => {
        console.error('Locations fetch error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [clientId, parentId, filters]);

  // Add location
  const addLocation = async (data: Partial<Location>): Promise<string> => {
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isDeleted: false,
    };
    
    const docRef = await addDoc(collection(db, LOCATIONS_COLLECTION), docData);
    return docRef.id;
  };

  // Update location
  const updateLocation = async (id: string, data: Partial<Location>): Promise<void> => {
    const docRef = doc(db, LOCATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  // Delete location
  const deleteLocation = async (id: string): Promise<void> => {
    const docRef = doc(db, LOCATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      isDeleted: true,
      updatedAt: serverTimestamp(),
    });
  };

  // Get location path (breadcrumb)
  const getLocationPath = (locationId: string): string => {
    const parts: string[] = [];
    let current = locations.find(l => l.id === locationId);
    
    while (current) {
      parts.unshift(current.name);
      current = locations.find(l => l.id === current?.parentId);
    }
    
    return parts.join(' > ');
  };

  return {
    locations,
    loading,
    error,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationPath,
  };
}

// ============================================
// 🔧 Utility: Convert Timestamps
// ============================================

function convertTimestamps(data: any): any {
  const converted = { ...data };
  
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  
  return converted;
}

// ============================================
// 📊 useEquipmentStats Hook
// ============================================

interface UseEquipmentStatsOptions {
  clientId?: string;
}

export function useEquipmentStats(options: UseEquipmentStatsOptions = {}) {
  const { equipment, loading, stats } = useEquipment({
    clientId: options.clientId,
  });

  // Additional computed stats
  const domainBreakdown = Object.entries(stats.byDomain).map(([domain, count]) => ({
    domain,
    count,
    percentage: Math.round((count / stats.total) * 100) || 0,
  }));

  const statusBreakdown = Object.entries(stats.byStatus).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round((count / stats.total) * 100) || 0,
  }));

  return {
    loading,
    stats: {
      ...stats,
      domainBreakdown,
      statusBreakdown,
    },
  };
}
