# 🏗️ Phase 1: Foundation - AEGIS Platform

## 📋 סקירה כללית

**שם המודול:** Foundation  
**מטרה:** בניית התשתית הבסיסית למערכת AEGIS  
**תלויות:** אין (מודול בסיס)  
**זמן פיתוח משוער:** 4-6 שבועות  

---

## 🎯 מה כולל המודול

| רכיב | תיאור | עדיפות |
|------|--------|--------|
| Multi-Tenant Architecture | תמיכה במספר בעלי מערכת | 🔴 קריטי |
| Authentication | הזדהות והרשמה | 🔴 קריטי |
| User Management | ניהול משתמשים פנימיים | 🔴 קריטי |
| Client Management | ניהול לקוחות הקצה | 🔴 קריטי |
| Contact Management | ניהול אנשי קשר + היררכיה | 🔴 קריטי |
| Permission System | מערכת הרשאות | 🔴 קריטי |
| Audit Log | לוג שינויים | 🔴 קריטי |

---

## 🏢 ארכיטקטורה רב-שכבתית

```
┌─────────────────────────────────────────────────────────────────┐
│                         AEGIS Platform                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏢 Tenant (בעל המערכת)                                        │
│  ════════════════════════                                       │
│  ממונה בטיחות / חברת ייעוץ שרוכשת את המערכת                     │
│  דוגמה: "אלומה בטיחות" / "מישל מזור"                            │
│                                                                 │
│     ┌──────────────────────────────────────────────────────┐   │
│     │                                                      │   │
│     │  👥 Users (צוות הממונה)                              │   │
│     │  ════════════════════                                │   │
│     │  עובדים של בעל המערכת שמנהלים לקוחות                 │   │
│     │  דוגמה: "עובד א' - מנהל 5 לקוחות"                    │   │
│     │                                                      │   │
│     │     ┌───────────────────────────────────────────┐   │   │
│     │     │                                           │   │   │
│     │     │  🏭 Clients (לקוחות הקצה)                 │   │   │
│     │     │  ═══════════════════════                  │   │   │
│     │     │  החברות שמקבלות שירותי בטיחות             │   │   │
│     │     │  דוגמה: "רול פרופיל בע"מ"                 │   │   │
│     │     │                                           │   │   │
│     │     │     ┌────────────────────────────────┐   │   │   │
│     │     │     │                                │   │   │   │
│     │     │     │  👤 Contacts (אנשי קשר)       │   │   │   │
│     │     │     │  ═════════════════════        │   │   │   │
│     │     │     │  אנשים בארגון הלקוח           │   │   │   │
│     │     │     │  דוגמה: "פרדי - מנכ"ל"       │   │   │   │
│     │     │     │                                │   │   │   │
│     │     │     └────────────────────────────────┘   │   │   │
│     │     │                                           │   │   │
│     │     └───────────────────────────────────────────┘   │   │
│     │                                                      │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 מבנה נתונים (Database Schema)

### 1. Tenants Collection
**נתיב:** `/tenants/{tenantId}`

```typescript
interface Tenant {
  id: string;
  
  // פרטי בעל המערכת
  name: string;                    // "אלומה בטיחות"
  businessName: string;            // שם העסק הרשום
  businessNumber: string;          // ח.פ / עוסק מורשה
  
  // פרטי קשר
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  
  // מיתוג (White Label)
  branding: {
    logo: string;                  // URL לוגו
    primaryColor: string;          // צבע ראשי
    secondaryColor: string;        // צבע משני
    customDomain?: string;         // דומיין מותאם (אופציונלי)
  };
  
  // הגדרות
  settings: {
    defaultLanguage: 'he' | 'en';
    timezone: string;              // "Asia/Jerusalem"
    dateFormat: string;            // "DD/MM/YYYY"
    currency: string;              // "ILS"
  };
  
  // מנוי
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'trial' | 'suspended' | 'cancelled';
    startDate: Timestamp;
    endDate: Timestamp;
    maxUsers: number;
    maxClients: number;
  };
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

### 2. Users Collection (צוות בעל המערכת)
**נתיב:** `/tenants/{tenantId}/users/{userId}`

