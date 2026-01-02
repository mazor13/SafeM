// ===========================================
// AEGIS - useFilledForm Hook
// Phase 2: ניהול מילוי טפסים
// ===========================================

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore as db } from '../firebase';
import { Template, TemplateField, TemplateSection } from '../types/template-types';

// ===========================================
// TYPES
// ===========================================

export type FilledFormStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface FilledForm {
  id: string;
  templateId: string;
  templateVersion: number;
  tenantId: string;
  clientId?: string;
  
  // סטטוס
  status: FilledFormStatus;
  
  // נתונים
  data: Record<string, any>;  // fieldId -> value
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  
  // הגשה
  submittedAt?: Timestamp;
  submittedBy?: string;
  
  // אישור
  approvedAt?: Timestamp;
  approvedBy?: string;
  rejectionReason?: string;
  
  // Prefill
  prefillSourceId?: string;  // ID של הטופס שממנו בוצע prefill
  
  // הערות
  notes?: string;
}

export interface FieldError {
  fieldId: string;
  message: string;
}

export interface UseFilledFormOptions {
  formId?: string;           // אם קיים - טעינת טופס קיים
  templateId?: string;       // אם חדש - יצירה מתבנית
  clientId?: string;
  tenantId: string;
  userId: string;
  autoSave?: boolean;        // שמירה אוטומטית
  autoSaveInterval?: number; // מילישניות
}

export interface UseFilledFormReturn {
  // מצב
  form: FilledForm | null;
  template: Template | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  
  // נתונים
  data: Record<string, any>;
  errors: FieldError[];
  progress: number;          // 0-100
  
  // פעולות
  setValue: (fieldId: string, value: any) => void;
  setValues: (values: Record<string, any>) => void;
  validate: () => boolean;
  validateField: (fieldId: string) => FieldError | null;
  
  // שמירה
  saveDraft: () => Promise<void>;
  submit: () => Promise<void>;
  
  // Prefill
  loadPrefillData: (sourceFormId: string) => Promise<void>;
  getPreviousForm: () => Promise<FilledForm | null>;
  
  // ניווט
  hasUnsavedChanges: boolean;
}

// ===========================================
// HOOK
// ===========================================

