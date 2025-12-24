import { useEffect, useState, useRef, useCallback } from 'react';
import {
  collection,
  query,
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
  clientName?: string;
  status?: string;
  signed?: boolean;
  filePath?: string;
  keyVersion?: string;
  createdAt?: Date | null;
  [k: string]: any;
};

export function useInspections(pageSize = 25) {
  const user = useUIStore((s) => s.user); // עכשיו אנחנו שוב תלויים במשתמש
  
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
      
      const q = query(
        colRef, 
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      unsubRef.current = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const items: Inspection[] = snapshot.docs.map((d) => {
            const data = d.data();
            const created = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : null);
            const signed = Boolean(data.signature || data.keyVersion || data.signed);
            
            return {
              id: d.id,
              client: data.client ?? data.clientName ?? data.clientId ?? '—',
              clientName: data.clientName ?? data.client ?? data.clientId,
              status: data.status ?? 'unknown',
              signed,
              filePath: data.filePath ?? null,
              keyVersion: data.keyVersion ?? null,
              createdAt: created,
              ...data,
            };
          });

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
  }, [user, pageSize]);

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
