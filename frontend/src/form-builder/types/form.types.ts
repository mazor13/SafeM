/**
 * AEGIS Form Builder Types
 * JSON Schema based form definition system
 */

// ============================================
// 📋 Field Types
// ============================================

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'multi-select'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'file'
  | 'image'
  | 'signature'
  | 'section'
  | 'divider'
  | 'heading'
  | 'paragraph';

// ============================================
// 🔧 Field Definition
// ============================================

export interface FormField {
  id: string;
  type: FieldType;
  name: string;
  label: string;
  labelEn?: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  
  // Validation
  validation?: FieldValidation;
  
  // Options for select/radio/checkbox
  options?: FieldOption[];
  
  // Conditional display
  condition?: FieldCondition;
  
  // Layout
  width?: 'full' | 'half' | 'third';
  order?: number;
  
  // Field-specific settings
  settings?: FieldSettings;
}

export interface FieldValidation {
  required?: boolean;
  requiredMessage?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  customValidation?: string; // Function name for custom validation
}

export interface FieldOption {
  value: string;
  label: string;
  labelEn?: string;
}

export interface FieldCondition {
  field: string;           // ID of the field to check
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value?: any;
}

export interface FieldSettings {
  // Text fields
  multiline?: boolean;
  rows?: number;
  
  // Number fields
  step?: number;
  prefix?: string;
  suffix?: string;
  
  // Date fields
  minDate?: string;
  maxDate?: string;
  dateFormat?: string;
  
  // File fields
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  
  // Signature fields
  width?: number;
  height?: number;
  penColor?: string;
  
  // Section fields
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// ============================================
// 📝 Form Schema
// ============================================

export interface FormSchema {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  version: string;
  
  // Form category
  category?: string;
  
  // Fields
  fields: FormField[];
  
  // Sections for grouping
  sections?: FormSection[];
  
  // Form settings
  settings: FormSettings;
  
