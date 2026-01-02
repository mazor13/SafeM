/**
 * AEGIS Safety Management Platform
 * Main Type Definitions
 * 
 * Interfaces for locations, equipment, inspections, and related entities
 */

import { Timestamp } from 'firebase/firestore';
import {
  SafetyDomain,
  LocationType,
  LocationStatus,
  EquipmentStatus,
  MaintenanceStatus,
  RiskLevel,
  InspectionType,
  InspectionStatus,
  FindingSeverity,
  ChecklistItemStatus,
  FrequencyType,
  InspectorType,
  LegalSourceType
} from './safety.enums';

// ============================================
// 🏢 Location Types
// ============================================

export interface Location {
  id: string;
  tenantId: string;
  clientId: string;
  parentLocationId?: string;  // For hierarchical structure
  
  // Basic Info
  name: string;
  nameEn?: string;
  type: LocationType;
  description?: string;
  
  // Safety domains relevant to this location
  safetyDomains: SafetyDomain[];
  
  // Physical location
  building?: string;
  floor?: string;
  roomNumber?: string;
  area?: number;              // Area in square meters
  
  // Address (for buildings/sites)
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Responsible persons
  responsiblePerson?: string;
  responsiblePhone?: string;
  responsibleEmail?: string;
  alternateContact?: {
    name: string;
    phone?: string;
    email?: string;
  };
  
  // Risk classification
  riskLevel?: RiskLevel;
  hazards?: string[];
  specialRequirements?: string[];
  
  // Statistics (computed)
  stats?: {
    equipmentCount: number;
    pendingInspections: number;
    overdueInspections: number;
    lastInspectionDate?: Timestamp;
  };
  
  // Metadata
  status: LocationStatus;
  tags?: string[];
  notes?: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy?: string;
}

export interface LocationTreeNode extends Location {
  children: LocationTreeNode[];
  level: number;
  path: string;  // e.g., "building-1/floor-2/room-201"
}

// ============================================
// 🔧 Equipment Types
// ============================================

export interface Equipment {
  id: string;
  tenantId: string;
  clientId: string;
  locationId: string;
  
  // Identification
  name: string;
  nameEn?: string;
  equipmentType: string;      // From domain-specific enums
  category: SafetyDomain;
  internalId?: string;        // Client's internal ID
  assetTag?: string;
  
  // Manufacturer info
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  yearOfManufacture?: number;
  installationDate?: Timestamp;
  
  // Technical specifications (dynamic based on type)
  specifications: EquipmentSpecifications;
  
  // Maintenance tracking
  maintenance: MaintenanceInfo;
  
  // Required inspections based on regulations
  requiredInspections: InspectionRequirement[];
  
  // Documentation
  documents?: EquipmentDocument[];
  photos?: string[];
  
  // Warranty
  warranty?: {
    provider?: string;
    expirationDate?: Timestamp;
    details?: string;
  };
  
  // Metadata
  status: EquipmentStatus;
  riskLevel?: RiskLevel;
  tags?: string[];
  notes?: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy?: string;
}

export interface EquipmentSpecifications {
  // Common fields
  capacity?: string;
  power?: string;
  voltage?: string;
  
  // Laser specific
  laserClass?: string;
  wavelength?: string;
  laserPower?: string;
  
  // Fire equipment
  extinguisherType?: string;
  extinguisherCapacity?: string;
  fireRating?: string;
  
  // Lifting equipment
  swl?: string;              // Safe Working Load
  liftHeight?: string;
  reachDistance?: string;
  
  // Pressure equipment
  maxPressure?: string;
  workingPressure?: string;
  volume?: string;
  heatingArea?: string;
  
  // Electrical
  currentRating?: string;
  phases?: string;
  frequency?: string;
  
  // Heights equipment
  fallDistance?: string;
  anchorStrength?: string;
  
  // Chemical
  chemicalCompatibility?: string[];
  flowRate?: string;
  
  // Generic custom fields
  customFields?: Record<string, string | number | boolean>;
}

export interface MaintenanceInfo {
  status: MaintenanceStatus;
  lastInspectionDate?: Timestamp;
  nextInspectionDate?: Timestamp;
  lastInspectionId?: string;
  provider?: string;
  certificateNumber?: string;
  certificateExpiry?: Timestamp;
  certificateUrl?: string;
}

