// ===========================================
// AEGIS - Template Builder Types
// Phase 2: מבנה נתונים מלא לתבניות
// ===========================================

import { Timestamp } from 'firebase/firestore';

// ===========================================
// TEMPLATE TYPES
// ===========================================

/**
 * סוגי תבניות במערכת
 */
export type TemplateType =
  | 'safety_plan'      // תוכנית בטיחות
  | 'inspection'       // דוח ביקורת
  | 'checklist'        // צ'קליסט
  | 'training_form'    // טופס הדרכה
  | 'incident_report'  // דוח אירוע
  | 'risk_assessment'  // הערכת סיכונים
  | 'permit'           // היתר עבודה
  | 'custom';          // מותאם אישית

export const TEMPLATE_TYPES: { value: TemplateType; label: string; labelHe: string; icon: string }[] = [
  { value: 'safety_plan', label: 'Safety Plan', labelHe: 'תוכנית בטיחות', icon: '📋' },
  { value: 'inspection', label: 'Inspection', labelHe: 'דוח ביקורת', icon: '🔍' },
  { value: 'checklist', label: 'Checklist', labelHe: 'צ\'קליסט', icon: '☑️' },
  { value: 'training_form', label: 'Training Form', labelHe: 'טופס הדרכה', icon: '🎓' },
  { value: 'incident_report', label: 'Incident Report', labelHe: 'דוח אירוע', icon: '🚨' },
  { value: 'risk_assessment', label: 'Risk Assessment', labelHe: 'הערכת סיכונים', icon: '⚠️' },
  { value: 'permit', label: 'Work Permit', labelHe: 'היתר עבודה', icon: '📝' },
  { value: 'custom', label: 'Custom', labelHe: 'מותאם אישית', icon: '⚙️' },
];

/**
 * קטגוריות בטיחות
 */
export type SafetyCategory = 
  | 'laser'           // בטיחות לייזר
  | 'fire'            // בטיחות אש
  | 'electrical'      // בטיחות חשמל
  | 'chemical'        // בטיחות כימית
  | 'radiation'       // קרינה
  | 'construction'    // בנייה
  | 'general'         // כללי
  | 'industrial'      // תעשייה
  | 'office'          // משרדים
  | 'medical';        // רפואי

export const SAFETY_CATEGORIES: { value: SafetyCategory; label: string; labelHe: string; icon: string }[] = [
  { value: 'laser', label: 'Laser Safety', labelHe: 'בטיחות לייזר', icon: '🔴' },
  { value: 'fire', label: 'Fire Safety', labelHe: 'בטיחות אש', icon: '🔥' },
  { value: 'electrical', label: 'Electrical Safety', labelHe: 'בטיחות חשמל', icon: '⚡' },
  { value: 'chemical', label: 'Chemical Safety', labelHe: 'בטיחות כימית', icon: '🧪' },
  { value: 'radiation', label: 'Radiation Safety', labelHe: 'בטיחות קרינה', icon: '☢️' },
  { value: 'construction', label: 'Construction Safety', labelHe: 'בטיחות בנייה', icon: '🏗️' },
  { value: 'general', label: 'General Safety', labelHe: 'בטיחות כללית', icon: '🛡️' },
  { value: 'industrial', label: 'Industrial Safety', labelHe: 'בטיחות תעשייתית', icon: '🏭' },
  { value: 'office', label: 'Office Safety', labelHe: 'בטיחות משרדית', icon: '🏢' },
  { value: 'medical', label: 'Medical Safety', labelHe: 'בטיחות רפואית', icon: '🏥' },
];

// ===========================================
// FIELD TYPES
// ===========================================

/**
 * סוגי שדות - 22 סוגים
 */
