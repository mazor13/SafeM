// ===========================================
// AEGIS Safety Module Types - Phase 1
// ===========================================

import { Timestamp } from 'firebase/firestore';

// --- Base Types ---
export interface BaseEntity {
  id: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  createdBy?: string;
}

// ===========================================
// TENANT (Client Company) - Extended
// ===========================================

export type TenantStatus = 'active' | 'suspended' | 'onboarding' | 'churned';
export type TenantPlan = 'starter' | 'pro' | 'enterprise';

export interface Tenant extends BaseEntity {
  // Basic Info
  name: string;
  businessNumber?: string;        // ח.פ. / ע.מ.
  
  // Contact
  email?: string;
  phone?: string;
  website?: string;
  
  // Address
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  
  // Status & Plan
  status: TenantStatus;
  plan: TenantPlan;
  
  // Limits
  usersCount: number;
  usersLimit: number;
  
  // Health
  healthScore: number;            // 0-100
  domain?: string;                // Company domain
  lastActive?: Date | Timestamp;
  
  // Branding (White Label)
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    companyNameDisplay?: string;
  };
  
  // Escalation Settings - Per Client!
  escalationSettings: EscalationSettings;
  
  // Billing
  billingSettings?: {
    billingEmail?: string;
    paymentMethod?: 'invoice' | 'credit_card' | 'bank_transfer';
    currency?: 'ILS' | 'USD' | 'EUR';
  };
  
  // Conversion tracking
  convertedFromLeadId?: string;
  
  // Notes
  notes?: string;
  tags?: string[];
}

// ===========================================
// ESCALATION SETTINGS
// ===========================================

export interface EscalationSettings {
  // הגדרות לפי חומרה
  critical: EscalationTiming;
  high: EscalationTiming;
  medium: EscalationTiming;
  low: EscalationTiming;
  
  // הגדרות כלליות
  notifyOnNewFinding: boolean;
  notifyOnOverdue: boolean;
  dailyOverdueReminder: boolean;
  notifyExternalOfficer: boolean;  // לשלוח גם לממונה החיצוני (בעל המערכת)
  
  // ערוצי התראה
  channels: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;                  // רק לקריטי
  };
}

export interface EscalationTiming {
  totalTimeHours: number;          // זמן כולל לטיפול
  firstReminderHours: number;      // תזכורת ראשונה אחרי X שעות
  escalateLevel2Hours: number;     // אסקלציה לרמה 2 אחרי X שעות
  escalateLevel3Hours: number;     // אסקלציה לרמה 3 אחרי X שעות
}

// ברירות מחדל לאסקלציה
export const DEFAULT_ESCALATION_SETTINGS: EscalationSettings = {
  critical: {
    totalTimeHours: 48,
    firstReminderHours: 12,
    escalateLevel2Hours: 24,
    escalateLevel3Hours: 36,
  },
  high: {
    totalTimeHours: 168,           // 7 days
    firstReminderHours: 72,        // 3 days
    escalateLevel2Hours: 120,      // 5 days
    escalateLevel3Hours: 144,      // 6 days
  },
  medium: {
    totalTimeHours: 720,           // 30 days
    firstReminderHours: 336,       // 14 days
    escalateLevel2Hours: 504,      // 21 days
    escalateLevel3Hours: 648,      // 27 days
  },
  low: {
    totalTimeHours: 2160,          // 90 days
    firstReminderHours: 1080,      // 45 days
    escalateLevel2Hours: 1680,     // 70 days
    escalateLevel3Hours: 2040,     // 85 days
  },
  notifyOnNewFinding: true,
  notifyOnOverdue: true,
  dailyOverdueReminder: true,
  notifyExternalOfficer: true,
  channels: {
    email: true,
    whatsapp: true,
    sms: false,
  },
};

// ===========================================
// CONTACT - Extended with Escalation Levels
// ===========================================

export type ContactStatus = 'active' | 'inactive';
export type EscalationLevel = 1 | 2 | 3;
export type PreferredContactMethod = 'email' | 'phone' | 'whatsapp';

