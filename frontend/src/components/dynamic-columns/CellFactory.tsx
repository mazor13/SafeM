// ===========================================
// SafeM - CellFactory Component
// Dynamic Entity Engine - Cell Renderer Factory
// ===========================================
import React, { useState, memo, Suspense } from 'react';
import { 
  Calendar, 
  User, 
  FileText, 
  AlertCircle,
  ChevronDown,
  X,
} from 'lucide-react';
import {
  ColumnDefinition,
  ColumnType,
  CellValue,
  TextCellValue,
  NumberCellValue,
  StatusCellValue,
  PersonCellValue,
  DateCellValue,
  PriorityCellValue,
  FileCellValue,
  StatusColumnSettings,
  NumberColumnSettings,
  TextColumnSettings,
  DateColumnSettings,
  PriorityColumnSettings,
  DEFAULT_PRIORITY_LEVELS,
} from '../../types/columns';

// ===========================================
// TYPES
// ===========================================

interface CellFactoryProps {
  column: ColumnDefinition;
  value: CellValue | null;
  onChange?: (value: CellValue) => void;
  isEditing?: boolean;
  disabled?: boolean;
}

interface BaseCellProps<T extends CellValue> {
  column: ColumnDefinition;
  value: T | null;
  onChange?: (value: T) => void;
  isEditing?: boolean;
  disabled?: boolean;
}

// ===========================================
// LOADING SKELETON
// ===========================================

export const CellSkeleton: React.FC<{ width?: number }> = ({ width = 100 }) => (
  <div 
    className="animate-pulse bg-gray-200 rounded h-6" 
    style={{ width: `${width}px` }}
  />
);

// ===========================================
// TEXT CELL
// ===========================================

const TextCell = memo<BaseCellProps<TextCellValue>>(({ 
  column, 
  value, 
  onChange, 
  isEditing,
  disabled 
}) => {
  const settings = column.settings as TextColumnSettings | undefined;
  const textValue = value?.value ?? '';

  if (isEditing && !disabled) {
    if (settings?.multiline) {
      return (
        <textarea
          value={textValue}
          onChange={(e) => onChange?.({ type: 'text', value: e.target.value })}
          placeholder={settings?.placeholder || 'הזן טקסט...'}
          maxLength={settings?.maxLength}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      );
    }
    return (
      <input
        type="text"
        value={textValue}
        onChange={(e) => onChange?.({ type: 'text', value: e.target.value })}
        placeholder={settings?.placeholder || 'הזן טקסט...'}
        maxLength={settings?.maxLength}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }

  return (
    <span className="text-sm text-gray-900 truncate" title={textValue}>
      {textValue || <span className="text-gray-400">-</span>}
    </span>
  );
});

TextCell.displayName = 'TextCell';

// ===========================================
// NUMBER CELL
// ===========================================

const NumberCell = memo<BaseCellProps<NumberCellValue>>(({ 
  column, 
  value, 
  onChange, 
  isEditing,
  disabled 
}) => {
  const settings = column.settings as NumberColumnSettings | undefined;
  const numValue = value?.value ?? null;

  const formatNumber = (num: number | null): string => {
    if (num === null) return '';
    
    const formatted = settings?.decimals !== undefined 
      ? num.toFixed(settings.decimals)
      : num.toString();
    
    if (settings?.format === 'currency') {
      return `₪${formatted}`;
    }
    if (settings?.format === 'percentage') {
      return `${formatted}%`;
    }
    if (settings?.unit && settings?.showUnit !== false) {
      return `${formatted} ${settings.unit}`;
    }
    return formatted;
  };

  if (isEditing && !disabled) {
    return (
      <div className="flex items-center gap-1">
        {settings?.unit && settings?.showUnit !== false && (
          <span className="text-gray-500 text-sm">{settings.unit}</span>
        )}
        <input
          type="number"
          value={numValue ?? ''}
          onChange={(e) => {
            const val = e.target.value === '' ? null : parseFloat(e.target.value);
            onChange?.({ type: 'number', value: val });
          }}
          min={settings?.min}
          max={settings?.max}
          step={settings?.decimals ? Math.pow(10, -settings.decimals) : 1}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }

  return (
    <span className="text-sm text-gray-900">
      {numValue !== null ? formatNumber(numValue) : <span className="text-gray-400">-</span>}
    </span>
  );
});

NumberCell.displayName = 'NumberCell';

// ===========================================
// STATUS CELL
// ===========================================

const StatusCell = memo<BaseCellProps<StatusCellValue>>(({ 
  column, 
  value, 
  onChange, 
  isEditing,
  disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = column.settings as StatusColumnSettings | undefined;
  const options = settings?.options || [];
  const currentOption = options.find(opt => opt.id === value?.optionId);

  if (isEditing && !disabled) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded text-sm w-full"
          style={{ backgroundColor: currentOption?.color || '#e5e7eb' }}
        >
          <span className="text-white font-medium truncate">
            {currentOption?.label || 'בחר סטטוס'}
          </span>
          <ChevronDown size={14} className="text-white flex-shrink-0" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onChange?.({ type: 'status', optionId: opt.id });
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-right hover:bg-gray-50 flex items-center gap-2"
              >
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: opt.color }}
                />
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!currentOption) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
      style={{ backgroundColor: currentOption.color }}
    >
      {currentOption.label}
    </span>
  );
});