export type FieldType =
  // בסיסיים
  | 'text'            // טקסט קצר
  | 'textarea'        // טקסט ארוך
  | 'number'          // מספר
  | 'email'           // אימייל
  | 'phone'           // טלפון
  | 'date'            // תאריך
  | 'time'            // שעה
  | 'datetime'        // תאריך ושעה
  // בחירה
  | 'select'          // בחירה מרשימה
  | 'multiselect'     // בחירה מרובה
  | 'radio'           // בחירה בודדת
  | 'checkbox'        // סימון בודד
  | 'checkboxGroup'   // קבוצת סימון
  | 'toggle'          // מתג
  // מתקדמים
  | 'image'           // העלאת תמונה
  | 'file'            // העלאת קובץ
  | 'signature'       // חתימה דיגיטלית
  | 'table'           // טבלה דינמית
  | 'rating'          // דירוג
  | 'location'        // מיקום
  // תצוגה
  | 'header'          // כותרת
  | 'paragraph'       // פסקת הסבר
  | 'divider'         // קו הפרדה
  | 'calculated';     // שדה מחושב

export const FIELD_TYPES: { 
  value: FieldType; 
  label: string; 
  labelHe: string; 
  icon: string;
  category: 'basic' | 'choice' | 'advanced' | 'display';
  hasOptions?: boolean;
  hasValidation?: boolean;
}[] = [
  // בסיסיים
  { value: 'text', label: 'Text', labelHe: 'טקסט קצר', icon: '📝', category: 'basic', hasValidation: true },
  { value: 'textarea', label: 'Long Text', labelHe: 'טקסט ארוך', icon: '📄', category: 'basic', hasValidation: true },
  { value: 'number', label: 'Number', labelHe: 'מספר', icon: '🔢', category: 'basic', hasValidation: true },
  { value: 'email', label: 'Email', labelHe: 'אימייל', icon: '📧', category: 'basic', hasValidation: true },
  { value: 'phone', label: 'Phone', labelHe: 'טלפון', icon: '📱', category: 'basic', hasValidation: true },
  { value: 'date', label: 'Date', labelHe: 'תאריך', icon: '📅', category: 'basic', hasValidation: true },
  { value: 'time', label: 'Time', labelHe: 'שעה', icon: '🕐', category: 'basic', hasValidation: true },
  { value: 'datetime', label: 'Date & Time', labelHe: 'תאריך ושעה', icon: '📆', category: 'basic', hasValidation: true },
  // בחירה
  { value: 'select', label: 'Dropdown', labelHe: 'בחירה מרשימה', icon: '📋', category: 'choice', hasOptions: true, hasValidation: true },
  { value: 'multiselect', label: 'Multi Select', labelHe: 'בחירה מרובה', icon: '☑️', category: 'choice', hasOptions: true, hasValidation: true },
  { value: 'radio', label: 'Radio Buttons', labelHe: 'בחירה בודדת', icon: '🔘', category: 'choice', hasOptions: true, hasValidation: true },
  { value: 'checkbox', label: 'Checkbox', labelHe: 'סימון', icon: '✅', category: 'choice', hasValidation: true },
  { value: 'checkboxGroup', label: 'Checkbox Group', labelHe: 'קבוצת סימון', icon: '☑️', category: 'choice', hasOptions: true, hasValidation: true },
  { value: 'toggle', label: 'Toggle', labelHe: 'מתג', icon: '🔄', category: 'choice' },
  // מתקדמים
  { value: 'image', label: 'Image Upload', labelHe: 'העלאת תמונה', icon: '🖼️', category: 'advanced', hasValidation: true },
  { value: 'file', label: 'File Upload', labelHe: 'העלאת קובץ', icon: '📎', category: 'advanced', hasValidation: true },
  { value: 'signature', label: 'Signature', labelHe: 'חתימה', icon: '✍️', category: 'advanced', hasValidation: true },
  { value: 'table', label: 'Table', labelHe: 'טבלה', icon: '📊', category: 'advanced', hasValidation: true },
  { value: 'rating', label: 'Rating', labelHe: 'דירוג', icon: '⭐', category: 'advanced', hasValidation: true },
  { value: 'location', label: 'Location', labelHe: 'מיקום', icon: '📍', category: 'advanced' },
  // תצוגה
  { value: 'header', label: 'Header', labelHe: 'כותרת', icon: '🏷️', category: 'display' },
  { value: 'paragraph', label: 'Paragraph', labelHe: 'פסקה', icon: '📰', category: 'display' },
  { value: 'divider', label: 'Divider', labelHe: 'קו הפרדה', icon: '➖', category: 'display' },
  { value: 'calculated', label: 'Calculated', labelHe: 'מחושב', icon: '🧮', category: 'display' },
];

