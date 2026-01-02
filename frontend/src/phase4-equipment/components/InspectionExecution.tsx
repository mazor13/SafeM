/**
 * AEGIS Inspection Execution Flow
 * זרימת ביצוע בדיקה מלאה
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Equipment, getEquipmentTypeById } from '../types/equipment.types';
import { SAFETY_DOMAINS } from '../types/safety';

// ============================================
// 📋 Types
// ============================================

export type InspectionPhase = 
  | 'select_equipment'  // בחירת ציוד
  | 'pre_inspection'    // הכנה לבדיקה
  | 'inspection'        // ביצוע הבדיקה
  | 'findings'          // תיעוד ממצאים
  | 'summary'           // סיכום
  | 'signature'         // חתימות
  | 'complete';         // הושלם

export interface InspectionRecord {
  id?: string;
  
  // References
  equipmentId: string;
  clientId: string;
  templateId: string;
  
  // Inspector
  inspectorId: string;
  inspectorName: string;
  inspectorLicense?: string;
  
  // Dates
  scheduledDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  
  // Status
  phase: InspectionPhase;
  status: 'draft' | 'in_progress' | 'pending_review' | 'completed' | 'cancelled';
  
  // Form Data
  formData: Record<string, any>;
  
  // Results
  result?: 'pass' | 'pass_with_conditions' | 'fail';
  overallNotes?: string;
  
  // Findings
  findingIds?: string[];
  
  // Signatures
  inspectorSignature?: string;
  inspectorSignedAt?: Date;
  clientSignature?: string;
  clientSignedAt?: Date;
  clientSignerName?: string;
  
  // Certificate
  certificateNumber?: string;
  certificateExpiry?: Date;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InspectionTemplate {
  id: string;
  name: string;
  domain: string;
  equipmentTypes: string[];
  sections: InspectionSection[];
}

export interface InspectionSection {
  id: string;
  title: string;
  fields: InspectionField[];
}

export interface InspectionField {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'text' | 'number' | 'select' | 'textarea' | 'photo';
  required?: boolean;
  options?: { value: string; label: string }[];
  condition?: { field: string; value: any };
}

// ============================================
// 🎨 Props
// ============================================

interface InspectionExecutionProps {
  equipment: Equipment;
  template: InspectionTemplate;
  inspection?: InspectionRecord;
  inspectorId: string;
  inspectorName: string;
  inspectorLicense?: string;
  onSave: (inspection: Partial<InspectionRecord>) => Promise<void>;
  onComplete: (inspection: InspectionRecord) => Promise<void>;
  onCancel: () => void;
  onAddFinding?: (finding: any) => Promise<string>;
}

// ============================================
// 📋 Main Component
// ============================================

export const InspectionExecution: React.FC<InspectionExecutionProps> = ({
  equipment,
  template,
  inspection,
  inspectorId,
  inspectorName,
  inspectorLicense,
  onSave,
  onComplete,
  onCancel,
  onAddFinding,
}) => {
  // State
  const [currentPhase, setCurrentPhase] = useState<InspectionPhase>(
    inspection?.phase || 'pre_inspection'
  );
  const [formData, setFormData] = useState<Record<string, any>>(
    inspection?.formData || {}
  );
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [result, setResult] = useState<InspectionRecord['result']>(inspection?.result);
  const [overallNotes, setOverallNotes] = useState(inspection?.overallNotes || '');
  const [findings, setFindings] = useState<any[]>([]);
  const [inspectorSignature, setInspectorSignature] = useState<string | null>(null);
  const [clientSignature, setClientSignature] = useState<string | null>(null);
  const [clientSignerName, setClientSignerName] = useState('');
  const [saving, setSaving] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  const eqType = getEquipmentTypeById(equipment.equipmentTypeId);
  const domainInfo = SAFETY_DOMAINS[equipment.domain];

  // Auto-save
  useEffect(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 30000); // Auto-save every 30 seconds
    
    setAutoSaveTimer(timer);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [formData]);

  const handleAutoSave = async () => {
    if (currentPhase === 'complete') return;
    
    try {
      await onSave({
        equipmentId: equipment.id,
        clientId: equipment.clientId,
        templateId: template.id,
        inspectorId,
        inspectorName,
        inspectorLicense,
        phase: currentPhase,
        status: 'in_progress',
        formData,
        result,
        overallNotes,
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Handle field change
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  // Calculate progress
  const calculateProgress = () => {
    const allFields = template.sections.flatMap(s => s.fields);
    const requiredFields = allFields.filter(f => f.required);
    const filledRequired = requiredFields.filter(f => formData[f.id] !== undefined && formData[f.id] !== '');
    return Math.round((filledRequired.length / requiredFields.length) * 100) || 0;
  };

  // Check if section is complete
  const isSectionComplete = (section: InspectionSection) => {
    const requiredFields = section.fields.filter(f => f.required);
    return requiredFields.every(f => formData[f.id] !== undefined && formData[f.id] !== '');
  };

  // Navigate phases
  const goToPhase = (phase: InspectionPhase) => {
    setCurrentPhase(phase);
  };

  const nextSection = () => {
    if (currentSectionIndex < template.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      goToPhase('findings');
    }
  };

  const prevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    } else {
      goToPhase('pre_inspection');
    }
  };

  // Handle complete
  const handleComplete = async () => {
    if (!result) {
      alert('יש לבחור תוצאת בדיקה');
      return;
    }
    
    if (!inspectorSignature) {
      alert('חתימת בודק נדרשת');
      return;
    }

    setSaving(true);
    try {
      const completedInspection: InspectionRecord = {
        ...inspection,
        equipmentId: equipment.id,
        clientId: equipment.clientId,
        templateId: template.id,
        inspectorId,
        inspectorName,
        inspectorLicense,
        phase: 'complete',
        status: 'completed',
        formData,
        result,
        overallNotes,
        inspectorSignature,
        inspectorSignedAt: new Date(),
        clientSignature: clientSignature || undefined,
        clientSignedAt: clientSignature ? new Date() : undefined,
        clientSignerName: clientSignerName || undefined,
        completedAt: new Date(),
        findingIds: findings.map(f => f.id),
      };

      await onComplete(completedInspection);
    } finally {
      setSaving(false);
    }
  };

  // Add finding
  const handleAddFinding = async (findingData: any) => {
    if (onAddFinding) {
      const id = await onAddFinding({
        ...findingData,
        equipmentId: equipment.id,
        clientId: equipment.clientId,
      });
      setFindings(prev => [...prev, { ...findingData, id }]);
    }
  };

  // Phases configuration
  const phases: { id: InspectionPhase; label: string; icon: string }[] = [
    { id: 'pre_inspection', label: 'הכנה', icon: '📋' },
    { id: 'inspection', label: 'בדיקה', icon: '🔍' },
    { id: 'findings', label: 'ממצאים', icon: '📝' },
    { id: 'summary', label: 'סיכום', icon: '📊' },
    { id: 'signature', label: 'חתימות', icon: '✍️' },
  ];

  return (
    <div className="inspection-execution" dir="rtl">
      {/* Header */}
      <div className="execution-header">
        <div className="header-info">
          <span className="domain-badge" style={{ background: domainInfo?.color }}>
            {domainInfo?.icon} {domainInfo?.name}
          </span>
          <h2>{equipment.name}</h2>
          <p>{eqType?.name} | {equipment.serialNumber || equipment.internalId}</p>
        </div>
        <div className="header-actions">
          <span className="progress-badge">{calculateProgress()}% הושלם</span>
          <button className="btn btn-secondary" onClick={onCancel}>
            יציאה
          </button>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="phase-nav">
        {phases.map((phase, index) => {
          const isActive = phase.id === currentPhase;
          const isPast = phases.findIndex(p => p.id === currentPhase) > index;
          
          return (
            <button
              key={phase.id}
              className={`phase-btn ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
              onClick={() => goToPhase(phase.id)}
            >
              <span className="phase-icon">{phase.icon}</span>
              <span className="phase-label">{phase.label}</span>
            </button>
          );
        })}
      </div>

      {/* Phase Content */}
      <div className="phase-content">
        {/* Pre-Inspection Phase */}
        {currentPhase === 'pre_inspection' && (
          <PreInspectionPhase
            equipment={equipment}
            template={template}
            inspectorName={inspectorName}
            inspectorLicense={inspectorLicense}
            onStart={() => goToPhase('inspection')}
          />
        )}

        {/* Inspection Phase */}
        {currentPhase === 'inspection' && (
          <InspectionPhaseComponent
            template={template}
            formData={formData}
            currentSectionIndex={currentSectionIndex}
            onFieldChange={handleFieldChange}
            onNextSection={nextSection}
            onPrevSection={prevSection}
            isSectionComplete={isSectionComplete}
          />
        )}

        {/* Findings Phase */}
        {currentPhase === 'findings' && (
          <FindingsPhase
            findings={findings}
            onAddFinding={handleAddFinding}
            onContinue={() => goToPhase('summary')}
            onBack={() => {
              setCurrentSectionIndex(template.sections.length - 1);
              goToPhase('inspection');
            }}
          />
        )}

        {/* Summary Phase */}
        {currentPhase === 'summary' && (
          <SummaryPhase
            result={result}
            overallNotes={overallNotes}
            onResultChange={setResult}
            onNotesChange={setOverallNotes}
            findingsCount={findings.length}
            onContinue={() => goToPhase('signature')}
            onBack={() => goToPhase('findings')}
          />
        )}

        {/* Signature Phase */}
        {currentPhase === 'signature' && (
          <SignaturePhase
            inspectorName={inspectorName}
            inspectorSignature={inspectorSignature}
            clientSignature={clientSignature}
            clientSignerName={clientSignerName}
            onInspectorSign={setInspectorSignature}
            onClientSign={setClientSignature}
            onClientNameChange={setClientSignerName}
            onComplete={handleComplete}
            onBack={() => goToPhase('summary')}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
};

// ============================================
// 📋 Pre-Inspection Phase
// ============================================

interface PreInspectionPhaseProps {
  equipment: Equipment;
  template: InspectionTemplate;
  inspectorName: string;
  inspectorLicense?: string;
  onStart: () => void;
}

const PreInspectionPhase: React.FC<PreInspectionPhaseProps> = ({
  equipment,
  template,
  inspectorName,
  inspectorLicense,
  onStart,
}) => {
  const eqType = getEquipmentTypeById(equipment.equipmentTypeId);
  
  return (
    <div className="pre-inspection-phase">
      <h3>הכנה לבדיקה</h3>
      
      <div className="info-cards">
        <div className="info-card">
          <h4>פרטי הציוד</h4>
          <div className="info-row">
            <span className="label">שם:</span>
            <span className="value">{equipment.name}</span>
          </div>
          <div className="info-row">
            <span className="label">סוג:</span>
            <span className="value">{eqType?.name}</span>
          </div>
          {equipment.serialNumber && (
            <div className="info-row">
              <span className="label">מס' סידורי:</span>
              <span className="value" dir="ltr">{equipment.serialNumber}</span>
            </div>
          )}
          {equipment.manufacturer && (
            <div className="info-row">
              <span className="label">יצרן:</span>
              <span className="value">{equipment.manufacturer}</span>
            </div>
          )}
          {equipment.locationDescription && (
            <div className="info-row">
              <span className="label">מיקום:</span>
              <span className="value">{equipment.locationDescription}</span>
            </div>
          )}
        </div>

        <div className="info-card">
          <h4>פרטי הבודק</h4>
          <div className="info-row">
            <span className="label">שם:</span>
            <span className="value">{inspectorName}</span>
          </div>
          {inspectorLicense && (
            <div className="info-row">
              <span className="label">רישיון:</span>
              <span className="value">{inspectorLicense}</span>
            </div>
          )}
          <div className="info-row">
            <span className="label">תאריך:</span>
            <span className="value">{new Date().toLocaleDateString('he-IL')}</span>
          </div>
        </div>

        <div className="info-card">
          <h4>תבנית בדיקה</h4>
          <div className="info-row">
            <span className="label">שם:</span>
            <span className="value">{template.name}</span>
          </div>
          <div className="info-row">
            <span className="label">סעיפים:</span>
            <span className="value">{template.sections.length}</span>
          </div>
          <div className="info-row">
            <span className="label">שדות:</span>
            <span className="value">
              {template.sections.reduce((sum, s) => sum + s.fields.length, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="checklist">
        <h4>רשימת בדיקה מקדימה</h4>
        <label className="check-item">
          <input type="checkbox" />
          <span>הציוד נגיש ובטוח לבדיקה</span>
        </label>
        <label className="check-item">
          <input type="checkbox" />
          <span>יש גישה לתיעוד טכני</span>
        </label>
        <label className="check-item">
          <input type="checkbox" />
          <span>ציוד בדיקה זמין ומכויל</span>
        </label>
        <label className="check-item">
          <input type="checkbox" />
          <span>איש קשר מהלקוח זמין</span>
        </label>
      </div>

      <div className="phase-actions">
        <button className="btn btn-primary btn-lg" onClick={onStart}>
          התחל בדיקה ←
        </button>
      </div>
    </div>
  );
};

// ============================================
// 🔍 Inspection Phase
// ============================================

interface InspectionPhaseProps {
  template: InspectionTemplate;
  formData: Record<string, any>;
  currentSectionIndex: number;
  onFieldChange: (fieldId: string, value: any) => void;
  onNextSection: () => void;
  onPrevSection: () => void;
  isSectionComplete: (section: InspectionSection) => boolean;
}

const InspectionPhaseComponent: React.FC<InspectionPhaseProps> = ({
  template,
  formData,
  currentSectionIndex,
  onFieldChange,
  onNextSection,
  onPrevSection,
  isSectionComplete,
}) => {
  const currentSection = template.sections[currentSectionIndex];
  
  const shouldShowField = (field: InspectionField) => {
    if (!field.condition) return true;
    return formData[field.condition.field] === field.condition.value;
  };

  return (
    <div className="inspection-phase">
      {/* Section Progress */}
      <div className="section-progress">
        {template.sections.map((section, index) => (
          <div
            key={section.id}
            className={`section-dot ${index === currentSectionIndex ? 'active' : ''} ${isSectionComplete(section) ? 'complete' : ''}`}
            title={section.title}
          />
        ))}
      </div>

      {/* Section Header */}
      <div className="section-header">
        <span className="section-number">{currentSectionIndex + 1}/{template.sections.length}</span>
        <h3>{currentSection.title}</h3>
      </div>

      {/* Fields */}
      <div className="section-fields">
        {currentSection.fields.map(field => {
          if (!shouldShowField(field)) return null;
          
          return (
            <div key={field.id} className="field-wrapper">
              <label className="field-label">
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              
              {field.type === 'radio' && field.options && (
                <div className="radio-group">
                  {field.options.map(opt => (
                    <label key={opt.value} className="radio-option">
                      <input
                        type="radio"
                        name={field.id}
                        value={opt.value}
                        checked={formData[field.id] === opt.value}
                        onChange={() => onFieldChange(field.id, opt.value)}
                      />
                      <span className={`radio-label ${opt.value}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {field.type === 'checkbox' && (
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={formData[field.id] || false}
                    onChange={e => onFieldChange(field.id, e.target.checked)}
                  />
                  <span>כן</span>
                </label>
              )}
              
              {field.type === 'text' && (
                <input
                  type="text"
                  value={formData[field.id] || ''}
                  onChange={e => onFieldChange(field.id, e.target.value)}
                  className="text-input"
                />
              )}
              
              {field.type === 'number' && (
                <input
                  type="number"
                  value={formData[field.id] || ''}
                  onChange={e => onFieldChange(field.id, e.target.value)}
                  className="number-input"
                />
              )}
              
              {field.type === 'textarea' && (
                <textarea
                  value={formData[field.id] || ''}
                  onChange={e => onFieldChange(field.id, e.target.value)}
                  rows={3}
                  className="textarea-input"
                />
              )}
              
              {field.type === 'select' && field.options && (
                <select
                  value={formData[field.id] || ''}
                  onChange={e => onFieldChange(field.id, e.target.value)}
                  className="select-input"
                >
                  <option value="">בחר...</option>
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="phase-actions">
        <button className="btn btn-secondary" onClick={onPrevSection}>
          → הקודם
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onNextSection}
        >
          {currentSectionIndex === template.sections.length - 1 ? 'לממצאים' : 'הבא'} ←
        </button>
      </div>
    </div>
  );
};

// ============================================
// 📝 Findings Phase
// ============================================

interface FindingsPhaseProps {
  findings: any[];
  onAddFinding: (finding: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

const FindingsPhase: React.FC<FindingsPhaseProps> = ({
  findings,
  onAddFinding,
  onContinue,
  onBack,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newFinding, setNewFinding] = useState({
    title: '',
    description: '',
    severity: 'minor',
    category: 'other',
  });

  const handleAdd = () => {
    if (!newFinding.title.trim()) return;
    onAddFinding(newFinding);
    setNewFinding({ title: '', description: '', severity: 'minor', category: 'other' });
    setShowForm(false);
  };

  return (
    <div className="findings-phase">
      <h3>תיעוד ממצאים</h3>
      <p className="phase-description">
        תעד כל ליקוי או ממצא שדורש תיקון. אם אין ממצאים, ניתן להמשיך.
      </p>

      {/* Existing Findings */}
      {findings.length > 0 && (
        <div className="findings-list">
          {findings.map((finding, index) => (
            <div key={index} className={`finding-item severity-${finding.severity}`}>
              <span className="finding-severity">{finding.severity === 'critical' ? '🚨' : finding.severity === 'major' ? '⚠️' : '📝'}</span>
              <div className="finding-content">
                <strong>{finding.title}</strong>
                <p>{finding.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Finding Form */}
      {showForm ? (
        <div className="add-finding-form">
          <div className="form-field">
            <label>כותרת *</label>
            <input
              type="text"
              value={newFinding.title}
              onChange={e => setNewFinding(f => ({ ...f, title: e.target.value }))}
              placeholder="תיאור קצר של הממצא"
            />
          </div>
          <div className="form-field">
            <label>תיאור</label>
            <textarea
              value={newFinding.description}
              onChange={e => setNewFinding(f => ({ ...f, description: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="form-field">
            <label>חומרה</label>
            <select
              value={newFinding.severity}
              onChange={e => setNewFinding(f => ({ ...f, severity: e.target.value }))}
            >
              <option value="critical">🚨 קריטי</option>
              <option value="major">⚠️ משמעותי</option>
              <option value="minor">📝 קל</option>
              <option value="observation">💡 הערה</option>
            </select>
          </div>
          <div className="form-actions-inline">
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>ביטול</button>
            <button className="btn btn-primary" onClick={handleAdd}>הוסף ממצא</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-outline add-finding-btn" onClick={() => setShowForm(true)}>
          + הוסף ממצא
        </button>
      )}

      {/* Navigation */}
      <div className="phase-actions">
        <button className="btn btn-secondary" onClick={onBack}>→ חזור לבדיקה</button>
        <button className="btn btn-primary" onClick={onContinue}>
          לסיכום ← {findings.length === 0 && '(ללא ממצאים)'}
        </button>
      </div>
    </div>
  );
};

// ============================================
// 📊 Summary Phase
// ============================================

interface SummaryPhaseProps {
  result?: InspectionRecord['result'];
  overallNotes: string;
  onResultChange: (result: InspectionRecord['result']) => void;
  onNotesChange: (notes: string) => void;
  findingsCount: number;
  onContinue: () => void;
  onBack: () => void;
}

const SummaryPhase: React.FC<SummaryPhaseProps> = ({
  result,
  overallNotes,
  onResultChange,
  onNotesChange,
  findingsCount,
  onContinue,
  onBack,
}) => {
  return (
    <div className="summary-phase">
      <h3>סיכום הבדיקה</h3>

      <div className="result-selection">
        <label>תוצאת הבדיקה *</label>
        <div className="result-buttons">
          <button
            className={`result-btn pass ${result === 'pass' ? 'selected' : ''}`}
            onClick={() => onResultChange('pass')}
          >
            ✅ עבר
          </button>
          <button
            className={`result-btn conditional ${result === 'pass_with_conditions' ? 'selected' : ''}`}
            onClick={() => onResultChange('pass_with_conditions')}
          >
            ⚠️ עבר בתנאים
          </button>
          <button
            className={`result-btn fail ${result === 'fail' ? 'selected' : ''}`}
            onClick={() => onResultChange('fail')}
          >
            ❌ נכשל
          </button>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat">
          <span className="stat-value">{findingsCount}</span>
          <span className="stat-label">ממצאים</span>
        </div>
      </div>

      <div className="form-field">
        <label>הערות כלליות</label>
        <textarea
          value={overallNotes}
          onChange={e => onNotesChange(e.target.value)}
          rows={4}
          placeholder="הערות, המלצות, או פרטים נוספים..."
        />
      </div>

      <div className="phase-actions">
        <button className="btn btn-secondary" onClick={onBack}>→ חזור</button>
        <button 
          className="btn btn-primary" 
          onClick={onContinue}
          disabled={!result}
        >
          לחתימות ←
        </button>
      </div>
    </div>
  );
};

// ============================================
// ✍️ Signature Phase
// ============================================

interface SignaturePhaseProps {
  inspectorName: string;
  inspectorSignature: string | null;
  clientSignature: string | null;
  clientSignerName: string;
  onInspectorSign: (sig: string) => void;
  onClientSign: (sig: string) => void;
  onClientNameChange: (name: string) => void;
  onComplete: () => void;
  onBack: () => void;
  saving: boolean;
}

const SignaturePhase: React.FC<SignaturePhaseProps> = ({
  inspectorName,
  inspectorSignature,
  clientSignature,
  clientSignerName,
  onInspectorSign,
  onClientSign,
  onClientNameChange,
  onComplete,
  onBack,
  saving,
}) => {
  return (
    <div className="signature-phase">
      <h3>חתימות</h3>

      {/* Inspector Signature */}
      <div className="signature-box">
        <h4>חתימת הבודק *</h4>
        <p className="signer-name">{inspectorName}</p>
        <SignaturePad
          signature={inspectorSignature}
          onSign={onInspectorSign}
        />
      </div>

      {/* Client Signature */}
      <div className="signature-box optional">
        <h4>חתימת נציג הלקוח (אופציונלי)</h4>
        <input
          type="text"
          placeholder="שם החותם"
          value={clientSignerName}
          onChange={e => onClientNameChange(e.target.value)}
          className="signer-name-input"
        />
        <SignaturePad
          signature={clientSignature}
          onSign={onClientSign}
        />
      </div>

      <div className="phase-actions">
        <button className="btn btn-secondary" onClick={onBack} disabled={saving}>
          → חזור
        </button>
        <button 
          className="btn btn-primary btn-lg" 
          onClick={onComplete}
          disabled={!inspectorSignature || saving}
        >
          {saving ? 'שומר...' : '✓ סיים וצור דו"ח'}
        </button>
      </div>
    </div>
  );
};

// ============================================
// ✍️ Signature Pad Component
// ============================================

interface SignaturePadProps {
  signature: string | null;
  onSign: (signature: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ signature, onSign }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load existing signature
    if (signature) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = signature;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      onSign(canvas.toDataURL());
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onSign('');
    }
  };

  return (
    <div className="signature-pad-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="signature-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button type="button" className="clear-btn" onClick={clear}>
        נקה
      </button>
    </div>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const InspectionExecutionStyles = `
.inspection-execution {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
}

.execution-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.header-info h2 {
  margin: 8px 0 4px;
  font-size: 20px;
}

.header-info p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.domain-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: white;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-badge {
  padding: 6px 12px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

/* Phase Navigation */
.phase-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.phase-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.phase-btn:hover {
  border-color: #3b82f6;
}

.phase-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.phase-btn.completed {
  border-color: #22c55e;
  background: #f0fdf4;
}

.phase-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.phase-label {
  font-size: 12px;
  color: #6b7280;
}

.phase-btn.active .phase-label {
  color: #1d4ed8;
  font-weight: 500;
}

/* Phase Content */
.phase-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.phase-content h3 {
  margin: 0 0 16px;
  font-size: 18px;
}

.phase-description {
  color: #6b7280;
  margin-bottom: 20px;
}

/* Pre-Inspection */
.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.info-card h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #6b7280;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
}

.info-row .label {
  color: #6b7280;
}

.info-row .value {
  font-weight: 500;
}

.checklist {
  margin-bottom: 24px;
}

.checklist h4 {
  margin: 0 0 12px;
  font-size: 14px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
}

/* Inspection Phase */
.section-progress {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.section-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e5e7eb;
}

.section-dot.active {
  background: #3b82f6;
  transform: scale(1.2);
}

.section-dot.complete {
  background: #22c55e;
}

.section-header {
  text-align: center;
  margin-bottom: 24px;
}

.section-number {
  font-size: 12px;
  color: #6b7280;
}

.section-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.field-wrapper {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.field-label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
}

.field-label .required {
  color: #ef4444;
  margin-right: 4px;
}

.radio-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.radio-label {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.radio-option input:checked + .radio-label.pass {
  background: #d1fae5;
  border-color: #22c55e;
  color: #065f46;
}

.radio-option input:checked + .radio-label.fail {
  background: #fee2e2;
  border-color: #ef4444;
  color: #991b1b;
}

.radio-option input:checked + .radio-label.na {
  background: #f3f4f6;
  border-color: #6b7280;
}

.text-input,
.number-input,
.textarea-input,
.select-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

/* Findings Phase */
.findings-list {
  margin-bottom: 20px;
}

.finding-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  border-right: 4px solid #6b7280;
}

.finding-item.severity-critical {
  border-right-color: #dc2626;
  background: #fef2f2;
}

.finding-item.severity-major {
  border-right-color: #f97316;
  background: #fff7ed;
}

.finding-severity {
  font-size: 20px;
}

.finding-content strong {
  display: block;
  margin-bottom: 4px;
}

.finding-content p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.add-finding-form {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;
}

.add-finding-btn {
  width: 100%;
  padding: 16px;
  border: 2px dashed #d1d5db;
  background: transparent;
  color: #6b7280;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-finding-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.form-actions-inline {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
}

/* Summary Phase */
.result-selection {
  margin-bottom: 24px;
}

.result-selection label {
  display: block;
  font-weight: 500;
  margin-bottom: 12px;
}

.result-buttons {
  display: flex;
  gap: 12px;
}

.result-btn {
  flex: 1;
  padding: 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.result-btn.pass.selected {
  background: #d1fae5;
  border-color: #22c55e;
}

.result-btn.conditional.selected {
  background: #fef3c7;
  border-color: #f59e0b;
}

.result-btn.fail.selected {
  background: #fee2e2;
  border-color: #ef4444;
}

.summary-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.summary-stats .stat {
  padding: 16px 24px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.summary-stats .stat-value {
  font-size: 24px;
  font-weight: 700;
}

.summary-stats .stat-label {
  font-size: 12px;
  color: #6b7280;
}

/* Signature Phase */
.signature-box {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.signature-box h4 {
  margin: 0 0 8px;
}

.signature-box.optional {
  opacity: 0.8;
}

.signer-name {
  color: #6b7280;
  margin: 0 0 12px;
}

.signer-name-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-bottom: 12px;
}

.signature-pad-container {
  position: relative;
}

.signature-canvas {
  width: 100%;
  height: 150px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: crosshair;
}

.clear-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 12px;
  font-size: 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

/* Form Fields */
.form-field {
  margin-bottom: 16px;
}

.form-field label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

/* Actions */
.phase-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  margin-top: 24px;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
}

.btn-lg {
  padding: 14px 28px;
  font-size: 16px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline {
  background: transparent;
  border: 2px dashed #d1d5db;
  color: #6b7280;
}

@media (max-width: 600px) {
  .phase-nav {
    overflow-x: auto;
  }
  
  .phase-btn {
    padding: 10px 14px;
  }
  
  .result-buttons {
    flex-direction: column;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
}
`;

export default InspectionExecution;
