// ===========================================
// AEGIS - Field Renderers
// Phase 2: קומפוננטות לרנדור שדות טפסים
// ===========================================

import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  X,
  Upload,
  Camera,
  Star,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  Plus,
  Trash2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Download,
} from 'lucide-react';
import { TemplateField, FieldType } from '../types/template-types';

// ===========================================
// TYPES
// ===========================================

export interface FieldRendererProps {
  field: TemplateField;
  value: any;
  onChange: (value: any) => void;
  mode: 'edit' | 'preview' | 'readonly';
  error?: string;
  previousValue?: any; // For prefill comparison
  showChanges?: boolean; // Highlight changes from previous
  disabled?: boolean;
}

export interface FieldComponentProps extends FieldRendererProps {}

// ===========================================
// MAIN FIELD RENDERER
// ===========================================

export function FieldRenderer(props: FieldRendererProps) {
  const { field, mode, error, previousValue, showChanges } = props;

  // Check if value changed from previous
  const hasChanged = showChanges && previousValue !== undefined && 
    JSON.stringify(props.value) !== JSON.stringify(previousValue);

  const Component = FIELD_COMPONENTS[field.type];

  if (!Component) {
    return (
      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
        סוג שדה לא נתמך: {field.type}
      </div>
    );
  }

  return (
    <div className={`relative ${hasChanged ? 'ring-2 ring-amber-500/50 rounded-xl' : ''}`}>
      {/* Changed indicator */}
      {hasChanged && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full z-10">
          שונה
        </div>
      )}

      {/* Field Label */}
      {field.type !== 'header' && field.type !== 'paragraph' && field.type !== 'divider' && (
        <label className="block mb-2">
          <span className="text-sm font-medium text-slate-300">
            {field.labelHe || field.label}
          </span>
          {field.validation?.required && (
            <span className="text-rose-400 mr-1">*</span>
          )}
        </label>
      )}

      {/* Field Component */}
      <Component {...props} />

      {/* Help Text */}
      {field.helpText && mode !== 'readonly' && (
        <p className="mt-1 text-xs text-slate-500">{field.helpText}</p>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      {/* Previous Value Reference */}
      {showChanges && previousValue !== undefined && field.prefillBehavior === 'reference' && (
        <p className="mt-1 text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
          ערך קודם: {formatPreviousValue(previousValue, field.type)}
        </p>
      )}
    </div>
  );
}

// ===========================================
// BASIC FIELDS
// ===========================================

function TextField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px]">
        {value || <span className="text-slate-500">-</span>}
      </div>
    );
  }

  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={field.placeholder}
      maxLength={field.validation?.maxLength}
      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

function TextareaField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[100px] whitespace-pre-wrap">
        {value || <span className="text-slate-500">-</span>}
      </div>
    );
  }

  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={field.placeholder}
      rows={field.display?.rows || 4}
      maxLength={field.validation?.maxLength}
      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none disabled:opacity-50"
    />
  );
}

function NumberField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px]">
        {value !== undefined && value !== null ? value : <span className="text-slate-500">-</span>}
        {field.numberConfig?.unit && <span className="text-slate-500 mr-1">{field.numberConfig.unit}</span>}
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        disabled={disabled}
        placeholder={field.placeholder}
        min={field.validation?.min}
        max={field.validation?.max}
        step={field.numberConfig?.step || 1}
        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
      />
      {field.numberConfig?.unit && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
          {field.numberConfig.unit}
        </span>
      )}
    </div>
  );
}

function EmailField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px]">
        {value ? (
          <a href={`mailto:${value}`} className="text-indigo-400 hover:underline">{value}</a>
        ) : (
          <span className="text-slate-500">-</span>
        )}
      </div>
    );
  }

  return (
    <input
      type="email"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={field.placeholder || 'example@email.com'}
      dir="ltr"
      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 text-left"
    />
  );
}

function PhoneField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px]">
        {value ? (
          <a href={`tel:${value}`} className="text-indigo-400 hover:underline" dir="ltr">{value}</a>
        ) : (
          <span className="text-slate-500">-</span>
        )}
      </div>
    );
  }

  return (
    <input
      type="tel"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={field.placeholder || '050-0000000'}
      dir="ltr"
      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 text-left"
    />
  );
}

function DateField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('he-IL');
    } catch {
      return dateStr;
    }
  };

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px] flex items-center gap-2">
        <Calendar size={16} className="text-slate-500" />
        {value ? formatDate(value) : <span className="text-slate-500">-</span>}
      </div>
    );
  }

  return (
    <div className="relative">
      <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={field.dateConfig?.minDate}
        max={field.dateConfig?.maxDate}
        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
      />
    </div>
  );
}