// ===========================================
// PREFILL BEHAVIOR
// ===========================================

/**
 * התנהגות Prefill מביקורת קודמת
 */
export type PrefillBehavior = 
  | 'always'      // תמיד מועתק (פרטי חברה, כתובת)
  | 'optional'    // המשתמש בוחר (רשימת ציוד)
  | 'never'       // לעולם לא (חתימות, תאריך נוכחי)
  | 'reference';  // מוצג לעיון בלבד (ממצאים קודמים)

export const PREFILL_BEHAVIORS: { value: PrefillBehavior; label: string; labelHe: string; description: string }[] = [
  { value: 'always', label: 'Always Copy', labelHe: 'העתק תמיד', description: 'נתונים שלא משתנים בין ביקורות' },
  { value: 'optional', label: 'Optional Copy', labelHe: 'העתקה אופציונלית', description: 'המשתמש בוחר אם להעתיק' },
  { value: 'never', label: 'Never Copy', labelHe: 'לא להעתיק', description: 'חייב להזין מחדש (חתימות, תאריכים)' },
  { value: 'reference', label: 'Reference Only', labelHe: 'לעיון בלבד', description: 'מוצג מהביקורת הקודמת לעיון' },
];

/**
 * ברירות מחדל של Prefill לפי סוג שדה
 */
export const DEFAULT_PREFILL_BY_FIELD_TYPE: Record<FieldType, PrefillBehavior> = {
  // בסיסיים - רוב מועתקים
  text: 'always',
  textarea: 'optional',
  number: 'always',
  email: 'always',
  phone: 'always',
  date: 'never',        // תאריך ביקורת חדש
  time: 'never',
  datetime: 'never',
  // בחירה - רוב מועתקים
  select: 'always',
  multiselect: 'always',
  radio: 'always',
  checkbox: 'always',   // צ'קליסט - מועתק!
  checkboxGroup: 'always',
  toggle: 'always',
  // מתקדמים
  image: 'optional',    // תמונות - לפעמים רוצים חדשות
  file: 'optional',
  signature: 'never',   // חתימה חדשה תמיד
  table: 'always',      // טבלאות כמו רשימת עובדים
  rating: 'always',
  location: 'always',
  // תצוגה - לא רלוונטי
  header: 'always',
  paragraph: 'always',
  divider: 'always',
  calculated: 'always',
};

// ===========================================
// VALIDATION
// ===========================================

/**
 * סוגי תיקוף
 */
export interface FieldValidation {
  required: boolean;
  
  // טקסט
  minLength?: number;
  maxLength?: number;
  pattern?: string;           // Regex
  patternMessage?: string;    // הודעת שגיאה מותאמת
  
  // מספרים
  min?: number;
  max?: number;
  step?: number;
  
  // תאריכים
  minDate?: string;           // 'today', 'field:otherFieldId', או תאריך קבוע
  maxDate?: string;
  
  // קבצים
  maxFileSize?: number;       // MB
  allowedFileTypes?: string[]; // ['image/*', 'application/pdf']
  maxFiles?: number;
  
  // טבלאות
  minRows?: number;
  maxRows?: number;
  
  // מותאם אישית
  customValidation?: {
    formula: string;          // ביטוי לבדיקה
    message: string;          // הודעת שגיאה
  };
}

