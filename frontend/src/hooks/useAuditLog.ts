// ===========================================
// AEGIS - useAuditLog Hook (FIXED)
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  addDoc,
  Timestamp,
  onSnapshot,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { 
  AuditLog, 
  AuditAction, 
  AuditEntityType 
} from '../types/safety';

// ===========================================
// TYPES
// ===========================================

interface UseAuditLogOptions {
  entityType?: AuditEntityType;
  entityId?: string;
  tenantId?: string;
  userId?: string;
  action?: AuditAction;
  pageSize?: number;
  realtime?: boolean;
}

interface UseAuditLogReturn {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

interface LogActionParams {
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityName?: string;
  details?: Record<string, any>;
  tenantId?: string;
  clientId?: string;
}

// ===========================================
// CONSTANTS
// ===========================================

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  created: 'נוצר',
  updated: 'עודכן',
  deleted: 'נמחק',
  viewed: 'נצפה',
  status_changed: 'סטטוס השתנה',
  approved: 'אושר',
  rejected: 'נדחה',
  submitted: 'הוגש',
  assigned: 'הוקצה',
  reassigned: 'הוקצה מחדש',
  escalated: 'הועלה דרג',
  reminder_sent: 'תזכורת נשלחה',
  login: 'התחברות',
  logout: 'התנתקות',
  password_changed: 'סיסמה שונתה',
  file_uploaded: 'קובץ הועלה',
  file_downloaded: 'קובץ הורד',
  file_deleted: 'קובץ נמחק',
  exported: 'יוצא',
  imported: 'יובא',
  comment_added: 'תגובה נוספה',
  email_sent: 'אימייל נשלח',
  sms_sent: 'SMS נשלח',
  whatsapp_sent: 'וואטסאפ נשלח',
};

export const ENTITY_TYPE_LABELS: Record<AuditEntityType, string> = {
  tenant: 'לקוח',
  contact: 'איש קשר',
  user: 'משתמש',
  lead: 'ליד',
  opportunity: 'הזדמנות',
  safety_file: 'תיק בטיחות',
  inspection: 'ביקורת',
  finding: 'ליקוי',
  template: 'תבנית',
  invoice: 'חשבונית',
  training: 'הדרכה',
  document: 'מסמך',
};

// ===========================================
// HOOK: useAuditLog
// ===========================================

export function useAuditLog(options: UseAuditLogOptions = {}): UseAuditLogReturn {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);

  const { 
    entityType, 
    entityId, 
    tenantId, 
    userId,
    action,
    pageSize = 20, 
    realtime = false 
  } = options;

  // Build query
  const buildQuery = useCallback(() => {
    let q = query(
      collection(firestore, 'auditLogs'),
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    );

    if (entityType) {
      q = query(q, where('entityType', '==', entityType));
    }

    if (entityId) {
      q = query(q, where('entityId', '==', entityId));
    }

    if (tenantId) {
      q = query(q, where('tenantId', '==', tenantId));
    }

    if (userId) {
      q = query(q, where('userId', '==', userId));
    }

    if (action) {
      q = query(q, where('action', '==', action));
    }

    return q;
  }, [entityType, entityId, tenantId, userId, action, pageSize]);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = buildQuery();
      const snapshot = await getDocs(q);

      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as AuditLog[];

      setLogs(logsData);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);
    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [buildQuery, pageSize]);

  // Load more
  const loadMore = useCallback(async () => {
    if (!hasMore || !lastDoc) return;

    try {
      const q = query(
        buildQuery(),
        startAfter(lastDoc)
      );

      const snapshot = await getDocs(q);

      const newLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as AuditLog[];

      setLogs(prev => [...prev, ...newLogs]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);
    } catch (err: any) {
      console.error('Error loading more audit logs:', err);
      setError(err.message);
    }
  }, [buildQuery, hasMore, lastDoc, pageSize]);

  // Real-time or one-time fetch
  useEffect(() => {
    if (realtime) {
      const q = buildQuery();
      const unsub = onSnapshot(q, 
        (snapshot) => {
          const logsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as AuditLog[];

          setLogs(logsData);
          setLoading(false);
        },
        (err) => {
          console.error('Error in audit log subscription:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsub();
    } else {
      fetchLogs();
    }
  }, [buildQuery, fetchLogs, realtime]);

  return {
    logs,
    loading,
    error,
    hasMore,
    loadMore,
  };
}

// ===========================================
// HOOK: useEntityHistory (Convenience)
// ===========================================

export function useEntityHistory(
  entityType: AuditEntityType,
  entityId: string | undefined
) {
  return useAuditLog({
    entityType,
    entityId,
    pageSize: 100,
    realtime: false,
  });
}

// ===========================================
// HELPER: Remove undefined values from object
// ===========================================

function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key as keyof T] = value;
    }
  }
  return result;
}

