#!/bin/bash

echo "🚀 Upgrading System Foundation to Enterprise Grade..."

# 1. עדכון מסמך הארכיטקטורה והתהליכים (ARCHITECTURE.md)
# אנחנו מוסיפים את הפרק החדש של Sales Logic
cat >> ARCHITECTURE.md << 'EOF'

## 7. Enterprise Sales Logic (Added v1.1)
Based on Expert Gap Analysis.

### 7.1 Data Model Enhancements
* **Opportunity Roles:** Multi-contact relationship mapping (Decision Maker, Blocker, Champion).
* **Activity Tracking:** Full history of interactions (Calls, Emails, Meetings).
* **Competitor Intelligence:** Tracking win/loss against specific competitors.

### 7.2 Pipeline Governance
* **BANT Qualification:** Mandatory scoring (Budget, Authority, Need, Timeline) before Discovery.
* **Stage Gating:** Validation rules preventing stage progression without required data.
* **Lost Analysis:** Mandatory reason codes for Closed-Lost deals.

### 7.3 Forecasting
* **Categories:** Pipeline, Best Case, Commit, Closed, Omitted.
* **Logic:** Weighted probability based on stage + manual override with justification.
EOF

# 2. עדכון קובץ הטיפוסים המלא (types/crm.ts)
# זהו "המוח" החדש של המערכת, הכולל את כל השדות מהאפיון
cat > frontend/src/types/crm.ts << 'EOF'
import { Timestamp } from 'firebase/firestore';

// --- ENUMS & CONSTANTS ---

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

// --- INTERFACES ---

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  date: any; // Timestamp
  duration?: number; // minutes
  outcome?: string;
  
  // Linking
  accountId: string;
  opportunityId?: string;
  contactId?: string;
  
  createdBy: string;
  createdAt: any;
}

export interface OpportunityContactRole {
  id: string;
  opportunityId: string;
  contactId: string;
  role: OpportunityRole;
  isPrimary: boolean;
  influence: 'high' | 'medium' | 'low';
}

export interface Competitor {
  id: string;
  name: string;
  website?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface Opportunity {
  id: string;
  title: string; // Deal Name
  accountId: string; // Link to Tenant
  accountName: string; // Denormalized for UI
  
  // --- Pipeline ---
  stage: Stage;
  amount: number;
  currency: string;
  closeDate: any; // Expected Close Date
  probability: number;
  
  // --- Forecast ---
  forecastCategory: ForecastCategory;
  forecastNotes?: string;
  
  // --- Qualification (BANT) ---
  bantScore?: number; // 0-4
  hasBudget?: boolean;
  hasAuthority?: boolean;
  hasNeed?: boolean;
  hasTimeline?: boolean;
  
  // --- Loss Analysis ---
  lostReason?: LostReason;
  lostReasonDetail?: string;
  competitorId?: string;
  
  // --- Meta ---
  ownerId: string;
  createdAt: any;
  updatedAt: any;
  lastActivityDate?: any;
}

// --- LEGACY SUPPORT (כדי לא לשבור קוד קיים בינתיים) ---
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  company?: string;
  status: string;
  source: string;
  rating: string;
  createdAt: any;
}

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

# 3. עדכון מדריך המשתמש (User Guide)
cat > frontend/public/docs/SALES_USER_GUIDE.md << 'EOF'
# מדריך משתמש - AEGIS Sales Enterprise
גרסה: 2.0 (מעודכן לפי אפיון מומחה)

## מושגי יסוד חדשים

### 1. BANT Qualification
לפני שפותחים הזדמנות, עליך לאמת 4 פרמטרים:
* **B**udget: האם יש להם כסף?
* **A**uthority: האם אנחנו מדברים עם המחליט?
* **N**eed: האם יש צורך אמיתי?
* **T**imeline: מתי הם רוצים לעלות לאוויר?

### 2. Opportunity Roles
עסקה לא נסגרת מול אדם אחד. עליך למפות את כל השחקנים:
* **Champion:** האדם שדוחף את העסקה מבפנים.
* **Blocker:** מי שעלול לעצור אותנו.
* **Economic Buyer:** מי שחותם על הצ'ק.

### 3. Forecast Categories
המנהל שלך ישאל אותך "מה הצפי?". השתמש בקטגוריות:
* **Commit:** אני מתחייב שזה ייסגר החודש.
* **Best Case:** אם הכל ילך חלק, זה ייסגר.
* **Pipeline:** כרגע בעבודה, מוקדם לדעת.

### 4. חובת דיווח (Activity Logging)
מערכת ה-CRM היא הזיכרון הארגוני.
כל שיחה, מייל או פגישה חייבים להיות מתועדים בכרטיס הלקוח תחת "פעילויות".
EOF

echo "✅ Enterprise Schema & Documentation Updated."
echo "⚠️ Note: Since we changed types/crm.ts, the existing OpportunitiesPage might have TS errors."
echo "   We will fix the UI in the next step to match this new schema."
