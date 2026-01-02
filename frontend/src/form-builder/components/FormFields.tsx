/**
 * AEGIS Form Fields
 * Individual field components for form rendering
 */

import React from 'react';
import { FormField, FieldOption } from '../types/form.types';

// ============================================
// 🎨 Common Props
// ============================================

interface FieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

// ============================================
// 📝 Text Field
// ============================================

export const TextField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <input
        id={field.id}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        disabled={disabled}
        maxLength={field.validation?.maxLength}
        className={`form-input ${error ? 'error' : ''}`}
      />
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 📝 TextArea Field
// ============================================

export const TextAreaField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <textarea
        id={field.id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        disabled={disabled}
        rows={field.settings?.rows || 4}
        maxLength={field.validation?.maxLength}
        className={`form-textarea ${error ? 'error' : ''}`}
      />
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 🔢 Number Field
// ============================================

export const NumberField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <div className="number-input-wrapper">
        {field.settings?.prefix && (
          <span className="input-prefix">{field.settings.prefix}</span>
        )}
        <input
          id={field.id}
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          placeholder={field.placeholder}
          disabled={disabled}
          min={field.validation?.min}
          max={field.validation?.max}
          step={field.settings?.step || 1}
          className={`form-input ${error ? 'error' : ''}`}
        />
        {field.settings?.suffix && (
          <span className="input-suffix">{field.settings.suffix}</span>
        )}
      </div>
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 📧 Email Field
// ============================================

export const EmailField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <input
        id={field.id}
        type="email"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || 'example@domain.com'}
        disabled={disabled}
        className={`form-input ${error ? 'error' : ''}`}
        dir="ltr"
      />
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 📞 Phone Field
// ============================================

export const PhoneField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <input
        id={field.id}
        type="tel"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || '050-000-0000'}
        disabled={disabled}
        className={`form-input ${error ? 'error' : ''}`}
        dir="ltr"
      />
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 📅 Date Field
// ============================================

export const DateField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <input
        id={field.id}
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={field.settings?.minDate}
        max={field.settings?.maxDate}
        className={`form-input ${error ? 'error' : ''}`}
      />
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// ⏰ Time Field
// ============================================

export const TimeField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <input
        id={field.id}
        type="time"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`form-input ${error ? 'error' : ''}`}
      />
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 📋 Select Field
// ============================================

export const SelectField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <select
        id={field.id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`form-select ${error ? 'error' : ''}`}
      >
        <option value="">{field.placeholder || 'בחר...'}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// ☑️ Multi-Select Field
// ============================================