// ===========================================
// LOG ACTION FUNCTION
// ===========================================

/**
 * Log an action to the audit log
 * 
 * @example
 * await logAction({
 *   action: 'created',
 *   entityType: 'tenant',
 *   entityId: 'abc123',
 *   entityName: 'רול פרופיל בע"מ',
 *   details: { notes: 'לקוח חדש' }
 * });
 */
export async function logAction(
  params: LogActionParams,
  currentUser: { uid: string; displayName?: string; email?: string } | null
): Promise<string> {
  const {
    action,
    entityType,
    entityId,
    entityName,
    details,
    tenantId,
    clientId,
  } = params;

  // Build log entry and remove undefined values
  const logEntry = removeUndefined({
    timestamp: Timestamp.now(),
    
    // מי
    userId: currentUser?.uid || 'system',
    userName: currentUser?.displayName || 'מערכת',
    userEmail: currentUser?.email || null,  // Use null instead of undefined
    userType: currentUser ? 'admin' : 'system',
    
    // מה
    action,
    
    // על מה
    entityType,
    entityId,
    entityName: entityName || null,
    
    // פרטים
    details: details || null,
    
    // קונטקסט
    tenantId: tenantId || null,
    clientId: clientId || null,
  });

  const docRef = await addDoc(collection(firestore, 'auditLogs'), logEntry);
  
  return docRef.id;
}

// ===========================================
// HELPER: LOG WITH CHANGES DETECTION
// ===========================================

/**
 * Log an update action with automatic change detection
 * 
 * @example
 * await logUpdate(
 *   'tenant',
 *   'abc123',
 *   'רול פרופיל',
 *   { name: 'Old Name', status: 'active' },
 *   { name: 'New Name', status: 'active' },
 *   currentUser
 * );
 */
export async function logUpdate(
  entityType: AuditEntityType,
  entityId: string,
  entityName: string,
  previousData: Record<string, any>,
  newData: Record<string, any>,
  currentUser: { uid: string; displayName?: string; email?: string } | null,
  tenantId?: string
): Promise<string | null> {
  // Detect changes
  const changes: Record<string, { from: any; to: any }> = {};
  
  const allKeys = new Set([
    ...Object.keys(previousData),
    ...Object.keys(newData),
  ]);

  for (const key of allKeys) {
    // Skip internal fields
    if (['updatedAt', 'createdAt', 'id'].includes(key)) continue;
    
    const prev = previousData[key];
    const next = newData[key];
    
    // Simple comparison (doesn't handle deep objects well)
    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      changes[key] = { from: prev, to: next };
    }
  }

  // Don't log if no changes
  if (Object.keys(changes).length === 0) {
    return null;
  }

  return logAction(
    {
      action: 'updated',
      entityType,
      entityId,
      entityName,
      details: { changes },
      tenantId,
    },
    currentUser
  );
}

// ===========================================
// HELPER: LOG STATUS CHANGE
// ===========================================

/**
 * Log a status change
 * 
 * @example
 * await logStatusChange(
 *   'finding',
 *   'abc123',
 *   'שילוט אזהרה דהוי',
 *   'open',
 *   'closed',
 *   currentUser,
 *   'tenant123'
 * );
 */
export async function logStatusChange(
  entityType: AuditEntityType,
  entityId: string,
  entityName: string,
  previousStatus: string,
  newStatus: string,
  currentUser: { uid: string; displayName?: string; email?: string } | null,
  tenantId?: string
): Promise<string> {
  return logAction(
    {
      action: 'status_changed',
      entityType,
      entityId,
      entityName,
      details: {
        previousValue: previousStatus,
        newValue: newStatus,
      },
      tenantId,
    },
    currentUser
  );
}

// ===========================================
// FORMAT HELPERS
// ===========================================

/**
 * Format an audit log entry for display
 */
export function formatAuditLogMessage(log: AuditLog): string {
  const entityLabel = ENTITY_TYPE_LABELS[log.entityType] || log.entityType;
  const actionLabel = AUDIT_ACTION_LABELS[log.action] || log.action;
  const entityName = log.entityName ? ` "${log.entityName}"` : '';
  
  return `${entityLabel}${entityName} ${actionLabel}`;
}

/**
 * Format timestamp for display
 */
export function formatAuditTimestamp(timestamp: any): string {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'עכשיו';
  if (diffMins < 60) return `לפני ${diffMins} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  
  return date.toLocaleDateString('he-IL');
}