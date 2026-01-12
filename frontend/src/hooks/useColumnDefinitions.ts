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
} from 'firebase/firestore';
import { firestore } from '../firebase';
import {
  ColumnDefinition,
  ColumnType,
  EntityType,
  CreateColumnInput,
  UpdateColumnInput,
  ColumnSettings,
  TextColumnSettings,
  NumberColumnSettings,
  StatusColumnSettings,
  PersonColumnSettings,
  DateColumnSettings,
  PriorityColumnSettings,
  FileColumnSettings,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_PRIORITY_LEVELS,
  DEFAULT_STATUS_OPTIONS,
} from '../types/columns';
import { useAuth } from '../providers/AuthProvider';

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
  createColumn: (data: Omit<CreateColumnInput, 'entityType' | 'tenantId' | 'order'>) => Promise<string>;
  updateColumn: (id: string, data: UpdateColumnInput) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;
  reorderColumns: (columnIds: string[]) => Promise<void>;
  duplicateColumn: (id: string) => Promise<string>;
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

const getDefaultSettings = (type: ColumnType): ColumnSettings => {
  switch (type) {
    case 'text':
      return { placeholder: '', maxLength: 500, multiline: false } as TextColumnSettings;
    case 'number':
      return { min: undefined, max: undefined, decimals: 0, unit: '', showUnit: false, format: 'number' } as NumberColumnSettings;
    case 'status':
      return { options: DEFAULT_STATUS_OPTIONS, defaultOptionId: 'todo' } as StatusColumnSettings;
    case 'person':
      return { allowMultiple: false, allowedRoles: [] } as PersonColumnSettings;
    case 'date':
      return { includeTime: false, showRelative: false } as DateColumnSettings;
    case 'priority':
      return { levels: DEFAULT_PRIORITY_LEVELS, defaultLevel: 'medium' } as PriorityColumnSettings;
    case 'file':
      return { allowedTypes: ['image/*', 'application/pdf'], maxSize: 10485760, maxFiles: 5 } as FileColumnSettings;
    default:
      return {} as TextColumnSettings;
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

  const tenantId = user?.tenantId || user?.uid || '';

  // Computed columns
  const systemColumns = useMemo(
    () => columns.filter(col => col.isSystem),
    [columns]
  );

  const customColumns = useMemo(
    () => columns.filter(col => !col.isSystem),
    [columns]
  );

  // Build query
  const buildQuery = useCallback(() => {
    const colRef = collection(firestore, COLLECTION_NAME);
    const constraints = [
      where('tenantId', '==', tenantId),
      where('entityType', '==', entityType),
      orderBy('order', 'asc'),
    ];
    return query(colRef, ...constraints);
  }, [tenantId, entityType]);

  // Fetch columns
  const fetchColumns = useCallback(async () => {
    if (!tenantId) {
      setColumns([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const q = buildQuery();
      const snapshot = await getDocs(q);
      
      const fetchedColumns: ColumnDefinition[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as ColumnDefinition[];

      const filteredColumns = includeHidden 
        ? fetchedColumns 
        : fetchedColumns.filter(col => col.visible !== false);

      setColumns(filteredColumns);
    } catch (err) {
      console.error('Error fetching columns:', err);
      setError('שגיאה בטעינת העמודות');
    } finally {
      setLoading(false);
    }
  }, [buildQuery, tenantId, includeHidden]);

  // Real-time listener
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
    const q = buildQuery();
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedColumns: ColumnDefinition[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as ColumnDefinition[];

        const filteredColumns = includeHidden 
          ? fetchedColumns 
          : fetchedColumns.filter(col => col.visible !== false);

        setColumns(filteredColumns);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Realtime error:', err);
        setError('שגיאה בהאזנה לשינויים');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [buildQuery, tenantId, realtime, includeHidden, fetchColumns]);

  // Create column
  const createColumn = useCallback(async (
    data: Omit<CreateColumnInput, 'entityType' | 'tenantId' | 'order'>
  ): Promise<string> => {
    if (!tenantId) throw new Error('לא מחובר');

    const maxOrder = columns.length > 0 
      ? Math.max(...columns.map(c => c.order)) + 1 
      : 0;

    const columnData: Omit<ColumnDefinition, 'id'> = {
      ...data,
      entityType,
      tenantId,
      order: maxOrder,
      width: data.width || DEFAULT_COLUMN_WIDTH[data.type],
      settings: data.settings || getDefaultSettings(data.type),
      visible: data.visible ?? true,
      required: data.required ?? false,
      isSystem: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user?.uid || '',
    };

    const colRef = collection(firestore, COLLECTION_NAME);
    const docRef = await addDoc(colRef, {
      ...columnData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Optimistic update
    if (!realtime) {
      setColumns(prev => [...prev, { ...columnData, id: docRef.id }]);
    }

    return docRef.id;
  }, [tenantId, entityType, columns, user, realtime]);

  // Update column
  const updateColumn = useCallback(async (
    id: string,
    data: UpdateColumnInput
  ): Promise<void> => {
    const docRef = doc(firestore, COLLECTION_NAME, id);
    
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    // Optimistic update
    const previousColumns = [...columns];
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, ...data, updatedAt: new Date() } : col
    ));

    try {
      await updateDoc(docRef, updateData);
    } catch (err) {
      // Rollback on error
      setColumns(previousColumns);
      throw err;
    }
  }, [columns]);

  // Delete column
  const deleteColumn = useCallback(async (id: string): Promise<void> => {
    const column = columns.find(c => c.id === id);
    if (column?.isSystem) {
      throw new Error('לא ניתן למחוק עמודת מערכת');
    }

    const docRef = doc(firestore, COLLECTION_NAME, id);
    
    // Optimistic update
    const previousColumns = [...columns];
    setColumns(prev => prev.filter(col => col.id !== id));

    try {
      await deleteDoc(docRef);
    } catch (err) {
      setColumns(previousColumns);
      throw err;
    }
  }, [columns]);

  // Reorder columns
  const reorderColumns = useCallback(async (columnIds: string[]): Promise<void> => {
    const batch = writeBatch(firestore);
    
    columnIds.forEach((id, index) => {
      const docRef = doc(firestore, COLLECTION_NAME, id);
      batch.update(docRef, { 
        order: index,
        updatedAt: Timestamp.now(),
      });
    });

    // Optimistic update
    const previousColumns = [...columns];
    setColumns(prev => {
      const reordered = [...prev];
      columnIds.forEach((id, index) => {
        const col = reordered.find(c => c.id === id);
        if (col) col.order = index;
      });
      return reordered.sort((a, b) => a.order - b.order);
    });

    try {
      await batch.commit();
    } catch (err) {
      setColumns(previousColumns);
      throw err;
    }
  }, [columns]);

  // Duplicate column
  const duplicateColumn = useCallback(async (id: string): Promise<string> => {
    const column = columns.find(c => c.id === id);
    if (!column) throw new Error('עמודה לא נמצאה');

    const newColumnData: Omit<CreateColumnInput, 'entityType' | 'tenantId' | 'order'> = {
      type: column.type,
      title: `${column.title} (עותק)`,
      width: column.width,
      settings: { ...column.settings },
      visible: column.visible,
      required: false,
    };

    return createColumn(newColumnData);
  }, [columns, createColumn]);

  // Get column by ID
  const getColumnById = useCallback((id: string): ColumnDefinition | undefined => {
    return columns.find(col => col.id === id);
  }, [columns]);

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
    refresh: fetchColumns,
  };
}

// ===========================================
// HOOK: useColumnStats
// ===========================================

export function useColumnStats(entityType: EntityType): ColumnStats & { loading: boolean } {
  const { columns, loading } = useColumnDefinitions({ entityType, realtime: false });

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