export const MultiSelectField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  const selectedValues: string[] = value || [];
  
  const handleToggle = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter(v => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };
  
  return (
    <div className="form-field">
      <label className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <div className="checkbox-group">
        {field.options?.map((option) => (
          <label key={option.value} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              disabled={disabled}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 🔘 Radio Field
// ============================================

export const RadioField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <div className="radio-group">
        {field.options?.map((option) => (
          <label key={option.value} className="radio-label">
            <input
              type="radio"
              name={field.name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// ✅ Checkbox Field (Single)
// ============================================

export const CheckboxField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <label className="checkbox-single">
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span>
          {field.label}
          {field.validation?.required && <span className="required">*</span>}
        </span>
      </label>
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 🔀 Toggle Field
// ============================================

export const ToggleField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="form-field">
      <div className="toggle-wrapper">
        <label className="form-label">
          {field.label}
          {field.validation?.required && <span className="required">*</span>}
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={value || false}
          onClick={() => !disabled && onChange(!value)}
          className={`toggle-button ${value ? 'active' : ''}`}
          disabled={disabled}
        >
          <span className="toggle-thumb" />
        </button>
      </div>
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 📁 File Field
// ============================================

export const FileField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (field.settings?.multiple) {
        onChange(Array.from(files));
      } else {
        onChange(files[0]);
      }
    }
  };
  
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <div className="file-input-wrapper">
        <input
          id={field.id}
          type="file"
          onChange={handleFileChange}
          disabled={disabled}
          accept={field.settings?.accept}
          multiple={field.settings?.multiple}
          className="file-input"
        />
        <label htmlFor={field.id} className="file-input-label">
          {value ? (
            Array.isArray(value) ? `${value.length} קבצים נבחרו` : value.name
          ) : (
            'בחר קובץ...'
          )}
        </label>
      </div>
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 🖼️ Image Field
// ============================================

export const ImageField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          file,
          dataUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <div className="image-input-wrapper">
        {value?.dataUrl ? (
          <div className="image-preview">
            <img src={value.dataUrl} alt="Preview" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="remove-image"
              disabled={disabled}
            >
              ✕
            </button>
          </div>
        ) : (
          <label htmlFor={field.id} className="image-input-label">
            <span className="image-icon">📷</span>
            <span>לחץ להוספת תמונה</span>
          </label>
        )}
        <input
          id={field.id}
          type="file"
          onChange={handleImageChange}
          disabled={disabled}
          accept="image/*"
          className="hidden-input"
        />
      </div>
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// ✍️ Signature Field
// ============================================

export const SignatureField: React.FC<FieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange(null);
  };
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = field.settings?.penColor || '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [field.settings?.penColor]);
  
  return (
    <div className="form-field">
      <label className="form-label">
        {field.label}
        {field.validation?.required && <span className="required">*</span>}
      </label>
      <div className="signature-wrapper">
        <canvas
          ref={canvasRef}
          width={field.settings?.width || 400}
          height={field.settings?.height || 150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className={`signature-canvas ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
        />
        <button
          type="button"
          onClick={clearSignature}
          className="clear-signature"
          disabled={disabled}
        >
          נקה חתימה
        </button>
      </div>
      {field.helpText && <p className="help-text">{field.helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// ============================================
// 📑 Section Header
// ============================================

export const SectionHeader: React.FC<{
  field: FormField;
  isCollapsed?: boolean;
  onToggle?: () => void;
}> = ({ field, isCollapsed, onToggle }) => {
  return (
    <div className="section-header">
      <h3 className="section-title">{field.label}</h3>
      {field.settings?.collapsible && (
        <button
          type="button"
          onClick={onToggle}
          className="section-toggle"
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      )}
    </div>
  );
};

// ============================================
// ➖ Divider
// ============================================

export const Divider: React.FC = () => {
  return <hr className="form-divider" />;
};

// ============================================
// 📌 Heading
// ============================================

export const HeadingField: React.FC<{ field: FormField }> = ({ field }) => {
  return <h4 className="form-heading">{field.label}</h4>;
};

// ============================================
// 📝 Paragraph
// ============================================

export const ParagraphField: React.FC<{ field: FormField }> = ({ field }) => {
  return <p className="form-paragraph">{field.label}</p>;
};

// ============================================
// 🔧 Field Renderer (Main Export)
// ============================================

export const FormFieldRenderer: React.FC<FieldProps> = (props) => {
  const { field } = props;
  
  switch (field.type) {
    case 'text':
      return <TextField {...props} />;
    case 'textarea':
      return <TextAreaField {...props} />;
    case 'number':
      return <NumberField {...props} />;
    case 'email':
      return <EmailField {...props} />;
    case 'phone':
      return <PhoneField {...props} />;
    case 'date':
      return <DateField {...props} />;
    case 'time':
      return <TimeField {...props} />;
    case 'datetime':
      return <DateField {...props} />; // Use date for now
    case 'select':
      return <SelectField {...props} />;
    case 'multi-select':
      return <MultiSelectField {...props} />;
    case 'radio':
      return <RadioField {...props} />;
    case 'checkbox':
      return <CheckboxField {...props} />;
    case 'toggle':
      return <ToggleField {...props} />;
    case 'file':
      return <FileField {...props} />;
    case 'image':
      return <ImageField {...props} />;
    case 'signature':
      return <SignatureField {...props} />;
    case 'section':
      return <SectionHeader field={field} />;
    case 'divider':
      return <Divider />;
    case 'heading':
      return <HeadingField field={field} />;
    case 'paragraph':
      return <ParagraphField field={field} />;
    default:
      return <TextField {...props} />;
  }
};

export default FormFieldRenderer;
