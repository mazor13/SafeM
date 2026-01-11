// ===========================================
// SafeM - useColumnDefinitions Hook
// Dynamic Entity Engine - Column Management
// ===========================================
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
  writeBatch,
  DocumentReference,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import {
  ColumnDefinition,
  ColumnType,
  EntityType,
  CreateColumnInput,
  UpdateColumnInput,
  ColumnSettings,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_PRIORITY_LEVELS,
  DEFAULT_STATUS_OPTIONS,
} from '../types/columns';
import { useAuth } from '../contexts/AuthContext';

// ===========================================
// TYPES
// ===========================================

interface UseColumnDefinitionsOptions {
  entityType: EntityType;
  realtime?: boolean;
  includeHidden?: boolean;
}

interface UseColumnDefinitionsReturn {
  columns: ColumnDefinition[];
  systemColumns: ColumnDefinition[];
  customColumns: ColumnDefinition[];
  loading: boolean;
  error: string | null;
  // CRUD Operations
  createColumn: (data: CreateColumnInput) => Promise<string>;
  updateColumn: (id: string, data: UpdateColumnInput) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;
  // Bulk Operations
  reorderColumns: (columnIds: string[]) => Promise<void>;
  duplicateColumn: (id: string) => Promise<string>;
  // Utilities
  getColumnById: (id: string) => ColumnDefinition | undefined;
  refresh: () => Promise<void>;
}

interface ColumnStats {
  total: number;
  system: number;
  custom: number;
  visible: number;
  hidden: number;
}

// ===========================================
// CONSTANTS
// ===========================================

const COLLECTION_NAME = 'columnDefinitions';

// Default settings per column type
const getDefaultSettings = (type: ColumnType): ColumnSettings => {
  switch (type) {
    case 'text':
      return { placeholder: '', maxLength: 500, multiline: false };
    case 'number':
      return { min: undefined, max: undefined, precision: 0, prefix: '', suffix: '' };
    case 'status':
      return { options: DEFAULT_STATUS_OPTIONS, allowMultiple: false, defaultValue: 'open' };
    case 'person':
      return { allowMultiple: false, roles: [], includeInactive: false };
    case 'date':
      return { includeTime: false, format: 'DD/MM/YYYY', allowPast: true, allowFuture: true };
    case 'priority':
      return { levels: DEFAULT_PRIORITY_LEVELS, defaultLevel: 'medium' };
    case 'file':
      return { allowedTypes: ['image/*', 'application/pdf'], maxSize: 10485760, maxFiles: 5 };
    default:
      return {};
  }
};

// ===========================================
// HOOK: useColumnDefinitions
// ===========================================

