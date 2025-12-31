# 🛡️ AEGIS CRM & Safety Module - Integration Guide
## Phase 1: Foundation + CRM Core

---

## 📁 קבצים חדשים שנוצרו

```
frontend/src/
├── types/
│   └── crm.ts                          # Types עבור CRM + Safety (חדש)
│
├── layouts/
│   └── AdminLayoutV2.tsx               # Layout מעודכן עם ניווט חדש (חדש)
│
├── hooks/
│   └── useLeads.ts                     # Hook לניהול לידים (חדש)
│
├── pages/admin/
│   ├── crm/
│   │   ├── index.ts                    # Exports (חדש)
│   │   ├── LeadsPage.tsx               # רשימת לידים (חדש)
│   │   └── LeadDetailPage.tsx          # פרטי ליד + המרה (חדש)
│   │
│   └── safety/
│       ├── index.ts                    # Exports (חדש)
│       └── SafetyFilesPage.tsx         # רשימת תיקי בטיחות (חדש)
```

---

## 🔧 שלבי אינטגרציה

### שלב 1: העתקת הקבצים

```bash
# מתוך התיקייה שהורדת
cp -r src/types/crm.ts YOUR_PROJECT/frontend/src/types/
cp -r src/layouts/AdminLayoutV2.tsx YOUR_PROJECT/frontend/src/layouts/
cp -r src/hooks/useLeads.ts YOUR_PROJECT/frontend/src/hooks/
cp -r src/pages/admin/crm YOUR_PROJECT/frontend/src/pages/admin/
cp -r src/pages/admin/safety YOUR_PROJECT/frontend/src/pages/admin/
```

### שלב 2: עדכון הניתוב (Router)

ב-`App.tsx` או בקובץ הניתוב שלך, הוסף את הנתיבים החדשים:

```tsx
import { LeadsPage, LeadDetailPage } from './pages/admin/crm';
import { SafetyFilesPage } from './pages/admin/safety';

// בתוך ה-Routes של Admin:
<Route path="admin" element={<AdminLayout />}>
  {/* ... existing routes ... */}
  
  {/* CRM Routes */}
  <Route path="crm/leads" element={<LeadsPage />} />
  <Route path="crm/leads/:id" element={<LeadDetailPage />} />
  <Route path="crm/contacts" element={<div>Coming Soon</div>} />
  <Route path="crm/accounts" element={<div>Coming Soon</div>} />
  <Route path="crm/opportunities" element={<div>Coming Soon</div>} />
  <Route path="crm/activities" element={<div>Coming Soon</div>} />
  
  {/* Safety Routes */}
  <Route path="safety/files" element={<SafetyFilesPage />} />
  <Route path="safety/files/:id" element={<div>Coming Soon</div>} />
  <Route path="safety/surveys" element={<div>Coming Soon</div>} />
  <Route path="safety/training" element={<div>Coming Soon</div>} />
  <Route path="safety/equipment" element={<div>Coming Soon</div>} />
</Route>
```

### שלב 3: עדכון ה-AdminLayout

**אפשרות א: החלף את ה-Layout הקיים**
```tsx
// ב-App.tsx
import AdminLayout from './layouts/AdminLayoutV2';
```

**אפשרות ב: הוסף רק את הניווט החדש**

עדכן את `AdminLayout.tsx` הקיים והוסף את הפריטים:

```tsx
const navigation = [
  { name: 'מגדל פיקוח', to: '/admin', end: true, icon: Home },
  { name: 'Cortex BI', to: '/admin/dashboard-bi', icon: LayoutDashboard },
  
  // CRM
  { name: 'לידים', to: '/admin/crm/leads', icon: UserPlus },
  { name: 'הזדמנויות', to: '/admin/crm/opportunities', icon: Target },
  
  // Safety
  { name: 'תיקי בטיחות', to: '/admin/safety/files', icon: Shield },
  
  // Existing
  { name: 'לקוחות', to: '/admin/clients', icon: Users },
  { name: 'ניהול ידע', to: '/admin/templates', icon: FileText },
  { name: 'פיננסים', to: '/admin/finance', icon: CreditCard },
  { name: 'מוצרים', to: '/admin/products', icon: Package },
  { name: 'הגדרות', to: '/admin/settings', icon: Settings },
];
```

