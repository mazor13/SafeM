/**
 * SafeM - Dynamic Column System
 * Type definitions for dynamic columns (Monday.com style)
 * 
 * @module types/columns
 * @description Enables custom columns for all entity types
 */

// ============================================
// Column Types
// ============================================

/**
 * Available column types in the system
 */
export type ColumnType = 
  | 'text'      // Simple text input
  | 'number'    // Numeric value with formatting
  | 'status'    // Dropdown with colored statuses
  | 'person'    // User/team member selector
  | 'date'      // Date picker
  | 'priority'  // Priority levels (Low/Medium/High/Critical)
  | 'file';     // File attachment

/**
 * Entity types that support dynamic columns
 */
export type EntityType = 
  | 'finding' 
  | 'equipment' 
  | 'inspection' 
  | 'task' 
  | 'client' 
  | 'facility';

// ============================================
// Column Settings (per type)
// ============================================

/**
 * Settings for Text columns
 */
export interface TextColumnSettings {
  maxLength?: number;
  placeholder?: string;
  multiline?: boolean;
}

/**
 * Settings for Number columns
 */
export interface NumberColumnSettings {
  min?: number;
  max?: number;
  decimals?: number;
  unit?: string;           // e.g., "kg", "m", "₪"
  showUnit?: boolean;
  format?: 'number' | 'currency' | 'percentage';
}

/**
 * Status option for Status columns
 */
export interface StatusOption {
  id: string;
  label: string;
  color: string;           // Hex color code
}

/**
 * Settings for Status columns
 */
export interface StatusColumnSettings {
  options: StatusOption[];
  defaultOptionId?: string;
}

/**
 * Settings for Person columns
 */
export interface PersonColumnSettings {
  allowMultiple?: boolean;
  allowedRoles?: string[]; // Filter by roles
}

/**
 * Settings for Date columns
 */
export interface DateColumnSettings {
  includeTime?: boolean;
  minDate?: string;        // ISO date string
  maxDate?: string;
  showRelative?: boolean;  // Show "2 days ago" etc.
}

/**
 * Settings for Priority columns
 */
export interface PriorityColumnSettings {
  levels: PriorityLevel[];
  defaultLevel?: string;
}

/**
 * Priority level definition
 */
export interface PriorityLevel {
  id: string;
  label: string;
  color: string;
  icon?: string;
  order: number;
}

/**
 * Settings for File columns
 */
export interface FileColumnSettings {
  allowedTypes?: string[]; // e.g., ['pdf', 'jpg', 'png']
  maxSize?: number;        // in MB
  maxFiles?: number;
}

/**
 * Union type for all column settings
 */
export type ColumnSettings = 
  | TextColumnSettings 
  | NumberColumnSettings 
  | StatusColumnSettings 
  | PersonColumnSettings 
  | DateColumnSettings 
  | PriorityColumnSettings 
  | FileColumnSettings;

// ============================================
// Column Definition
// ============================================

/**
 * Main column definition interface
 * Stored in Firestore: tenants/{tenantId}/columnDefinitions/{columnId}
 */
export interface ColumnDefinition {
  /** Unique column ID */
  id: string;
  
  /** Entity type this column belongs to */
  entityType: EntityType;
  
  /** Column type determines rendering and editing */
  type: ColumnType;
  
  /** Display title (Hebrew/English) */
  title: string;
  
  /** Column width in pixels */
  width: number;
  
  /** Display order (lower = first) */
  order: number;
  
  /** Is this field required? */
  required: boolean;
  
  /** Is this a system column (cannot be deleted)? */
  isSystem?: boolean;
  
  /** Is this column visible? */
  visible: boolean;
  
  /** Type-specific settings */
  settings: ColumnSettings;
  
  /** Tenant ID (for multi-tenancy) */
  tenantId: string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
  
  /** Created by user ID */
  createdBy: string;
}

// ============================================
// Cell Values
// ============================================

/**
 * Text cell value
 */
export interface TextCellValue {
  type: 'text';
  value: string;
}

/**
 * Number cell value
 */
export interface NumberCellValue {
  type: 'number';
  value: number | null;
}

/**
 * Status cell value
 */
export interface StatusCellValue {
  type: 'status';
  optionId: string;
}

/**
 * Person cell value
 */
export interface PersonCellValue {
  type: 'person';
  userIds: string[];
}

/**
 * Date cell value
 */
export interface DateCellValue {
  type: 'date';
  value: string | null;    // ISO date string
}

/**
 * Priority cell value
 */
export interface PriorityCellValue {
  type: 'priority';
  levelId: string;
}

/**
 * File cell value
 */
export interface FileCellValue {
  type: 'file';
  files: FileReference[];
}

/**
 * File reference for File columns
 */
export interface FileReference {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

/**
 * Union type for all cell values
 */
export type CellValue = 
  | TextCellValue 
  | NumberCellValue 
  | StatusCellValue 
  | PersonCellValue 
  | DateCellValue 
  | PriorityCellValue 
  | FileCellValue;

// ============================================
// Cell Data (stored per entity)
// ============================================

/**
 * Dynamic cell data for an entity
 * Stored in: tenants/{tenantId}/{entityType}/{entityId}/dynamicColumns/{columnId}
 * Or as a map field in the entity document
 */
export interface DynamicCellData {
  /** Column ID reference */
  columnId: string;
  
  /** The actual cell value */
  value: CellValue;
  
  /** Last update timestamp */
  updatedAt: Date;
  
  /** Updated by user ID */
  updatedBy: string;
}

// ============================================
// Helper Types
// ============================================

/**
 * Map of column ID to cell data
 */
export type DynamicColumnsMap = Record<string, DynamicCellData>;

/**
 * Column definition with resolved cell value
 */
export interface ColumnWithValue extends ColumnDefinition {
  cellData?: DynamicCellData;
}

/**
 * Input for creating a new column
 */
export type CreateColumnInput = Omit<
  ColumnDefinition, 
  'id' | 'createdAt' | 'updatedAt' | 'createdBy'
>;

/**
 * Input for updating a column
 */
export type UpdateColumnInput = Partial<
  Omit<ColumnDefinition, 'id' | 'entityType' | 'tenantId' | 'createdAt' | 'createdBy'>
>;

// ============================================
// Default Values
// ============================================

/**
 * Default column width by type
 */
export const DEFAULT_COLUMN_WIDTH: Record<ColumnType, number> = {
  text: 200,
  number: 120,
  status: 150,
  person: 150,
  date: 140,
  priority: 120,
  file: 100,
};

/**
 * Default priority levels (Hebrew)
 */
export const DEFAULT_PRIORITY_LEVELS: PriorityLevel[] = [
  { id: 'low', label: 'נמוכה', color: '#22c55e', icon: '🟢', order: 1 },
  { id: 'medium', label: 'בינונית', color: '#eab308', icon: '🟡', order: 2 },
  { id: 'high', label: 'גבוהה', color: '#f97316', icon: '🟠', order: 3 },
  { id: 'critical', label: 'קריטית', color: '#ef4444', icon: '🔴', order: 4 },
];

/**
 * Default status options (Hebrew)
 */
export const DEFAULT_STATUS_OPTIONS: StatusOption[] = [
  { id: 'todo', label: 'לביצוע', color: '#64748b' },
  { id: 'in_progress', label: 'בתהליך', color: '#3b82f6' },
  { id: 'done', label: 'הושלם', color: '#22c55e' },
];