export function useColumnDefinitions(
  options: UseColumnDefinitionsOptions
): UseColumnDefinitionsReturn {
  const { entityType, realtime = true, includeHidden = false } = options;
  const { user } = useAuth();
  
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get tenant ID from user
  const tenantId = useMemo(() => user?.tenantId || '', [user]);

  // ===========================================
  // FETCH COLUMNS
  // ===========================================

  const fetchColumns = useCallback(async () => {
    if (!tenantId) {
      setColumns([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const columnsRef = collection(firestore, COLLECTION_NAME);
      const q = query(
        columnsRef,
        where('tenantId', '==', tenantId),
        where('entityType', '==', entityType),
        orderBy('order', 'asc')
      );

      const snapshot = await getDocs(q);
      let columnsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      })) as ColumnDefinition[];

      // Filter hidden columns if needed
      if (!includeHidden) {
        columnsData = columnsData.filter(col => col.visible !== false);
      }

      setColumns(columnsData);
    } catch (err) {
      console.error('Error fetching column definitions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch columns');
    } finally {
      setLoading(false);
    }
  }, [tenantId, entityType, includeHidden]);

  // ===========================================
  // REAL-TIME LISTENER
  // ===========================================

  useEffect(() => {
    if (!tenantId) {
      setColumns([]);
      setLoading(false);
      return;
    }

    if (!realtime) {
      fetchColumns();
      return;
    }

    setLoading(true);
    setError(null);

    const columnsRef = collection(firestore, COLLECTION_NAME);
    const q = query(
      columnsRef,
      where('tenantId', '==', tenantId),
      where('entityType', '==', entityType),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let columnsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
        })) as ColumnDefinition[];

        if (!includeHidden) {
          columnsData = columnsData.filter(col => col.visible !== false);
        }

        setColumns(columnsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error in column definitions listener:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tenantId, entityType, realtime, includeHidden, fetchColumns]);

  // ===========================================
  // COMPUTED VALUES
  // ===========================================

  const systemColumns = useMemo(
    () => columns.filter(col => col.isSystem),
    [columns]
  );

  const customColumns = useMemo(
    () => columns.filter(col => !col.isSystem),
    [columns]
  );

  // ===========================================
  // CREATE COLUMN
  // ===========================================

  const createColumn = useCallback(async (data: CreateColumnInput): Promise<string> => {
    if (!tenantId) {
      throw new Error('No tenant ID available');
    }

    try {
      // Calculate next order
      const maxOrder = columns.reduce((max, col) => Math.max(max, col.order), 0);
      
      const newColumn: Omit<ColumnDefinition, 'id'> = {
        tenantId,
        entityType,
        type: data.type,
        title: data.title,
        width: data.width || DEFAULT_COLUMN_WIDTH,
        order: maxOrder + 1,
        required: data.required || false,
        isSystem: false,
        visible: data.visible !== false,
        settings: data.settings || getDefaultSettings(data.type),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticColumn = { ...newColumn, id: tempId } as ColumnDefinition;
      setColumns(prev => [...prev, optimisticColumn]);

      // Create in Firestore
      const columnsRef = collection(firestore, COLLECTION_NAME);
      const docRef = await addDoc(columnsRef, {
        ...newColumn,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Update with real ID (realtime listener will handle this, but just in case)
      if (!realtime) {
        setColumns(prev => 
          prev.map(col => col.id === tempId ? { ...col, id: docRef.id } : col)
        );
      }

      return docRef.id;
    } catch (err) {
      // Rollback optimistic update
      setColumns(prev => prev.filter(col => !col.id.startsWith('temp-')));
      console.error('Error creating column:', err);
      throw err;
    }
  }, [tenantId, entityType, columns, realtime]);

  // ===========================================
  // UPDATE COLUMN
  // ===========================================

  const updateColumn = useCallback(async (
    id: string,
    data: UpdateColumnInput
  ): Promise<void> => {
    if (!tenantId) {
      throw new Error('No tenant ID available');
    }

    const column = columns.find(col => col.id === id);
    if (!column) {
      throw new Error('Column not found');
    }

    // Prevent modifying system columns (except visibility)
    if (column.isSystem && Object.keys(data).some(key => key !== 'visible' && key !== 'width')) {
      throw new Error('Cannot modify system column');
    }

    try {
      // Optimistic update
      const previousColumns = [...columns];
      setColumns(prev =>
        prev.map(col =>
          col.id === id ? { ...col, ...data, updatedAt: new Date() } : col
        )
      );

      // Update in Firestore
      const docRef = doc(firestore, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      // Rollback on error
      console.error('Error updating column:', err);
      await fetchColumns();
      throw err;
    }
  }, [tenantId, columns, fetchColumns]);

  // ===========================================
  // DELETE COLUMN
  // ===========================================

  const deleteColumn = useCallback(async (id: string): Promise<void> => {
    if (!tenantId) {
      throw new Error('No tenant ID available');
    }

    const column = columns.find(col => col.id === id);
    if (!column) {
      throw new Error('Column not found');
    }

    if (column.isSystem) {
      throw new Error('Cannot delete system column');
    }

    try {
      // Optimistic update
      const previousColumns = [...columns];
      setColumns(prev => prev.filter(col => col.id !== id));

      // Delete from Firestore
      const docRef = doc(firestore, COLLECTION_NAME, id);
      await deleteDoc(docRef);

      // Note: Cell values in entities would need to be cleaned up separately
      // This could be done via a Cloud Function triggered on column deletion
    } catch (err) {
      // Rollback on error
      console.error('Error deleting column:', err);
      await fetchColumns();
      throw err;
    }
  }, [tenantId, columns, fetchColumns]);

  // ===========================================
  // REORDER COLUMNS
  // ===========================================

  const reorderColumns = useCallback(async (columnIds: string[]): Promise<void> => {
    if (!tenantId) {
      throw new Error('No tenant ID available');
    }

    try {
      // Optimistic update
      const reorderedColumns = columnIds
        .map((id, index) => {
          const col = columns.find(c => c.id === id);
          return col ? { ...col, order: index } : null;
        })
        .filter(Boolean) as ColumnDefinition[];

      setColumns(reorderedColumns);

      // Batch update in Firestore
      const batch = writeBatch(firestore);
      
      columnIds.forEach((id, index) => {
        const docRef = doc(firestore, COLLECTION_NAME, id);
        batch.update(docRef, {
          order: index,
          updatedAt: Timestamp.now(),
        });
      });

      await batch.commit();
    } catch (err) {
      console.error('Error reordering columns:', err);
      await fetchColumns();
      throw err;
    }
  }, [tenantId, columns, fetchColumns]);

  // ===========================================
  // DUPLICATE COLUMN
  // ===========================================

  const duplicateColumn = useCallback(async (id: string): Promise<string> => {
    const column = columns.find(col => col.id === id);
    if (!column) {
      throw new Error('Column not found');
    }

    if (column.isSystem) {
      throw new Error('Cannot duplicate system column');
    }

    return createColumn({
      type: column.type,
      title: `${column.title} (העתק)`,
      width: column.width,
      required: column.required,
      visible: column.visible,
      settings: { ...column.settings },
    });
  }, [columns, createColumn]);

  // ===========================================
  // UTILITIES
  // ===========================================

  const getColumnById = useCallback((id: string): ColumnDefinition | undefined => {
    return columns.find(col => col.id === id);
  }, [columns]);

  const refresh = useCallback(async () => {
    await fetchColumns();
  }, [fetchColumns]);

  // ===========================================
  // RETURN
  // ===========================================

  return {
    columns,
    systemColumns,
    customColumns,
    loading,
    error,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    duplicateColumn,
    getColumnById,
    refresh,
  };
}

// ===========================================
// HOOK: useColumnStats
// ===========================================

export function useColumnStats(entityType: EntityType): ColumnStats & { loading: boolean } {
  const { columns, loading } = useColumnDefinitions({ 
    entityType, 
    includeHidden: true,
    realtime: false,
  });

  const stats = useMemo(() => ({
    total: columns.length,
    system: columns.filter(c => c.isSystem).length,
    custom: columns.filter(c => !c.isSystem).length,
    visible: columns.filter(c => c.visible !== false).length,
    hidden: columns.filter(c => c.visible === false).length,
  }), [columns]);

  return { ...stats, loading };
}

export default useColumnDefinitions;
