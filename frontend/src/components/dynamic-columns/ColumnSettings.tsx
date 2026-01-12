// ===========================================
// SafeM - ColumnSettings Component
// Dynamic Entity Engine - Column Header Settings Dropdown
// ===========================================
import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight,
  Copy,
  ArrowUp,
  ArrowDown,
  Lock,
} from 'lucide-react';
import { ColumnDefinition, UpdateColumnInput } from '../../types/columns';

// ===========================================
// TYPES
// ===========================================

interface ColumnSettingsProps {
  column: ColumnDefinition;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onToggleVisibility?: () => void;
  onUpdateWidth?: (width: number) => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorRef: React.RefObject<HTMLElement>;
}

// ===========================================
// DROPDOWN COMPONENT
// ===========================================

const Dropdown: React.FC<DropdownProps> = ({ isOpen, onClose, children, anchorRef }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      {children}
    </div>
  );
};

// ===========================================
// MENU ITEM COMPONENT
// ===========================================

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  shortcut?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  label, 
  onClick, 
  disabled = false,
  danger = false,
  shortcut,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full flex items-center gap-2 px-3 py-2 text-sm text-right
      ${disabled ? 'text-gray-400 cursor-not-allowed' : danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'}
      transition-colors
    `}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="flex-1">{label}</span>
    {shortcut && <span className="text-xs text-gray-400">{shortcut}</span>}
  </button>
);

const MenuDivider: React.FC = () => (
  <div className="border-t border-gray-100 my-1" />
);

// ===========================================
// WIDTH SLIDER COMPONENT
// ===========================================

interface WidthSliderProps {
  value: number;
  onChange: (value: number) => void;
  onClose: () => void;
}

const WidthSlider: React.FC<WidthSliderProps> = ({ value, onChange, onClose }) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(parseInt(e.target.value));
  };

  const handleBlur = () => {
    onChange(localValue);
  };

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-700">רוחב עמודה</span>
        <span className="text-sm text-gray-500">{localValue}px</span>
      </div>
      <input
        type="range"
        min={50}
        max={400}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onMouseUp={handleBlur}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>50</span>
        <span>400</span>
      </div>
    </div>
  );
};

// ===========================================
// COLUMN SETTINGS COMPONENT
// ===========================================

export const ColumnSettings: React.FC<ColumnSettingsProps> = ({
  column,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onUpdateWidth,
  onMoveLeft,
  onMoveRight,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWidthSlider, setShowWidthSlider] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    setShowWidthSlider(false);
  };

  const handleAction = (action?: () => void) => {
    if (action) {
      action();
    }
    handleClose();
  };

  const handleWidthChange = (width: number) => {
    onUpdateWidth?.(width);
    setShowWidthSlider(false);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          p-1 rounded hover:bg-gray-200 transition-colors
          ${isOpen ? 'bg-gray-200' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title="הגדרות עמודה"
      >
        <Settings size={14} className="text-gray-500" />
      </button>

      <Dropdown isOpen={isOpen} onClose={handleClose} anchorRef={buttonRef}>
        {showWidthSlider ? (
          <>
            <button
              onClick={() => setShowWidthSlider(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ChevronRight size={16} />
              חזרה
            </button>
            <MenuDivider />
            <WidthSlider
              value={column.width}
              onChange={handleWidthChange}
              onClose={() => setShowWidthSlider(false)}
            />
          </>
        ) : (
          <>
            {/* Column Info */}
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="font-medium text-gray-900 text-sm truncate">
                {column.title}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {column.isSystem && (
                  <span className="inline-flex items-center gap-1">
                    <Lock size={10} />
                    עמודת מערכת
                  </span>
                )}
              </div>
            </div>

            {/* Edit */}
            {onEdit && !column.isSystem && (
              <MenuItem
                icon={<Edit3 size={16} />}
                label="עריכת עמודה"
                onClick={() => handleAction(onEdit)}
              />
            )}

            {/* Width */}
            {onUpdateWidth && (
              <MenuItem
                icon={<ChevronLeft size={16} />}
                label="שינוי רוחב"
                onClick={() => setShowWidthSlider(true)}
              />
            )}

            {/* Visibility */}
            {onToggleVisibility && (
              <MenuItem
                icon={column.visible !== false ? <EyeOff size={16} /> : <Eye size={16} />}
                label={column.visible !== false ? 'הסתר עמודה' : 'הצג עמודה'}
                onClick={() => handleAction(onToggleVisibility)}
              />
            )}

            <MenuDivider />

            {/* Move */}
            {(onMoveLeft || onMoveRight) && (
              <>
                {onMoveLeft && (
                  <MenuItem
                    icon={<ArrowRight size={16} />}
                    label="הזז ימינה"
                    onClick={() => handleAction(onMoveLeft)}
                  />
                )}
                {onMoveRight && (
                  <MenuItem
                    icon={<ArrowLeft size={16} />}
                    label="הזז שמאלה"
                    onClick={() => handleAction(onMoveRight)}
                  />
                )}
                <MenuDivider />
              </>
            )}

            {/* Duplicate */}
            {onDuplicate && !column.isSystem && (
              <MenuItem
                icon={<Copy size={16} />}
                label="שכפל עמודה"
                onClick={() => handleAction(onDuplicate)}
              />
            )}

            {/* Delete */}
            {onDelete && !column.isSystem && (
              <MenuItem
                icon={<Trash2 size={16} />}
                label="מחק עמודה"
                onClick={() => handleAction(onDelete)}
                danger
              />
            )}

            {/* System column notice */}
            {column.isSystem && (
              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50">
                עמודות מערכת אינן ניתנות למחיקה או עריכה
              </div>
            )}
          </>
        )}
      </Dropdown>
    </div>
  );
};

// ===========================================
// ARROW ICONS (RTL)
// ===========================================

const ArrowRight: React.FC<{ size: number }> = ({ size }) => (
  <ArrowUp size={size} style={{ transform: 'rotate(90deg)' }} />
);

const ArrowLeft: React.FC<{ size: number }> = ({ size }) => (
  <ArrowDown size={size} style={{ transform: 'rotate(90deg)' }} />
);

export default ColumnSettings;
