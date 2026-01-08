import { useEffect, useState, useRef, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  type QueryConstraint,
  type DocumentData,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { useUIStore } from '../store/uiStore';

export type Inspection = {
  id: string;
  client?: string;
  clientId?: string;
  clientName?: string;
  facilityId?: string;  // ✅ Added for facility-based permissions
  status?: string;
  signed?: boolean;
  filePath?: string;
  keyVersion?: string;
  createdAt?: Date | null;
  [k: string]: any;
};

// ✅ Added options interface for filtering
interface UseInspectionsOptions {
  clientId?: string;
  facilityId?: string;
  facilityIds?: string[];
  pageSize?: number;
}

export function useInspections(optionsOrPageSize: UseInspectionsOptions | number = 25) {
  // Support both old signature (number) and new signature (options object)
  const options: UseInspectionsOptions = typeof optionsOrPageSize === 'number' 
    ? { pageSize: optionsOrPageSize }
    : optionsOrPageSize;
  
  const { clientId, facilityId, facilityIds, pageSize = 25 } = options;
  
  const user = useUIStore((s) => s.user);
  
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubRef = useRef<Unsubscribe | null>(null);

  const startListener = useCallback(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    // אם אין משתמש - לא מנסים אפילו לגשת ל-DB
    if (!user) {
      setInspections([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const colRef = collection(firestore, 'inspections');
      
      // ✅ Build query constraints
      const constraints: QueryConstraint[] = [];
      
      if (clientId) {
        constraints.push(where('clientId', '==', clientId));
      }
      
      // ✅ Filter by single facility
      if (facilityId) {
        constraints.push(where('facilityId', '==', facilityId));
      }
      
      // ✅ Filter by multiple facilities (for portal users)
      if (facilityIds && facilityIds.length > 0 && !facilityId) {
        if (facilityIds.length <= 10) {
          constraints.push(where('facilityId', 'in', facilityIds));
        }
        // If more than 10, we'll filter client-side
      }
      
      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(pageSize));
      
      const q = query(colRef, ...constraints);

      unsubRef.current = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          let items: Inspection[] = snapshot.docs.map((d) => {
            const data = d.data();
            const created = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : null);
            const signed = Boolean(data.signature || data.keyVersion || data.signed);
            
            return {
              id: d.id,
              client: data.client ?? data.clientName ?? data.clientId ?? '—',
              clientId: data.clientId,
              clientName: data.clientName ?? data.client ?? data.clientId,
              facilityId: data.facilityId,  // ✅ Include facilityId
              status: data.status ?? 'unknown',
              signed,
              filePath: data.filePath ?? null,
              keyVersion: data.keyVersion ?? null,
              createdAt: created,
              ...data,
            };
          });
          
          // ✅ Client-side filter for facilityIds > 10
          if (facilityIds && facilityIds.length > 10 && !facilityId) {
            items = items.filter(i => i.facilityId && facilityIds.includes(i.facilityId));
          }
          
          setInspections(items);
          setLoading(false);
        },
        (err) => {
          console.error('Snapshot error:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Listener failed:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  }, [user, clientId, facilityId, facilityIds, pageSize]);

  useEffect(() => {
    startListener();
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
      }
    };
  }, [startListener]);

  return { inspections, loading, error, refresh: startListener };
}