export function useFilledForm(options: UseFilledFormOptions): UseFilledFormReturn {
  const {
    formId,
    templateId,
    clientId,
    tenantId,
    userId,
    autoSave = true,
    autoSaveInterval = 30000, // 30 שניות
  } = options;

  // State
  const [form, setForm] = useState<FilledForm | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // ===========================================
  // LOAD DATA
  // ===========================================

  useEffect(() => {
    loadData();
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formId, templateId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // טעינת טופס קיים
      if (formId) {
        const formDoc = await getDoc(doc(db, 'filledForms', formId));
        if (!formDoc.exists()) {
          throw new Error('הטופס לא נמצא');
        }
        
        const formData = { id: formDoc.id, ...formDoc.data() } as FilledForm;
        setForm(formData);
        setData(formData.data || {});
        lastSavedDataRef.current = JSON.stringify(formData.data || {});

        // טעינת התבנית
        const templateDoc = await getDoc(doc(db, 'templates', formData.templateId));
        if (templateDoc.exists()) {
          setTemplate({ id: templateDoc.id, ...templateDoc.data() } as Template);
        }
      }
      // יצירת טופס חדש מתבנית
      else if (templateId) {
        const templateDoc = await getDoc(doc(db, 'templates', templateId));
        if (!templateDoc.exists()) {
          throw new Error('התבנית לא נמצאה');
        }

        const templateData = { id: templateDoc.id, ...templateDoc.data() } as Template;
        setTemplate(templateData);

        // יצירת טופס חדש
        const newFormId = `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const initialData = getInitialData(templateData);
        
        const newForm: FilledForm = {
          id: newFormId,
          templateId: templateData.id,
          templateVersion: templateData.version,
          tenantId,
          ...(clientId ? { clientId } : {}),
          status: 'draft',
          data: initialData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          createdBy: userId,
        };

        setForm(newForm);
        setData(initialData);
        lastSavedDataRef.current = JSON.stringify(initialData);

        // שמירה ראשונית
        await setDoc(doc(db, 'filledForms', newFormId), {
          ...newForm,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Error loading form:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת הטופס');
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // GET INITIAL DATA
  // ===========================================

  const getInitialData = (template: Template): Record<string, any> => {
    const initialData: Record<string, any> = {};
    
    template.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        }
      });
    });

    return initialData;
  };

  // ===========================================
  // SET VALUE
  // ===========================================

  const setValue = useCallback((fieldId: string, value: any) => {
    setData(prev => {
      const newData = { ...prev, [fieldId]: value };
      setHasUnsavedChanges(JSON.stringify(newData) !== lastSavedDataRef.current);
      return newData;
    });

    // נקה שגיאה לשדה זה
    setErrors(prev => prev.filter(e => e.fieldId !== fieldId));

    // Auto-save
    if (autoSave) {
      scheduleAutoSave();
    }
  }, [autoSave]);

  const setValues = useCallback((values: Record<string, any>) => {
    setData(prev => {
      const newData = { ...prev, ...values };
      setHasUnsavedChanges(JSON.stringify(newData) !== lastSavedDataRef.current);
      return newData;
    });

    if (autoSave) {
      scheduleAutoSave();
    }
  }, [autoSave]);

  // ===========================================
  // AUTO-SAVE
  // ===========================================

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft();
    }, autoSaveInterval);
  }, [autoSaveInterval]);

  // ===========================================
  // VALIDATION
  // ===========================================

  const validateField = useCallback((fieldId: string): FieldError | null => {
    if (!template) return null;

    let field: TemplateField | undefined;
    for (const section of template.sections) {
      field = section.fields.find(f => f.id === fieldId);
      if (field) break;
    }

    if (!field) return null;

    const value = data[fieldId];
    const validation = field.validation;

    // Required check
    if (validation?.required) {
      if (value === undefined || value === null || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        return { fieldId, message: 'שדה חובה' };
      }
    }

    // Skip further validation if empty and not required
    if (value === undefined || value === null || value === '') {
      return null;
    }

    // Type-specific validation
    switch (field.type) {
      case 'text':
      case 'textarea':
        if (validation?.minLength && String(value).length < validation.minLength) {
          return { fieldId, message: `מינימום ${validation.minLength} תווים` };
        }
        if (validation?.maxLength && String(value).length > validation.maxLength) {
          return { fieldId, message: `מקסימום ${validation.maxLength} תווים` };
        }
        if (validation?.pattern) {
          const regex = new RegExp(validation.pattern);
          if (!regex.test(String(value))) {
            return { fieldId, message: validation.patternMessage || 'פורמט לא תקין' };
          }
        }
        break;

      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return { fieldId, message: 'יש להזין מספר' };
        }
        if (validation?.min !== undefined && numValue < validation.min) {
          return { fieldId, message: `מינימום ${validation.min}` };
        }
        if (validation?.max !== undefined && numValue > validation.max) {
          return { fieldId, message: `מקסימום ${validation.max}` };
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          return { fieldId, message: 'כתובת אימייל לא תקינה' };
        }
        break;

      case 'phone':
        const phoneRegex = /^[\d\-\+\(\)\s]{7,20}$/;
        if (!phoneRegex.test(String(value))) {
          return { fieldId, message: 'מספר טלפון לא תקין' };
        }
        break;

      case 'date':
        if (validation?.minDate && value < validation.minDate) {
          return { fieldId, message: 'תאריך מוקדם מדי' };
        }
        if (validation?.maxDate && value > validation.maxDate) {
          return { fieldId, message: 'תאריך מאוחר מדי' };
        }
        break;

      case 'multiselect':
      case 'checkboxGroup':
        if (validation?.minLength && Array.isArray(value) && value.length < validation.minLength) {
          return { fieldId, message: `יש לבחור לפחות ${validation.minLength} אפשרויות` };
        }
        if (validation?.maxLength && Array.isArray(value) && value.length > validation.maxLength) {
          return { fieldId, message: `מקסימום ${validation.maxLength} אפשרויות` };
        }
        break;
    }

    return null;
  }, [template, data]);

  const validate = useCallback((): boolean => {
    if (!template) return false;

    const newErrors: FieldError[] = [];

    template.sections.forEach(section => {
      // Check if section is visible (conditional logic)
      if (isSectionVisible(section)) {
        section.fields.forEach(field => {
          // Check if field is visible
          if (isFieldVisible(field)) {
            const error = validateField(field.id);
            if (error) {
              newErrors.push(error);
            }
          }
        });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [template, validateField]);

  // ===========================================
  // CONDITIONAL LOGIC HELPERS
  // ===========================================

  const isSectionVisible = (section: TemplateSection): boolean => {
    if (!section.conditionalLogic?.enabled) return true;
    return evaluateConditions(section.conditionalLogic);
  };

  const isFieldVisible = (field: TemplateField): boolean => {
    if (!field.conditionalLogic?.enabled) return true;
    return evaluateConditions(field.conditionalLogic);
  };

  const evaluateConditions = (logic: any): boolean => {
    if (!logic?.conditions?.length) return true;

    const results = logic.conditions.map((condition: any) => {
      const fieldValue = data[condition.fieldId];
      return evaluateCondition(fieldValue, condition.operator, condition.value);
    });

    if (logic.logicType === 'all') {
      return results.every((r: boolean) => r);
    } else {
      return results.some((r: boolean) => r);
    }
  };

  const evaluateCondition = (fieldValue: any, operator: string, compareValue: any): boolean => {
    switch (operator) {
      case 'equals':
        return fieldValue === compareValue;
      case 'not_equals':
        return fieldValue !== compareValue;
      case 'contains':
        return String(fieldValue || '').includes(String(compareValue));
      case 'not_contains':
        return !String(fieldValue || '').includes(String(compareValue));
      case 'greater_than':
        return Number(fieldValue) > Number(compareValue);
      case 'less_than':
        return Number(fieldValue) < Number(compareValue);
      case 'is_empty':
        return !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'is_not_empty':
        return fieldValue && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      case 'in_list':
        return Array.isArray(compareValue) && compareValue.includes(fieldValue);
      default:
        return true;
    }
  };

  // ===========================================
  // CALCULATE PROGRESS
  // ===========================================

  const progress = (() => {
    if (!template) return 0;

    let totalRequired = 0;
    let filledRequired = 0;

    template.sections.forEach(section => {
      if (isSectionVisible(section)) {
        section.fields.forEach(field => {
          if (isFieldVisible(field) && field.validation?.required) {
            totalRequired++;
            const value = data[field.id];
            if (value !== undefined && value !== null && value !== '' &&
                (!Array.isArray(value) || value.length > 0)) {
              filledRequired++;
            }
          }
        });
      }
    });

    if (totalRequired === 0) return 100;
    return Math.round((filledRequired / totalRequired) * 100);
  })();

  // ===========================================
  // SAVE DRAFT
  // ===========================================

  const saveDraft = useCallback(async () => {
    if (!form) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'filledForms', form.id), {
        data,
        status: 'draft',
        updatedAt: serverTimestamp(),
      });

      lastSavedDataRef.current = JSON.stringify(data);
      setHasUnsavedChanges(false);
      
      setForm(prev => prev ? { ...prev, data, updatedAt: Timestamp.now() } : null);
    } catch (err) {
      console.error('Error saving draft:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [form, data]);

  // ===========================================
  // SUBMIT
  // ===========================================

  const submit = useCallback(async () => {
    if (!form) return;

    // Validate first
    if (!validate()) {
      throw new Error('יש לתקן את השגיאות לפני ההגשה');
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'filledForms', form.id), {
        data,
        status: 'submitted',
        updatedAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
        submittedBy: userId,
      });

      lastSavedDataRef.current = JSON.stringify(data);
      setHasUnsavedChanges(false);
      
      setForm(prev => prev ? {
        ...prev,
        data,
        status: 'submitted',
        updatedAt: Timestamp.now(),
        submittedAt: Timestamp.now(),
        submittedBy: userId,
      } : null);
    } catch (err) {
      console.error('Error submitting form:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [form, data, validate, userId]);

  // ===========================================
  // PREFILL
  // ===========================================

  const getPreviousForm = useCallback(async (): Promise<FilledForm | null> => {
    if (!template || !clientId) return null;

    try {
      const q = query(
        collection(db, 'filledForms'),
        where('templateId', '==', template.id),
        where('clientId', '==', clientId),
        where('status', '==', 'submitted'),
        orderBy('submittedAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as FilledForm;
    } catch (err) {
      console.error('Error getting previous form:', err);
      return null;
    }
  }, [template, clientId]);

  const loadPrefillData = useCallback(async (sourceFormId: string) => {
    if (!template) return;

    try {
      const sourceDoc = await getDoc(doc(db, 'filledForms', sourceFormId));
      if (!sourceDoc.exists()) {
        throw new Error('טופס המקור לא נמצא');
      }

      const sourceData = sourceDoc.data().data || {};
      const prefillData: Record<string, any> = {};

      // Copy only fields with appropriate prefill behavior
      template.sections.forEach(section => {
        section.fields.forEach(field => {
          const behavior = field.prefillBehavior || 'optional';
          
          if (behavior === 'always' || behavior === 'optional') {
            if (sourceData[field.id] !== undefined) {
              prefillData[field.id] = sourceData[field.id];
            }
          }
          // 'never' and 'reference' fields are not copied
        });
      });

      setValues(prefillData);

      // Update form with prefill source
      if (form) {
        await updateDoc(doc(db, 'filledForms', form.id), {
          prefillSourceId: sourceFormId,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Error loading prefill data:', err);
      throw err;
    }
  }, [template, form, setValues]);

  // ===========================================
  // RETURN
  // ===========================================

  return {
    form,
    template,
    loading,
    error,
    saving,
    data,
    errors,
    progress,
    setValue,
    setValues,
    validate,
    validateField,
    saveDraft,
    submit,
    loadPrefillData,
    getPreviousForm,
    hasUnsavedChanges,
  };
}

// ===========================================
// ADDITIONAL HOOKS
// ===========================================

/**
 * טעינת רשימת טפסים מלאים
 */
export function useFilledForms(options: {
  tenantId: string;
  clientId?: string;
  templateId?: string;
  status?: FilledFormStatus;
}) {
  const [forms, setForms] = useState<FilledForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, [options.tenantId, options.clientId, options.templateId, options.status]);

  const loadForms = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'filledForms'),
        where('tenantId', '==', options.tenantId)
      );

      if (options.clientId) {
        q = query(q, where('clientId', '==', options.clientId));
      }
      if (options.templateId) {
        q = query(q, where('templateId', '==', options.templateId));
      }
      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }

      q = query(q, orderBy('updatedAt', 'desc'));

      const snapshot = await getDocs(q);
      const formsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FilledForm[];

      setForms(formsList);
    } catch (err) {
      console.error('Error loading forms:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת טפסים');
    } finally {
      setLoading(false);
    }
  };

  return { forms, loading, error, reload: loadForms };
}