```typescript
interface User {
  id: string;
  tenantId: string;
  
  // פרטים אישיים
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  
  // הזדהות
  authUid: string;                 // Firebase Auth UID
  
  // תפקיד והרשאות
  role: 'owner' | 'admin' | 'manager' | 'viewer';
  permissions: UserPermissions;
  
  // שיוך לקוחות (למנהלים)
  assignedClientIds: string[];     // רשימת לקוחות שהמשתמש מנהל
  
  // סטטוס
  status: 'active' | 'inactive' | 'pending';
  lastLoginAt?: Timestamp;
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

interface UserPermissions {
  // לקוחות
  clients: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    viewAll: boolean;              // רואה את כל הלקוחות או רק משויכים
  };
  
  // תיקי בטיחות
  safetyFiles: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  };
  
  // ביקורות
  inspections: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  
  // ליקויים
  findings: {
    view: boolean;
    create: boolean;
    edit: boolean;
    close: boolean;
  };
  
  // הדרכות
  training: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  
  // הגדרות
  settings: {
    viewTenantSettings: boolean;
    editTenantSettings: boolean;
    manageUsers: boolean;
    manageBilling: boolean;
    manageTemplates: boolean;
  };
  
  // דוחות
  reports: {
    view: boolean;
    export: boolean;
  };
}
```

### 3. Clients Collection (לקוחות הקצה)
**נתיב:** `/tenants/{tenantId}/clients/{clientId}`

```typescript
interface Client {
  id: string;
  tenantId: string;
  
  // פרטי החברה
  name: string;                    // "רול פרופיל בע"מ"
  businessNumber: string;          // ח.פ
  industry: string;                // "תעשייה" / "בריאות" / וכו'
  
  // כתובת
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  
  // פרטי קשר ראשיים
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  
  // הגדרות אסקלציה מותאמות
  escalationSettings: EscalationSettings;
  
  // הגדרות התראות
  notificationSettings: {
    emailEnabled: boolean;
    whatsappEnabled: boolean;
    reminderDays: {
      training: number[];          // [60, 30, 14, 7]
      inspections: number[];       // [90, 60, 30, 14]
      permits: number[];           // [180, 90, 60, 30]
    };
  };
  
  // תחומי בטיחות רלוונטיים
  safetyDomains: SafetyDomain[];   // ['laser', 'fire', 'general']
  
  // משתמש מנהל (מי מטפל בלקוח הזה)
  assignedUserId: string;
  
  // סטטוס
  status: 'active' | 'inactive' | 'prospect';
  
  // הערות פנימיות
  internalNotes?: string;
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

type SafetyDomain = 
  | 'laser' 
  | 'fire' 
  | 'radiation' 
  | 'chemical' 
  | 'heights' 
  | 'construction' 
  | 'general';

interface EscalationSettings {
  // הגדרות לפי חומרה
  critical: EscalationTiming;
  high: EscalationTiming;
  medium: EscalationTiming;
  low: EscalationTiming;
}

interface EscalationTiming {
  totalTime: number;               // זמן כולל לטיפול (בשעות)
  firstReminder: number;           // תזכורת ראשונה (בשעות)
  escalateToLevel2: number;        // אסקלציה לרמה 2 (בשעות)
  escalateToLevel3: number;        // אסקלציה לרמה 3 (בשעות)
}
```

### 4. Contacts Collection (אנשי קשר בלקוח)
**נתיב:** `/tenants/{tenantId}/clients/{clientId}/contacts/{contactId}`

