// ===========================================
// AEGIS CRM & Safety Types
// ===========================================

// --- Base Types ---
export interface BaseEntity {
  id: string;
  createdAt: Date | any;
  updatedAt: Date | any;
  createdBy?: string;
}

// --- CRM: Leads ---
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
export type LeadSource = 'website' | 'referral' | 'linkedin' | 'cold_call' | 'event' | 'partner' | 'other';
export type LeadRating = 'hot' | 'warm' | 'cold';

export interface Lead extends BaseEntity {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  
  // Company Info
  company?: string;
  title?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  
  // Lead Management
  status: LeadStatus;
  source: LeadSource;
  rating: LeadRating;
  
  // Assignment
  ownerId?: string;
  ownerName?: string;
  
  // Address
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  
  // Tracking
  description?: string;
  notes?: string;
  tags?: string[];
  
  // Conversion
  convertedAt?: Date | any;
  convertedToTenantId?: string;
  convertedToContactId?: string;
  
  // Engagement Metrics
  lastActivityAt?: Date | any;
  activitiesCount?: number;
}

// --- CRM: Contacts ---
export interface Contact extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  
  // Association
  tenantId?: string;      // Connected to which client/tenant
  tenantName?: string;
  
  // Professional
  title?: string;
  department?: string;
  
  // Preferences
  doNotCall?: boolean;
  doNotEmail?: boolean;
  preferredContactMethod?: 'email' | 'phone' | 'whatsapp';
  
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
  status: 'active' | 'inactive';
  isPrimary?: boolean;    // Primary contact for the tenant
}

// --- CRM: Opportunities ---
export type OpportunityStage = 
  | 'qualification' 
  | 'discovery' 
  | 'proposal' 
  | 'negotiation' 
  | 'closed_won' 
  | 'closed_lost';

export type ForecastCategory = 'pipeline' | 'best_case' | 'commit' | 'closed';

export interface Opportunity extends BaseEntity {
  name: string;
  
  // Association
  tenantId?: string;
  tenantName?: string;
  contactId?: string;
  contactName?: string;
  leadId?: string;        // If originated from lead
  
  // Pipeline
  stage: OpportunityStage;
  probability: number;    // 0-100
  forecastCategory: ForecastCategory;
  
  // Financials
  amount: number;
  currency: string;       // 'ILS', 'USD', 'EUR'
  expectedRevenue?: number;
  
  // Timeline
  closeDate: Date | any;
  
  // Assignment
  ownerId?: string;
  ownerName?: string;
  
  // Details
  description?: string;
  nextStep?: string;
  competitorNotes?: string;
  lossReason?: string;
  
  // Products/Services
  products?: OpportunityProduct[];
  
  // Stage History
  stageHistory?: StageChange[];
}

export interface OpportunityProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface StageChange {
  stage: OpportunityStage;
  changedAt: Date | any;
  changedBy: string;
  notes?: string;
}

// --- CRM: Activities ---
export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note';
export type ActivityStatus = 'planned' | 'completed' | 'cancelled';

export interface Activity extends BaseEntity {
  type: ActivityType;
  subject: string;
  description?: string;
  
  // Status
  status: ActivityStatus;
  priority?: 'low' | 'medium' | 'high';
  
  // Timing
  dueDate?: Date | any;
  startTime?: Date | any;
  endTime?: Date | any;
  duration?: number;      // minutes
  
  // Related To
  relatedToType?: 'lead' | 'contact' | 'tenant' | 'opportunity';
  relatedToId?: string;
  relatedToName?: string;
  
  // Assignment
  ownerId?: string;
  ownerName?: string;
  
  // Type-specific
  callDetails?: {
    direction: 'inbound' | 'outbound';
    outcome?: 'answered' | 'no_answer' | 'voicemail' | 'busy';
    phoneNumber?: string;
  };
  
  meetingDetails?: {
    location?: string;
    isOnline?: boolean;
    meetingLink?: string;
    attendees?: string[];
  };
  
  emailDetails?: {
    to?: string[];
    cc?: string[];
    templateId?: string;
  };
}