// ===========================================
// CONDITIONAL LOGIC
// ===========================================

/**
 * אופרטורים להשוואה
 */
export type ConditionalOperator =
  | 'equals'           // שווה
  | 'not_equals'       // לא שווה
  | 'contains'         // מכיל
  | 'not_contains'     // לא מכיל
  | 'starts_with'      // מתחיל ב
  | 'ends_with'        // מסתיים ב
  | 'greater_than'     // גדול מ
  | 'less_than'        // קטן מ
  | 'greater_or_equal' // גדול או שווה
  | 'less_or_equal'    // קטן או שווה
  | 'is_empty'         // ריק
  | 'is_not_empty'     // לא ריק
  | 'in_list'          // ברשימה
  | 'not_in_list';     // לא ברשימה

export const CONDITIONAL_OPERATORS: { value: ConditionalOperator; label: string; labelHe: string; applicableTo: FieldType[] }[] = [
  { value: 'equals', label: 'Equals', labelHe: 'שווה ל', applicableTo: ['text', 'number', 'select', 'radio', 'date'] },
  { value: 'not_equals', label: 'Not Equals', labelHe: 'לא שווה ל', applicableTo: ['text', 'number', 'select', 'radio', 'date'] },
  { value: 'contains', label: 'Contains', labelHe: 'מכיל', applicableTo: ['text', 'textarea', 'multiselect'] },
  { value: 'not_contains', label: 'Not Contains', labelHe: 'לא מכיל', applicableTo: ['text', 'textarea', 'multiselect'] },
  { value: 'starts_with', label: 'Starts With', labelHe: 'מתחיל ב', applicableTo: ['text', 'textarea'] },
  { value: 'ends_with', label: 'Ends With', labelHe: 'מסתיים ב', applicableTo: ['text', 'textarea'] },
  { value: 'greater_than', label: 'Greater Than', labelHe: 'גדול מ', applicableTo: ['number', 'date', 'rating'] },
  { value: 'less_than', label: 'Less Than', labelHe: 'קטן מ', applicableTo: ['number', 'date', 'rating'] },
  { value: 'greater_or_equal', label: 'Greater or Equal', labelHe: 'גדול או שווה', applicableTo: ['number', 'date'] },
  { value: 'less_or_equal', label: 'Less or Equal', labelHe: 'קטן או שווה', applicableTo: ['number', 'date'] },
  { value: 'is_empty', label: 'Is Empty', labelHe: 'ריק', applicableTo: ['text', 'textarea', 'select', 'multiselect', 'image', 'file'] },
  { value: 'is_not_empty', label: 'Is Not Empty', labelHe: 'לא ריק', applicableTo: ['text', 'textarea', 'select', 'multiselect', 'image', 'file'] },
  { value: 'in_list', label: 'In List', labelHe: 'נמצא ברשימה', applicableTo: ['select', 'multiselect', 'radio'] },
  { value: 'not_in_list', label: 'Not In List', labelHe: 'לא נמצא ברשימה', applicableTo: ['select', 'multiselect', 'radio'] },
];

/**
 * תנאי בודד
 */
export interface Condition {
  id: string;
  fieldId: string;            // השדה שבודקים
  operator: ConditionalOperator;
  value: any;                 // הערך להשוואה
}

/**
 * לוגיקה מותנית - קבוצת תנאים
 */
export interface ConditionalLogic {
  enabled: boolean;
  action: 'show' | 'hide' | 'require' | 'disable';
  logicType: 'all' | 'any';   // AND / OR
  conditions: Condition[];
}

// ===========================================
// FIELD OPTIONS
// ===========================================

/**
 * אפשרות בחירה (ל-select, radio, checkbox)
 */
export interface FieldOption {
  id: string;
  value: string;
  label: string;
  labelHe?: string;
  color?: string;             // צבע לתצוגה
  icon?: string;              // אייקון
  score?: number;             // ניקוד (לדירוג)
  isDefault?: boolean;        // ברירת מחדל
  conditionalLogic?: ConditionalLogic; // הצג/הסתר אפשרות
}

