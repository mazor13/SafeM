/**
 * SafeM - Column Templates Library
 * Pre-defined column templates for quick setup
 * 
 * @module components/dynamic-columns/columnTemplates
 * @description Ready-to-use column configurations
 */

import {
  ColumnType,
  EntityType,
  ColumnDefinition,
  StatusOption,
  PriorityLevel,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_PRIORITY_LEVELS,
  DEFAULT_STATUS_OPTIONS,
} from '../../types/columns';

// ============================================
// Template Types
// ============================================

export interface ColumnTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  entityTypes: EntityType[];
  type: ColumnType;
  defaultTitle: string;
  settings: ColumnDefinition['settings'];
  icon: string;
}

export type TemplateCategory = 
  | 'safety'
  | 'tasks'
  | 'dates'
  | 'people'
  | 'general'
  | 'financial';

// ============================================
// Status Options Presets
// ============================================

export const STATUS_PRESETS = {
  findingStatus: [
    { id: 'open', label: 'פתוח', color: '#ef4444' },
    { id: 'in_treatment', label: 'בטיפול', color: '#f97316' },
    { id: 'pending_approval', label: 'ממתין לאישור', color: '#eab308' },
    { id: 'resolved', label: 'טופל', color: '#22c55e' },
    { id: 'closed', label: 'סגור', color: '#64748b' },
  ] as StatusOption[],

  taskStatus: [
    { id: 'todo', label: 'לביצוע', color: '#64748b' },
    { id: 'in_progress', label: 'בתהליך', color: '#3b82f6' },
    { id: 'review', label: 'לבדיקה', color: '#eab308' },
    { id: 'done', label: 'הושלם', color: '#22c55e' },
  ] as StatusOption[],

  equipmentStatus: [
    { id: 'active', label: 'פעיל', color: '#22c55e' },
    { id: 'maintenance', label: 'בתחזוקה', color: '#f97316' },
    { id: 'out_of_service', label: 'מושבת', color: '#ef4444' },
    { id: 'retired', label: 'פרישה', color: '#64748b' },
  ] as StatusOption[],

  inspectionStatus: [
    { id: 'scheduled', label: 'מתוכנן', color: '#3b82f6' },
    { id: 'in_progress', label: 'בביצוע', color: '#f97316' },
    { id: 'completed', label: 'הושלם', color: '#22c55e' },
    { id: 'cancelled', label: 'בוטל', color: '#64748b' },
  ] as StatusOption[],

  approvalStatus: [
    { id: 'pending', label: 'ממתין', color: '#eab308' },
    { id: 'approved', label: 'מאושר', color: '#22c55e' },
    { id: 'rejected', label: 'נדחה', color: '#ef4444' },
  ] as StatusOption[],

  compliance: [
    { id: 'compliant', label: 'תקין', color: '#22c55e' },
    { id: 'non_compliant', label: 'לא תקין', color: '#ef4444' },
    { id: 'partial', label: 'חלקי', color: '#eab308' },
  ] as StatusOption[],

  yesNo: [
    { id: 'yes', label: 'כן', color: '#22c55e' },
    { id: 'no', label: 'לא', color: '#ef4444' },
  ] as StatusOption[],
};

// ============================================
// Priority Presets
// ============================================

export const PRIORITY_PRESETS = {
  standard: DEFAULT_PRIORITY_LEVELS,

  riskLevel: [
    { id: 'negligible', label: 'זניח', color: '#22c55e', icon: '⬜', order: 1 },
    { id: 'low', label: 'נמוך', color: '#84cc16', icon: '🟩', order: 2 },
    { id: 'medium', label: 'בינוני', color: '#eab308', icon: '🟨', order: 3 },
    { id: 'high', label: 'גבוה', color: '#f97316', icon: '🟧', order: 4 },
    { id: 'critical', label: 'קריטי', color: '#ef4444', icon: '🟥', order: 5 },
  ] as PriorityLevel[],

  urgency: [
    { id: 'routine', label: 'שגרתי', color: '#64748b', icon: '⏳', order: 1 },
    { id: 'soon', label: 'בקרוב', color: '#3b82f6', icon: '📅', order: 2 },
    { id: 'urgent', label: 'דחוף', color: '#f97316', icon: '⚡', order: 3 },
    { id: 'immediate', label: 'מיידי', color: '#ef4444', icon: '🚨', order: 4 },
  ] as PriorityLevel[],
};

// ============================================
// Column Templates
// ============================================

