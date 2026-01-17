import { Timestamp } from 'firebase/firestore';

// --- CRM TYPES ---
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  company: string;
  title: string;
  source: string;
  rating: string;
  status: LeadStatus;
  notes?: string;
  website?: string;
  createdAt: any;
  updatedAt: any;
  convertedAt?: any;
  convertedToTenantId?: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  subject: string;
  description?: string;
  status: 'pending' | 'completed';
  relatedToType: 'lead' | 'contact' | 'opportunity';
  relatedToId: string;
  createdAt: any;
}

export const LEAD_STATUSES = [
  { value: 'new', label: 'חדש' },
  { value: 'contacted', label: 'נוצר קשר' },
  { value: 'qualified', label: 'מוסמך' },
  { value: 'unqualified', label: 'לא רלוונטי' },
  { value: 'converted', label: 'הומר ללקוח' },
];

export const LEAD_SOURCES = [
  { value: 'website', label: 'אתר אינטרנט' },
  { value: 'referral', label: 'הפניה' },
  { value: 'social', label: 'רשתות חברתיות' },
  { value: 'other', label: 'אחר' },
];

export const LEAD_RATINGS = [
  { value: 'hot', label: 'חם', emoji: '🔥' },
  { value: 'warm', label: 'פושר', emoji: '☀️' },
  { value: 'cold', label: 'קר', emoji: '❄️' },
];

export const ACTIVITY_TYPES = [
  { value: 'call', label: 'שיחה', icon: '📞' },
  { value: 'email', label: 'אימייל', icon: '✉️' },
  { value: 'meeting', label: 'פגישה', icon: '📅' },
  { value: 'note', label: 'הערה', icon: '📝' },
];

// --- SAFETY TYPES (UPDATED TO MATCH CODE) ---

// הוספנו את 'laser' ואחרים שהקוד חיפש
export type SafetyFileType = 'fire_risk' | 'machinery' | 'chemical' | 'general' | 'heights' | 'accessibility' | 'laser' | 'radiation';

// הוספנו את 'approved', 'in_progress', 'pending_approval'
export type SafetyFileStatus = 'draft' | 'active' | 'review_needed' | 'expired' | 'archived' | 'approved' | 'in_progress' | 'pending_approval';

export interface SafetyFile {
  id: string;
  title: string; // Changed from name to title
  type: SafetyFileType;
  status: SafetyFileStatus;
  
  // New fields code expects
  tenantName?: string;
  validUntil?: any;
  responsibleOfficerName?: string;
  
  // Legacy fields kept for compatibility
  clientId?: string;
  siteId?: string;
  assignedTo?: string;
  description?: string;
  createdAt: any;
  updatedAt: any;
  expiryDate?: any;
  lastReviewDate?: any;
  nextReviewDate?: any;
  tags?: string[];
}

export const SAFETY_FILE_TYPES = [
  { value: 'fire_risk', label: 'תיק שטח / כיבוי אש', icon: '🔥', color: 'red' },
  { value: 'machinery', label: 'בטיחות מכונות', icon: '⚙️', color: 'slate' },
  { value: 'chemical', label: 'חומרים מסוכנים', icon: '☣️', color: 'orange' },
  { value: 'heights', label: 'עבודה בגובה', icon: '🏗️', color: 'blue' },
  { value: 'accessibility', label: 'נגישות', icon: '♿', color: 'purple' },
  { value: 'general', label: 'כללי / אחר', icon: '📁', color: 'gray' },
  { value: 'laser', label: 'בטיחות לייזר', icon: '🔴', color: 'red' },
];