function TimeField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px] flex items-center gap-2">
        <Clock size={16} className="text-slate-500" />
        {value || <span className="text-slate-500">-</span>}
      </div>
    );
  }

  return (
    <div className="relative">
      <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        type="time"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
      />
    </div>
  );
}

function DateTimeField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return `${date.toLocaleDateString('he-IL')} ${date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return dateStr;
    }
  };

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px] flex items-center gap-2">
        <Calendar size={16} className="text-slate-500" />
        {value ? formatDateTime(value) : <span className="text-slate-500">-</span>}
      </div>
    );
  }

  return (
    <input
      type="datetime-local"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
    />
  );
}

// ===========================================
// CHOICE FIELDS
// ===========================================

function SelectField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const selectedOption = field.options?.find(o => o.value === value);

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px]">
        {selectedOption?.label || <span className="text-slate-500">-</span>}
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none disabled:opacity-50"
      >
        <option value="">{field.placeholder || 'בחר...'}</option>
        {field.options?.map(option => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );
}

function MultiSelectField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const selectedValues: string[] = value || [];
  const selectedLabels = field.options
    ?.filter(o => selectedValues.includes(o.value))
    .map(o => o.label) || [];

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px]">
        {selectedLabels.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedLabels.map((label, i) => (
              <span key={i} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-sm">
                {label}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-500">-</span>
        )}
      </div>
    );
  }

  const toggleOption = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      {field.options?.map(option => (
        <label
          key={option.id}
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            selectedValues.includes(option.value)
              ? 'bg-indigo-500/10 border-indigo-500/50'
              : 'bg-slate-800/50 border-white/5 hover:border-white/10'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            selectedValues.includes(option.value)
              ? 'bg-indigo-500 border-indigo-500'
              : 'border-slate-500'
          }`}>
            {selectedValues.includes(option.value) && <Check size={14} className="text-white" />}
          </div>
          <input
            type="checkbox"
            checked={selectedValues.includes(option.value)}
            onChange={() => toggleOption(option.value)}
            disabled={disabled}
            className="sr-only"
          />
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function RadioField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const selectedOption = field.options?.find(o => o.value === value);

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px]">
        {selectedOption?.label || <span className="text-slate-500">-</span>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {field.options?.map(option => (
        <label
          key={option.id}
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            value === option.value
              ? 'bg-indigo-500/10 border-indigo-500/50'
              : 'bg-slate-800/50 border-white/5 hover:border-white/10'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            value === option.value
              ? 'border-indigo-500'
              : 'border-slate-500'
          }`}>
            {value === option.value && (
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            )}
          </div>
          <input
            type="radio"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
            className="sr-only"
          />
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const isChecked = Boolean(value);

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/30 rounded-xl">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'
        }`}>
          {isChecked && <Check size={14} className="text-white" />}
        </div>
        <span className="text-slate-300">{isChecked ? 'כן' : 'לא'}</span>
      </div>
    );
  }

  return (
    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
      isChecked
        ? 'bg-indigo-500/10 border-indigo-500/50'
        : 'bg-slate-800/50 border-white/5 hover:border-white/10'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
        isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'
      }`}>
        {isChecked && <Check size={14} className="text-white" />}
      </div>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <span className="text-sm">{field.checkboxLabel || 'אשר'}</span>
    </label>
  );
}

function CheckboxGroupField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  // Same as MultiSelect but with different styling
  return <MultiSelectField field={field} value={value} onChange={onChange} mode={mode} disabled={disabled} />;
}

function ToggleField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const isOn = Boolean(value);

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/30 rounded-xl">
        <div className={`w-10 h-6 rounded-full relative ${isOn ? 'bg-indigo-500' : 'bg-slate-600'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
            isOn ? 'right-1' : 'right-5'
          }`} />
        </div>
        <span className="text-slate-300">{isOn ? 'פעיל' : 'לא פעיל'}</span>
      </div>
    );
  }

  return (
    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
      isOn
        ? 'bg-indigo-500/10 border-indigo-500/50'
        : 'bg-slate-800/50 border-white/5 hover:border-white/10'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        onClick={() => onChange(!isOn)}
        disabled={disabled}
        className={`w-10 h-6 rounded-full relative transition-colors ${
          isOn ? 'bg-indigo-500' : 'bg-slate-600'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
          isOn ? 'right-1' : 'right-5'
        }`} />
      </button>
      <span className="text-sm">{field.checkboxLabel || (isOn ? 'פעיל' : 'לא פעיל')}</span>
    </label>
  );
}

// ===========================================
// ADVANCED FIELDS
// ===========================================

function ImageField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onChange(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="bg-slate-800/30 rounded-xl p-4">
        {preview ? (
          <img src={preview} alt="Uploaded" className="max-w-full max-h-64 rounded-lg mx-auto" />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <ImageIcon size={32} />
            <span className="text-sm mt-2">אין תמונה</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative bg-slate-800/30 rounded-xl p-4">
          <img src={preview} alt="Preview" className="max-w-full max-h-64 rounded-lg mx-auto" />
          {!disabled && (
            <button
              onClick={() => { setPreview(null); onChange(null); }}
              className="absolute top-2 left-2 p-1 bg-rose-500 rounded-full text-white hover:bg-rose-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500/30 transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Camera size={32} className="mx-auto text-slate-500 mb-2" />
          <p className="text-sm text-slate-400">לחץ להעלאת תמונה</p>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG עד 5MB</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}

function FileField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(value?.name || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // In real implementation, upload to storage and save URL
      onChange({ name: file.name, size: file.size, type: file.type });
    }
  };

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl">
        {fileName ? (
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-slate-500" />
            <span className="text-slate-300">{fileName}</span>
            <button className="mr-auto p-1 text-indigo-400 hover:text-indigo-300">
              <Download size={16} />
            </button>
          </div>
        ) : (
          <span className="text-slate-500">אין קובץ</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fileName ? (
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 rounded-xl border border-white/10">
          <FileText size={16} className="text-slate-500" />
          <span className="text-sm flex-1">{fileName}</span>
          {!disabled && (
            <button
              onClick={() => { setFileName(null); onChange(null); }}
              className="p-1 text-rose-400 hover:text-rose-300"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => !disabled && fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-sm hover:border-indigo-500/30 transition-colors disabled:opacity-50"
        >
          <Upload size={16} />
          בחר קובץ
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={field.fileConfig?.allowedTypes?.join(',')}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}

function SignatureField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(value));

  useEffect(() => {
    if (value && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, [value]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || mode !== 'edit') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      onChange(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      onChange(null);
    }
  };

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="bg-slate-800/30 rounded-xl p-4">
        {value ? (
          <img src={value} alt="Signature" className="max-h-24 mx-auto" />
        ) : (
          <div className="text-center py-4 text-slate-500">
            <span className="text-sm">אין חתימה</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`w-full cursor-crosshair touch-none ${disabled ? 'opacity-50' : ''}`}
        />
      </div>
      {hasSignature && !disabled && (
        <button
          onClick={clearSignature}
          className="text-sm text-rose-400 hover:text-rose-300"
        >
          נקה חתימה
        </button>
      )}
    </div>
  );
}

function RatingField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const maxRating = field.ratingConfig?.max || 5;
  const currentValue = value || 0;

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="flex items-center gap-1 px-4 py-3 bg-slate-800/30 rounded-xl">
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            size={24}
            className={i < currentValue ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
          />
        ))}
        <span className="text-slate-400 mr-2">({currentValue}/{maxRating})</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => (
        <button
          key={i}
          onClick={() => !disabled && onChange(i + 1)}
          disabled={disabled}
          className={`p-1 transition-colors ${disabled ? 'cursor-not-allowed' : 'hover:scale-110'}`}
        >
          <Star
            size={32}
            className={i < currentValue ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-amber-400'}
          />
        </button>
      ))}
    </div>
  );
}

function LocationField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('הדפדפן לא תומך במיקום');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (error) => {
        console.error('Location error:', error);
        alert('לא ניתן לקבל מיקום');
        setLoading(false);
      }
    );
  };

  if (mode === 'readonly' || mode === 'preview') {
    return (
      <div className="px-4 py-3 bg-slate-800/30 rounded-xl">
        {value ? (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-indigo-400" />
            <span className="text-slate-300 text-sm">
              {value.lat?.toFixed(6)}, {value.lng?.toFixed(6)}
            </span>
          </div>
        ) : (
          <span className="text-slate-500">אין מיקום</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 rounded-xl border border-white/10">
          <MapPin size={16} className="text-indigo-400" />
          <span className="text-sm flex-1">
            {value.lat?.toFixed(6)}, {value.lng?.toFixed(6)}
          </span>
          {!disabled && (
            <button
              onClick={() => onChange(null)}
              className="p-1 text-rose-400 hover:text-rose-300"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={getCurrentLocation}
          disabled={disabled || loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-sm hover:border-indigo-500/30 transition-colors disabled:opacity-50"
        >
          <MapPin size={16} />
          {loading ? 'מקבל מיקום...' : 'קבל מיקום נוכחי'}
        </button>
      )}
    </div>
  );
}

function TableField({ field, value, onChange, mode, disabled }: FieldComponentProps) {
  const columns = field.tableConfig?.columns || [];
  const rows: Record<string, any>[] = value || [];

  const addRow = () => {
    const newRow: Record<string, any> = {};
    columns.forEach(col => { newRow[col.id] = ''; });
    onChange([...rows, newRow]);
  };

  const updateCell = (rowIndex: number, columnId: string, cellValue: any) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnId]: cellValue };
    onChange(newRows);
  };

  const deleteRow = (rowIndex: number) => {
    onChange(rows.filter((_, i) => i !== rowIndex));
  };

  if (mode === 'readonly' || mode === 'preview') {
    if (rows.length === 0) {
      return <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-500">אין נתונים</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map(col => (
                <th key={col.id} className="px-3 py-2 text-right text-xs font-bold text-slate-400">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/5">
                {columns.map(col => (
                  <td key={col.id} className="px-3 py-2 text-sm text-slate-300">
                    {row[col.id] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto bg-slate-800 rounded-xl border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map(col => (
                <th key={col.id} className="px-3 py-2 text-right text-xs font-bold text-slate-400">
                  {col.label}
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/5">
                {columns.map(col => (
                  <td key={col.id} className="px-2 py-1">
                    <input
                      type={col.type === 'number' ? 'number' : 'text'}
                      value={row[col.id] || ''}
                      onChange={(e) => updateCell(rowIndex, col.id, e.target.value)}
                      disabled={disabled}
                      className="w-full bg-transparent px-2 py-1 text-sm focus:outline-none focus:bg-slate-700 rounded"
                    />
                  </td>
                ))}
                <td className="px-2 py-1">
                  {!disabled && (
                    <button
                      onClick={() => deleteRow(rowIndex)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!disabled && (
        <button
          onClick={addRow}
          className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
        >
          <Plus size={16} />
          הוסף שורה
        </button>
      )}
    </div>
  );
}

function CalculatedField({ field, value, onChange, mode }: FieldComponentProps) {
  // Calculated fields are read-only and computed from other fields
  return (
    <div className="px-4 py-3 bg-slate-800/30 rounded-xl text-slate-300 min-h-[44px] flex items-center">
      <span className="text-indigo-400 font-mono">
        {value !== undefined ? value : <span className="text-slate-500">חישוב אוטומטי</span>}
      </span>
    </div>
  );
}

// ===========================================
// DISPLAY FIELDS
// ===========================================

function HeaderField({ field }: FieldComponentProps) {
  return (
    <div className="py-2">
      <h3 className="text-lg font-bold text-slate-200">
        {field.labelHe || field.label}
      </h3>
      {field.helpText && (
        <p className="text-sm text-slate-500 mt-1">{field.helpText}</p>
      )}
    </div>
  );
}

function ParagraphField({ field }: FieldComponentProps) {
  return (
    <div className="py-2">
      <p className="text-slate-400 whitespace-pre-wrap">
        {field.paragraphContent || field.helpText || field.labelHe || field.label}
      </p>
    </div>
  );
}

function DividerField({ field }: FieldComponentProps) {
  return (
    <div className="py-4">
      <hr className="border-white/10" />
    </div>
  );
}

// ===========================================
// FIELD COMPONENTS MAP
// ===========================================

const FIELD_COMPONENTS: Record<FieldType, React.FC<FieldComponentProps>> = {
  text: TextField,
  textarea: TextareaField,
  number: NumberField,
  email: EmailField,
  phone: PhoneField,
  date: DateField,
  time: TimeField,
  datetime: DateTimeField,
  select: SelectField,
  multiselect: MultiSelectField,
  radio: RadioField,
  checkbox: CheckboxField,
  checkboxGroup: CheckboxGroupField,
  toggle: ToggleField,
  image: ImageField,
  file: FileField,
  signature: SignatureField,
  rating: RatingField,
  location: LocationField,
  table: TableField,
  calculated: CalculatedField,
  header: HeaderField,
  paragraph: ParagraphField,
  divider: DividerField,
};

// ===========================================
// UTILITIES
// ===========================================

function formatPreviousValue(value: any, fieldType: FieldType): string {
  if (value === null || value === undefined) return '-';
  
  switch (fieldType) {
    case 'checkbox':
    case 'toggle':
      return value ? 'כן' : 'לא';
    case 'date':
      return new Date(value).toLocaleDateString('he-IL');
    case 'multiselect':
    case 'checkboxGroup':
      return Array.isArray(value) ? value.join(', ') : String(value);
    case 'rating':
      return `${value} כוכבים`;
    case 'location':
      return value?.lat ? `${value.lat.toFixed(4)}, ${value.lng.toFixed(4)}` : '-';
    default:
      return String(value);
  }
}

// ===========================================
// EXPORTS
// ===========================================

export {
  TextField,
  TextareaField,
  NumberField,
  EmailField,
  PhoneField,
  DateField,
  TimeField,
  DateTimeField,
  SelectField,
  MultiSelectField,
  RadioField,
  CheckboxField,
  CheckboxGroupField,
  ToggleField,
  ImageField,
  FileField,
  SignatureField,
  RatingField,
  LocationField,
  TableField,
  CalculatedField,
  HeaderField,
  ParagraphField,
  DividerField,
  FIELD_COMPONENTS,
};