// ===========================================
// SafeM - ColumnReorder Component
// Dynamic Entity Engine - Drag & Drop Column Reordering
// ===========================================
import React, { useState, useCallback, useRef } from 'react';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Settings,
  Check,
  X,
} from 'lucide-react';
import { ColumnDefinition, UpdateColumnInput } from '../../types/columns';

// ===========================================
// TYPES
// ===========================================

interface ColumnReorderProps {
  columns: ColumnDefinition[];
  onReorder: (columnIds: string[]) => Promise<void>;
  onUpdateColumn?: (id: string, data: UpdateColumnInput) => Promise<void>;
  onEditColumn?: (column: ColumnDefinition) => void;
}

interface DragState {
  draggedId: string | null;
  dragOverId: string | null;
}

// ===========================================
// COLUMN ITEM COMPONENT
// ===========================================

interface ColumnItemProps {
  column: ColumnDefinition;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onToggleVisibility?: () => void;
  onEdit?: () => void;
}

const ColumnItem: React.FC<ColumnItemProps> = ({
  column,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragEnd,
  onToggleVisibility,
  onEdit,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, column.id)}
      onDragOver={(e) => onDragOver(e, column.id)}
      onDragEnd={onDragEnd}
      className={`
        flex items-center gap-2 px-3 py-2 bg-white border rounded-lg
        cursor-grab active:cursor-grabbing
        transition-all duration-150
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isDragOver ? 'border-blue-500 border-2' : 'border-gray-200'}
        ${column.visible === false ? 'bg-gray-50' : ''}
      `}
    >
      {/* Drag Handle */}
      <GripVertical 
        size={16} 
        className="text-gray-400 flex-shrink-0" 
      />
      
      {/* Column Type Icon */}
      <span className="text-lg flex-shrink-0">
        {getColumnTypeIcon(column.type)}
      </span>
      
      {/* Column Title */}
      <span className={`
        flex-1 text-sm truncate
        ${column.visible === false ? 'text-gray-400' : 'text-gray-900'}
      `}>
        {column.title}
        {column.isSystem && (
          <span className="text-xs text-gray-400 mr-1">(מערכת)</span>
        )}
      </span>
      
      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Visibility Toggle */}
        {onToggleVisibility && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title={column.visible === false ? 'הצג עמודה' : 'הסתר עמודה'}
          >
            {column.visible === false ? (
              <EyeOff size={14} className="text-gray-400" />
            ) : (
              <Eye size={14} className="text-gray-600" />
            )}
          </button>
        )}
        
        {/* Edit Button */}
        {onEdit && !column.isSystem && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="הגדרות עמודה"
          >
            <Settings size={14} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

const getColumnTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    text: '📝',
    number: '#️⃣',
    status: '🏷️',
    person: '👤',
    date: '📅',
    priority: '🚩',
    file: '📎',
  };
  return icons[type] || '📋';
};

// ===========================================
// COLUMN REORDER COMPONENT
// ===========================================

export const ColumnReorder: React.FC<ColumnReorderProps> = ({
  columns,
  onReorder,
  onUpdateColumn,
  onEditColumn,
}) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedId: null,
    dragOverId: null,
  });
  const [localColumns, setLocalColumns] = useState<ColumnDefinition[]>(columns);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync with props
  React.useEffect(() => {
    if (!hasChanges) {
      setLocalColumns(columns);
    }
  }, [columns, hasChanges]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragState({ draggedId: id, dragOverId: null });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    setDragState(prev => {
      if (prev.draggedId === id) return prev;
      return { ...prev, dragOverId: id };
    });

    // Reorder locally during drag
    setLocalColumns(prev => {
      const draggedId = dragState.draggedId;
      if (!draggedId || draggedId === id) return prev;

      const draggedIndex = prev.findIndex(c => c.id === draggedId);
      const overIndex = prev.findIndex(c => c.id === id);
      
      if (draggedIndex === -1 || overIndex === -1) return prev;
      if (draggedIndex === overIndex) return prev;

      const newColumns = [...prev];
      const [draggedItem] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(overIndex, 0, draggedItem);
      
      setHasChanges(true);
      return newColumns;
    });
  }, [dragState.draggedId]);

  const handleDragEnd = useCallback(() => {
    setDragState({ draggedId: null, dragOverId: null });
  }, []);

  // Save reorder
  const handleSave = async () => {
    try {
      setSaving(true);
      const columnIds = localColumns.map(c => c.id);
      await onReorder(columnIds);
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving order:', err);
      setLocalColumns(columns); // Revert
    } finally {
      setSaving(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setLocalColumns(columns);
    setHasChanges(false);
  };

  // Toggle visibility
  const handleToggleVisibility = async (column: ColumnDefinition) => {
    if (!onUpdateColumn) return;
    
    try {
      await onUpdateColumn(column.id, { 
        visible: column.visible === false ? true : false 
      });
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          סדר עמודות ({localColumns.length})
        </h3>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              <X size={14} className="inline ml-1" />
              ביטול
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                'שומר...'
              ) : (
                <>
                  <Check size={14} className="inline ml-1" />
                  שמור סדר
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-xs text-gray-500">
        גרור עמודות לשינוי הסדר. לחץ על העין להסתרה/הצגה.
      </p>

      {/* Column List */}
      <div className="space-y-2">
        {localColumns.map((column) => (
          <ColumnItem
            key={column.id}
            column={column}
            isDragging={dragState.draggedId === column.id}
            isDragOver={dragState.dragOverId === column.id}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onToggleVisibility={
              onUpdateColumn 
                ? () => handleToggleVisibility(column) 
                : undefined
            }
            onEdit={
              onEditColumn 
                ? () => onEditColumn(column) 
                : undefined
            }
          />
        ))}
      </div>

      {/* Empty State */}
      {localColumns.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          אין עמודות להציג
        </div>
      )}
    </div>
  );
};

export default ColumnReorder;
