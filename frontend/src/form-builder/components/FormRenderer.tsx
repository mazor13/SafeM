/**
 * AEGIS Form Renderer
 * Renders a form from JSON Schema
 */

import React, { useState, useCallback, useEffect } from 'react';
import { FormFieldRenderer } from './FormFields';
import { 
  FormSchema, 
  FormField, 
  validateFormData, 
  evaluateCondition 
} from '../types/form.types';

// ============================================
// 📋 Form Renderer Props
// ============================================

interface FormRendererProps {
  schema: FormSchema;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onSaveDraft?: (data: Record<string, any>) => void;
  onChange?: (data: Record<string, any>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

// ============================================
// 🎨 Form Renderer Component
// ============================================

export const FormRenderer: React.FC<FormRendererProps> = ({
  schema,
  initialData = {},
  onSubmit,
  onSaveDraft,
  onChange,
  disabled = false,
  readOnly = false,
  className = '',
}) => {
  // State
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Auto-save
  useEffect(() => {
    if (schema.settings.autoSave && onSaveDraft) {
      const interval = setInterval(() => {
        onSaveDraft(formData);
      }, (schema.settings.autoSaveInterval || 30) * 1000);
      
      return () => clearInterval(interval);
    }
  }, [formData, schema.settings.autoSave, schema.settings.autoSaveInterval, onSaveDraft]);

  // Notify parent of changes
  useEffect(() => {
    onChange?.(formData);
  }, [formData, onChange]);

  // Handle field change
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when field is edited
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle field blur (mark as touched)
  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouched(prev => new Set(prev).add(fieldName));
  }, []);

  // Check if field should be visible (conditional logic)
  const isFieldVisible = useCallback((field: FormField): boolean => {
    if (!field.condition) return true;
    return evaluateCondition(field.condition, formData);
  }, [formData]);