// ===========================================
// TABLE CONFIGURATION
// ===========================================

/**
 * הגדרות עמודה בטבלה
 */
export interface TableColumn {
  id: string;
  label: string;
  labelHe: string;
  type: Exclude<FieldType, 'table' | 'header' | 'paragraph' | 'divider'>;
  width: string;              // '20%', '150px'
  required: boolean;
  options?: FieldOption[];    // לעמודות מסוג select
  validation?: FieldValidation;
}

/**
 * הגדרות טבלה
 */
export interface TableConfig {
  columns: TableColumn[];
  minRows: number;
  maxRows: number;
  allowAddRows: boolean;
  allowDeleteRows: boolean;
  showRowNumbers: boolean;
  defaultRows?: number;
}

// ===========================================
// CALCULATED FIELD
// ===========================================

/**
 * הגדרות שדה מחושב
 */
export interface CalculatedFieldConfig {
  formula: string;            // "SUM(field1, field2)" או "field1 * field2"
  resultType: 'number' | 'text' | 'date';
  decimalPlaces?: number;
  prefix?: string;            // "₪"
  suffix?: string;            // "%"
}

// ===========================================
// TEMPLATE FIELD
// ===========================================

/**
 * שדה בתבנית
 */
export interface TemplateField {
  id: string;
  sectionId: string;
  
  // סוג
  type: FieldType;
  
  // מידע בסיסי
  label: string;
  labelHe: string;
  placeholder?: string;
  helpText?: string;
  
  // סדר
  order: number;
  
  // ערך ברירת מחדל
  defaultValue?: any;
  
  // אפשרויות (לשדות בחירה)
  options?: FieldOption[];
  
  // הגדרות לפי סוג שדה
  tableConfig?: TableConfig;
  calculatedConfig?: CalculatedFieldConfig;
  
  // הגדרות מספרים
  numberConfig?: {
    unit?: string;           // יחידת מידה (ק"מ, מ', ₪)
    step?: number;           // קפיצות (0.1, 1, 10)
    decimalPlaces?: number;  // ספרות אחרי נקודה
  };
  
  // הגדרות תאריך
  dateConfig?: {
    minDate?: string;        // 'today', תאריך קבוע, או 'field:fieldId'
    maxDate?: string;
    includeTime?: boolean;
  };
  
  // הגדרות דירוג
  ratingConfig?: {
    max: number;             // מקסימום כוכבים (3, 5, 10)
    icon?: 'star' | 'heart' | 'thumb'; // אייקון
    allowHalf?: boolean;     // חצאי כוכבים
  };
  
  // הגדרות קבצים
  fileConfig?: {
    allowedTypes?: string[]; // ['image/*', 'application/pdf']
    maxSize?: number;        // MB
    maxFiles?: number;       // מספר קבצים מקסימלי
  };
  
  // טקסט מיוחד
  checkboxLabel?: string;     // תווית ל-checkbox/toggle
  paragraphContent?: string;  // תוכן לשדה paragraph
  
  // תיקוף
  validation: FieldValidation;
  
  // לוגיקה מותנית
  conditionalLogic?: ConditionalLogic;
  
  // Prefill
  prefillBehavior: PrefillBehavior;
  prefillFromField?: string;  // אם שונה משם השדה
  
  // תצוגה
  display: {
    width: 'full' | 'half' | 'third' | 'quarter';
    hidden: boolean;
    readOnly: boolean;
    cssClass?: string;
    rows?: number;           // מספר שורות ל-textarea
  };
  
  // מטא
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ===========================================
// TEMPLATE SECTION
// ===========================================

/**
 * סקשן בתבנית
 */
export interface TemplateSection {
  id: string;
  