// --- Safety Module Types ---
export type SafetyFileType = 'laser' | 'fire' | 'general' | 'radiation' | 'chemical' | 'combined';
export type SafetyFileStatus = 'draft' | 'in_progress' | 'pending_approval' | 'approved' | 'expired';

export interface SafetyFile extends BaseEntity {
  // Basic Info
  title: string;
  type: SafetyFileType;
  status: SafetyFileStatus;
  
  // Association
  tenantId: string;
  tenantName?: string;
  facilityId?: string;
  facilityName?: string;
  
  // Validity
  validFrom?: Date | any;
  validUntil?: Date | any;
  nextReviewDate?: Date | any;
  
  // Assignment
  responsibleOfficerId?: string;
  responsibleOfficerName?: string;
  
  // Content
  sections: SafetySection[];
  
  // Attachments
  attachments?: SafetyAttachment[];
  
  // Approval
  approvedAt?: Date | any;
  approvedBy?: string;
  
  // Compliance
  regulatoryStandard?: string;
  complianceScore?: number;
}

export interface SafetySection {
  id: string;
  title: string;
  order: number;
  isComplete: boolean;
  content?: string;
  items?: SafetyCheckItem[];
}

export interface SafetyCheckItem {
  id: string;
  text: string;
  type: 'pass_fail' | 'text' | 'number' | 'date' | 'photo' | 'signature';
  required: boolean;
  value?: any;
  notes?: string;
}

export interface SafetyAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date | any;
}

// --- Constants ---
export const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'new', label: 'חדש', color: 'blue' },
  { value: 'contacted', label: 'נוצר קשר', color: 'yellow' },
  { value: 'qualified', label: 'מוסמך', color: 'green' },
  { value: 'unqualified', label: 'לא מתאים', color: 'gray' },
  { value: 'converted', label: 'הומר', color: 'purple' },
];

export const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: 'website', label: 'אתר' },
  { value: 'referral', label: 'הפניה' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'cold_call', label: 'שיחה קרה' },
  { value: 'event', label: 'אירוע' },
  { value: 'partner', label: 'שותף' },
  { value: 'other', label: 'אחר' },
];

export const LEAD_RATINGS: { value: LeadRating; label: string; emoji: string }[] = [
  { value: 'hot', label: 'חם', emoji: '🔥' },
  { value: 'warm', label: 'פושר', emoji: '☀️' },
  { value: 'cold', label: 'קר', emoji: '❄️' },
];

export const OPPORTUNITY_STAGES: { value: OpportunityStage; label: string; probability: number; color: string }[] = [
  { value: 'qualification', label: 'סינון', probability: 10, color: 'slate' },
  { value: 'discovery', label: 'גילוי צרכים', probability: 25, color: 'blue' },
  { value: 'proposal', label: 'הצעת מחיר', probability: 50, color: 'indigo' },
  { value: 'negotiation', label: 'משא ומתן', probability: 75, color: 'purple' },
  { value: 'closed_won', label: 'נסגר - זכייה', probability: 100, color: 'emerald' },
  { value: 'closed_lost', label: 'נסגר - הפסד', probability: 0, color: 'rose' },
];

export const SAFETY_FILE_TYPES: { value: SafetyFileType; label: string; icon: string }[] = [
  { value: 'laser', label: 'בטיחות לייזר', icon: '🔴' },
  { value: 'fire', label: 'בטיחות אש', icon: '🔥' },
  { value: 'general', label: 'בטיחות כללית', icon: '🛡️' },
  { value: 'radiation', label: 'קרינה', icon: '☢️' },
  { value: 'chemical', label: 'כימיקלים', icon: '⚗️' },
  { value: 'combined', label: 'משולב', icon: '📋' },
];

export const ACTIVITY_TYPES: { value: ActivityType; label: string; icon: string }[] = [
  { value: 'call', label: 'שיחה', icon: '📞' },
  { value: 'email', label: 'אימייל', icon: '📧' },
  { value: 'meeting', label: 'פגישה', icon: '📅' },
  { value: 'task', label: 'משימה', icon: '✓' },
  { value: 'note', label: 'הערה', icon: '📝' },
];