export const COLUMN_TEMPLATES: ColumnTemplate[] = [
  // Safety
  {
    id: 'finding-status',
    name: 'סטטוס ליקוי',
    description: 'מעקב אחר סטטוס טיפול בליקוי',
    category: 'safety',
    entityTypes: ['finding'],
    type: 'status',
    defaultTitle: 'סטטוס',
    settings: { options: STATUS_PRESETS.findingStatus, defaultOptionId: 'open' },
    icon: '🚨',
  },
  {
    id: 'risk-level',
    name: 'רמת סיכון',
    description: 'הערכת רמת הסיכון',
    category: 'safety',
    entityTypes: ['finding', 'equipment', 'facility'],
    type: 'priority',
    defaultTitle: 'רמת סיכון',
    settings: { levels: PRIORITY_PRESETS.riskLevel, defaultLevel: 'medium' },
    icon: '⚠️',
  },
  {
    id: 'compliance-status',
    name: 'סטטוס תאימות',
    description: 'האם עומד בתקן',
    category: 'safety',
    entityTypes: ['equipment', 'facility'],
    type: 'status',
    defaultTitle: 'תאימות',
    settings: { options: STATUS_PRESETS.compliance, defaultOptionId: 'compliant' },
    icon: '✅',
  },
  {
    id: 'equipment-status',
    name: 'סטטוס ציוד',
    description: 'מצב הציוד',
    category: 'safety',
    entityTypes: ['equipment'],
    type: 'status',
    defaultTitle: 'מצב ציוד',
    settings: { options: STATUS_PRESETS.equipmentStatus, defaultOptionId: 'active' },
    icon: '🔧',
  },
  {
    id: 'inspection-status',
    name: 'סטטוס בדיקה',
    description: 'מעקב סטטוס בדיקות',
    category: 'safety',
    entityTypes: ['inspection', 'equipment'],
    type: 'status',
    defaultTitle: 'סטטוס בדיקה',
    settings: { options: STATUS_PRESETS.inspectionStatus, defaultOptionId: 'scheduled' },
    icon: '🔍',
  },

  // Tasks
  {
    id: 'task-status',
    name: 'סטטוס משימה',
    description: 'מעקב סטטוס משימות',
    category: 'tasks',
    entityTypes: ['task', 'finding'],
    type: 'status',
    defaultTitle: 'סטטוס',
    settings: { options: STATUS_PRESETS.taskStatus, defaultOptionId: 'todo' },
    icon: '📋',
  },
  {
    id: 'task-priority',
    name: 'עדיפות משימה',
    description: 'רמת עדיפות',
    category: 'tasks',
    entityTypes: ['task', 'finding'],
    type: 'priority',
    defaultTitle: 'עדיפות',
    settings: { levels: DEFAULT_PRIORITY_LEVELS, defaultLevel: 'medium' },
    icon: '🎯',
  },
  {
    id: 'approval-status',
    name: 'סטטוס אישור',
    description: 'מעקב תהליך אישור',
    category: 'tasks',
    entityTypes: ['task', 'finding', 'inspection'],
    type: 'status',
    defaultTitle: 'אישור',
    settings: { options: STATUS_PRESETS.approvalStatus, defaultOptionId: 'pending' },
    icon: '👍',
  },
  {
    id: 'progress-percent',
    name: 'אחוז התקדמות',
    description: 'אחוז השלמת המשימה',
    category: 'tasks',
    entityTypes: ['task', 'finding'],
    type: 'number',
    defaultTitle: '% התקדמות',
    settings: { min: 0, max: 100, decimals: 0, unit: '%', showUnit: true, format: 'percentage' },
    icon: '📊',
  },

  // Dates
  {
    id: 'due-date',
    name: 'תאריך יעד',
    description: 'תאריך יעד לביצוע',
    category: 'dates',
    entityTypes: [],
    type: 'date',
    defaultTitle: 'תאריך יעד',
    settings: { includeTime: false, showRelative: true },
    icon: '📅',
  },
  {
    id: 'last-inspection',
    name: 'בדיקה אחרונה',
    description: 'תאריך הבדיקה האחרונה',
    category: 'dates',
    entityTypes: ['equipment', 'facility'],
    type: 'date',
    defaultTitle: 'בדיקה אחרונה',
    settings: { includeTime: false, showRelative: true },
    icon: '🔍',
  },
  {
    id: 'next-inspection',
    name: 'בדיקה הבאה',
    description: 'תאריך הבדיקה הבאה',
    category: 'dates',
    entityTypes: ['equipment', 'facility'],
    type: 'date',
    defaultTitle: 'בדיקה הבאה',
    settings: { includeTime: false, showRelative: true },
    icon: '📆',
  },
  {
    id: 'expiry-date',
    name: 'תאריך תפוגה',
    description: 'תאריך תפוגת תעודה',
    category: 'dates',
    entityTypes: ['equipment', 'facility'],
    type: 'date',
    defaultTitle: 'תאריך תפוגה',
    settings: { includeTime: false, showRelative: true },
    icon: '⏰',
  },

  // People
  {
    id: 'assignee',
    name: 'אחראי',
    description: 'האחראי על הטיפול',
    category: 'people',
    entityTypes: [],
    type: 'person',
    defaultTitle: 'אחראי',
    settings: { allowMultiple: false },
    icon: '👤',
  },
  {
    id: 'team-members',
    name: 'צוות',
    description: 'חברי הצוות',
    category: 'people',
    entityTypes: [],
    type: 'person',
    defaultTitle: 'צוות',
    settings: { allowMultiple: true },
    icon: '👥',
  },

  // General
  {
    id: 'notes',
    name: 'הערות',
    description: 'שדה טקסט להערות',
    category: 'general',
    entityTypes: [],
    type: 'text',
    defaultTitle: 'הערות',
    settings: { maxLength: 1000, multiline: true, placeholder: 'הוסף הערות...' },
    icon: '📝',
  },
  {
    id: 'reference-number',
    name: 'מספר אסמכתא',
    description: 'מספר אסמכתא/הפניה',
    category: 'general',
    entityTypes: [],
    type: 'text',
    defaultTitle: 'מס\' אסמכתא',
    settings: { maxLength: 50, placeholder: 'מספר אסמכתא' },
    icon: '🔢',
  },
  {
    id: 'yes-no',
    name: 'כן/לא',
    description: 'שדה בחירה כן או לא',
    category: 'general',
    entityTypes: [],
    type: 'status',
    defaultTitle: 'האם?',
    settings: { options: STATUS_PRESETS.yesNo },
    icon: '❓',
  },
  {
    id: 'attachments',
    name: 'קבצים מצורפים',
    description: 'העלאת קבצים',
    category: 'general',
    entityTypes: [],
    type: 'file',
    defaultTitle: 'קבצים',
    settings: { maxFiles: 10, maxSize: 10 },
    icon: '📎',
  },

  // Financial
  {
    id: 'cost',
    name: 'עלות',
    description: 'עלות בשקלים',
    category: 'financial',
    entityTypes: [],
    type: 'number',
    defaultTitle: 'עלות',
    settings: { min: 0, decimals: 2, unit: '₪', showUnit: true, format: 'currency' },
    icon: '💰',
  },
  {
    id: 'quantity',
    name: 'כמות',
    description: 'כמות פריטים',
    category: 'financial',
    entityTypes: ['equipment'],
    type: 'number',
    defaultTitle: 'כמות',
    settings: { min: 0, decimals: 0 },
    icon: '📦',
  },
];