  // מידע בסיסי
  title: string;
  titleHe: string;
  description?: string;
  icon?: string;
  
  // סדר
  order: number;
  
  // שדות
  fields: TemplateField[];
  
  // לוגיקה מותנית
  conditionalLogic?: ConditionalLogic;
  
  // הגדרות
  settings: {
    collapsible: boolean;
    startCollapsed: boolean;
    repeatable: boolean;      // סקשן שניתן לשכפל
    maxRepetitions?: number;
    showTitle: boolean;
    backgroundColor?: string;
  };
}

// ===========================================
// TEMPLATE SETTINGS
// ===========================================

/**
 * הגדרות תבנית
 */
export interface TemplateSettings {
  // תצוגה
  showProgressBar: boolean;
  showSectionNumbers: boolean;
  allowSaveAsDraft: boolean;
  autoSaveInterval: number;   // שניות, 0 = כבוי
  
  // PDF
  pdfSettings: {
    includeHeader: boolean;
    includeFooter: boolean;
    includeLogo: boolean;
    logoUrl?: string;           // URL של הלוגו
    logoPosition?: 'right' | 'center' | 'left';  // מיקום הלוגו
    pageSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
    headerText?: string;
    footerText?: string;
  };
  
  // תפוגה
  validityPeriod?: {
    enabled: boolean;
    months: number;
  };
  
  // Prefill
  prefillSettings: {
    enabled: boolean;
    allowUserChoice: boolean;
    showPreviousValues: boolean;  // הצג מה היה קודם
    highlightChanges: boolean;    // הדגש שינויים
  };
  
  // הרשאות
  permissions: {
    whoCanFill: 'tenant_users' | 'client_contacts' | 'both';
    requireApproval: boolean;
    approverRoles: string[];
  };
  
  // Scoring
  scoring?: {
    enabled: boolean;
    maxScore: number;
    passingScore: number;
    showScoreToUser: boolean;
  };
}

// ===========================================
// TEMPLATE
// ===========================================

/**
 * סטטוס תבנית
 */
export type TemplateStatus = 'draft' | 'published' | 'archived';

/**
 * תבנית מלאה
 */
export interface Template {
  id: string;
  tenantId: string;
  
  // מידע בסיסי
  name: string;
  nameHe: string;
  description?: string;
  descriptionHe?: string;
  type: TemplateType;
  
  // קטגוריה
  category: SafetyCategory;
  tags: string[];
  
  // גרסה
  version: number;
  versionNotes?: string;
  previousVersionId?: string;
  
  // מבנה
  sections: TemplateSection[];
  
  // הגדרות
  settings: TemplateSettings;
  
  // סטטוס
  status: TemplateStatus;
  
  // שיתוף
  isSystemTemplate: boolean;  // תבנית מערכת (ספרייה)
  isShared: boolean;          // משותף עם לקוחות
  sharedWithTenantIds?: string[];
  
  // סטטיסטיקות
  stats?: {
    timesUsed: number;
    lastUsedAt?: Timestamp;
    averageCompletionTime?: number; // דקות
  };
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  lastEditedBy: string;
}

// ===========================================
// TEMPLATE VERSION (for history)
// ===========================================

/**
 * גרסת תבנית (להיסטוריה)
 */
export interface TemplateVersion {
  id: string;
  templateId: string;
  version: number;
  
  // Snapshot של התבנית
  snapshot: Omit<Template, 'id' | 'stats'>;
  
  // מטא
  createdAt: Timestamp;
  createdBy: string;
  notes?: string;
  
  // השוואה
  changes?: {
    fieldsAdded: string[];
    fieldsRemoved: string[];
    fieldsModified: string[];
    sectionsAdded: string[];
    sectionsRemoved: string[];
  };
}

// ===========================================
// FILLED FORM (Instance of Template)
// ===========================================

/**
 * סטטוס טופס מלא
 */
export type FilledFormStatus = 
  | 'draft'           // טיוטה
  | 'submitted'       // הוגש
  | 'pending_approval' // ממתין לאישור
  | 'approved'        // אושר
  | 'rejected'        // נדחה
  | 'expired';        // פג תוקף

/**
 * טופס מלא (instance של תבנית)
 */
export interface FilledForm {
  id: string;
  templateId: string;
  templateVersion: number;
  tenantId: string;
  