```typescript
interface Contact {
  id: string;
  clientId: string;
  tenantId: string;
  
  // פרטים אישיים
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;               // מספר וואטסאפ (אם שונה)
  
  // תפקיד בארגון
  role: string;                    // "מנכ"ל" / "ממונה בטיחות" / "מנהל ייצור"
  department?: string;             // מחלקה
  
  // רמה בהיררכיה (לאסקלציה)
  escalationLevel: 1 | 2 | 3;
  // 1 = אחראי ישיר (מקבל ראשון)
  // 2 = מנהל/ממונה (אסקלציה שנייה)
  // 3 = מנכ"ל/בעלים (אסקלציה סופית)
  
  // מה איש הקשר מקבל
  notifications: {
    findings: boolean;             // ליקויים
    reports: boolean;              // דוחות ביקורת
    reminders: boolean;            // תזכורות
    escalations: boolean;          // אסקלציות
    training: boolean;             // עדכוני הדרכות
    documents: boolean;            // מסמכים חדשים
  };
  
  // לאילו תחומים
  departments: SafetyDomain[];     // ['laser', 'fire']
  
  // האם יש גישה לפורטל
  portalAccess: {
    enabled: boolean;
    role: 'admin' | 'manager' | 'viewer';
    authUid?: string;              // Firebase Auth UID (אם רשום)
    lastLoginAt?: Timestamp;
  };
  
  // איש קשר ראשי?
  isPrimary: boolean;
  
  // סטטוס
  status: 'active' | 'inactive';
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

### 5. Audit Log Collection
**נתיב:** `/tenants/{tenantId}/auditLogs/{logId}`

```typescript
interface AuditLog {
  id: string;
  tenantId: string;
  
  // מי עשה את הפעולה
  userId: string;
  userName: string;
  userEmail: string;
  userType: 'tenant_user' | 'client_contact';
  
  // מתי
  timestamp: Timestamp;
  
  // מה
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export';
  
  // על מה
  resource: {
    type: 'client' | 'contact' | 'safetyFile' | 'inspection' | 'finding' | 'training' | 'document' | 'user' | 'settings';
    id: string;
    name: string;                  // שם הפריט לתצוגה
  };
  
  // פרטי השינוי
  details: {
    field?: string;                // איזה שדה השתנה
    previousValue?: any;           // ערך קודם
    newValue?: any;                // ערך חדש
    description?: string;          // תיאור טקסטואלי
  };
  
  // מידע טכני
  metadata: {
    ipAddress: string;
    userAgent: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser?: string;
    os?: string;
  };
  