export interface Contact extends BaseEntity {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  
  // Association - קשר ללקוח
  tenantId: string;
  tenantName?: string;
  
  // Professional
  title?: string;                  // "ממונה בטיחות" / "מנהל ייצור"
  department?: string;
  
  // 🔴 Escalation Level - NEW!
  escalationLevel: EscalationLevel;
  // 1 = אחראי ישיר (מקבל ראשון)
  // 2 = מנהל (מקבל אם רמה 1 לא מגיב)
  // 3 = מנכ"ל/הנהלה (מקבל אם רמה 2 לא מגיב)
  
  // Preferences
  doNotCall?: boolean;
  doNotEmail?: boolean;
  preferredContactMethod?: PreferredContactMethod;
  
  // Address
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  
  // Notes
  description?: string;
  notes?: string;
  tags?: string[];
  
  // Status
  status: ContactStatus;
  isPrimary?: boolean;             // Primary contact for the tenant
  
  // 🔴 Portal Access - NEW!
  portalAccess?: {
    enabled: boolean;
    role: 'admin' | 'manager' | 'viewer';
    authUid?: string;              // Firebase Auth UID
    lastLoginAt?: Date | Timestamp;
    invitedAt?: Date | Timestamp;
    invitedBy?: string;
  };
  
  // 🔴 Notification Preferences - NEW!
  notificationPreferences?: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
    
    // מה לקבל
    newFindings: boolean;
    findingReminders: boolean;
    reportReady: boolean;
    trainingReminders: boolean;
  };
}

// ===========================================
// AUDIT LOG
// ===========================================

export type AuditAction = 
  // Entity CRUD
  | 'created'
  | 'updated'
  | 'deleted'
  | 'viewed'
  // Status changes
  | 'status_changed'
  | 'approved'
  | 'rejected'
  | 'submitted'
  // Assignment
  | 'assigned'
  | 'reassigned'
  // Escalation
  | 'escalated'
  | 'reminder_sent'
  // Auth
  | 'login'
  | 'logout'
  | 'password_changed'
  // Files
  | 'file_uploaded'
  | 'file_downloaded'
  | 'file_deleted'
  // Other
  | 'exported'
  | 'imported'
  | 'comment_added'
  | 'email_sent'
  | 'sms_sent'
  | 'whatsapp_sent';

export type AuditEntityType = 
  | 'tenant'
  | 'contact'
  | 'user'
  | 'lead'
  | 'opportunity'
  | 'safety_file'
  | 'inspection'
  | 'finding'
  | 'template'
  | 'invoice'
  | 'training'
  | 'document';

export interface AuditLog {
  id: string;
  
  // מתי
  timestamp: Date | Timestamp;
  
  // מי
  userId: string;
  userName: string;
  userEmail?: string;
  userType: 'admin' | 'tenant_user' | 'client_contact' | 'system';
  
  // מה
  action: AuditAction;
  
  // על מה
  entityType: AuditEntityType;
  entityId: string;
  entityName?: string;             // לנוחות הצגה
  
  // פרטים
  details?: {
    previousValue?: any;
    newValue?: any;
    changes?: Record<string, { from: any; to: any }>;
    notes?: string;
  };
  
  // קונטקסט
  tenantId?: string;               // אם רלוונטי
  clientId?: string;               // אם רלוונטי
  
