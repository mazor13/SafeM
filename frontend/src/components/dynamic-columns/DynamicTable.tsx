/**
 * DynamicTable Component
 * 
 * Main table component that integrates all dynamic column features.
 * 
 * @package SafeM
 * @module DynamicColumns
 * @issue #117
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useColumnDefinitions } from '../../hooks/useColumnDefinitions';
import { CellFactory } from './CellFactory';
import { ColumnManager } from './ColumnManager';
import { ColumnSettings } from './ColumnSettings';
import { ColumnReorder } from './ColumnReorder';
import type { 
  EntityType, 
  ColumnDefinition, 
  CellValue,
  CreateColumnInput,
  UpdateColumnInput 
} from '../../types/columns';

// ============================================================================
// Types
// ============================================================================

interface RowData {
  id: string;
  [key: string]: CellValue | string;
}

interface DynamicTableProps {
  entityType: EntityType;
  data: RowData[];
  loading?: boolean;
  onCellChange?: (rowId: string, columnId: string, value: CellValue) => void;
  onRowClick?: (rowId: string) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  className?: string;
  emptyMessage?: string;
}

// ============================================================================
// Sub-components
// ============================================================================

const TableSkeleton: React.FC<{ columns: number; rows: number }> = ({ columns, rows }) => (
  <div className="animate-pulse">
    <div className="flex border-b border-gray-200 bg-gray-50">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="flex-1 p-3">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
        </div>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="flex border-b border-gray-100">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div key={colIdx} className="flex-1 p-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p className="text-lg">{message}</p>
  </div>
);

const HeaderCell: React.FC<{
  column: ColumnDefinition;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onMove: (direction: 'left' | 'right') => void;
  onWidthChange: (width: number) => void;
}> = ({
  column,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onMove,
  onWidthChange,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <th
      className="relative px-4 py-3 text-right font-medium text-gray-700 bg-gray-50 border-b border-gray-200 group"
      style={{ width: column.width || 150, minWidth: 80 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate">{column.title}</span>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="הגדרות עמודה"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {showSettings && (
        <div className="absolute top-full left-0 z-50 mt-1">
          <ColumnSettings
            column={column}
            onEdit={() => { onEdit(); setShowSettings(false); }}
            onDelete={() => { onDelete(); setShowSettings(false); }}
            onDuplicate={() => { onDuplicate(); setShowSettings(false); }}
            onToggleVisibility={() => { onToggleVisibility(); setShowSettings(false); }}
            onMoveLeft={isFirst ? undefined : () => { onMove('left'); setShowSettings(false); }}
            onMoveRight={isLast ? undefined : () => { onMove('right'); setShowSettings(false); }}
            onUpdateWidth={onWidthChange}
          />
          {/* Click outside to close */}
          <div 
            className="fixed inset-0 -z-10" 
            onClick={() => setShowSettings(false)} 
          />
        </div>
      )}
    </th>
  );
};

