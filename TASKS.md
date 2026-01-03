# AEGIS - משימות פיתוח

## 🏗️ ארכיטקטורת המערכת
```
┌─────────────────────────────────────────────────────────────────┐
│                    AEGIS PLATFORM                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LEVEL 1: SUPER ADMIN (Platform Owner)                         │
│  Route: /admin/*                                                │
│  ├── ניהול Tenants (יועצים/חברות בטיחות)                       │
│  ├── חבילות ותמחור                                             │
│  ├── ניטור כללי                                                │
│  └── הגדרות מערכת                                              │
│                                                                 │
│  LEVEL 2: TENANT (Safety Consultant)                           │
│  Route: /dashboard/*                                            │
│  Collection: tenants/{tenantId}                                 │
│  ├── דשבורד ראשי - סקירת כל הלקוחות                            │
│  ├── ניהול לקוחות (clients)                                    │
│  │   └── clients/{clientId}                                     │
│  ├── ניהול ציוד (לפי לקוח)                                     │
│  │   └── clients/{clientId}/equipment/{equipId}                │
│  ├── ביצוע בדיקות                                              │
│  ├── ניהול ממצאים                                              │
│  ├── דוחות ואנליטיקה                                           │
│  ├── CRM - לידים והזדמנויות                                    │
│  ├── LMS - הדרכות                                              │
│  └── פיננסי - חשבוניות                                         │
│                                                                 │
│  LEVEL 3: CLIENT PORTAL (End Customer)                         │
│  Route: /portal/*                                               │
│  Collection: clients/{clientId}                                 │
│  ├── דשבורד - סקירה כללית                                      │
│  ├── מתחמים ומיקומים                                           │
│  ├── ציוד ונכסים                                               │
│  ├── בדיקות - היסטוריה וקרובות                                 │
│  ├── ממצאים - צפייה ועדכון סטטוס                               │
│  ├── מסמכים - תעודות, דוחות                                    │
│  └── עובדים והדרכות (אם במודול)                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ הושלם

### Phase 1-3 (תשתית)
- [x] מערכת Auth
- [x] Admin Layout
- [x] ניהול Tenants (Client360)
- [x] Form Builder
- [x] Templates System

### Phase 4 - ניהול ציוד (Admin Level)
- [x] דף רשימת ציוד (`/admin/equipment`)
- [x] דף ממצאים (`/admin/findings`)
- [x] Hooks: `useEquipment`, `useFindings`
- [x] קומפוננטות: `EquipmentList`, `FindingTracker`
- [x] טופס הוספת ציוד (`/admin/equipment/new`)

### Phase 5 - דוחות (Admin Level)
- [x] דף אנליטיקות (`/admin/analytics`)
- [x] דף היסטוריית בדיקות (`/admin/reports/history`)
- [x] דף ציות (`/admin/reports/compliance`)

### Client Dashboard (קיים אך לא מחובר)
- [x] ClientDashboardLayout.tsx
- [x] ClientEquipment.tsx (מלא עם טופס!)
- [x] ClientOverview.tsx (stub)
- [x] ClientFacilities.tsx (stub)
- [x] ClientInspections.tsx (stub)
- [x] ClientDocuments.tsx (stub)

---

## 🔴 עדיפות גבוהה - חיבור Client Dashboard

### P1 - Routes ל-Client Portal
- [ ] הוסף routes ב-App.tsx ל-`/portal/:clientId/*`
- [ ] חבר את ClientDashboardLayout
- [ ] הגדר הרשאות - client רואה רק את עצמו

### P2 - חיבור Client Equipment למבנה הנכון
- [ ] וודא ש-ClientEquipment קורא מ-`clients/{clientId}/equipment`
- [ ] בדוק שהטופס שומר נכון
- [ ] הוסף Firestore rules ל-sub-collection

### P3 - השלמת Client Dashboard Pages
- [ ] ClientOverview - סטטיסטיקות וציון בריאות
- [ ] ClientFacilities - מתחמים ומיקומים
- [ ] ClientInspections - בדיקות קרובות והיסטוריה
- [ ] ClientDocuments - תעודות ודוחות

---

## 🟡 עדיפות בינונית - Tenant Dashboard

### P4 - דשבורד יועץ בטיחות
- [ ] Route: `/dashboard/*`
- [ ] TenantDashboardLayout.tsx
- [ ] רשימת לקוחות עם סטטיסטיקות
- [ ] תצוגת ציוד cross-clients
- [ ] לוח בדיקות מתוכננות

### P5 - ניהול לקוחות (Clients of Tenant)
- [ ] דף יצירת לקוח חדש
- [ ] דף עריכת לקוח
- [ ] הגדרת מודולים ללקוח

---

## 🟢 עדיפות נמוכה - שיפורים

### P6 - ביצוע בדיקות
- [ ] InspectionExecution component
- [ ] טופס דינמי לפי template
- [ ] חתימה דיגיטלית
- [ ] יצירת PDF

### P7 - LMS הדרכות
- [ ] ניהול קורסים
- [ ] רישום עובדים
- [ ] מעקב השתתפות

### P8 - פיננסי
- [ ] יצירת חשבוניות
- [ ] מעקב תשלומים
- [ ] דוחות כספיים

---

## 📁 מבנה Firestore
```
tenants/{tenantId}
  ├── name, plan, settings, limits
  └── users: sub-collection

clients/{clientId}
  ├── tenantId (reference)
  ├── name, contact, address
  ├── safetyDomains[]
  ├── contractDetails
  └── equipment/{equipmentId}  ← SUB-COLLECTION
      └── historyLog, purchaseInfo, etc.

users/{userId}
  ├── tenantId
  ├── clientId (if client user)
  └── role

equipment/{equipmentId}  ← FLAT (legacy?)
findings/{findingId}
inspections/{inspectionId}
```

---

## 📝 הערות

- `/admin/*` = Super Admin (Platform)
- `/dashboard/*` = Tenant (Safety Consultant)  
- `/portal/*` = Client (End Customer)
- Phase 4/5 components ב-`/admin/equipment` צריכים refactor לתמוך ב-clientId

עודכן: 2026-01-03