  // קשר ללקוח (אם רלוונטי)
  clientId?: string;
  clientName?: string;
}
```

---

## 🔐 מערכת הרשאות

### תפקידים ברמת Tenant (בעל המערכת)

| תפקיד | תיאור | הרשאות |
|--------|--------|---------|
| **Owner** | בעל המערכת | הכל + הגדרות מערכת + סליקה |
| **Admin** | מנהל מערכת | הכל חוץ מהגדרות סליקה |
| **Manager** | מנהל לקוחות | ניהול לקוחות משויכים בלבד |
| **Viewer** | צפייה בלבד | צפייה בלקוחות משויכים בלבד |

### תפקידים ברמת Client Portal (לקוח הקצה)

| תפקיד | תיאור | הרשאות |
|--------|--------|---------|
| **Admin** | מנהל בארגון | צפייה + עדכון ליקויים + הגדרות |
| **Manager** | ממונה/מנהל | צפייה + עדכון ליקויים |
| **Viewer** | צופה | צפייה בלבד |

### Default Permissions לפי תפקיד

```typescript
const DEFAULT_PERMISSIONS: Record<string, UserPermissions> = {
  owner: {
    clients: { view: true, create: true, edit: true, delete: true, viewAll: true },
    safetyFiles: { view: true, create: true, edit: true, delete: true, approve: true },
    inspections: { view: true, create: true, edit: true, delete: true },
    findings: { view: true, create: true, edit: true, close: true },
    training: { view: true, create: true, edit: true, delete: true },
    settings: { viewTenantSettings: true, editTenantSettings: true, manageUsers: true, manageBilling: true, manageTemplates: true },
    reports: { view: true, export: true },
  },
  admin: {
    clients: { view: true, create: true, edit: true, delete: true, viewAll: true },
    safetyFiles: { view: true, create: true, edit: true, delete: true, approve: true },
    inspections: { view: true, create: true, edit: true, delete: true },
    findings: { view: true, create: true, edit: true, close: true },
    training: { view: true, create: true, edit: true, delete: true },
    settings: { viewTenantSettings: true, editTenantSettings: true, manageUsers: true, manageBilling: false, manageTemplates: true },
    reports: { view: true, export: true },
  },
  manager: {
    clients: { view: true, create: true, edit: true, delete: false, viewAll: false },
    safetyFiles: { view: true, create: true, edit: true, delete: false, approve: false },
    inspections: { view: true, create: true, edit: true, delete: false },
    findings: { view: true, create: true, edit: true, close: true },
    training: { view: true, create: true, edit: true, delete: false },
    settings: { viewTenantSettings: false, editTenantSettings: false, manageUsers: false, manageBilling: false, manageTemplates: false },
    reports: { view: true, export: true },
  },
  viewer: {
    clients: { view: true, create: false, edit: false, delete: false, viewAll: false },
    safetyFiles: { view: true, create: false, edit: false, delete: false, approve: false },
    inspections: { view: true, create: false, edit: false, delete: false },
    findings: { view: true, create: false, edit: false, close: false },
    training: { view: true, create: false, edit: false, delete: false },
    settings: { viewTenantSettings: false, editTenantSettings: false, manageUsers: false, manageBilling: false, manageTemplates: false },
    reports: { view: true, export: false },
  },
};
```

---

## 🔄 תהליכי עבודה (Workflows)

### 1. הרשמת Tenant חדש

```
┌─────────────────────────────────────────────────────────────────┐
│  1. משתמש נרשם באתר                                            │
│     ├── מזין פרטים אישיים                                      │
│     ├── מזין פרטי עסק                                          │
│     └── בוחר תוכנית מנוי                                       │
│                              ↓                                  │
│  2. נוצר Tenant במערכת                                         │
│     ├── נוצר רשומת Tenant                                      │
│     ├── נוצר User עם role: owner                               │
│     └── נשלח אימייל ברוכים הבאים                               │
│                              ↓                                  │
│  3. Onboarding                                                  │
│     ├── הגדרת מיתוג (לוגו, צבעים)                              │
│     ├── הגדרת פרטי עסק                                         │
│     └── יצירת לקוח ראשון                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 2. הוספת User חדש (עובד)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Owner/Admin מוסיף עובד                                      │
│     ├── מזין פרטים: שם, אימייל, טלפון                          │
│     ├── בוחר תפקיד: admin/manager/viewer                       │
│     └── משייך לקוחות (אם manager)                              │
│                              ↓                                  │
│  2. נוצר User עם status: pending                                │
│                              ↓                                  │
│  3. נשלחת הזמנה באימייל                                        │
│     └── לינק להגדרת סיסמה                                      │
│                              ↓                                  │
│  4. עובד מגדיר סיסמה ונכנס                                     │
│     └── status משתנה ל-active                                  │
│                              ↓                                  │
│  5. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 3. הוספת Client חדש (לקוח)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User מוסיף לקוח                                             │
│     ├── פרטי חברה: שם, ח.פ, כתובת                              │
│     ├── תחומי בטיחות: לייזר, אש, וכו'                          │
│     └── איש קשר ראשי                                           │
│                              ↓                                  │
│  2. נוצר Client                                                 │
│     ├── הגדרות אסקלציה: ברירת מחדל מה-Tenant                   │
│     └── assignedUserId: היוצר                                  │
│                              ↓                                  │
│  3. נוצר Contact ראשון (איש קשר ראשי)                          │
│     └── isPrimary: true                                        │
│                              ↓                                  │
│  4. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 4. הוספת Contact עם גישה לפורטל

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User מוסיף איש קשר                                          │
│     ├── פרטים: שם, אימייל, טלפון, תפקיד                        │
│     ├── רמת אסקלציה: 1/2/3                                     │
│     ├── התראות: ליקויים, דוחות, תזכורות                        │
│     └── גישה לפורטל: כן/לא                                     │
│                              ↓                                  │
│  2. אם portalAccess.enabled = true:                             │
│     ├── נשלחת הזמנה באימייל                                    │
│     └── לינק להרשמה לפורטל                                     │
│                              ↓                                  │
│  3. איש קשר נרשם לפורטל                                        │
│     ├── יוצר סיסמה                                             │
│     └── authUid נשמר                                           │
│                              ↓                                  │
│  4. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ ממשקים (UI Screens)