export interface InspectionRequirement {
  id: string;
  name: string;
  nameEn?: string;
  
  // Legal source
  source: {
    type: LegalSourceType;
    name: string;           // e.g., "תקנות הבטיחות בעבודה"
    reference?: string;     // e.g., "סעיף 31"
    url?: string;
  };
  
  // Frequency
  frequency: {
    type: FrequencyType;
    intervalDays?: number;
    intervalMonths?: number;
  };
  
  // Conditional frequency changes
  conditions?: InspectionCondition[];
  
  // Inspector requirements
  inspectorType: InspectorType;
  certificationRequired?: string;
  
  // Documentation
  formRequired: boolean;
  reportToAuthority: boolean;
  authorityName?: string;
  retentionYears: number;
  
  // Inspection details
  inspectionType: 'visual' | 'functional' | 'full' | 'hydrostatic' | 'calibration' | 'training';
  checklistTemplateId?: string;
  estimatedDuration?: number;  // in minutes
}

export interface InspectionCondition {
  type: 'age' | 'risk_level' | 'after_repair' | 'before_use';
  
  // Age-based conditions
  ageThresholdYears?: number;
  newFrequency?: {
    type: FrequencyType;
    intervalMonths?: number;
  };
  
  // Risk-based conditions
  riskLevel?: RiskLevel;
  
  // Event-based
  triggerEvent?: string;
}

export interface EquipmentDocument {
  id: string;
  type: 'certificate' | 'manual' | 'drawing' | 'sds' | 'inspection_report' | 'other';
  name: string;
  url: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
  expirationDate?: Timestamp;
}

// ============================================
// 📋 Inspection Types
// ============================================

export interface Inspection {
  id: string;
  tenantId: string;
  clientId: string;
  locationId?: string;
  templateId?: string;
  
  // Type and category
  type: InspectionType;
  category: SafetyDomain;
  title: string;
  description?: string;
  
  // Equipment inspected
  equipmentIds: string[];
  equipmentSummary?: {
    id: string;
    name: string;
    type: string;
  }[];
  
  // Inspection details
  scheduledDate?: Timestamp;
  inspectionDate: Timestamp;
  completedDate?: Timestamp;
  
  // Inspector info
  inspector: {
    id?: string;
    name: string;
    certification?: string;
    company?: string;
    phone?: string;
    email?: string;
  };
  
  // Checklist and findings
  checklist: ChecklistItem[];
  findings: Finding[];
  
  // Overall result
  overallStatus: 'pass' | 'pass_with_remarks' | 'fail' | 'incomplete';
  summary?: string;
  
  // Signatures
  signatures: {
    inspector?: SignatureData;
    client?: SignatureData;
    witness?: SignatureData;
  };
  
  // Follow-up
  recommendations?: string;
  followUpRequired: boolean;
  followUpDate?: Timestamp;
  followUpNotes?: string;
  
  // Documents
  attachments?: InspectionAttachment[];
  pdfUrl?: string;
  
  // Metadata
  status: InspectionStatus;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy?: string;
}

export interface ChecklistItem {
  id: string;
  sectionId?: string;
  sectionName?: string;
  order: number;
  
  // Question
  question: string;
  questionEn?: string;
  helpText?: string;
  
  // Response
  status: ChecklistItemStatus;
  notes?: string;
  
  // Severity if failed
  severity?: FindingSeverity;
  
  // Evidence
  photos?: string[];
  
  // Conditional logic
  conditionalOn?: {
    itemId: string;
    expectedStatus: ChecklistItemStatus;
  };
  
  // Required/optional
  isRequired: boolean;
  isCritical?: boolean;
}

export interface Finding {
  id: string;
  checklistItemId?: string;
  
  // Description
  title: string;
  description: string;
  location?: string;
  
  // Classification
  severity: FindingSeverity;
  category?: string;
  
  // Recommendation
  recommendation: string;
  correctiveAction?: string;
  
  // Timeline
  dueDate?: Timestamp;
  closedDate?: Timestamp;
  
  // Status tracking
  status: 'open' | 'in_progress' | 'closed' | 'verified';
  assignedTo?: string;
  
  // Evidence
  photos?: string[];
  
  // Follow-up
  followUpInspectionId?: string;
  verificationNotes?: string;
}