### שלב 4: יצירת Collections ב-Firestore

צור את ה-Collections הבאים (ייווצרו אוטומטית עם ההוספה הראשונה, אבל כדאי להגדיר indexes):

```
firestore/
├── leads/                  # לידים
├── contacts/               # אנשי קשר
├── opportunities/          # הזדמנויות
├── activities/             # פעילויות
└── safetyFiles/            # תיקי בטיחות
```

### שלב 5: עדכון Firestore Rules

הוסף ל-`firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... existing rules ...
    
    // CRM Collections
    match /leads/{leadId} {
      allow read, write: if request.auth != null;
    }
    
    match /contacts/{contactId} {
      allow read, write: if request.auth != null;
    }
    
    match /opportunities/{oppId} {
      allow read, write: if request.auth != null;
    }
    
    match /activities/{activityId} {
      allow read, write: if request.auth != null;
    }
    
    // Safety Collections
    match /safetyFiles/{fileId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🎨 התאמות לסגנון הקיים

הקוד נכתב בהתאם לסגנון הקיים שלך:

| אלמנט | סגנון |
|--------|--------|
| רקע | `bg-[#0f172a]` (slate-900) |
| כרטיסים | `bg-slate-900/40 border-white/5 backdrop-blur-sm rounded-2xl` |
| כפתור ראשי | `bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20` |
| טקסט | `text-white` (headers), `text-slate-400` (secondary) |
| RTL | `dir="rtl"` |

---

## 📊 מבנה הנתונים (Firestore Schema)

### Lead Document
```typescript
{
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phone?: string,
  company?: string,
  title?: string,
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted',
  source: 'website' | 'referral' | 'linkedin' | 'cold_call' | 'event' | 'partner' | 'other',
  rating: 'hot' | 'warm' | 'cold',
  notes?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  convertedToTenantId?: string,  // אם הומר ללקוח
}
```

### SafetyFile Document
```typescript
{
  id: string,
  title: string,
  type: 'laser' | 'fire' | 'general' | 'radiation' | 'chemical' | 'combined',
  status: 'draft' | 'in_progress' | 'pending_approval' | 'approved' | 'expired',
  tenantId: string,
  tenantName?: string,
  validFrom?: Timestamp,
  validUntil?: Timestamp,
  responsibleOfficerId?: string,
  responsibleOfficerName?: string,
  sections: SafetySection[],
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

## 🚀 מה הלאה (Phase 2)

### דפים להוספה:
1. **ContactsPage** - אנשי קשר מחוברים ל-Tenants
2. **OpportunitiesPage** - פייפליין מכירות (Kanban)
3. **SafetyFileDetailPage** - עריכת תיק בטיחות מלא
4. **SurveysPage** - ניהול סקרים

### פיצ'רים להוספה:
1. **Convert Lead Flow** - המרה מלאה עם בחירת תוכנית
2. **Activity Timeline** - היסטוריה מלאה
3. **Pipeline Dashboard** - תצוגת Kanban להזדמנויות
4. **Safety Templates** - תבניות לתיקי בטיחות

---

## ❓ שאלות נפוצות

**ש: איך מחברים Lead ל-Tenant קיים?**
ת: ב-LeadDetailPage יש כפתור "המר ללקוח" שיוצר Tenant חדש ו-Contact ראשי.

**ש: איך מוסיפים שדות נוספים ל-Lead?**
ת: עדכן את ה-interface ב-`types/crm.ts` ואת הטופס ב-`LeadsPage.tsx`.

**ש: איך מחברים תיק בטיחות ללקוח?**
ת: בעת יצירת תיק, בחר את ה-Tenant מרשימה (צריך להוסיף dropdown).

---

## 📞 תמיכה

אם יש שאלות, פשוט תעלה את ה-screenshot של השגיאה ואעזור!