StatusCell.displayName = 'StatusCell';

// ===========================================
// PERSON CELL
// ===========================================

const PersonCell = memo<BaseCellProps<PersonCellValue>>(({ 
  column, 
  value, 
  onChange, 
  isEditing,
  disabled 
}) => {
  const userIds = value?.userIds || [];
  
  // TODO: Fetch user details from context/hook
  // For now, show placeholder
  const displayUsers = userIds.length > 0 
    ? userIds.map(id => ({ id, name: `משתמש ${id.slice(0, 4)}` }))
    : [];

  if (isEditing && !disabled) {
    return (
      <div className="flex items-center gap-1">
        <User size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">
          {displayUsers.length > 0 
            ? displayUsers.map(u => u.name).join(', ')
            : 'בחר משתמש...'}
        </span>
        {/* TODO: Add user picker dropdown */}
      </div>
    );
  }

  if (displayUsers.length === 0) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <span className="text-white text-xs font-medium">
          {displayUsers[0]?.name?.charAt(0) || '?'}
        </span>
      </div>
      <span className="text-sm text-gray-900 truncate">
        {displayUsers.map(u => u.name).join(', ')}
      </span>
      {displayUsers.length > 1 && (
        <span className="text-xs text-gray-500">+{displayUsers.length - 1}</span>
      )}
    </div>
  );
});

PersonCell.displayName = 'PersonCell';

// ===========================================
// DATE CELL
// ===========================================

const DateCell = memo<BaseCellProps<DateCellValue>>(({ 
  column, 
  value, 
  onChange, 
  isEditing,
  disabled 
}) => {
  const settings = column.settings as DateColumnSettings | undefined;
  const dateValue = value?.value ?? null;

  const formatDate = (isoString: string | null): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (settings?.includeTime) {
      return date.toLocaleString('he-IL');
    }
    return date.toLocaleDateString('he-IL');
  };

  if (isEditing && !disabled) {
    return (
      <input
        type={settings?.includeTime ? 'datetime-local' : 'date'}
        value={dateValue ? dateValue.slice(0, settings?.includeTime ? 16 : 10) : ''}
        onChange={(e) => {
          const newValue = e.target.value ? new Date(e.target.value).toISOString() : null;
          onChange?.({ type: 'date', value: newValue });
        }}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Calendar size={14} className="text-gray-400" />
      <span className="text-sm text-gray-900">
        {dateValue ? formatDate(dateValue) : <span className="text-gray-400">-</span>}
      </span>
    </div>
  );
});

DateCell.displayName = 'DateCell';

// ===========================================
// PRIORITY CELL
// ===========================================

