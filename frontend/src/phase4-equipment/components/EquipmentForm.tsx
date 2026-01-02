/**
 * AEGIS Equipment Form Component
 * טופס להוספה/עריכת ציוד
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Equipment,
  EquipmentStatus,
  EQUIPMENT_STATUS_LABELS,
  EQUIPMENT_TYPES,
  getEquipmentTypesByDomain,
  calculateNextInspectionDate,
} from '../types/equipment.types';
import { SafetyDomain, SAFETY_DOMAINS } from '../types/safety';

// ============================================
// 🎨 Props
// ============================================

interface EquipmentFormProps {
  equipment?: Equipment;
  clientId: string;
  onSave: (equipment: Partial<Equipment>) => Promise<void>;
  onCancel: () => void;
  locations?: { id: string; name: string }[];
}

// ============================================
// 📝 Equipment Form Component
// ============================================

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  equipment,
  clientId,
  onSave,
  onCancel,
  locations = [],
}) => {
  const isEdit = !!equipment;
  
  // Form state
  const [formData, setFormData] = useState<Partial<Equipment>>({
    clientId,
    status: 'active',
    inspectionFrequencyMonths: 12,
    ...equipment,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  // Get equipment types for selected domain
  const equipmentTypes = useMemo(() => {
    if (!formData.domain) return [];
    return getEquipmentTypesByDomain(formData.domain);
  }, [formData.domain]);

  // Update inspection frequency when equipment type changes
  useEffect(() => {
    if (formData.equipmentTypeId) {
      const eqType = EQUIPMENT_TYPES.find(t => t.id === formData.equipmentTypeId);
      if (eqType) {
        setFormData(prev => ({
          ...prev,
          inspectionFrequencyMonths: eqType.inspectionFrequency,
        }));
      }
    }
  }, [formData.equipmentTypeId]);

  // Calculate next inspection date
  useEffect(() => {
    if (formData.lastInspectionDate && formData.inspectionFrequencyMonths) {
      const nextDate = calculateNextInspectionDate(
        new Date(formData.lastInspectionDate),
        formData.inspectionFrequencyMonths
      );
      setFormData(prev => ({
        ...prev,
        nextInspectionDate: nextDate,
      }));
    }
  }, [formData.lastInspectionDate, formData.inspectionFrequencyMonths]);

  // Handle field change
  const handleChange = (field: keyof Equipment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'שם הציוד הוא שדה חובה';
    }
    if (!formData.domain) {
      newErrors.domain = 'יש לבחור תחום';
    }
    if (!formData.equipmentTypeId) {
      newErrors.equipmentTypeId = 'יש לבחור סוג ציוד';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving equipment:', error);
    } finally {
      setSaving(false);
    }
  };

  // Format date for input
  const formatDateForInput = (date?: Date | string): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Section navigation
  const sections = [
    { id: 'basic', label: 'פרטים בסיסיים', icon: '📦' },
    { id: 'identification', label: 'זיהוי', icon: '🏷️' },
    { id: 'technical', label: 'מפרט טכני', icon: '⚙️' },
    { id: 'inspection', label: 'בדיקות', icon: '📋' },
    { id: 'location', label: 'מיקום', icon: '📍' },
  ];

  return (
    <form className="equipment-form" onSubmit={handleSubmit} dir="rtl">
      {/* Header */}
      <div className="form-header">
        <h2>{isEdit ? 'עריכת ציוד' : 'הוספת ציוד חדש'}</h2>
        <button type="button" className="close-btn" onClick={onCancel}>✕</button>
      </div>

      {/* Section Navigation */}
      <div className="section-nav">
        {sections.map(section => (
          <button
            key={section.id}
            type="button"
            className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="section-icon">{section.icon}</span>
            <span className="section-label">{section.label}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="form-content">
        {/* Basic Info Section */}
        {activeSection === 'basic' && (
          <div className="form-section">
            <h3>פרטים בסיסיים</h3>
            
            <div className="form-row">
              <div className="form-field full">
                <label htmlFor="name">שם הציוד *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="לדוגמה: לייזר רפואי - חדר 101"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="domain">תחום בטיחות *</label>
                <select
                  id="domain"
                  value={formData.domain || ''}
                  onChange={e => {
                    handleChange('domain', e.target.value);
                    handleChange('equipmentTypeId', ''); // Reset equipment type
                  }}
                  className={errors.domain ? 'error' : ''}
                >
                  <option value="">בחר תחום...</option>
                  {Object.entries(SAFETY_DOMAINS).map(([key, domain]) => (
                    <option key={key} value={key}>{domain.name}</option>
                  ))}
                </select>
                {errors.domain && <span className="error-text">{errors.domain}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="equipmentTypeId">סוג ציוד *</label>
                <select
                  id="equipmentTypeId"
                  value={formData.equipmentTypeId || ''}
                  onChange={e => handleChange('equipmentTypeId', e.target.value)}
                  disabled={!formData.domain}
                  className={errors.equipmentTypeId ? 'error' : ''}
                >
                  <option value="">בחר סוג...</option>
                  {equipmentTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                {errors.equipmentTypeId && <span className="error-text">{errors.equipmentTypeId}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="status">סטטוס</label>
                <select
                  id="status"
                  value={formData.status || 'active'}
                  onChange={e => handleChange('status', e.target.value)}
                >
                  {Object.entries(EQUIPMENT_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label.he}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field full">
                <label htmlFor="description">תיאור</label>
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  rows={3}
                  placeholder="תיאור נוסף על הציוד..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Identification Section */}
        {activeSection === 'identification' && (
          <div className="form-section">
            <h3>פרטי זיהוי</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="serialNumber">מספר סידורי</label>
                <input
                  id="serialNumber"
                  type="text"
                  value={formData.serialNumber || ''}
                  onChange={e => handleChange('serialNumber', e.target.value)}
                  dir="ltr"
                  placeholder="S/N"
                />
              </div>

              <div className="form-field">
                <label htmlFor="internalId">מספר פנימי</label>
                <input
                  id="internalId"
                  type="text"
                  value={formData.internalId || ''}
                  onChange={e => handleChange('internalId', e.target.value)}
                  placeholder="מספר נכס פנימי"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="registrationNumber">מספר רישום (משרד העבודה)</label>
                <input
                  id="registrationNumber"
                  type="text"
                  value={formData.registrationNumber || ''}
                  onChange={e => handleChange('registrationNumber', e.target.value)}
                  placeholder="אם רלוונטי"
                />
              </div>

              <div className="form-field">
                <label htmlFor="certificateNumber">מספר תעודה</label>
                <input
                  id="certificateNumber"
                  type="text"
                  value={formData.certificateNumber || ''}
                  onChange={e => handleChange('certificateNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Technical Section */}
        {activeSection === 'technical' && (
          <div className="form-section">
            <h3>מפרט טכני</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="manufacturer">יצרן</label>
                <input
                  id="manufacturer"
                  type="text"
                  value={formData.manufacturer || ''}
                  onChange={e => handleChange('manufacturer', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="model">דגם</label>
                <input
                  id="model"
                  type="text"
                  value={formData.model || ''}
                  onChange={e => handleChange('model', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="manufactureYear">שנת ייצור</label>
                <input
                  id="manufactureYear"
                  type="number"
                  value={formData.manufactureYear || ''}
                  onChange={e => handleChange('manufactureYear', parseInt(e.target.value) || null)}
                  min="1950"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div className="form-field">
                <label htmlFor="installationDate">תאריך התקנה</label>
                <input
                  id="installationDate"
                  type="date"
                  value={formatDateForInput(formData.installationDate)}
                  onChange={e => handleChange('installationDate', e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field full">
                <label htmlFor="notes">הערות טכניות</label>
                <textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={e => handleChange('notes', e.target.value)}
                  rows={3}
                  placeholder="מפרטים טכניים נוספים, SWL, קיבולת וכו'..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Inspection Section */}
        {activeSection === 'inspection' && (
          <div className="form-section">
            <h3>בדיקות ותחזוקה</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="inspectionFrequencyMonths">תדירות בדיקה (חודשים)</label>
                <input
                  id="inspectionFrequencyMonths"
                  type="number"
                  value={formData.inspectionFrequencyMonths || 12}
                  onChange={e => handleChange('inspectionFrequencyMonths', parseInt(e.target.value) || 12)}
                  min="1"
                  max="60"
                />
                <span className="help-text">נקבע אוטומטית לפי סוג הציוד</span>
              </div>

              <div className="form-field">
                <label htmlFor="lastInspectionDate">תאריך בדיקה אחרונה</label>
                <input
                  id="lastInspectionDate"
                  type="date"
                  value={formatDateForInput(formData.lastInspectionDate)}
                  onChange={e => handleChange('lastInspectionDate', e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="lastInspectionResult">תוצאת בדיקה אחרונה</label>
                <select
                  id="lastInspectionResult"
                  value={formData.lastInspectionResult || ''}
                  onChange={e => handleChange('lastInspectionResult', e.target.value || null)}
                >
                  <option value="">לא נבדק</option>
                  <option value="pass">עבר</option>
                  <option value="conditional">עבר בתנאים</option>
                  <option value="fail">נכשל</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="nextInspectionDate">תאריך בדיקה הבאה</label>
                <input
                  id="nextInspectionDate"
                  type="date"
                  value={formatDateForInput(formData.nextInspectionDate)}
                  onChange={e => handleChange('nextInspectionDate', e.target.value ? new Date(e.target.value) : null)}
                />
                <span className="help-text">מחושב אוטומטית</span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="certificateExpiry">תוקף תעודה</label>
                <input
                  id="certificateExpiry"
                  type="date"
                  value={formatDateForInput(formData.certificateExpiry)}
                  onChange={e => handleChange('certificateExpiry', e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Location Section */}
        {activeSection === 'location' && (
          <div className="form-section">
            <h3>מיקום</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="locationId">מיקום</label>
                <select
                  id="locationId"
                  value={formData.locationId || ''}
                  onChange={e => handleChange('locationId', e.target.value || null)}
                >
                  <option value="">ללא מיקום מוגדר</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field full">
                <label htmlFor="locationDescription">תיאור מיקום</label>
                <input
                  id="locationDescription"
                  type="text"
                  value={formData.locationDescription || ''}
                  onChange={e => handleChange('locationDescription', e.target.value)}
                  placeholder="לדוגמה: קומה 2, חדר 205, ליד המעלית"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          ביטול
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? 'שומר...' : (isEdit ? 'עדכן' : 'הוסף')}
        </button>
      </div>
    </form>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const EquipmentFormStyles = `
.equipment-form {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.form-header h2 {
  margin: 0;
  font-size: 20px;
  color: #111827;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  border-radius: 8px;
}

.close-btn:hover {
  background: #e5e7eb;
}

.section-nav {
  display: flex;
  overflow-x: auto;
  padding: 0 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.section-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  color: #6b7280;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.section-btn:hover {
  color: #111827;
}

.section-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.section-icon {
  font-size: 16px;
}

.form-content {
  padding: 24px;
}

.form-section h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #374151;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-field {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-field.full {
  flex: 100%;
}

.form-field label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-field input,
.form-field select,
.form-field textarea {
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-field input.error,
.form-field select.error {
  border-color: #ef4444;
}

.form-field textarea {
  resize: vertical;
}

.form-field select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

.help-text {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: #f9fafb;
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

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }
  
  .section-nav {
    padding: 0 8px;
  }
  
  .section-btn {
    padding: 10px 12px;
  }
  
  .section-label {
    display: none;
  }
}
`;

export default EquipmentForm;
