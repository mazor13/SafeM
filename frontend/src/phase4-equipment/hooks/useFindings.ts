/**
 * AEGIS Finding Hooks
 * React hooks for finding management with Firebase
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
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Finding,
  FindingFilters,
  FindingStats,
  FindingStatus,
  calculateFindingStats,
  isOverdue,
} from '../components/FindingTracker';

// ============================================
// 🔥 Collection Name
// ============================================

const FINDINGS_COLLECTION = 'findings';

// ============================================
// 📋 useFindings Hook
// ============================================

interface UseFindingsOptions {
  clientId?: string;
  equipmentId?: string;
  inspectionId?: string;
  filters?: FindingFilters;
  realtime?: boolean;
}

interface UseFindingsReturn {
  findings: Finding[];
  loading: boolean;
  error: Error | null;
  stats: FindingStats;
  addFinding: (data: Partial<Finding>) => Promise<string>;
  updateFinding: (id: string, data: Partial<Finding>) => Promise<void>;
  updateStatus: (id: string, status: FindingStatus, resolution?: string) => Promise<void>;
  refresh: () => void;
}

export function useFindings(options: UseFindingsOptions = {}): UseFindingsReturn {
  const { clientId, equipmentId, inspectionId, filters, realtime = true } = options;
  
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Build query constraints
  const buildConstraints = useCallback((): QueryConstraint[] => {
    const constraints: QueryConstraint[] = [];
    
    if (clientId) {
      constraints.push(where('clientId', '==', clientId));
    }
    if (equipmentId) {
      constraints.push(where('equipmentId', '==', equipmentId));
    }
    if (inspectionId) {
      constraints.push(where('inspectionId', '==', inspectionId));
    }
    if (filters?.severity) {
      constraints.push(where('severity', '==', filters.severity));
    }
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.assignedTo) {
      constraints.push(where('assignedTo', '==', filters.assignedTo));
    }
    
    // Order by found date descending
    constraints.push(orderBy('foundDate', 'desc'));
    
    return constraints;
  }, [clientId, equipmentId, inspectionId, filters]);

  // Fetch findings
  useEffect(() => {
    if (!clientId && !equipmentId && !inspectionId) {
      setFindings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, FINDINGS_COLLECTION),
      ...buildConstraints()
    );

    if (realtime) {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let items: Finding[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
          } as Finding));
          
          // Client-side filters
          if (filters?.overdue) {
            items = items.filter(isOverdue);
          }
          if (filters?.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            items = items.filter(f =>
              f.title.toLowerCase().includes(term) ||
              f.description.toLowerCase().includes(term)
            );
          }
          
          setFindings(items);
          setLoading(false);
        },
        (err) => {
          console.error('Findings fetch error:', err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [clientId, equipmentId, inspectionId, filters, buildConstraints, realtime, refreshKey]);

  // Calculate stats
  const stats = calculateFindingStats(findings);

  // Add finding
  const addFinding = async (data: Partial<Finding>): Promise<string> => {
    const docData = {
      ...data,
      foundDate: data.foundDate || serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, FINDINGS_COLLECTION), docData);
    return docRef.id;
  };

  // Update finding
  const updateFinding = async (id: string, data: Partial<Finding>): Promise<void> => {
    const docRef = doc(db, FINDINGS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  // Update status with optional resolution
  const updateStatus = async (
    id: string, 
    status: FindingStatus, 
    resolution?: string
  ): Promise<void> => {
    const updates: any = {
      status,
      updatedAt: serverTimestamp(),
    };
    
    if (status === 'closed') {
      updates.closedDate = serverTimestamp();
    }
    
    if (resolution) {
      updates.resolution = resolution;
    }
    
    const docRef = doc(db, FINDINGS_COLLECTION, id);
    await updateDoc(docRef, updates);
  };

  // Refresh
  const refresh = () => setRefreshKey(k => k + 1);

  return {
    findings,
    loading,
    error,
    stats,
    addFinding,
    updateFinding,
    updateStatus,
    refresh,
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
// 📊 useFindingStats Hook
// ============================================

interface UseFindingStatsOptions {
  clientId?: string;
  dateRange?: { start: Date; end: Date };
}

export function useFindingStats(options: UseFindingStatsOptions = {}) {
  const { findings, loading, stats } = useFindings({
    clientId: options.clientId,
  });

  // Additional computed stats
  const openByAge = findings
    .filter(f => f.status === 'open' || f.status === 'in_progress')
    .reduce((acc, f) => {
      const days = Math.floor(
        (new Date().getTime() - new Date(f.foundDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (days <= 7) acc.thisWeek++;
      else if (days <= 30) acc.thisMonth++;
      else if (days <= 90) acc.lastQuarter++;
      else acc.older++;
      
      return acc;
    }, { thisWeek: 0, thisMonth: 0, lastQuarter: 0, older: 0 });

  return {
    loading,
    stats: {
      ...stats,
      openByAge,
    },
  };
}