// ============================================
// Helper Functions
// ============================================

export function getTemplatesByCategory(category: TemplateCategory): ColumnTemplate[] {
  return COLUMN_TEMPLATES.filter(t => t.category === category);
}

export function getTemplatesForEntity(entityType: EntityType): ColumnTemplate[] {
  return COLUMN_TEMPLATES.filter(
    t => t.entityTypes.length === 0 || t.entityTypes.includes(entityType)
  );
}

export function getTemplateById(templateId: string): ColumnTemplate | undefined {
  return COLUMN_TEMPLATES.find(t => t.id === templateId);
}

export function createColumnFromTemplate(
  template: ColumnTemplate,
  entityType: EntityType,
  tenantId: string,
  order: number,
  customTitle?: string
): Omit<ColumnDefinition, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> {
  return {
    entityType,
    type: template.type,
    title: customTitle || template.defaultTitle,
    width: DEFAULT_COLUMN_WIDTH[template.type],
    order,
    required: false,
    isSystem: false,
    visible: true,
    settings: { ...template.settings },
    tenantId,
  };
}

export const CATEGORY_NAMES: Record<TemplateCategory, string> = {
  safety: 'בטיחות',
  tasks: 'משימות',
  dates: 'תאריכים',
  people: 'אנשים',
  general: 'כללי',
  financial: 'כספים',
};

export const CATEGORY_ICONS: Record<TemplateCategory, string> = {
  safety: '🛡️',
  tasks: '📋',
  dates: '📅',
  people: '👥',
  general: '📝',
  financial: '💰',
};