const TableToolbar: React.FC<{
  onAddColumn: () => void;
  onReorderColumns: () => void;
  columnCount: number;
}> = ({ onAddColumn, onReorderColumns, columnCount }) => (
  <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
    <span className="text-sm text-gray-500">{columnCount} עמודות</span>
    <div className="flex items-center gap-2">
      <button
        onClick={onReorderColumns}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        סדר עמודות
      </button>
      <button
        onClick={onAddColumn}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        הוסף עמודה
      </button>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export const DynamicTable: React.FC<DynamicTableProps> = ({
  entityType,
  data,
  loading = false,
  onCellChange,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  className = '',
  emptyMessage = 'אין נתונים להצגה',
}) => {
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showColumnReorder, setShowColumnReorder] = useState(false);
  const [editingColumn, setEditingColumn] = useState<ColumnDefinition | null>(null);

  const {
    columns,
    loading: columnsLoading,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
  } = useColumnDefinitions({ entityType });

  const visibleColumns = useMemo(
    () => columns.filter(col => col.visible !== false),
    [columns]
  );

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    if (selectedRows.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(row => row.id));
    }
  }, [data, selectedRows, onSelectionChange]);

  const handleSelectRow = useCallback((rowId: string) => {
    if (!onSelectionChange) return;
    if (selectedRows.includes(rowId)) {
      onSelectionChange(selectedRows.filter(id => id !== rowId));
    } else {
      onSelectionChange([...selectedRows, rowId]);
    }
  }, [selectedRows, onSelectionChange]);

  // Column action handlers
  const handleEditColumn = useCallback((column: ColumnDefinition) => {
    setEditingColumn(column);
    setShowColumnManager(true);
  }, []);

  const handleDeleteColumn = useCallback(async (columnId: string) => {
    if (window.confirm('האם למחוק את העמודה? פעולה זו לא ניתנת לביטול.')) {
      await deleteColumn(columnId);
    }
  }, [deleteColumn]);

  const handleDuplicateColumn = useCallback(async (column: ColumnDefinition) => {
    const duplicateData = {
      title: `${column.title} (עותק)`,
      type: column.type,
      settings: column.settings,
      visible: column.visible,
      width: column.width,
      required: column.required,
    };
    await createColumn(duplicateData);
  }, [createColumn]);

  const handleToggleVisibility = useCallback(async (column: ColumnDefinition) => {
    await updateColumn(column.id, { visible: !column.visible });
  }, [updateColumn]);

  const handleMoveColumn = useCallback(async (columnId: string, direction: 'left' | 'right') => {
    const currentIndex = columns.findIndex(c => c.id === columnId);
    if (currentIndex === -1) return;
    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= columns.length) return;
    const newOrder = [...columns];
    const [moved] = newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, moved);
    await reorderColumns(newOrder.map(c => c.id));
  }, [columns, reorderColumns]);

  const handleWidthChange = useCallback(async (columnId: string, width: number) => {
    await updateColumn(columnId, { width });
  }, [updateColumn]);

  const handleSaveColumn = useCallback(async (columnData: Partial<CreateColumnInput> | UpdateColumnInput) => {
    if (editingColumn) {
      await updateColumn(editingColumn.id, columnData as UpdateColumnInput);
    } else {
      await createColumn(columnData as Omit<CreateColumnInput, 'entityType' | 'tenantId' | 'order'>);
    }
    setShowColumnManager(false);
    setEditingColumn(null);
  }, [editingColumn, createColumn, updateColumn]);

  const handleReorder = useCallback(async (columnIds: string[]) => {
    await reorderColumns(columnIds);
    setShowColumnReorder(false);
  }, [reorderColumns]);

  const getCellValue = useCallback((row: RowData, column: ColumnDefinition): CellValue | null => {
    const value = row[column.id];
    if (value === undefined || value === null) {
      return null;
    }
    return value as CellValue;
  }, []);

  if (loading || columnsLoading) {
    return (
      <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
        <TableSkeleton columns={5} rows={5} />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <TableToolbar
        onAddColumn={() => { setEditingColumn(null); setShowColumnManager(true); }}
        onReorderColumns={() => setShowColumnReorder(true)}
        columnCount={visibleColumns.length}
      />

      <div className="overflow-x-auto">
        <table className="w-full" dir="rtl">
          <thead>
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {visibleColumns.map((column, index) => (
                <HeaderCell
                  key={column.id}
                  column={column}
                  isFirst={index === 0}
                  isLast={index === visibleColumns.length - 1}
                  onEdit={() => handleEditColumn(column)}
                  onDelete={() => handleDeleteColumn(column.id)}
                  onDuplicate={() => handleDuplicateColumn(column)}
                  onToggleVisibility={() => handleToggleVisibility(column)}
                  onMove={(dir) => handleMoveColumn(column.id, dir)}
                  onWidthChange={(width) => handleWidthChange(column.id, width)}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="p-0">
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.id)}
                  className={`
                    border-b border-gray-100 transition-colors
                    ${onRowClick ? 'cursor-pointer hover:bg-blue-50' : ''}
                    ${selectedRows.includes(row.id) ? 'bg-blue-50' : 'bg-white'}
                  `}
                >
                  {selectable && (
                    <td className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td key={column.id} className="px-4 py-3" style={{ width: column.width || 150 }}>
                      <CellFactory
                        column={column}
                        value={getCellValue(row, column)}
                        onChange={onCellChange ? (value) => onCellChange(row.id, column.id, value) : undefined}
                        isEditing={false}
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Column Manager Modal */}
      <ColumnManager
        isOpen={showColumnManager}
        onClose={() => { setShowColumnManager(false); setEditingColumn(null); }}
        entityType={entityType}
        existingColumn={editingColumn || undefined}
        onSave={handleSaveColumn}
        onDelete={editingColumn ? () => handleDeleteColumn(editingColumn.id) : undefined}
      />

      {/* Column Reorder Modal */}
      {showColumnReorder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">סדר עמודות</h2>
                <button onClick={() => setShowColumnReorder(false)} className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <ColumnReorder
                columns={columns}
                onReorder={handleReorder}
                onUpdateColumn={updateColumn}
                onEditColumn={handleEditColumn}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