  // קישור
  clientId?: string;          // לאיזה לקוח
  safetyFileId?: string;      // לאיזה תיק בטיחות
  inspectionId?: string;      // לאיזו ביקורת
  
  // נתונים
  data: Record<string, any>;  // fieldId -> value
  
  // Prefill
  prefillSourceId?: string;   // מאיזה טופס קודם
  changesFromPrevious?: {
    fieldId: string;
    previousValue: any;
    currentValue: any;
  }[];
  
  // סטטוס
  status: FilledFormStatus;
  
  // אישור
  approval?: {
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: Timestamp;
    rejectionReason?: string;
  };
  
  // ניקוד
  score?: {
    total: number;
    max: number;
    percentage: number;
    passed: boolean;
  };
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt?: Timestamp;
  createdBy: string;
  lastEditedBy: string;
  
  // Auto-save
  lastAutoSaveAt?: Timestamp;
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * יצירת שדה חדש עם ברירות מחדל
 */
export function createDefaultField(
  type: FieldType,
  sectionId: string,
  order: number
): TemplateField {
  return {
    id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sectionId,
    type,
    label: '',
    labelHe: '',
    order,
    validation: {
      required: false,
    },
    prefillBehavior: DEFAULT_PREFILL_BY_FIELD_TYPE[type],
    display: {
      width: 'full',
      hidden: false,
      readOnly: false,
    },
  };
}

/**
 * יצירת סקשן חדש עם ברירות מחדל
 */
export function createDefaultSection(order: number): TemplateSection {
  return {
    id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: '',
    titleHe: '',
    order,
    fields: [],
    settings: {
      collapsible: true,
      startCollapsed: false,
      repeatable: false,
      showTitle: true,
    },
  };
}

/**
 * יצירת תבנית חדשה עם ברירות מחדל
 */
export function createDefaultTemplate(
  tenantId: string,
  createdBy: string
): Omit<Template, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    tenantId,
    name: '',
    nameHe: '',
    type: 'inspection',
    category: 'general',
    tags: [],
    version: 1,
    sections: [],
    settings: {
      showProgressBar: true,
      showSectionNumbers: true,
      allowSaveAsDraft: true,
      autoSaveInterval: 30,
      pdfSettings: {
        includeHeader: true,
        includeFooter: true,
        includeLogo: true,
        pageSize: 'A4',
        orientation: 'portrait',
      },
      prefillSettings: {
        enabled: true,
        allowUserChoice: true,
        showPreviousValues: true,
        highlightChanges: true,
      },
      permissions: {
        whoCanFill: 'both',
        requireApproval: false,
        approverRoles: [],
      },
    },
    status: 'draft',
    isSystemTemplate: false,
    isShared: false,
    createdBy,
    lastEditedBy: createdBy,
  };
}

/**
 * קבלת הגדרות Prefill ברירת מחדל לפי סוג התבנית
 */
export function getDefaultPrefillSettingsByTemplateType(type: TemplateType): Partial<TemplateSettings['prefillSettings']> {
  switch (type) {
    case 'inspection':
    case 'checklist':
      return {
        enabled: true,
        allowUserChoice: true,
        showPreviousValues: true,
        highlightChanges: true,
      };
    case 'incident_report':
      return {
        enabled: false,  // אירוע חדש לא צריך prefill
        allowUserChoice: false,
        showPreviousValues: false,
        highlightChanges: false,
      };
    default:
      return {
        enabled: true,
        allowUserChoice: true,
        showPreviousValues: false,
        highlightChanges: false,
      };
  }
}