  // מטא
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

// ===========================================
// FINDING SEVERITY
// ===========================================

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';

export const FINDING_SEVERITIES: { 
  value: FindingSeverity; 
  label: string; 
  labelHe: string;
  color: string; 
  emoji: string;
  hoursToResolve: number;
}[] = [
  { 
    value: 'critical', 
    label: 'Critical', 
    labelHe: 'קריטי',
    color: 'red', 
    emoji: '🔴',
    hoursToResolve: 48
  },
  { 
    value: 'high', 
    label: 'High', 
    labelHe: 'גבוה',
    color: 'orange', 
    emoji: '🟠',
    hoursToResolve: 168  // 7 days
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    labelHe: 'בינוני',
    color: 'yellow', 
    emoji: '🟡',
    hoursToResolve: 720  // 30 days
  },
  { 
    value: 'low', 
    label: 'Low', 
    labelHe: 'נמוך',
    color: 'green', 
    emoji: '🟢',
    hoursToResolve: 2160  // 90 days
  },
];

// ===========================================
// ESCALATION LEVELS
// ===========================================

export const ESCALATION_LEVELS: {
  level: EscalationLevel;
  label: string;
  labelHe: string;
  description: string;
}[] = [
  {
    level: 1,
    label: 'Direct Responsible',
    labelHe: 'אחראי ישיר',
    description: 'מקבל את ההתראה הראשונה'
  },
  {
    level: 2,
    label: 'Manager',
    labelHe: 'מנהל',
    description: 'מקבל אם רמה 1 לא מגיב'
  },
  {
    level: 3,
    label: 'Executive',
    labelHe: 'הנהלה/מנכ"ל',
    description: 'מקבל אם רמה 2 לא מגיב'
  },
];

// ===========================================
// CONTACT STATUS CONSTANTS
// ===========================================

export const CONTACT_STATUSES: { value: ContactStatus; label: string; color: string }[] = [
  { value: 'active', label: 'פעיל', color: 'green' },
  { value: 'inactive', label: 'לא פעיל', color: 'gray' },
];

// ===========================================
// PORTAL ROLES
// ===========================================

export const PORTAL_ROLES: { 
  value: 'admin' | 'manager' | 'viewer'; 
  label: string; 
  description: string;
}[] = [
  { 
    value: 'admin', 
    label: 'מנהל', 
    description: 'צפייה בהכל + עדכון ליקויים + הגדרות' 
  },
  { 
    value: 'manager', 
    label: 'מנהל תחום', 
    description: 'צפייה בהכל + עדכון ליקויים' 
  },
  { 
    value: 'viewer', 
    label: 'צופה', 
    description: 'צפייה בלבד' 
  },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get escalation timing for a severity
 */
export function getEscalationTiming(
  settings: EscalationSettings, 
  severity: FindingSeverity
): EscalationTiming {
  return settings[severity];
}

/**
 * Calculate due date for a finding
 */
export function calculateDueDate(
  createdAt: Date, 
  severity: FindingSeverity,
  settings: EscalationSettings
): Date {
  const timing = getEscalationTiming(settings, severity);
  const dueDate = new Date(createdAt);
  dueDate.setHours(dueDate.getHours() + timing.totalTimeHours);
  return dueDate;
}

/**
 * Check if a finding is overdue
 */
export function isOverdue(dueDate: Date): boolean {
  return new Date() > dueDate;
}

/**
 * Get hours remaining until due date
 */
export function getHoursRemaining(dueDate: Date): number {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
}

/**
 * Get days remaining until due date
 */
export function getDaysRemaining(dueDate: Date): number {
  return Math.floor(getHoursRemaining(dueDate) / 24);
}

/**
 * Format remaining time as string
 */
export function formatTimeRemaining(dueDate: Date): string {
  const hours = getHoursRemaining(dueDate);
  
  if (hours < 0) {
    const overdue = Math.abs(hours);
    if (overdue < 24) {
      return `באיחור של ${overdue} שעות`;
    }
    return `באיחור של ${Math.floor(overdue / 24)} ימים`;
  }
  
  if (hours < 24) {
    return `${hours} שעות`;
  }
  
  if (hours < 48) {
    return 'יום אחד';
  }
  
  return `${Math.floor(hours / 24)} ימים`;
}

/**
 * Get contact's full name
 */
export function getContactFullName(contact: Contact): string {
  return `${contact.firstName} ${contact.lastName}`.trim();
}

/**
 * Get contacts by escalation level
 */
export function getContactsByLevel(
  contacts: Contact[], 
  level: EscalationLevel
): Contact[] {
  return contacts.filter(c => c.escalationLevel === level && c.status === 'active');
}
