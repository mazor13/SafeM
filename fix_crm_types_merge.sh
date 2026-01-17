#!/bin/bash

echo "🚑 Merging Legacy Types with Enterprise Types to fix Build..."

cat > frontend/src/types/crm.ts << 'EOF'
import { Timestamp } from 'firebase/firestore';

// ==========================================
// 🚀 ENTERPRISE MODULES (NEW)
// ==========================================

export type Stage = 
  | 'qualification' | 'discovery' | 'proposal' | 'negotiation' 
  | 'verbal_commit' | 'closed_won' | 'closed_lost' | 'disqualified';

export const STAGES = [
  { value: 'qualification', label: 'סינון ראשוני (Qual)', prob: 10 },
  { value: 'discovery', label: 'זיהוי צרכים (Discovery)', prob: 25 },
  { value: 'proposal', label: 'הצעת מחיר (Proposal)', prob: 50 },
  { value: 'negotiation', label: 'משא ומתן (Negotiation)', prob: 75 },
  { value: 'verbal_commit', label: 'אישור בע"פ (Commit)', prob: 90 },
  { value: 'closed_won', label: 'סגירה (Won)', prob: 100 },
  { value: 'closed_lost', label: 'הפסד (Lost)', prob: 0 },
];

export type OpportunityRole = 
  | 'decision_maker' | 'economic_buyer' | 'technical_evaluator' 
  | 'champion' | 'influencer' | 'blocker' | 'end_user' | 'other';

export type ActivityType = 
  | 'call' | 'email' | 'meeting' | 'demo' | 'proposal_sent' 
  | 'whatsapp' | 'linkedin' | 'note';

export type ForecastCategory = 
  | 'pipeline' | 'best_case' | 'commit' | 'closed' | 'omitted';

export type LostReason = 
  | 'price_too_high' | 'competitor_features' | 'no_budget' 
  | 'no_decision' | 'bad_timing' | 'feature_gap' | 'other';

export interface Opportunity {
  id: string;
  title: string;
  accountId: string;
  accountName: string;
  stage: Stage;
  amount: number;
  currency: string;
  closeDate: any;
  probability: number;
  forecastCategory: ForecastCategory;
  forecastNotes?: string;
  bantScore?: number;
  hasBudget?: boolean;
  hasAuthority?: boolean;
  hasNeed?: boolean;
  hasTimeline?: boolean;
  ownerId: string;
  createdAt: any;
  updatedAt: any;
}

// ==========================================
// 🏚️ LEGACY MODULES (RESTORED FOR COMPATIBILITY)
// ==========================================

// --- LEADS ---
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'חדש' },
  { value: 'contacted', label: 'נוצר קשר' },
  { value: 'qualified', label: 'מוסמך' },
  { value: 'unqualified', label: 'לא רלוונטי' },
  { value: 'converted', label: 'הומר ללקוח' },
];

export const LEAD_SOURCES = [
  { value: 'website', label: 'אתר אינטרנט' },
  { value: 'referral', label: 'הפניה' },
  { value: 'linkedin', label: 'לינקדאין' },
  { value: 'cold_call', label: 'שיחה יזומה' },
  { value: 'event', label: 'כנס/אירוע' },
];

export const LEAD_RATINGS = [
  { value: 'hot', label: 'חם', emoji: '🔥' },
  { value: 'warm', label: 'פושר', emoji: '☀️' },
  { value: 'cold', label: 'קר', emoji: '❄️' },
];

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  title?: string; // restored
  company?: string;
  status: LeadStatus;
  source: string;
  rating: string;
  notes?: string;
  createdAt: any;
  updatedAt: any;
  convertedToTenantId?: string;
  convertedAt?: any;
}

// --- ACTIVITIES (LEGACY + NEW) ---
export const ACTIVITY_TYPES = [
  { value: 'call', label: 'שיחה', icon: '📞' },
  { value: 'email', label: 'אימייל', icon: '📧' },
  { value: 'meeting', label: 'פגישה', icon: '📅' },
  { value: 'note', label: 'הערה', icon: '📝' },
];

export interface Activity {
  id: string;
  type: ActivityType; // Shared type
  subject: string;
  description?: string;
  status?: 'completed' | 'scheduled'; // legacy support
  relatedToType?: 'lead' | 'contact' | 'opportunity';
  relatedToId?: string;
  createdAt: any;
  date?: any;
}

// --- SAFETY FILES (RESTORED) ---
export type SafetyFileType = 'laser' | 'fire_risk' | 'machinery' | 'chemical' | 'general' | 'heights' | 'accessibility' | 'radiation';
export type SafetyFileStatus = 'draft' | 'in_progress' | 'pending_approval' | 'approved' | 'expired' | 'active' | 'review_needed' | 'archived';

export const SAFETY_FILE_TYPES = [
  { value: 'general', label: 'תיק מפעל כללי' },
  { value: 'fire_risk', label: 'תיק שטח (אש)' },
  { value: 'laser', label: 'בטיחות לייזר' },
  { value: 'radiation', label: 'בטיחות קרינה' },
];

export interface SafetyFile {
  id: string;
  title: string;
  type: SafetyFileType;
  status: SafetyFileStatus;
  tenantId: string;
  tenantName?: string;
  validUntil?: any;
  responsibleOfficerName?: string;
  createdAt: any;
}

// --- CONTACTS ---
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  tenantId: string;
  tenantName: string;
  isPrimary: boolean;
  createdAt: any;
}
EOF

echo "✅ Types Merged. Retrying Build..."
cd frontend && npm run build

if [ $? -eq 0 ]; then
  echo "🚀 Build Success! Deploying..."
  cd ..
  firebase deploy --only hosting
else
  echo "❌ Build Failed again. Check logs."
fi