const PriorityCell = memo<BaseCellProps<PriorityCellValue>>(({ 
  column, 
  value, 
  onChange, 
  isEditing,
  disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = column.settings as PriorityColumnSettings | undefined;
  const levels = settings?.levels || DEFAULT_PRIORITY_LEVELS;
  const currentLevel = levels.find(l => l.id === value?.levelId);

  if (isEditing && !disabled) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded text-sm border border-gray-300 w-full"
        >
          {currentLevel ? (
            <>
              <span>{currentLevel.icon}</span>
              <span style={{ color: currentLevel.color }}>{currentLevel.label}</span>
            </>
          ) : (
            <span className="text-gray-400">בחר עדיפות</span>
          )}
          <ChevronDown size={14} className="text-gray-400 mr-auto" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => {
                  onChange?.({ type: 'priority', levelId: level.id });
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-right hover:bg-gray-50 flex items-center gap-2"
              >
                <span>{level.icon}</span>
                <span className="text-sm" style={{ color: level.color }}>
                  {level.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!currentLevel) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  return (
    <div className="flex items-center gap-1">
      <span>{currentLevel.icon}</span>
      <span className="text-sm font-medium" style={{ color: currentLevel.color }}>
        {currentLevel.label}
      </span>
    </div>
  );
});

PriorityCell.displayName = 'PriorityCell';

// ===========================================
// FILE CELL
// ===========================================

const FileCell = memo<BaseCellProps<FileCellValue>>(({ 
  column, 
  value, 
  onChange, 
  isEditing,
  disabled 
}) => {
  const files = value?.files || [];

  if (isEditing && !disabled) {
    return (
      <div className="flex items-center gap-1">
        <FileText size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">
          {files.length > 0 ? `${files.length} קבצים` : 'העלה קובץ...'}
        </span>
        {/* TODO: Add file upload functionality */}
      </div>
    );
  }

  if (files.length === 0) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  return (
    <div className="flex items-center gap-1">
      <FileText size={14} className="text-blue-500" />
      <span className="text-sm text-blue-600 hover:underline cursor-pointer">
        {files.length === 1 ? files[0].name : `${files.length} קבצים`}
      </span>
    </div>
  );
});

FileCell.displayName = 'FileCell';

// ===========================================
// CELL FACTORY (MAIN COMPONENT)
// ===========================================

export const CellFactory: React.FC<CellFactoryProps> = memo(({
  column,
  value,
  onChange,
  isEditing = false,
  disabled = false,
}) => {
  const renderCell = () => {
    switch (column.type) {
      case 'text':
        return (
          <TextCell
            column={column}
            value={value as TextCellValue | null}
            onChange={onChange as ((v: TextCellValue) => void) | undefined}
            isEditing={isEditing}
            disabled={disabled}
          />
        );
      
      case 'number':
        return (
          <NumberCell
            column={column}
            value={value as NumberCellValue | null}
            onChange={onChange as ((v: NumberCellValue) => void) | undefined}
            isEditing={isEditing}
            disabled={disabled}
          />
        );
      
      case 'status':
        return (
          <StatusCell
            column={column}
            value={value as StatusCellValue | null}
            onChange={onChange as ((v: StatusCellValue) => void) | undefined}
            isEditing={isEditing}
            disabled={disabled}
          />
        );
      
      case 'person':
        return (
          <PersonCell
            column={column}
            value={value as PersonCellValue | null}
            onChange={onChange as ((v: PersonCellValue) => void) | undefined}
            isEditing={isEditing}
            disabled={disabled}
          />
        );
      
      case 'date':
        return (
          <DateCell
            column={column}
            value={value as DateCellValue | null}
            onChange={onChange as ((v: DateCellValue) => void) | undefined}
            isEditing={isEditing}
            disabled={disabled}
          />
        );
      
      case 'priority':
        return (
          <PriorityCell
            column={column}
            value={value as PriorityCellValue | null}
            onChange={onChange as ((v: PriorityCellValue) => void) | undefined}
            isEditing={isEditing}
            disabled={disabled}
          />
        );
      
      case 'file':
        return (
          <FileCell
            column={column}
            value={value as FileCellValue | null}
            onChange={onChange as ((v: FileCellValue) => void) | undefined}
            isEditing={isEditing}
            disabled={disabled}
          />
        );
      
      default:
        return (
          <div className="flex items-center gap-1 text-red-500">
            <AlertCircle size={14} />
            <span className="text-sm">סוג לא נתמך</span>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={<CellSkeleton width={column.width} />}>
      <div className="min-h-[28px] flex items-center">
        {renderCell()}
      </div>
    </Suspense>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if these actually change
  return (
    prevProps.column.id === nextProps.column.id &&
    prevProps.value === nextProps.value &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.disabled === nextProps.disabled
  );
});

CellFactory.displayName = 'CellFactory';
export default CellFactory;
