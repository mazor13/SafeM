// ===========================================
// SafeM - ColumnManager Component
// Dynamic Entity Engine - Column Management Modal
// ===========================================
import React, { useState, useCallback, useMemo } from 'react';
import { X, Plus, Type, Hash, CheckSquare, User, Calendar, Flag, Paperclip } from 'lucide-react';
import {
  ColumnDefinition,
  ColumnType,
  EntityType,
  CreateColumnInput,
  UpdateColumnInput,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_PRIORITY_LEVELS,
  DEFAULT_STATUS_OPTIONS,
} from '../../types/columns';

// ===========================================
// TYPES
// ===========================================

interface ColumnManagerProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: EntityType;
  existingColumn?: ColumnDefinition; // For edit mode
  onSave: (data: Partial<CreateColumnInput> | UpdateColumnInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

interface ColumnTypeOption {
  type: ColumnType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// ===========================================
// CONSTANTS
// ===========================================

const COLUMN_TYPES: ColumnTypeOption[] = [
  { type: 'text', label: 'טקסט', icon: <Type size={20} />, description: 'טקסט חופשי - מילה או משפט' },
  { type: 'number', label: 'מספר', icon: <Hash size={20} />, description: 'ערך מספרי - כמות, מחיר וכו׳' },
  { type: 'status', label: 'סטטוס', icon: <CheckSquare size={20} />, description: 'בחירה מרשימה מוגדרת מראש' },
  { type: 'person', label: 'אדם', icon: <User size={20} />, description: 'הקצאה לאיש צוות' },
  { type: 'date', label: 'תאריך', icon: <Calendar size={20} />, description: 'תאריך או תאריך ושעה' },
  { type: 'priority', label: 'עדיפות', icon: <Flag size={20} />, description: 'רמת עדיפות - נמוכה עד קריטית' },
  { type: 'file', label: 'קובץ', icon: <Paperclip size={20} />, description: 'צירוף קבצים או תמונות' },
];

const ENTITY_LABELS: Record<EntityType, string> = {
  finding: 'ממצאים',
  equipment: 'ציוד',
  inspection: 'ביקורות',
  task: 'משימות',
  client: 'לקוחות',
  facility: 'מתקנים',
};

// ===========================================
// COMPONENT
// ===========================================

export const ColumnManager: React.FC<ColumnManagerProps> = ({
  isOpen,
  onClose,
  entityType,
  existingColumn,
  onSave,
  onDelete,
}) => {
  const isEditMode = !!existingColumn;
  
  // Form state
  const [step, setStep] = useState<'type' | 'details'>(isEditMode ? 'details' : 'type');
  const [selectedType, setSelectedType] = useState<ColumnType | null>(existingColumn?.type || null);
  const [title, setTitle] = useState(existingColumn?.title || '');
  const [width, setWidth] = useState(existingColumn?.width || DEFAULT_COLUMN_WIDTH[selectedType || 'text']);
  const [required, setRequired] = useState(existingColumn?.required || false);
  const [settings, setSettings] = useState<Record<string, any>>(existingColumn?.settings || {});
  
  // UI state
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  const resetForm = useCallback(() => {
    setStep(isEditMode ? 'details' : 'type');
    setSelectedType(existingColumn?.type || null);
    setTitle(existingColumn?.title || '');
    setWidth(existingColumn?.width || DEFAULT_COLUMN_WIDTH[selectedType || 'text']);
    setRequired(existingColumn?.required || false);
    setSettings(existingColumn?.settings || {});
    setError(null);
  }, [existingColumn, isEditMode]);

  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Initialize settings when type is selected
  const handleTypeSelect = useCallback((type: ColumnType) => {
    setSelectedType(type);
    // Set default settings based on type
    switch (type) {
      case 'text':
        setSettings({ placeholder: '', maxLength: 500, multiline: false });
        break;
      case 'number':
        setSettings({ min: undefined, max: undefined, precision: 0, prefix: '', suffix: '' });
        break;
      case 'status':
        setSettings({ options: DEFAULT_STATUS_OPTIONS, allowMultiple: false });
        break;
      case 'person':
        setSettings({ allowMultiple: false, roles: [], includeInactive: false });
        break;
      case 'date':
        setSettings({ includeTime: false, format: 'DD/MM/YYYY', allowPast: true, allowFuture: true });
        break;
      case 'priority':
        setSettings({ levels: DEFAULT_PRIORITY_LEVELS, defaultLevel: 'medium' });
        break;
      case 'file':
        setSettings({ allowedTypes: ['image/*', 'application/pdf'], maxSize: 10485760, maxFiles: 5 });
        break;
    }
    setStep('details');
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!selectedType || !title.trim()) {
      setError('נא למלא את כל השדות הנדרשים');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const data = {
        type: selectedType,
        title: title.trim(),
        width,
        required,
        visible: true,
        settings,
      };

      await onSave(data);
      onClose();
    } catch (err) {
      console.error('Error saving column:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בשמירת העמודה');
    } finally {
      setSaving(false);
    }
  }, [selectedType, title, width, required, settings, onSave, onClose]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!existingColumn || !onDelete) return;
    
    if (!confirm(`האם למחוק את העמודה "${existingColumn.title}"? פעולה זו אינה ניתנת לביטול.`)) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await onDelete(existingColumn.id);
      onClose();
    } catch (err) {
      console.error('Error deleting column:', err);
      setError(err instanceof Error ? err.message : 'שגיאה במחיקת העמודה');
    } finally {
      setDeleting(false);
    }
  }, [existingColumn, onDelete, onClose]);

  // Render type selection step
  const renderTypeSelection = () => (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">בחר סוג עמודה</h3>
      <div className="grid grid-cols-2 gap-3">
        {COLUMN_TYPES.map((option) => (
          <button
            key={option.type}
            onClick={() => handleTypeSelect(option.type)}
            className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-right"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              {option.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-500 mt-0.5">{option.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Render details step
  const renderDetails = () => (
    <div className="p-6 space-y-4">
      {/* Column Type Badge */}
      {selectedType && (
        <div className="flex items-center gap-2 pb-4 border-b">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            {COLUMN_TYPES.find(t => t.type === selectedType)?.icon}
          </div>
          <span className="font-medium text-gray-900">
            {COLUMN_TYPES.find(t => t.type === selectedType)?.label}
          </span>
          {!isEditMode && (
            <button
              onClick={() => setStep('type')}
              className="text-sm text-blue-600 hover:underline mr-auto"
            >
              שנה סוג
            </button>
          )}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          שם העמודה *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="לדוגמה: תאריך יעד"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
      </div>

      {/* Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          רוחב (פיקסלים)
        </label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value) || DEFAULT_COLUMN_WIDTH[selectedType || 'text'])}
          min={50}
          max={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Required */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="required"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="required" className="text-sm text-gray-700">
          שדה חובה
        </label>
      </div>

      {/* Type-specific settings */}
      {selectedType && renderTypeSettings()}
    </div>
  );

  // Render type-specific settings
  const renderTypeSettings = () => {
    switch (selectedType) {
      case 'text':
        return (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-gray-900">הגדרות טקסט</h4>
            <div>
              <label className="block text-sm text-gray-600 mb-1">טקסט ברירת מחדל</label>
              <input
                type="text"
                value={settings.placeholder || ''}
                onChange={(e) => setSettings({ ...settings, placeholder: e.target.value })}
                placeholder="טקסט שיוצג כשהשדה ריק"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="multiline"
                checked={settings.multiline || false}
                onChange={(e) => setSettings({ ...settings, multiline: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="multiline" className="text-sm text-gray-700">
                אפשר מספר שורות
              </label>
            </div>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-gray-900">הגדרות מספר</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">מינימום</label>
                <input
                  type="number"
                  value={settings.min ?? ''}
                  onChange={(e) => setSettings({ ...settings, min: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">מקסימום</label>
                <input
                  type="number"
                  value={settings.max ?? ''}
                  onChange={(e) => setSettings({ ...settings, max: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">תחילית</label>
                <input
                  type="text"
                  value={settings.prefix || ''}
                  onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
                  placeholder="₪"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">סיומת</label>
                <input
                  type="text"
                  value={settings.suffix || ''}
                  onChange={(e) => setSettings({ ...settings, suffix: e.target.value })}
                  placeholder="%"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-gray-900">אפשרויות סטטוס</h4>
            <div className="space-y-2">
              {(settings.options || []).map((opt: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={opt.color}
                    onChange={(e) => {
                      const newOptions = [...settings.options];
                      newOptions[idx] = { ...opt, color: e.target.value };
                      setSettings({ ...settings, options: newOptions });
                    }}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => {
                      const newOptions = [...settings.options];
                      newOptions[idx] = { ...opt, label: e.target.value };
                      setSettings({ ...settings, options: newOptions });
                    }}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => {
                      const newOptions = settings.options.filter((_: any, i: number) => i !== idx);
                      setSettings({ ...settings, options: newOptions });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...(settings.options || []), { value: `option_${Date.now()}`, label: '', color: '#6B7280' }];
                  setSettings({ ...settings, options: newOptions });
                }}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus size={16} />
                הוסף אפשרות
              </button>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-gray-900">הגדרות תאריך</h4>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeTime"
                checked={settings.includeTime || false}
                onChange={(e) => setSettings({ ...settings, includeTime: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="includeTime" className="text-sm text-gray-700">
                כולל שעה
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? 'עריכת עמודה' : 'הוספת עמודה חדשה'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          {step === 'type' ? renderTypeSelection() : renderDetails()}

          {/* Error */}
          {error && (
            <div className="px-6 py-2 bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Footer */}
          {step === 'details' && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-xl">
              <div>
                {isEditMode && onDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting || saving}
                    className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                  >
                    {deleting ? 'מוחק...' : 'מחק עמודה'}
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={saving || deleting}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || deleting || !title.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'שומר...' : isEditMode ? 'שמור שינויים' : 'הוסף עמודה'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColumnManager;