export interface SignatureData {
  name: string;
  role?: string;
  signatureUrl: string;
  signedAt: Timestamp;
  ipAddress?: string;
}

export interface InspectionAttachment {
  id: string;
  type: 'photo' | 'document' | 'video' | 'audio';
  name: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Timestamp;
  description?: string;
  checklistItemId?: string;
  findingId?: string;
}

// ============================================
// 📝 Template Types
// ============================================

export interface InspectionTemplate {
  id: string;
  tenantId: string;
  
  // Basic info
  name: string;
  nameEn?: string;
  description?: string;
  category: SafetyDomain;
  
  // Equipment types this template applies to
  applicableEquipmentTypes: string[];
  
  // Version control
  version: string;
  isActive: boolean;
  isDefault?: boolean;
  
  // Template structure
  sections: TemplateSection[];
  
  // Legal reference
  legalReference?: {
    law?: string;
    regulation?: string;
    standard?: string;
  };
  
  // Settings
  settings: {
    requiresSignature: boolean;
    requiresClientSignature: boolean;
    requiresPhotos: boolean;
    autoGeneratePdf: boolean;
    pdfTemplate?: string;
  };
  
  // Metadata
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy?: string;
}

export interface TemplateSection {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  order: number;
  isCollapsible?: boolean;
  
  items: TemplateItem[];
}

export interface TemplateItem {
  id: string;
  order: number;
  
  // Question
  question: string;
  questionEn?: string;
  helpText?: string;
  
  // Response type
  responseType: 'pass_fail' | 'yes_no' | 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'photo';
  options?: string[];          // For select/multi_select
  unit?: string;               // For number responses
  validation?: {
    required: boolean;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
  };
  
  // Classification
  isCritical: boolean;
  isRequired: boolean;
  defaultSeverity?: FindingSeverity;
  
  // Conditional display
  conditionalOn?: {
    itemId: string;
    condition: 'equals' | 'not_equals' | 'contains';
    value: string;
  };
}

// ============================================
// 📅 Scheduling Types
// ============================================

export interface ScheduledInspection {
  id: string;
  tenantId: string;
  clientId: string;
  
  // What to inspect
  equipmentId?: string;
  locationId?: string;
  templateId: string;
  category: SafetyDomain;
  
  // Schedule
  scheduledDate: Timestamp;
  dueDate: Timestamp;
  reminderSent: boolean;
  reminderDates?: Timestamp[];
  
  // Recurrence
  isRecurring: boolean;
  recurrenceRule?: {
    frequency: FrequencyType;
    intervalMonths?: number;
    endDate?: Timestamp;
    occurrences?: number;
  };
  
  // Assignment
  assignedTo?: string;
  assignedTeam?: string;
  
  // Status
  status: 'scheduled' | 'overdue' | 'completed' | 'cancelled';
  completedInspectionId?: string;
  
  // Metadata
  createdAt: Timestamp;
  createdBy: string;
  notes?: string;
}

// ============================================
// 📊 Report Types
// ============================================

export interface SafetyReport {
  id: string;
  tenantId: string;
  clientId?: string;
  
  // Report type
  type: 'summary' | 'compliance' | 'equipment_status' | 'findings' | 'custom';
  title: string;
  
  // Period
  periodStart: Timestamp;
  periodEnd: Timestamp;
  
  // Filters
  filters?: {
    categories?: SafetyDomain[];
    locations?: string[];
    equipmentTypes?: string[];
  };
  
  // Data
  data: Record<string, any>;
  
  // Generated document
  pdfUrl?: string;
  excelUrl?: string;
  
  // Metadata
  generatedAt: Timestamp;
  generatedBy: string;
}

// ============================================
// 🔔 Notification Types
// ============================================

export interface SafetyNotification {
  id: string;
  tenantId: string;
  userId: string;
  
  // Content
  type: 'inspection_due' | 'inspection_overdue' | 'finding_due' | 'certificate_expiry' | 'system';
  title: string;
  message: string;
  
  // Related entity
  entityType?: 'equipment' | 'inspection' | 'finding' | 'location';
  entityId?: string;
  
  // Status
  isRead: boolean;
  readAt?: Timestamp;
  
  // Actions
  actionUrl?: string;
  actionLabel?: string;
  
