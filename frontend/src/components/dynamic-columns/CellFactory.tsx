// ===========================================
// SafeM - CellFactory Component
// Dynamic Entity Engine - Cell Renderer
// ===========================================
import React, { memo, Suspense, lazy } from 'react';
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
} from '../../types/columns';

// ===========================================
// TYPES
// ===========================================

export type CellMode = 'view' | 'edit';

export interface CellProps<T extends CellValue = CellValue> {
  column: ColumnDefinition;
  value: T | null;
  mode: CellMode;
  onChange?: (value: T | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface CellFactoryProps {
  column: ColumnDefinition;
  value: CellValue | null;
  mode?: CellMode;
  onChange?: (value: CellValue | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

// ===========================================
// LOADING SKELETON
// ===========================================

const CellSkeleton: React.FC<{ width?: number }> = ({ width = 100 }) => (
  <div 
    className="animate-pulse bg-gray-200 rounded h-6"
    style={{ width: `${width}px` }}
  />
);

// ===========================================
// PLACEHOLDER CELLS (will be replaced with actual implementations)
// ===========================================

// Text Cell
const TextCell: React.FC<CellProps<TextCellValue>> = memo(({
  column,
  value,
  mode,
  onChange,
  onBlur,
  disabled,
  className = '',
}) => {
  const settings = column.settings as { placeholder?: string; maxLength?: number; multiline?: boolean };
  
  if (mode === 'view') {
    return (
      <span className={`text-gray-900 truncate ${className}`}>
        {value?.value || <span className="text-gray-400">-</span>}
      </span>
    );
  }

  if (settings?.multiline) {
    return (
      <textarea
        value={value?.value || ''}
        onChange={(e) => onChange?.({ value: e.target.value })}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={settings?.placeholder}
        maxLength={settings?.maxLength}
        className={`w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        rows={2}
      />
    );
  }

  return (
    <input
      type="text"
      value={value?.value || ''}
      onChange={(e) => onChange?.({ value: e.target.value })}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={settings?.placeholder}
      maxLength={settings?.maxLength}
      className={`w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );
});
TextCell.displayName = 'TextCell';

// Number Cell
const NumberCell: React.FC<CellProps<NumberCellValue>> = memo(({
  column,
  value,
  mode,
  onChange,
  onBlur,
  disabled,
  className = '',
}) => {
  const settings = column.settings as { 
    min?: number; 
    max?: number; 
    precision?: number;
    prefix?: string;
    suffix?: string;
  };

  const formatValue = (val: number | undefined): string => {
    if (val === undefined || val === null) return '';
    const formatted = settings?.precision !== undefined 
      ? val.toFixed(settings.precision)
      : val.toString();
    return `${settings?.prefix || ''}${formatted}${settings?.suffix || ''}`;
  };

  if (mode === 'view') {
    return (
      <span className={`text-gray-900 ${className}`}>
        {value?.value !== undefined ? formatValue(value.value) : <span className="text-gray-400">-</span>}
      </span>
    );
  }

  return (
    <input
      type="number"
      value={value?.value ?? ''}
      onChange={(e) => {
        const val = e.target.value === '' ? null : parseFloat(e.target.value);
        onChange?.(val !== null ? { value: val } : null);
      }}
      onBlur={onBlur}
      disabled={disabled}
      min={settings?.min}
      max={settings?.max}
      step={settings?.precision ? Math.pow(10, -settings.precision) : 1}
      className={`w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );
});
NumberCell.displayName = 'NumberCell';

// Status Cell
const StatusCell: React.FC<CellProps<StatusCellValue>> = memo(({
  column,
  value,
  mode,
  onChange,
  disabled,
  className = '',
}) => {
  const settings = column.settings as { 
    options?: Array<{ value: string; label: string; color: string }>;
    allowMultiple?: boolean;
  };
  const options = settings?.options || [];
  const currentOption = options.find(opt => opt.value === value?.value);

  if (mode === 'view') {
    if (!currentOption) {
      return <span className="text-gray-400">-</span>;
    }
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
        style={{ 
          backgroundColor: `${currentOption.color}20`,
          color: currentOption.color,
        }}
      >
        {currentOption.label}
      </span>
    );
  }

  return (
    <select
      value={value?.value || ''}
      onChange={(e) => onChange?.(e.target.value ? { value: e.target.value } : null)}
      disabled={disabled}
      className={`w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      <option value="">בחר סטטוס</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});
StatusCell.displayName = 'StatusCell';

// Person Cell
const PersonCell: React.FC<CellProps<PersonCellValue>> = memo(({
  column,
  value,
  mode,
  onChange,
  disabled,
  className = '',
}) => {
  // TODO: Implement with user selection
  if (mode === 'view') {
    if (!value?.userId) {
      return <span className="text-gray-400">-</span>;
    }
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
          {value.displayName?.charAt(0) || '?'}
        </div>
        <span className="text-gray-900 text-sm">{value.displayName}</span>
      </div>
    );
  }

  return (
    <div className={`text-gray-500 text-sm ${className}`}>
      {value?.displayName || 'בחר משתמש...'}
    </div>
  );
});
PersonCell.displayName = 'PersonCell';

// Date Cell
const DateCell: React.FC<CellProps<DateCellValue>> = memo(({
  column,
  value,
  mode,
  onChange,
  onBlur,
  disabled,
  className = '',
}) => {
  const settings = column.settings as { 
    includeTime?: boolean;
    format?: string;
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    if (settings?.includeTime) {
      return d.toLocaleString('he-IL');
    }
    return d.toLocaleDateString('he-IL');
  };

  const toInputValue = (date: Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    if (settings?.includeTime) {
      return d.toISOString().slice(0, 16);
    }
    return d.toISOString().slice(0, 10);
  };

  if (mode === 'view') {
    return (
      <span className={`text-gray-900 ${className}`}>
        {value?.value ? formatDate(value.value) : <span className="text-gray-400">-</span>}
      </span>
    );
  }

  return (
    <input
      type={settings?.includeTime ? 'datetime-local' : 'date'}
      value={toInputValue(value?.value)}
      onChange={(e) => {
        const val = e.target.value ? new Date(e.target.value) : null;
        onChange?.(val ? { value: val } : null);
      }}
      onBlur={onBlur}
      disabled={disabled}
      className={`w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );
});
DateCell.displayName = 'DateCell';

// Priority Cell
const PriorityCell: React.FC<CellProps<PriorityCellValue>> = memo(({
  column,
  value,
  mode,
  onChange,
  disabled,
  className = '',
}) => {
  const settings = column.settings as { 
    levels?: Array<{ value: string; label: string; color: string; icon?: string }>;
  };
  const levels = settings?.levels || [];
  const currentLevel = levels.find(lvl => lvl.value === value?.level);

  if (mode === 'view') {
    if (!currentLevel) {
      return <span className="text-gray-400">-</span>;
    }
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${className}`}
        style={{ 
          backgroundColor: `${currentLevel.color}20`,
          color: currentLevel.color,
        }}
      >
        {currentLevel.icon && <span>{currentLevel.icon}</span>}
        {currentLevel.label}
      </span>
    );
  }

  return (
    <select
      value={value?.level || ''}
      onChange={(e) => onChange?.(e.target.value ? { level: e.target.value } : null)}
      disabled={disabled}
      className={`w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      <option value="">בחר עדיפות</option>
      {levels.map(lvl => (
        <option key={lvl.value} value={lvl.value}>
          {lvl.label}
        </option>
      ))}
    </select>
  );
});
PriorityCell.displayName = 'PriorityCell';

// File Cell
const FileCell: React.FC<CellProps<FileCellValue>> = memo(({
  column,
  value,
  mode,
  onChange,
  disabled,
  className = '',
}) => {
  const files = value?.files || [];

  if (mode === 'view') {
    if (files.length === 0) {
      return <span className="text-gray-400">-</span>;
    }
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="text-blue-600 text-sm">
          📎 {files.length} {files.length === 1 ? 'קובץ' : 'קבצים'}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`text-blue-600 text-sm hover:underline ${className}`}
    >
      + הוסף קובץ
    </button>
  );
});
FileCell.displayName = 'FileCell';

// ===========================================
// CELL FACTORY
// ===========================================

export const CellFactory: React.FC<CellFactoryProps> = memo(({
  column,
  value,
  mode = 'view',
  onChange,
  onBlur,
  disabled = false,
  className = '',
}) => {
  const cellProps = {
    column,
    mode,
    onChange,
    onBlur,
    disabled,
    className,
  };

  const renderCell = () => {
    switch (column.type) {
      case 'text':
        return <TextCell {...cellProps} value={value as TextCellValue | null} />;
      
      case 'number':
        return <NumberCell {...cellProps} value={value as NumberCellValue | null} />;
      
      case 'status':
        return <StatusCell {...cellProps} value={value as StatusCellValue | null} />;
      
      case 'person':
        return <PersonCell {...cellProps} value={value as PersonCellValue | null} />;
      
      case 'date':
        return <DateCell {...cellProps} value={value as DateCellValue | null} />;
      
      case 'priority':
        return <PriorityCell {...cellProps} value={value as PriorityCellValue | null} />;
      
      case 'file':
        return <FileCell {...cellProps} value={value as FileCellValue | null} />;
      
      default:
        console.warn(`Unknown column type: ${column.type}`);
        return <span className="text-gray-400">סוג לא נתמך</span>;
    }
  };

  return (
    <Suspense fallback={<CellSkeleton width={column.width} />}>
      {renderCell()}
    </Suspense>
  );
});

CellFactory.displayName = 'CellFactory';

// ===========================================
// EXPORTS
// ===========================================

export {
  TextCell,
  NumberCell,
  StatusCell,
  PersonCell,
  DateCell,
  PriorityCell,
  FileCell,
};

export default CellFactory;