  // Metadata
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface FormSection {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  order: number;
  fieldIds: string[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormSettings {
  // Display
  direction: 'rtl' | 'ltr';
  showProgressBar?: boolean;
  showFieldNumbers?: boolean;
  
  // Submission
  submitButtonText?: string;
  submitButtonTextEn?: string;
  showSaveAsDraft?: boolean;
  
  // Signatures
  requireInspectorSignature?: boolean;
  requireClientSignature?: boolean;
  requireWitnessSignature?: boolean;
  
  // Auto-save
  autoSave?: boolean;
  autoSaveInterval?: number; // seconds
  
  // PDF
  generatePdf?: boolean;
  pdfTemplate?: string;
}

// ============================================
// 📊 Form Data (Filled Form)
// ============================================

export interface FormData {
  id: string;
  schemaId: string;
  schemaVersion: string;
  
  // Values
  values: Record<string, any>;
  
  // Status
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  
  // Signatures
  signatures?: {
    inspector?: SignatureData;
    client?: SignatureData;
    witness?: SignatureData;
  };
  
  // Metadata
  startedAt?: Date;
  submittedAt?: Date;
  submittedBy?: string;
  
  // Related entities
  clientId?: string;
  locationId?: string;
  equipmentId?: string;
  inspectionId?: string;
}

export interface SignatureData {
  dataUrl: string;
  signedAt: Date;
  signedBy: string;
  ipAddress?: string;
}

// ============================================
// 🎨 Form Builder State
// ============================================

export interface FormBuilderState {
  schema: FormSchema;
  selectedFieldId: string | null;
  isDragging: boolean;
  history: FormSchema[];
  historyIndex: number;
}

export type FormBuilderAction =
  | { type: 'ADD_FIELD'; field: FormField }
  | { type: 'UPDATE_FIELD'; fieldId: string; updates: Partial<FormField> }
  | { type: 'DELETE_FIELD'; fieldId: string }
  | { type: 'REORDER_FIELDS'; fromIndex: number; toIndex: number }
  | { type: 'SELECT_FIELD'; fieldId: string | null }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<FormSettings> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_SCHEMA'; schema: FormSchema };

// ============================================
// 🔌 Field Registry
// ============================================

export interface FieldTypeConfig {
  type: FieldType;
  label: string;
  labelEn: string;
  icon: string;
  category: 'input' | 'selection' | 'media' | 'layout';
  defaultSettings?: Partial<FieldSettings>;
  defaultValidation?: Partial<FieldValidation>;
}

export const FIELD_TYPE_CONFIGS: FieldTypeConfig[] = [
  // Input fields
  { type: 'text', label: 'טקסט', labelEn: 'Text', icon: 'Type', category: 'input' },
  { type: 'textarea', label: 'טקסט ארוך', labelEn: 'Text Area', icon: 'AlignLeft', category: 'input' },
  { type: 'number', label: 'מספר', labelEn: 'Number', icon: 'Hash', category: 'input' },
  { type: 'email', label: 'אימייל', labelEn: 'Email', icon: 'Mail', category: 'input' },
  { type: 'phone', label: 'טלפון', labelEn: 'Phone', icon: 'Phone', category: 'input' },
  { type: 'date', label: 'תאריך', labelEn: 'Date', icon: 'Calendar', category: 'input' },
  { type: 'time', label: 'שעה', labelEn: 'Time', icon: 'Clock', category: 'input' },
  { type: 'datetime', label: 'תאריך ושעה', labelEn: 'Date & Time', icon: 'CalendarClock', category: 'input' },
  
  // Selection fields
  { type: 'select', label: 'בחירה', labelEn: 'Select', icon: 'ChevronDown', category: 'selection' },
  { type: 'multi-select', label: 'בחירה מרובה', labelEn: 'Multi Select', icon: 'CheckSquare', category: 'selection' },
  { type: 'radio', label: 'כפתורי רדיו', labelEn: 'Radio', icon: 'Circle', category: 'selection' },
  { type: 'checkbox', label: 'תיבת סימון', labelEn: 'Checkbox', icon: 'CheckSquare', category: 'selection' },
  { type: 'toggle', label: 'מתג', labelEn: 'Toggle', icon: 'ToggleRight', category: 'selection' },
  
  // Media fields
  { type: 'file', label: 'קובץ', labelEn: 'File', icon: 'File', category: 'media' },
  { type: 'image', label: 'תמונה', labelEn: 'Image', icon: 'Image', category: 'media' },
  { type: 'signature', label: 'חתימה', labelEn: 'Signature', icon: 'PenTool', category: 'media' },
  
  // Layout fields
  { type: 'section', label: 'מקטע', labelEn: 'Section', icon: 'Layout', category: 'layout' },
  { type: 'divider', label: 'קו מפריד', labelEn: 'Divider', icon: 'Minus', category: 'layout' },
  { type: 'heading', label: 'כותרת', labelEn: 'Heading', icon: 'Heading', category: 'layout' },
  { type: 'paragraph', label: 'פסקה', labelEn: 'Paragraph', icon: 'FileText', category: 'layout' },
];

// ============================================
// 🛠️ Helper Functions
// ============================================

export function createEmptyField(type: FieldType): FormField {
  const config = FIELD_TYPE_CONFIGS.find(c => c.type === type);
  return {
    id: generateId(),
    type,
    name: `field_${Date.now()}`,
    label: config?.label || type,
    width: 'full',
    validation: config?.defaultValidation,
    settings: config?.defaultSettings,
  };
}

export function createEmptySchema(): FormSchema {
  return {
    id: generateId(),
    name: 'טופס חדש',
    nameEn: 'New Form',
    version: '1.0.0',
    fields: [],
    settings: {
      direction: 'rtl',
      showProgressBar: false,
      showFieldNumbers: false,
      submitButtonText: 'שלח',
      submitButtonTextEn: 'Submit',
      showSaveAsDraft: true,
      autoSave: true,
      autoSaveInterval: 30,
    },
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function validateFormData(
  schema: FormSchema,
  data: Record<string, any>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const field of schema.fields) {
    const value = data[field.name];
    const validation = field.validation;
    
    if (!validation) continue;
    
    // Required check
    if (validation.required && (value === undefined || value === null || value === '')) {
      errors[field.name] = validation.requiredMessage || 'שדה חובה';
      continue;
    }
    
    // Skip other validations if empty and not required
    if (value === undefined || value === null || value === '') continue;
    
    // Min/Max for numbers
    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        errors[field.name] = `הערך המינימלי הוא ${validation.min}`;
      }
      if (validation.max !== undefined && value > validation.max) {
        errors[field.name] = `הערך המקסימלי הוא ${validation.max}`;
      }
    }
    
    // MinLength/MaxLength for strings
    if (typeof value === 'string') {
      if (validation.minLength !== undefined && value.length < validation.minLength) {
        errors[field.name] = `אורך מינימלי: ${validation.minLength} תווים`;
      }
      if (validation.maxLength !== undefined && value.length > validation.maxLength) {
        errors[field.name] = `אורך מקסימלי: ${validation.maxLength} תווים`;
      }
    }
    
    // Pattern
    if (validation.pattern && typeof value === 'string') {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        errors[field.name] = validation.patternMessage || 'פורמט לא תקין';
      }
    }
  }
  
  return errors;
}

export function evaluateCondition(
  condition: FieldCondition,
  data: Record<string, any>
): boolean {
  const fieldValue = data[condition.field];
  
  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    case 'not_equals':
      return fieldValue !== condition.value;
    case 'contains':
      return String(fieldValue).includes(String(condition.value));
    case 'not_contains':
      return !String(fieldValue).includes(String(condition.value));
    case 'greater_than':
      return Number(fieldValue) > Number(condition.value);
    case 'less_than':
      return Number(fieldValue) < Number(condition.value);
    case 'is_empty':
      return fieldValue === undefined || fieldValue === null || fieldValue === '';
    case 'is_not_empty':
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
    default:
      return true;
  }
}