  // Metadata
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}

// ============================================
// 👤 User & Tenant Types
// ============================================

export interface SafetyTenant {
  id: string;
  name: string;
  type: 'consultant' | 'organization';
  
  // Subscription
  plan: 'free' | 'basic' | 'professional' | 'enterprise';
  enabledDomains: SafetyDomain[];
  
  // Settings
  settings: {
    defaultLanguage: 'he' | 'en';
    dateFormat: string;
    timezone: string;
    logoUrl?: string;
    primaryColor?: string;
  };
  
  // Limits
  limits: {
    maxClients: number;
    maxEquipment: number;
    maxUsers: number;
    storageGb: number;
  };
  
  // Billing
  billing?: {
    customerId?: string;
    subscriptionId?: string;
    currentPeriodEnd?: Timestamp;
  };
  
  // Metadata
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Client {
  id: string;
  tenantId: string;
  
  // Basic info
  name: string;
  nameEn?: string;
  companyNumber?: string;
  
  // Contact
  contactPerson?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Address
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  
  // Safety domains
  safetyDomains: SafetyDomain[];
  
  // Settings
  settings?: {
    inspectionReminders: boolean;
    reminderDays: number[];
    autoGenerateReports: boolean;
  };
  
  // Statistics
  stats?: {
    locationsCount: number;
    equipmentCount: number;
    lastInspectionDate?: Timestamp;
    complianceRate?: number;
  };
  
  // Metadata
  status: 'active' | 'inactive' | 'archived';
  tags?: string[];
  notes?: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
}

// ============================================
// 📄 Form Builder Types
// ============================================

export interface DynamicForm {
  id: string;
  tenantId: string;
  
  // Form info
  name: string;
  description?: string;
  type: 'inspection' | 'audit' | 'checklist' | 'report' | 'custom';
  category?: SafetyDomain;
  
  // JSON Schema definition
  schema: JSONSchemaDefinition;
  
  // UI Schema for rendering
  uiSchema?: UISchemaDefinition;
  
  // Version
  version: string;
  isActive: boolean;
  
  // Metadata
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
}

export interface JSONSchemaDefinition {
  type: 'object';
  title?: string;
  description?: string;
  required?: string[];
  properties: Record<string, JSONSchemaProperty>;
}

export interface JSONSchemaProperty {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  title?: string;
  description?: string;
  default?: any;
  enum?: (string | number)[];
  enumNames?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: 'date' | 'date-time' | 'email' | 'uri' | 'data-url';
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
}

export interface UISchemaDefinition {
  'ui:order'?: string[];
  [key: string]: UISchemaField | string[] | undefined;
}

export interface UISchemaField {
  'ui:widget'?: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file' | 'signature' | 'hidden';
  'ui:options'?: {
    rows?: number;
    accept?: string;
    inline?: boolean;
  };
  'ui:placeholder'?: string;
  'ui:help'?: string;
  'ui:disabled'?: boolean;
  'ui:readonly'?: boolean;
  classNames?: string;
}

// ============================================
// 🔍 Query & Filter Types
// ============================================

export interface EquipmentFilter {
  categories?: SafetyDomain[];
  types?: string[];
  statuses?: EquipmentStatus[];
  maintenanceStatuses?: MaintenanceStatus[];
  locations?: string[];
  riskLevels?: RiskLevel[];
  tags?: string[];
  searchQuery?: string;
  overdueOnly?: boolean;
}

export interface InspectionFilter {
  categories?: SafetyDomain[];
  types?: InspectionType[];
  statuses?: InspectionStatus[];
  overallStatuses?: ('pass' | 'pass_with_remarks' | 'fail')[];
  locations?: string[];
  equipment?: string[];
  inspectors?: string[];
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
  hasFindings?: boolean;
  searchQuery?: string;
}

export interface DashboardStats {
  totalEquipment: number;
  validEquipment: number;
  expiredEquipment: number;
  pendingInspections: number;
  overdueInspections: number;
  completedThisMonth: number;
  openFindings: number;
  criticalFindings: number;
  complianceRate: number;
  upcomingInspections: ScheduledInspection[];
  recentInspections: Inspection[];
  equipmentByCategory: Record<SafetyDomain, number>;
  inspectionsByMonth: { month: string; count: number }[];
}