### Admin Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| Dashboard | `/admin` | סקירה כללית |
| Clients List | `/admin/clients` | רשימת לקוחות |
| Client Detail | `/admin/clients/:id` | פרטי לקוח + אנשי קשר |
| Create Client | `/admin/clients/new` | יצירת לקוח חדש |
| Users List | `/admin/users` | ניהול עובדים |
| User Detail | `/admin/users/:id` | פרטי עובד + הרשאות |
| Settings | `/admin/settings` | הגדרות מערכת |
| Tenant Profile | `/admin/settings/profile` | פרטי עסק + מיתוג |
| Audit Log | `/admin/audit` | יומן פעילות |

### Client Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| Dashboard | `/portal` | סקירה כללית ללקוח |
| Profile | `/portal/profile` | פרטי החברה |
| Contacts | `/portal/contacts` | אנשי קשר בארגון |

---

## 🔥 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isTenantMember(tenantId) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/tenants/$(tenantId)/users/$(request.auth.uid));
    }
    
    function getTenantUser(tenantId) {
      return get(/databases/$(database)/documents/tenants/$(tenantId)/users/$(request.auth.uid)).data;
    }
    
    function isTenantOwner(tenantId) {
      return isTenantMember(tenantId) && getTenantUser(tenantId).role == 'owner';
    }
    
    function isTenantAdmin(tenantId) {
      return isTenantMember(tenantId) && getTenantUser(tenantId).role in ['owner', 'admin'];
    }
    
    function canViewClient(tenantId, clientId) {
      let user = getTenantUser(tenantId);
      return user.permissions.clients.viewAll == true || 
        clientId in user.assignedClientIds;
    }
    
    // Tenants
    match /tenants/{tenantId} {
      allow read: if isTenantMember(tenantId);
      allow write: if isTenantOwner(tenantId);
      
      // Users (עובדי הממונה)
      match /users/{userId} {
        allow read: if isTenantMember(tenantId);
        allow create: if isTenantAdmin(tenantId);
        allow update: if isTenantAdmin(tenantId) || request.auth.uid == userId;
        allow delete: if isTenantOwner(tenantId);
      }
      
      // Clients (לקוחות)
      match /clients/{clientId} {
        allow read: if isTenantMember(tenantId) && canViewClient(tenantId, clientId);
        allow create: if isTenantMember(tenantId) && getTenantUser(tenantId).permissions.clients.create == true;
        allow update: if isTenantMember(tenantId) && canViewClient(tenantId, clientId) && getTenantUser(tenantId).permissions.clients.edit == true;
        allow delete: if isTenantAdmin(tenantId);
        
        // Contacts (אנשי קשר)
        match /contacts/{contactId} {
          allow read: if isTenantMember(tenantId) && canViewClient(tenantId, clientId);
          allow write: if isTenantMember(tenantId) && canViewClient(tenantId, clientId);
        }
      }
      
      // Audit Logs
      match /auditLogs/{logId} {
        allow read: if isTenantAdmin(tenantId);
        allow create: if isTenantMember(tenantId);
        allow update, delete: if false; // לא ניתן לשנות או למחוק לוגים
      }
    }
  }
}
```

---

## 📁 מבנה קבצים

```
frontend/src/
├── types/
│   ├── tenant.ts              # Tenant, User, UserPermissions
│   ├── client.ts              # Client, EscalationSettings
│   ├── contact.ts             # Contact
│   └── auditLog.ts            # AuditLog
│
├── hooks/
│   ├── useTenant.ts           # פעולות על Tenant
│   ├── useUsers.ts            # ניהול Users
│   ├── useClients.ts          # ניהול Clients
│   ├── useContacts.ts         # ניהול Contacts
│   ├── usePermissions.ts      # בדיקת הרשאות
│   └── useAuditLog.ts         # כתיבה ללוג
│
├── contexts/
│   ├── TenantContext.tsx      # Context לנתוני Tenant
│   └── PermissionContext.tsx  # Context להרשאות
│
├── pages/admin/
│   ├── clients/
│   │   ├── ClientsPage.tsx    # רשימת לקוחות
│   │   ├── ClientDetailPage.tsx # פרטי לקוח
│   │   └── CreateClientPage.tsx # יצירת לקוח
│   │
│   ├── users/
│   │   ├── UsersPage.tsx      # רשימת עובדים
│   │   └── UserDetailPage.tsx # פרטי עובד
│   │
│   └── settings/
│       ├── SettingsPage.tsx   # הגדרות ראשי
│       ├── ProfileSettings.tsx # פרטי עסק
│       ├── BrandingSettings.tsx # מיתוג
│       └── AuditLogPage.tsx   # יומן פעילות
│
├── components/
│   ├── clients/
│   │   ├── ClientCard.tsx
│   │   ├── ClientForm.tsx
│   │   └── ContactsTable.tsx
│   │
│   ├── users/
│   │   ├── UserCard.tsx
│   │   ├── UserForm.tsx
│   │   └── PermissionsEditor.tsx
│   │
│   └── common/
│       ├── PermissionGate.tsx # הסתרת רכיבים לפי הרשאה
│       └── AuditLogViewer.tsx
│
└── utils/
    ├── permissions.ts         # פונקציות עזר להרשאות
    └── auditLogger.ts         # פונקציה לכתיבת לוג