  // Toggle section collapse
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Validate form
  const validate = useCallback((): boolean => {
    const visibleFields = schema.fields.filter(isFieldVisible);
    const validationErrors = validateFormData({ ...schema, fields: visibleFields }, formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [schema, formData, isFieldVisible]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched(new Set(schema.fields.map(f => f.name)));
    
    // Validate
    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-text');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = () => {
    onSaveDraft?.(formData);
  };

  // Get visible fields
  const visibleFields = schema.fields.filter(isFieldVisible);

  // Calculate progress
  const totalRequired = visibleFields.filter(f => f.validation?.required).length;
  const filledRequired = visibleFields.filter(f => {
    if (!f.validation?.required) return false;
    const value = formData[f.name];
    return value !== undefined && value !== null && value !== '';
  }).length;
  const progress = totalRequired > 0 ? Math.round((filledRequired / totalRequired) * 100) : 0;

  return (
    <form 
      className={`form-renderer ${className}`}
      onSubmit={handleSubmit}
      dir={schema.settings.direction}
    >
      {/* Form Header */}
      <div className="form-header">
        <h2 className="form-title">{schema.name}</h2>
        {schema.description && (
          <p className="form-description">{schema.description}</p>
        )}
      </div>

      {/* Progress Bar */}
      {schema.settings.showProgressBar && (
        <div className="progress-bar-wrapper">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{progress}% הושלם</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="form-fields">
        {visibleFields.map((field, index) => {
          // Check if field is in a collapsed section
          const isInCollapsedSection = schema.sections?.some(
            section => 
              section.fieldIds.includes(field.id) && 
              collapsedSections.has(section.id)
          );
          
          if (isInCollapsedSection) return null;

          return (
            <div 
              key={field.id}
              className={`form-field-wrapper width-${field.width || 'full'}`}
            >
              {schema.settings.showFieldNumbers && (
                <span className="field-number">{index + 1}</span>
              )}
              <FormFieldRenderer
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={touched.has(field.name) ? errors[field.name] : undefined}
                disabled={disabled || readOnly}
              />
            </div>
          );
        })}
      </div>

      {/* Signatures */}
      {(schema.settings.requireInspectorSignature || 
        schema.settings.requireClientSignature || 
        schema.settings.requireWitnessSignature) && (
        <div className="signatures-section">
          <h3>חתימות</h3>
          <div className="signatures-grid">
            {schema.settings.requireInspectorSignature && (
              <div className="signature-field">
                <label>חתימת בודק</label>
                <FormFieldRenderer
                  field={{
                    id: 'inspector_signature',
                    type: 'signature',
                    name: 'inspectorSignature',
                    label: 'חתימת בודק',
                    validation: { required: true }
                  }}
                  value={formData.inspectorSignature}
                  onChange={(value) => handleFieldChange('inspectorSignature', value)}
                  error={touched.has('inspectorSignature') ? errors.inspectorSignature : undefined}
                  disabled={disabled || readOnly}
                />
              </div>
            )}
            {schema.settings.requireClientSignature && (
              <div className="signature-field">
                <label>חתימת לקוח</label>
                <FormFieldRenderer
                  field={{
                    id: 'client_signature',
                    type: 'signature',
                    name: 'clientSignature',
                    label: 'חתימת לקוח',
                    validation: { required: true }
                  }}
                  value={formData.clientSignature}
                  onChange={(value) => handleFieldChange('clientSignature', value)}
                  error={touched.has('clientSignature') ? errors.clientSignature : undefined}
                  disabled={disabled || readOnly}
                />
              </div>
            )}
            {schema.settings.requireWitnessSignature && (
              <div className="signature-field">
                <label>חתימת עד</label>
                <FormFieldRenderer
                  field={{
                    id: 'witness_signature',
                    type: 'signature',
                    name: 'witnessSignature',
                    label: 'חתימת עד'
                  }}
                  value={formData.witnessSignature}
                  onChange={(value) => handleFieldChange('witnessSignature', value)}
                  disabled={disabled || readOnly}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Actions */}
      {!readOnly && (
        <div className="form-actions">
          {schema.settings.showSaveAsDraft && onSaveDraft && (
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn btn-secondary"
              disabled={disabled || isSubmitting}
            >
              שמור טיוטה
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={disabled || isSubmitting}
          >
            {isSubmitting ? 'שולח...' : (schema.settings.submitButtonText || 'שלח')}
          </button>
        </div>
      )}
    </form>
  );
};

// ============================================
// 🎨 Form Renderer Styles
// ============================================

export const FormRendererStyles = `
  .form-renderer {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .form-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .form-title {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 8px 0;
  }

  .form-description {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }

  .progress-bar-wrapper {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: #3b82f6;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 12px;
    color: #6b7280;
    min-width: 60px;
  }

  .form-fields {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .form-field-wrapper {
    position: relative;
  }

  .form-field-wrapper.width-full {
    width: 100%;
  }

  .form-field-wrapper.width-half {
    width: calc(50% - 8px);
  }

  .form-field-wrapper.width-third {
    width: calc(33.333% - 11px);
  }

  .field-number {
    position: absolute;
    top: 0;
    right: -24px;
    font-size: 12px;
    color: #9ca3af;
  }

  .form-field {
    margin-bottom: 8px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
  }

  .required {
    color: #ef4444;
    margin-right: 4px;
  }

  .form-input,
  .form-textarea,
  .form-select {
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-input.error,
  .form-textarea.error,
  .form-select.error {
    border-color: #ef4444;
  }

  .help-text {
    font-size: 12px;
    color: #6b7280;
    margin: 4px 0 0 0;
  }

  .error-text {
    font-size: 12px;
    color: #ef4444;
    margin: 4px 0 0 0;
  }

  .checkbox-group,
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .checkbox-label,
  .radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .checkbox-single {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .toggle-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toggle-button {
    width: 48px;
    height: 24px;
    padding: 2px;
    background: #d1d5db;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .toggle-button.active {
    background: #3b82f6;
  }

  .toggle-thumb {
    display: block;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
  }

  .toggle-button.active .toggle-thumb {
    transform: translateX(24px);
  }

  [dir="rtl"] .toggle-button.active .toggle-thumb {
    transform: translateX(-24px);
  }

  .file-input-wrapper {
    position: relative;
  }

  .file-input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .file-input-label {
    display: block;
    padding: 12px 16px;
    background: #f3f4f6;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .file-input-label:hover {
    border-color: #3b82f6;
  }

  .image-input-wrapper {
    position: relative;
  }

  .image-input-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: #f3f4f6;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    cursor: pointer;
  }

  .image-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .image-preview {
    position: relative;
    display: inline-block;
  }

  .image-preview img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
  }

  .remove-image {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }

  .hidden-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .signature-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .signature-canvas {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: crosshair;
    touch-action: none;
  }

  .signature-canvas.error {
    border-color: #ef4444;
  }

  .signature-canvas.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .clear-signature {
    align-self: flex-start;
    padding: 6px 12px;
    font-size: 12px;
    color: #6b7280;
    background: transparent;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
  }

  .clear-signature:hover {
    background: #f3f4f6;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 2px solid #e5e7eb;
    margin-top: 24px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .section-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: #6b7280;
  }

  .form-divider {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 24px 0;
  }

  .form-heading {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 16px 0 8px 0;
  }

  .form-paragraph {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 16px 0;
    line-height: 1.6;
  }

  .signatures-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 2px solid #e5e7eb;
  }

  .signatures-section h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 16px 0;
  }

  .signatures-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
  }

  .btn {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
    border: none;
  }

  .btn-primary:hover:not(:disabled) {
    background: #2563eb;
  }

  .btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #f3f4f6;
  }

  @media (max-width: 640px) {
    .form-renderer {
      padding: 16px;
    }

    .form-field-wrapper.width-half,
    .form-field-wrapper.width-third {
      width: 100%;
    }

    .signatures-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default FormRenderer;