```

---

## ✅ Checklist לפיתוח

### Types & Interfaces
- [ ] `types/tenant.ts` - Tenant, User, UserPermissions
- [ ] `types/client.ts` - Client, EscalationSettings, SafetyDomain
- [ ] `types/contact.ts` - Contact
- [ ] `types/auditLog.ts` - AuditLog

### Hooks
- [ ] `useTenant.ts` - getTenant, updateTenant
- [ ] `useUsers.ts` - getUsers, createUser, updateUser, deleteUser
- [ ] `useClients.ts` - getClients, getClient, createClient, updateClient, deleteClient
- [ ] `useContacts.ts` - getContacts, createContact, updateContact, deleteContact
- [ ] `usePermissions.ts` - hasPermission, canViewClient
- [ ] `useAuditLog.ts` - logAction, getAuditLogs

### Pages
- [ ] ClientsPage - רשימת לקוחות עם חיפוש וסינון
- [ ] ClientDetailPage - פרטי לקוח + טאבים (פרטים, אנשי קשר, הגדרות)
- [ ] CreateClientPage - טופס יצירת לקוח
- [ ] UsersPage - רשימת עובדים
- [ ] UserDetailPage - פרטי עובד + עריכת הרשאות
- [ ] SettingsPage - הגדרות מערכת
- [ ] AuditLogPage - יומן פעילות

### Components
- [ ] ClientCard - כרטיס לקוח
- [ ] ClientForm - טופס לקוח
- [ ] ContactsTable - טבלת אנשי קשר
- [ ] ContactForm - טופס איש קשר
- [ ] EscalationSettingsEditor - עריכת הגדרות אסקלציה
- [ ] UserCard - כרטיס עובד
- [ ] UserForm - טופס עובד
- [ ] PermissionsEditor - עורך הרשאות
- [ ] PermissionGate - הסתרת רכיבים לפי הרשאה
- [ ] AuditLogViewer - צפייה ביומן

### Security Rules
- [ ] עדכון firestore.rules

### Testing
- [ ] בדיקת הרשאות
- [ ] בדיקת audit log

---

## 📅 אבני דרך

| שבוע | משימות |
|------|---------|
| **1** | Types, Hooks בסיסיים, Firestore rules |
| **2** | ClientsPage, ClientDetailPage, CreateClientPage |
| **3** | Contacts, EscalationSettings |
| **4** | UsersPage, Permissions |
| **5** | Settings, AuditLog |
| **6** | בדיקות, תיקונים, Polish |

---

## 📝 הערות נוספות

1. **Multi-tenancy:** כל הנתונים מבודדים לפי `tenantId`
2. **Audit Log:** כל פעולה נרשמת - אין אפשרות לערוך או למחוק
3. **Permissions:** בדיקה בצד Client (UI) + בצד Server (Security Rules)
4. **Soft Delete:** לא מוחקים באמת - משנים `status` ל-`inactive`

---

*מסמך זה יעודכן במהלך הפיתוח*

**גרסה:** 1.0  
**תאריך:** 31/12/2025  
**נכתב ע"י:** Claude + Michel Mazor
