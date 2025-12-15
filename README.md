# 🏛️ Keren Laser System
## מסמך חזון אסטרטגי וארכיטקטורת מערכת
**גרסה:** 2.0  
**תאריך:** דצמבר 2025  
**סיווג:** מסמך פנימי - סודי עסקי

---

## תוכן עניינים

1. [תקציר מנהלים](#1-תקציר-מנהלים)
2. [חזון ומשימה](#2-חזון-ומשימה)
3. [ניתוח שוק והזדמנות עסקית](#3-ניתוח-שוק-והזדמנות-עסקית)
4. [ארכיטקטורת המערכת](#4-ארכיטקטורת-המערכת)
5. [מודל המשתמשים וההרשאות](#5-מודל-המשתמשים-וההרשאות)
6. [ניתוח תהליכים עסקיים](#6-ניתוח-תהליכים-עסקיים)
7. [מודולי המערכת](#7-מודולי-המערכת)
8. [אבטחת מידע וסייבר](#8-אבטחת-מידע-וסייבר)
9. [היבטים משפטיים ורגולטוריים](#9-היבטים-משפטיים-ורגולטוריים)
10. [תוכנית פיתוח (Roadmap)](#10-תוכנית-פיתוח-roadmap)
11. [מדדי הצלחה (KPIs)](#11-מדדי-הצלחה-kpis)
12. [נספחים טכניים](#12-נספחים-טכניים)

---

## 1. תקציר מנהלים

### 1.1 מהות המערכת

**Keren Laser** היא פלטפורמת SaaS (Software as a Service) מודולרית לניהול בטיחות וגיהות תעסוקתית. המערכת מיועדת לשרת חברות ייעוץ בטיחות, ממוני בטיחות עצמאיים, וארגונים המחויבים בפיקוח רגולטורי על מערכות לייזר, קרינה, אש ובטיחות כללית.

### 1.2 הצעת הערך הייחודית (Value Proposition)

| מאפיין | תיאור | יתרון תחרותי |
|--------|--------|---------------|
| **Closed-Loop Safety** | מעקב מסוף לסוף - מביקורת ועד סגירת ליקוי | אין ליקויים "נופלים בין הכיסאות" |
| **Offline-First** | עבודה מלאה בשטח ללא תלות ברשת | פתרון לאתרים מבודדים/מאובטחים |
| **מודולריות** | תשלום רק על מה שצריך | התאמה לכל גודל עסק |
| **Legal-Grade Documentation** | דוחות עם חתימה דיגיטלית | קבילות משפטית מלאה |
| **AI-Powered** | זיהוי אוטומטי וניסוח מקצועי | חיסכון בזמן של 40%+ |

### 1.3 קהל יעד

```
┌─────────────────────────────────────────────────────────────────┐
│  PRIMARY: חברות ייעוץ בטיחות (10-50 ממונים)                     │
│  SECONDARY: ממוני בטיחות עצמאיים                                │
│  TERTIARY: מחלקות בטיחות פנים-ארגוניות בתעשייה                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. חזון ומשימה

### 2.1 הצהרת חזון

> **"להפוך את ניהול הבטיחות מנטל בירוקרטי למנוע צמיחה עסקית - דרך טכנולוגיה חכמה, אוטומציה מלאה, ותובנות מבוססות נתונים."**

### 2.2 עקרונות יסוד

```
╔══════════════════════════════════════════════════════════════════╗
║  1. PROACTIVE, NOT REACTIVE                                      ║
║     המערכת מתריעה לפני שמשהו פג תוקף, לא אחרי                    ║
╠══════════════════════════════════════════════════════════════════╣
║  2. MOBILE-FIRST, OFFLINE-CAPABLE                                ║
║     השטח הוא מקום העבודה העיקרי                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  3. COMPLIANCE BY DESIGN                                         ║
║     הרגולציה מובנית בתהליך, לא כתוספת                            ║
╠══════════════════════════════════════════════════════════════════╣
║  4. ZERO TRUST SECURITY                                          ║
║     כל גישה נבדקת, כל פעולה מתועדת                               ║
╠══════════════════════════════════════════════════════════════════╣
║  5. DATA-DRIVEN DECISIONS                                        ║
║     תובנות מנתונים, לא מתחושות בטן                               ║
╚══════════════════════════════════════════════════════════════════╝
```

### 2.3 יעדים אסטרטגיים (3 שנים)

| שנה | יעד | מדד |
|-----|-----|-----|
| 2025 | השקת MVP מלא + 10 לקוחות משלמים | MRR: ₪15,000 |
| 2026 | 50 ארגונים + מודול אש | MRR: ₪75,000 |
| 2027 | 150 ארגונים + AI מלא + הרחבה למודולים נוספים | MRR: ₪250,000 |

---

## 3. ניתוח שוק והזדמנות עסקית

### 3.1 גודל השוק (TAM/SAM/SOM)

```
┌────────────────────────────────────────────────────────────────┐
│  TAM (Total Addressable Market)                                │
│  שוק תוכנות ניהול בטיחות בישראל: ~₪500M/שנה                   │
├────────────────────────────────────────────────────────────────┤
│  SAM (Serviceable Addressable Market)                          │
│  חברות ייעוץ + ממונים עצמאיים: ~₪80M/שנה                      │
├────────────────────────────────────────────────────────────────┤
│  SOM (Serviceable Obtainable Market)                           │
│  יעד 5 שנים - 5% מהשוק: ~₪4M/שנה                              │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 ניתוח תחרותי

| מתחרה | חוזקות | חולשות | הזדמנות עבורנו |
|--------|--------|--------|-----------------|
| Excel/Google Sheets | חינמי, מוכר | ידני, ללא אוטומציה, לא מאובטח | אוטומציה + אבטחה |
| מערכות ERP כלליות | מקיפות | יקרות, מורכבות, לא מותאמות | פשטות + התמחות |
| פתרונות נקודתיים | זולים | לא מחוברים, חוסר המשכיות | אינטגרציה מלאה |
| תיקיות פיזיות | "עובד" | אובדן מידע, חוסר נגישות | דיגיטציה מלאה |

### 3.3 מגמות שוק תומכות

1. **הקשחה רגולטורית** - דרישות תיעוד הולכות וגדלות
2. **מחסור בממוני בטיחות** - צורך בהתייעלות
3. **עבודה מרחוק/היברידית** - צורך בכלים דיגיטליים
4. **דור ה-Z נכנס לשוק העבודה** - ציפייה לממשקים מודרניים
5. **אחריות אישית של מנהלים** - צורך בתיעוד מוכח

---

## 4. ארכיטקטורת המערכת

### 4.1 תרשים ארכיטקטורה כללי

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           KEREN LASER ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│   │   Web App   │  │ Mobile PWA  │  │ Client      │  │  Admin      │       │
│   │   (React)   │  │  (React)    │  │ Portal      │  │  Dashboard  │       │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│          │                │                │                │              │
│          └────────────────┴────────────────┴────────────────┘              │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                      API GATEWAY / CLOUD FUNCTIONS                  │  │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│   │  │   Auth   │ │Inspection│ │  Report  │ │ Billing  │ │   AI     │  │  │
│   │  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │  │  │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                         DATA LAYER                                  │  │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │  │
│   │  │  Firestore   │  │   Storage    │  │   Realtime   │              │  │
│   │  │  (Primary)   │  │  (Files/PDF) │  │    (Sync)    │              │  │
│   │  └──────────────┘  └──────────────┘  └──────────────┘              │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                      EXTERNAL INTEGRATIONS                          │  │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │  │
│   │  │חשבונית   │ │  Email   │ │   SMS    │ │  OpenAI  │              │  │
│   │  │ירוקה    │ │(SendGrid)│ │(Twilio)  │ │  Claude  │              │  │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Technology Stack

| שכבה | טכנולוגיה | נימוק |
|------|-----------|--------|
| **Frontend** | React 18 + TypeScript | ביצועים, Type Safety, קהילה גדולה |
| **UI Framework** | Tailwind CSS + shadcn/ui | מודרני, מהיר, RTL Support |
| **State Management** | Zustand + React Query | פשטות + Cache מובנה |
| **Backend** | Firebase Cloud Functions | Serverless, Scaling אוטומטי |
| **Database** | Firestore | NoSQL גמיש, Realtime, Offline |
| **Storage** | Firebase Storage | אינטגרציה מלאה, CDN מובנה |
| **Auth** | Firebase Auth + Custom Claims | OAuth, MFA, Role-based |
| **PDF Generation** | pdf-lib + Custom Engine | שליטה מלאה, עברית מלאה |
| **Offline** | Workbox + IndexedDB | PWA מתקדם |
| **AI** | Claude API / OpenAI | ניסוח, ניתוח תמונות |

### 4.3 מבנה Database (Firestore Collections)

```
firestore/
├── organizations/                    # ארגונים (Tenants)
│   └── {orgId}/
│       ├── profile                   # פרטי הארגון
│       ├── subscription              # פרטי מנוי
│       ├── settings                  # הגדרות
│       └── branding                  # לוגו, צבעים
│
├── users/                            # משתמשים
│   └── {userId}/
│       ├── profile                   # פרטים אישיים
│       ├── organizationId            # שיוך לארגון
│       ├── role                      # תפקיד
│       └── signature                 # חתימה דיגיטלית
│
├── clients/                          # לקוחות קצה (נבדקים)
│   └── {clientId}/
│       ├── organizationId            # שיוך לארגון המנהל
│       ├── details                   # פרטי החברה
│       ├── contacts                  # אנשי קשר
│       └── sites                     # אתרים/סניפים
│
├── inspections/                      # ביקורות
│   └── {inspectionId}/
│       ├── organizationId            # שיוך
│       ├── clientId                  # לקוח נבדק
│       ├── inspectorId               # מבצע הביקורת
│       ├── type                      # סוג (laser/fire/general)
│       ├── status                    # סטטוס
│       ├── data                      # נתוני הביקורת
│       ├── findings                  # ליקויים
│       └── timestamps                # תאריכים
│
├── findings/                         # ליקויים (CAPA)
│   └── {findingId}/
│       ├── inspectionId              # קישור לביקורת
│       ├── status                    # open/pending/approved/closed
│       ├── severity                  # חומרה
│       ├── evidence                  # תמונות הוכחה
│       └── timeline                  # היסטוריית טיפול
│
├── documents/                        # מסמכים שהופקו
│   └── {docId}/
│       ├── type                      # report/certificate/letter
│       ├── storageRef                # קישור לקובץ
│       ├── hash                      # SHA-256 לאימות
│       └── digitalSignature          # חתימה דיגיטלית
│
├── trainings/                        # הדרכות
│   └── {trainingId}/
│       ├── type                      # סוג הדרכה
│       ├── participants              # משתתפים
│       ├── validUntil                # תוקף
│       └── certificate               # תעודה
│
├── equipment/                        # ציוד (מכשירי לייזר)
│   └── {equipmentId}/
│       ├── clientId                  # שיוך ללקוח
│       ├── type                      # סוג מכשיר
│       ├── class                     # סיווג לייזר
│       ├── lastInspection            # בדיקה אחרונה
│       └── nextInspection            # בדיקה הבאה
│
└── audit_log/                        # יומן ביקורת
    └── {logId}/
        ├── userId                    # מי ביצע
        ├── action                    # מה בוצע
        ├── resource                  # על מה
        ├── timestamp                 # מתי
        ├── ipAddress                 # מאיפה
        └── changes                   # מה השתנה
```

### 4.4 Offline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    OFFLINE-FIRST STRATEGY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐         ┌─────────────────┐               │
│  │   USER ACTION   │         │   SYNC ENGINE   │               │
│  │                 │         │                 │               │
│  │  1. Fill Form   │────────▶│  Queue Action   │               │
│  │  2. Take Photo  │         │  (IndexedDB)    │               │
│  │  3. Save Draft  │         │                 │               │
│  └─────────────────┘         └────────┬────────┘               │
│                                       │                         │
│                                       ▼                         │
│                              ┌─────────────────┐               │
│                              │ NETWORK STATUS  │               │
│                              │    MONITOR      │               │
│                              └────────┬────────┘               │
│                                       │                         │
│                    ┌──────────────────┴──────────────────┐     │
│                    │                                      │     │
│                    ▼                                      ▼     │
│           ┌─────────────────┐                  ┌─────────────┐ │
│           │    OFFLINE      │                  │   ONLINE    │ │
│           │                 │                  │             │ │
│           │ • Store locally │                  │ • Sync to   │ │
│           │ • Show pending  │                  │   Firebase  │ │
│           │ • Continue work │                  │ • Resolve   │ │
│           │                 │                  │   conflicts │ │
│           └─────────────────┘                  └─────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  CONFLICT RESOLUTION STRATEGY:                                  │
│  • Last-Write-Wins for simple fields                           │
│  • Merge for arrays (findings, photos)                         │
│  • Manual resolution flag for critical conflicts               │
│  • Server timestamp always authoritative                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. מודל המשתמשים וההרשאות

### 5.1 היררכיית משתמשים

```
                    ┌─────────────────────┐
                    │   SUPER ADMIN       │
                    │   (Platform Owner)  │
                    │                     │
                    │   • Full access     │
                    │   • All tenants     │
                    │   • System config   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │  ORGANIZATION A │ │  ORGANIZATION B │ │  ORGANIZATION C │
    │  (Tenant)       │ │  (Tenant)       │ │  (Tenant)       │
    └────────┬────────┘ └─────────────────┘ └─────────────────┘
             │
             │
    ┌────────┴────────┐
    │   ORG ADMIN     │
    │                 │
    │ • Manage users  │
    │ • View all data │
    │ • Billing       │
    │ • Settings      │
    └────────┬────────┘
             │
    ┌────────┴─────────────────┐
    │                          │
    ▼                          ▼
┌─────────────────┐    ┌─────────────────┐
│   INSPECTOR     │    │   INSPECTOR     │
│   (Field User)  │    │   (Field User)  │
│                 │    │                 │
│ • Own clients   │    │ • Own clients   │
│ • Inspections   │    │ • Inspections   │
│ • Reports       │    │ • Reports       │
└────────┬────────┘    └─────────────────┘
         │
         │ (Access granted per client)
         │
    ┌────┴────────────────────────────┐
    │                                 │
    ▼                                 ▼
┌─────────────────┐          ┌─────────────────┐
│  END CLIENT A   │          │  END CLIENT B   │
│  (Portal User)  │          │  (Portal User)  │
│                 │          │                 │
│ • View findings │          │ • View findings │
│ • Upload proof  │          │ • Upload proof  │
│ • Download docs │          │ • Download docs │
└─────────────────┘          └─────────────────┘
```

### 5.2 מטריצת הרשאות (RBAC Matrix)

| פעולה | Super Admin | Org Admin | Inspector | End Client |
|-------|:-----------:|:---------:|:---------:|:----------:|
| **ניהול מערכת** |
| הגדרות פלטפורמה | ✅ | ❌ | ❌ | ❌ |
| צפייה בכל הארגונים | ✅ | ❌ | ❌ | ❌ |
| ניהול חבילות/מחירים | ✅ | ❌ | ❌ | ❌ |
| **ניהול ארגון** |
| הגדרות ארגון | ✅ | ✅ | ❌ | ❌ |
| ניהול משתמשים | ✅ | ✅ | ❌ | ❌ |
| ניהול מנוי/תשלומים | ✅ | ✅ | ❌ | ❌ |
| צפייה בכל הלקוחות | ✅ | ✅ | 🔶* | ❌ |
| **עבודה שוטפת** |
| יצירת ביקורת | ✅ | ✅ | ✅ | ❌ |
| עריכת ביקורת | ✅ | ✅ | 🔶* | ❌ |
| הפקת דוח | ✅ | ✅ | ✅ | ❌ |
| צפייה בליקויים | ✅ | ✅ | 🔶* | 🔶* |
| סגירת ליקוי | ✅ | ✅ | ✅ | ❌ |
| **פורטל לקוח** |
| צפייה בדוחות | ✅ | ✅ | 🔶* | ✅ |
| העלאת הוכחות תיקון | ❌ | ❌ | ❌ | ✅ |
| הורדת אישורים | ✅ | ✅ | 🔶* | ✅ |

**🔶* = רק למשאבים שהוקצו למשתמש**

### 5.3 Custom Claims Structure (Firebase Auth)

```typescript
interface UserClaims {
  role: 'super_admin' | 'org_admin' | 'inspector' | 'client';
  organizationId: string;
  permissions: string[];
  modules: ('laser' | 'fire' | 'safety' | 'training')[];
  assignedClients?: string[];  // For inspectors
  clientId?: string;           // For end clients
}

// Example:
{
  role: 'inspector',
  organizationId: 'org_abc123',
  permissions: ['inspections.create', 'inspections.edit.own', 'reports.generate'],
  modules: ['laser', 'fire'],
  assignedClients: ['client_xyz', 'client_456']
}
```

---

## 6. ניתוח תהליכים עסקיים

### 6.1 תהליך ראשי: מחזור חיי ביקורת (Inspection Lifecycle)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INSPECTION LIFECYCLE PROCESS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ SCHEDULE │───▶│ PREPARE  │───▶│ EXECUTE  │───▶│ DOCUMENT │             │
│  │          │    │          │    │          │    │          │             │
│  │ • תזמון  │    │ • בדיקת  │    │ • ביקורת │    │ • מילוי  │             │
│  │   ביקורת │    │   ציוד   │    │   בשטח   │    │   טופס   │             │
│  │ • הקצאת │    │ • הורדת  │    │ • צילום  │    │ • תיעוד  │             │
│  │   ממונה  │    │   נתונים │    │ • ראיונות│    │   ליקויים│             │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘             │
│                                                        │                   │
│                                                        ▼                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │  CLOSE   │◀───│ FOLLOWUP │◀───│ DELIVER  │◀───│ GENERATE │             │
│  │          │    │          │    │          │    │          │             │
│  │ • אישור │    │ • מעקב   │    │ • שליחת  │    │ • הפקת   │             │
│  │   תיקונים│    │   ליקויים│    │   דוח    │    │   PDF    │             │
│  │ • סגירת │    │ • קבלת   │    │ • התראות │    │ • חתימה  │             │
│  │   מעגל   │    │   הוכחות │    │   ללקוח  │    │   דיגיטלית│             │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 פירוט שלבי התהליך

#### שלב 1: SCHEDULE - תזמון

```
TRIGGER: הגיע מועד ביקורת תקופתית / בקשת לקוח חדש

INPUT:
├── לקוח קצה (קיים/חדש)
├── סוג ביקורת (לייזר/אש/כללי)
├── תאריך מבוקש
└── ממונה מבצע

PROCESS:
├── [1] בדיקת זמינות ממונה
├── [2] בדיקת תוקף מנוי הארגון
├── [3] יצירת רשומת ביקורת (status: scheduled)
├── [4] שליחת הזמנה ללקוח
└── [5] הוספה ליומן הממונה

OUTPUT:
├── רשומת ביקורת מתוזמנת
├── התראות בלוח מחוונים
└── אימייל/SMS ללקוח

EXCEPTIONS:
├── מנוי לא בתוקף → חסימה + התראה
├── ממונה לא זמין → הצעת תאריכים חלופיים
└── לקוח לא אושר → המתנה לאישור Org Admin
```

#### שלב 2: PREPARE - הכנה

```
TRIGGER: 24 שעות לפני מועד הביקורת

INPUT:
├── פרטי הביקורת המתוזמנת
├── היסטוריית לקוח (ביקורות קודמות)
└── רשימת ציוד ידועה

PROCESS:
├── [1] סנכרון נתונים למכשיר הממונה (Offline)
│   ├── פרטי לקוח
│   ├── רשימת ציוד
│   ├── ליקויים פתוחים
│   └── תבנית הביקורת
├── [2] בדיקת שלמות נתונים
└── [3] יצירת Checklist להכנה

OUTPUT:
├── נתונים מסונכרנים במכשיר
├── התראת "מוכן לביקורת"
└── תזכורת ללקוח

OFFLINE CAPABILITY:
├── כל הנתונים הנדרשים זמינים מקומית
├── יכולת עבודה מלאה ללא רשת
└── Queue לסנכרון עתידי
```

#### שלב 3: EXECUTE - ביצוע בשטח

```
TRIGGER: הממונה מתחיל את הביקורת באפליקציה

INPUT:
├── תבנית ביקורת לפי סוג
├── נתוני לקוח וציוד
└── ליקויים פתוחים לבדיקה

PROCESS:
├── [1] מעבר על סעיפי הביקורת
│   ├── סימון תקין/לא תקין/לא רלוונטי
│   ├── צילום ראיות
│   └── הוספת הערות
├── [2] בדיקת ציוד ספציפי
│   ├── סריקת ברקוד/QR (אם קיים)
│   ├── תיעוד מדידות
│   └── סימון סטטוס
├── [3] תיעוד ליקויים חדשים
│   ├── תיאור הליקוי
│   ├── חומרה (קריטי/גבוה/בינוני/נמוך)
│   ├── תמונות
│   └── המלצה לתיקון
├── [4] בדיקת ליקויים קודמים
│   ├── אושר תיקון → סגירה
│   └── לא תוקן → עדכון סטטוס
└── [5] חתימות
    ├── חתימת הממונה
    └── חתימת נציג הלקוח (על טאבלט)

OUTPUT:
├── טופס ביקורת מלא
├── תמונות מתויגות
├── רשימת ליקויים מעודכנת
└── חתימות דיגיטליות

VALIDATION:
├── בדיקת שדות חובה
├── אזהרה על סעיפים שדולגו
└── בדיקת איכות תמונות (AI)
```

#### שלב 4: GENERATE - הפקת דוח

```
TRIGGER: הממונה לוחץ "סיים ביקורת והפק דוח"

INPUT:
├── נתוני הביקורת המלאים
├── תבנית דוח (לפי סוג ומודול)
├── ברנדינג הארגון (לוגו, צבעים)
└── פרטי הממונה והחתימה

PROCESS:
├── [1] ולידציה סופית
│   ├── בדיקת שלמות
│   └── התראות על חוסרים
├── [2] עיבוד נתונים
│   ├── חישוב ציון כללי
│   ├── סיווג ליקויים לפי חומרה
│   └── יצירת סיכום
├── [3] הפקת PDF
│   ├── עמוד שער
│   ├── פרטי הביקורת
│   ├── ממצאים וליקויים
│   ├── תמונות (נספח)
│   ├── המלצות
│   └── חתימות
├── [4] חתימה דיגיטלית
│   ├── חישוב Hash (SHA-256)
│   ├── הצפנת החתימה
│   └── הטמעה ב-PDF
└── [5] שמירה ואינדוקס
    ├── העלאה ל-Storage
    ├── עדכון רשומת הביקורת
    └── יצירת רשומה ב-documents

OUTPUT:
├── קובץ PDF חתום
├── מטא-דאטה לאימות
└── לינק להורדה

DIGITAL SIGNATURE STRUCTURE:
{
  "documentHash": "sha256:abc123...",
  "signedBy": "user_id",
  "signedAt": "2025-01-15T10:30:00Z",
  "certificate": "base64_encoded_cert",
  "organizationId": "org_xyz"
}
```

#### שלב 5: DELIVER - מסירה

```
TRIGGER: דוח הופק בהצלחה

INPUT:
├── קובץ PDF
├── פרטי קשר של הלקוח
└── העדפות התראות

PROCESS:
├── [1] שליחה אוטומטית
│   ├── אימייל עם PDF מצורף
│   ├── SMS עם לינק (אופציונלי)
│   └── התראה בפורטל לקוח
├── [2] עדכון סטטוסים
│   ├── ביקורת → "הושלמה"
│   ├── ליקויים → "ממתין לטיפול"
│   └── תזמון ביקורת הבאה
└── [3] יצירת משימות המשך
    ├── משימת מעקב לממונה
    └── תזכורת ללקוח

OUTPUT:
├── דוח נמסר ללקוח
├── פורטל לקוח מעודכן
└── משימות מעקב נוצרו

NOTIFICATION TEMPLATES:
├── "ביקורת הושלמה - נמצאו X ליקויים"
├── "דוח מוכן להורדה"
└── "נדרש טיפול ב-X ליקויים עד [תאריך]"
```

#### שלב 6: FOLLOWUP - מעקב

```
TRIGGER: קיימים ליקויים פתוחים

INPUT:
├── רשימת ליקויים פתוחים
├── תאריכי יעד לתיקון
└── הוכחות שהועלו

PROCESS:
├── [1] התראות אוטומטיות
│   ├── תזכורת שבועית ללקוח
│   ├── התראה על תאריך יעד מתקרב
│   └── אסקלציה אם עבר תאריך יעד
├── [2] קבלת הוכחות (Client Portal)
│   ├── לקוח מעלה תמונה/מסמך
│   ├── שינוי סטטוס → "ממתין לאישור"
│   └── התראה לממונה
├── [3] בדיקת ממונה
│   ├── צפייה בהוכחה
│   ├── אישור → סגירת ליקוי
│   └── דחייה → בקשה להוכחה נוספת
└── [4] תיעוד מלא
    ├── היסטוריית כל הפעולות
    └── Audit Trail מלא

OUTPUT:
├── ליקויים בסטטוס מעודכן
├── Audit Trail מלא
└── דוח מצב ליקויים

ESCALATION RULES:
├── 7 ימים לפני יעד → תזכורת
├── יום היעד → התראה דחופה
├── 3 ימים אחרי → אסקלציה ל-Org Admin
└── 14 ימים אחרי → סימון "באיחור קריטי"
```

#### שלב 7: CLOSE - סגירת מעגל

```
TRIGGER: כל הליקויים נסגרו / התקבלה החלטה לסגור

INPUT:
├── סטטוס כל הליקויים
├── הוכחות תיקון
└── אישורי ממונה

PROCESS:
├── [1] בדיקת תנאי סגירה
│   ├── כל הליקויים הקריטיים נסגרו?
│   ├── יש אישור ממונה?
│   └── תיעוד מלא?
├── [2] הפקת אישור בטיחות
│   ├── תעודה/אישור רשמי
│   ├── תוקף (עד הביקורת הבאה)
│   └── חתימה דיגיטלית
├── [3] עדכון מערכת
│   ├── ביקורת → "נסגרה"
│   ├── תזמון ביקורת הבאה
│   └── עדכון דשבורד
└── [4] ארכיון
    ├── העברה לארכיון (לאחר X שנים)
    └── שמירה לפי דרישות רגולציה

OUTPUT:
├── אישור/תעודת בטיחות
├── ביקורת נסגרה
├── ביקורת הבאה מתוזמנת
└── רשומה בארכיון

COMPLIANCE CHECK:
├── האם כל הליקויים הקריטיים טופלו?
├── האם יש תיעוד מלא?
├── האם עברו בדיקות חובה?
└── האם ניתן להנפיק אישור?
```

### 6.3 תהליכי משנה נוספים

#### תהליך A: הוספת לקוח חדש

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ CREATE  │───▶│ ASSIGN  │───▶│ SETUP   │───▶│ ACTIVE  │
│ Client  │    │Inspector│    │ Portal  │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘

פרטים:
1. הזנת פרטי לקוח (שם, כתובת, איש קשר)
2. הוספת אתרים/סניפים
3. הוספת ציוד (מכשירי לייזר)
4. הקצאת ממונה/ים אחראיים
5. הגדרת תדירות ביקורות
6. יצירת גישה לפורטל לקוח (אופציונלי)
7. תזמון ביקורת ראשונה
```

#### תהליך B: חידוש מנוי

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ ALERT   │───▶│ INVOICE │───▶│ PAYMENT │───▶│ RENEW   │
│ 30 days │    │ Create  │    │ Process │    │ Access  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘

אוטומציות:
• 30 יום לפני - התראה ראשונה
• 14 יום לפני - תזכורת
• 7 ימים לפני - אזהרה
• יום התפוגה - חסימת יצירת ביקורות חדשות
• 7 ימים אחרי - חסימת גישה מלאה (צפייה בלבד)
• 30 יום אחרי - ארכיון + הודעה על מחיקה עתידית
```

#### תהליך C: הפקת דוח תקופתי

```
TRIGGER: יום ראשון בחודש / סוף רבעון

OUTPUT:
├── סיכום ביקורות שבוצעו
├── סטטוס ליקויים פתוחים
├── תוקף הדרכות קרב
├── לקוחות עם ביקורת באיחור
└── מדדי ביצוע (KPIs)
```

---

## 7. מודולי המערכת

### 7.1 מודול בסיס (Core)

**כלול בכל החבילות:**

| רכיב | תיאור | סטטוס |
|------|--------|--------|
| Authentication | הרשמה, התחברות, MFA | ✅ בנוי |
| User Management | ניהול משתמשים והרשאות | ✅ בנוי |
| Client Management | ניהול לקוחות קצה | ✅ בנוי |
| Dashboard | לוח מחוונים ראשי | 🔶 חלקי |
| Notifications | התראות Email/Push | 📋 מתוכנן |
| Audit Log | יומן פעולות | 📋 מתוכנן |
| Backup & Export | גיבוי וייצוא נתונים | 📋 מתוכנן |

### 7.2 מודול לייזר (Laser Safety)

**מיועד ל:** ממוני בטיחות קרינה, מפעלים עם ציוד לייזר, מרפאות

| רכיב | תיאור | סטטוס |
|------|--------|--------|
| Equipment Registry | מאגר מכשירי לייזר | ✅ בנוי |
| Laser Classification | סיווג לפי Class (1-4) | ✅ בנוי |
| Inspection Forms | טפסי ביקורת דינמיים | ✅ בנוי |
| Safety Calculations | חישובי MPE, NOHD | 📋 מתוכנן |
| Training Tracker | מעקב הדרכות קרינה | 🔶 חלקי |
| Report Generator | הפקת דוחות לייזר | ✅ בנוי |
| Regulatory Compliance | עמידה בתקנות משרד הבריאות | 🔶 חלקי |

**תבנית ביקורת לייזר - סעיפים עיקריים:**

```
1. פרטים כלליים
   ├── שם העסק
   ├── כתובת
   ├── איש קשר
   └── תאריך ביקורת

2. פרטי מכשיר הלייזר
   ├── יצרן ודגם
   ├── מספר סריאלי
   ├── סיווג (Class)
   ├── אורך גל
   ├── הספק
   └── מצב תקינות

3. בדיקות בטיחות
   ├── שילוט אזהרה
   ├── מיגון עיניים
   ├── נהלי הפעלה
   ├── אמצעי בקרה
   ├── תחזוקה
   └── הדרכות

4. ליקויים והמלצות
   ├── ליקוי + חומרה
   ├── תמונה
   └── המלצה לתיקון

5. סיכום והמלצות
   └── חתימות
```

### 7.3 מודול אש (Fire Safety)

**מיועד ל:** ממוני בטיחות אש, חברות כיבוי אש, מפעלים

| רכיב | תיאור | סטטוס |
|------|--------|--------|
| Fire Equipment Registry | מאגר ציוד כיבוי | 📋 מתוכנן |
| Inspection Checklists | רשימות בדיקה | 📋 מתוכנן |
| Evacuation Plans | תוכניות פינוי | 📋 מתוכנן |
| Fire Drill Tracker | מעקב תרגילים | 📋 מתוכנן |
| Hydrant Mapping | מיפוי הידרנטים | 📋 מתוכנן |
| Report Generator | הפקת דוחות אש | 📋 מתוכנן |

### 7.4 מודול הדרכות (Training Management)

**מיועד ל:** כל הארגונים

| רכיב | תיאור | סטטוס |
|------|--------|--------|
| Training Catalog | קטלוג סוגי הדרכות | 🔶 חלקי |
| Participant Management | ניהול משתתפים | 🔶 חלקי |
| Attendance Tracking | נוכחות וחתימות | 🔶 חלקי |
| Certificate Generator | הפקת תעודות | 🔶 חלקי |
| Expiry Alerts | התראות תוקף | 📋 מתוכנן |
| Compliance Reports | דוחות עמידה | 📋 מתוכנן |

### 7.5 מודול AI (Intelligence)

**מיועד ל:** חבילות Premium

| רכיב | תיאור | סטטוס |
|------|--------|--------|
| Image Analysis | זיהוי אוטומטי מתמונות | 📋 מתוכנן |
| Text Enhancement | שיפור ניסוח מקצועי | 📋 מתוכנן |
| Risk Scoring | ניקוד סיכון אוטומטי | 📋 מתוכנן |
| Predictive Alerts | התראות מנבאות | 📋 מתוכנן |
| Auto-Categorization | סיווג ליקויים | 📋 מתוכנן |
| Report Summarization | סיכום אוטומטי | 📋 מתוכנן |

### 7.6 מודול סליקה ומנויים (Billing)

| רכיב | תיאור | סטטוס |
|------|--------|--------|
| Subscription Management | ניהול מנויים | 📋 מתוכנן |
| Payment Processing | סליקה (חשבונית ירוקה) | 📋 מתוכנן |
| Invoice Generation | הפקת חשבוניות | 📋 מתוכנן |
| Usage Tracking | מעקב שימוש | 📋 מתוכנן |
| Module Provisioning | הפעלת מודולים | 📋 מתוכנן |

---

## 8. אבטחת מידע וסייבר

### 8.1 מודל איומים (Threat Model)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         THREAT MODEL - KEREN LASER                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  EXTERNAL THREATS                           INTERNAL THREATS                │
│  ─────────────────                          ─────────────────               │
│  • Unauthorized access                      • Data theft by employee        │
│  • DDoS attacks                             • Accidental data exposure      │
│  • Data interception                        • Privilege abuse               │
│  • SQL/NoSQL injection                      • Unauthorized sharing          │
│  • XSS attacks                              • Weak passwords                │
│  • CSRF attacks                                                             │
│  • Malicious file upload                    BUSINESS THREATS                │
│  • API abuse                                ─────────────────               │
│  • Brute force                              • Competitor access             │
│  • Session hijacking                        • Document forgery              │
│                                             • Compliance violation          │
│                                             • Data loss                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 ארכיטקטורת אבטחה

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE LAYERS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LAYER 1: PERIMETER                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Firebase App Check (device attestation)                          │   │
│  │  • Rate limiting on Cloud Functions                                 │   │
│  │  • DDoS protection (Firebase/Google infrastructure)                 │   │
│  │  • HTTPS only (TLS 1.3)                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  LAYER 2: AUTHENTICATION                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Firebase Auth with email/password                                │   │
│  │  • Multi-Factor Authentication (MFA) - mandatory for Admins         │   │
│  │  • Session management (1 hour tokens, refresh rotation)             │   │
│  │  • Account lockout after failed attempts                            │   │
│  │  • Magic links for End Clients (passwordless)                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  LAYER 3: AUTHORIZATION                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Role-Based Access Control (RBAC)                                 │   │
│  │  • Custom Claims in JWT tokens                                      │   │
│  │  • Firestore Security Rules (server-side enforcement)               │   │
│  │  • Organization isolation (multi-tenancy)                           │   │
│  │  • Resource-level permissions                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  LAYER 4: DATA PROTECTION                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Encryption at rest (Google-managed keys)                         │   │
│  │  • Encryption in transit (TLS)                                      │   │
│  │  • Field-level encryption for sensitive data                        │   │
│  │  • Secure file storage with signed URLs                             │   │
│  │  • Data anonymization for analytics                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  LAYER 5: MONITORING & RESPONSE                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Comprehensive audit logging                                      │   │
│  │  • Real-time anomaly detection                                      │   │
│  │  • Security alerts (suspicious activity)                            │   │
│  │  • Incident response procedures                                     │   │
│  │  • Regular security reviews                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Firestore Security Rules (Reference Implementation)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && 
             request.auth.token.role == 'super_admin';
    }
    
    function isOrgAdmin(orgId) {
      return isAuthenticated() && 
             request.auth.token.role == 'org_admin' &&
             request.auth.token.organizationId == orgId;
    }
    
    function isInspector(orgId) {
      return isAuthenticated() && 
             request.auth.token.role == 'inspector' &&
             request.auth.token.organizationId == orgId;
    }
    
    function belongsToOrg(orgId) {
      return isAuthenticated() && 
             request.auth.token.organizationId == orgId;
    }
    
    function hasModule(module) {
      return module in request.auth.token.modules;
    }
    
    function isAssignedToClient(clientId) {
      return clientId in request.auth.token.assignedClients;
    }
    
    // ============================================
    // ORGANIZATIONS
    // ============================================
    
    match /organizations/{orgId} {
      allow read: if isSuperAdmin() || belongsToOrg(orgId);
      allow create: if isSuperAdmin();
      allow update: if isSuperAdmin() || isOrgAdmin(orgId);
      allow delete: if isSuperAdmin();
      
      // Nested settings
      match /settings/{settingId} {
        allow read, write: if isSuperAdmin() || isOrgAdmin(orgId);
      }
    }
    
    // ============================================
    // USERS
    // ============================================
    
    match /users/{userId} {
      allow read: if isSuperAdmin() || 
                    request.auth.uid == userId ||
                    (isOrgAdmin(resource.data.organizationId));
      allow create: if isSuperAdmin() || 
                      isOrgAdmin(request.resource.data.organizationId);
      allow update: if isSuperAdmin() || 
                      request.auth.uid == userId ||
                      isOrgAdmin(resource.data.organizationId);
      allow delete: if isSuperAdmin() || 
                      isOrgAdmin(resource.data.organizationId);
    }
    
    // ============================================
    // CLIENTS (End Clients)
    // ============================================
    
    match /clients/{clientId} {
      allow read: if isSuperAdmin() ||
                    isOrgAdmin(resource.data.organizationId) ||
                    (isInspector(resource.data.organizationId) && 
                     isAssignedToClient(clientId)) ||
                    request.auth.token.clientId == clientId;
      allow create: if isSuperAdmin() || 
                      isOrgAdmin(request.resource.data.organizationId);
      allow update: if isSuperAdmin() || 
                      isOrgAdmin(resource.data.organizationId);
      allow delete: if isSuperAdmin() || 
                      isOrgAdmin(resource.data.organizationId);
    }
    
    // ============================================
    // INSPECTIONS
    // ============================================
    
    match /inspections/{inspectionId} {
      allow read: if isSuperAdmin() ||
                    isOrgAdmin(resource.data.organizationId) ||
                    (isInspector(resource.data.organizationId) && 
                     isAssignedToClient(resource.data.clientId)) ||
                    request.auth.token.clientId == resource.data.clientId;
      
      allow create: if isSuperAdmin() ||
                      isOrgAdmin(request.resource.data.organizationId) ||
                      (isInspector(request.resource.data.organizationId) && 
                       isAssignedToClient(request.resource.data.clientId) &&
                       hasModule(request.resource.data.type));
      
      allow update: if isSuperAdmin() ||
                      isOrgAdmin(resource.data.organizationId) ||
                      (isInspector(resource.data.organizationId) && 
                       resource.data.inspectorId == request.auth.uid &&
                       resource.data.status in ['draft', 'in_progress']);
      
      allow delete: if isSuperAdmin() ||
                      (isOrgAdmin(resource.data.organizationId) && 
                       resource.data.status == 'draft');
    }
    
    // ============================================
    // FINDINGS (CAPA)
    // ============================================
    
    match /findings/{findingId} {
      allow read: if isSuperAdmin() ||
                    isOrgAdmin(resource.data.organizationId) ||
                    (isInspector(resource.data.organizationId) && 
                     isAssignedToClient(resource.data.clientId)) ||
                    request.auth.token.clientId == resource.data.clientId;
      
      allow create: if isSuperAdmin() ||
                      isOrgAdmin(request.resource.data.organizationId) ||
                      isInspector(request.resource.data.organizationId);
      
      // End clients can only update with evidence
      allow update: if isSuperAdmin() ||
                      isOrgAdmin(resource.data.organizationId) ||
                      isInspector(resource.data.organizationId) ||
                      (request.auth.token.clientId == resource.data.clientId &&
                       request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['evidence', 'clientComment', 'status']) &&
                       request.resource.data.status == 'pending_approval');
      
      allow delete: if isSuperAdmin();
    }
    
    // ============================================
    // DOCUMENTS
    // ============================================
    
    match /documents/{docId} {
      allow read: if isSuperAdmin() ||
                    isOrgAdmin(resource.data.organizationId) ||
                    (isInspector(resource.data.organizationId) && 
                     isAssignedToClient(resource.data.clientId)) ||
                    request.auth.token.clientId == resource.data.clientId;
      
      allow create: if isSuperAdmin() ||
                      isOrgAdmin(request.resource.data.organizationId) ||
                      isInspector(request.resource.data.organizationId);
      
      // Documents are immutable after creation
      allow update, delete: if false;
    }
    
    // ============================================
    // AUDIT LOG (Write-only, no delete)
    // ============================================
    
    match /audit_log/{logId} {
      allow read: if isSuperAdmin() || 
                    isOrgAdmin(resource.data.organizationId);
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
    
    // ============================================
    // EQUIPMENT
    // ============================================
    
    match /equipment/{equipmentId} {
      allow read: if isSuperAdmin() ||
                    isOrgAdmin(resource.data.organizationId) ||
                    (isInspector(resource.data.organizationId) && 
                     isAssignedToClient(resource.data.clientId));
      
      allow write: if isSuperAdmin() ||
                     isOrgAdmin(request.resource.data.organizationId) ||
                     (isInspector(request.resource.data.organizationId) && 
                      isAssignedToClient(request.resource.data.clientId));
    }
    
    // ============================================
    // TRAININGS
    // ============================================
    
    match /trainings/{trainingId} {
      allow read: if isSuperAdmin() ||
                    isOrgAdmin(resource.data.organizationId) ||
                    (isInspector(resource.data.organizationId) && 
                     isAssignedToClient(resource.data.clientId));
      
      allow write: if isSuperAdmin() ||
                     isOrgAdmin(request.resource.data.organizationId) ||
                     isInspector(request.resource.data.organizationId);
    }
  }
}
```

### 8.4 Audit Log Structure

```typescript
interface AuditLogEntry {
  id: string;
  timestamp: Timestamp;
  userId: string;
  userEmail: string;
  organizationId: string;
  
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  
  ipAddress: string;
  userAgent: string;
  
  previousState?: object;  // For updates
  newState?: object;       // For creates/updates
  
  metadata?: {
    reason?: string;
    source?: 'web' | 'mobile' | 'api';
    [key: string]: any;
  };
}

type AuditAction = 
  | 'create' | 'read' | 'update' | 'delete'
  | 'login' | 'logout' | 'login_failed'
  | 'export' | 'share' | 'download'
  | 'approve' | 'reject'
  | 'permission_change';

type ResourceType = 
  | 'user' | 'organization' | 'client'
  | 'inspection' | 'finding' | 'document'
  | 'equipment' | 'training';
```

### 8.5 Digital Signature Implementation

```typescript
interface DigitalSignature {
  // Document identification
  documentId: string;
  documentType: 'inspection_report' | 'certificate' | 'training_cert';
  
  // Hash of the document content
  contentHash: {
    algorithm: 'SHA-256';
    value: string;  // hex-encoded
  };
  
  // Signature details
  signature: {
    algorithm: 'RSA-SHA256';
    value: string;  // base64-encoded
    certificate: string;  // base64-encoded X.509 cert
  };
  
  // Signer information
  signer: {
    userId: string;
    name: string;
    role: string;
    organizationId: string;
    organizationName: string;
  };
  
  // Timestamp
  timestamp: {
    time: string;  // ISO 8601
    source: 'server' | 'tsa';  // Time Stamping Authority
    tsaResponse?: string;  // Optional TSA token
  };
  
  // Chain of custody (for multi-signature)
  previousSignature?: string;
}

// Verification endpoint
async function verifyDocument(documentId: string): Promise<{
  isValid: boolean;
  document: DocumentMetadata;
  signatures: SignatureVerification[];
  errors?: string[];
}>;
```

### 8.6 מדיניות סיסמאות וגישה

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PASSWORD & ACCESS POLICY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PASSWORD REQUIREMENTS:                                                     │
│  • Minimum 12 characters                                                    │
│  • At least 1 uppercase, 1 lowercase, 1 number, 1 special character        │
│  • Not in common password lists                                            │
│  • Cannot reuse last 5 passwords                                           │
│  • Expiry: 90 days for admins, 180 days for others                        │
│                                                                             │
│  MFA REQUIREMENTS:                                                          │
│  • Super Admin: Mandatory (TOTP + backup codes)                            │
│  • Org Admin: Mandatory (TOTP or SMS)                                      │
│  • Inspector: Recommended (optional)                                        │
│  • End Client: Not required (magic links preferred)                        │
│                                                                             │
│  SESSION MANAGEMENT:                                                        │
│  • Access token lifetime: 1 hour                                           │
│  • Refresh token lifetime: 7 days                                          │
│  • Idle timeout: 30 minutes                                                │
│  • Max concurrent sessions: 3                                              │
│  • Session invalidation on password change                                 │
│                                                                             │
│  ACCOUNT LOCKOUT:                                                           │
│  • 5 failed attempts → 15 minute lockout                                   │
│  • 10 failed attempts → 1 hour lockout + admin alert                       │
│  • 20 failed attempts → account disabled + manual unlock                   │
│                                                                             │
│  ACCESS REVIEW:                                                             │
│  • Quarterly review of admin access                                        │
│  • Immediate revocation on employee departure                              │
│  • Annual permission audit                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. היבטים משפטיים ורגולטוריים

### 9.1 מפת רגולציה רלוונטית

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      REGULATORY COMPLIANCE MAP                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🏛️ הגנת פרטיות ומידע                                                      │
│  ├── חוק הגנת הפרטיות, התשמ"א-1981                                         │
│  ├── תקנות הגנת הפרטיות (אבטחת מידע), התשע"ז-2017                          │
│  └── GDPR (אם יש לקוחות באירופה)                                           │
│                                                                             │
│  ⚛️ בטיחות קרינה                                                           │
│  ├── חוק הקרינה הבלתי מייננת, התשס"ו-2006                                  │
│  ├── תקנות הקרינה הבלתי מייננת (לייזרים), התשע"א-2011                      │
│  ├── תקנות הקרינה הבלתי מייננת (מכשירים רפואיים)                           │
│  └── הנחיות משרד הבריאות                                                   │
│                                                                             │
│  🔥 בטיחות אש                                                               │
│  ├── חוק הרשות הארצית לכבאות והצלה, התשע"ב-2012                           │
│  ├── תקנות התכנון והבניה (בקשה להיתר)                                       │
│  └── ת"י 1220 - מערכות גילוי וכיבוי אש                                     │
│                                                                             │
│  🏭 בטיחות בעבודה                                                           │
│  ├── פקודת הבטיחות בעבודה [נוסח חדש], התש"ל-1970                          │
│  ├── תקנות הבטיחות בעבודה (ממונה על הבטיחות)                               │
│  └── תקנות ארגון הפיקוח על העבודה                                          │
│                                                                             │
│  📋 תקנים רלוונטיים                                                         │
│  ├── ISO 27001 - אבטחת מידע                                                │
│  ├── ISO 9001 - ניהול איכות                                                │
│  └── IEC 60825 - בטיחות מוצרי לייזר                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 דרישות הגנת פרטיות

#### מיפוי מידע אישי במערכת

| קטגוריה | סוג מידע | רמת רגישות | תקופת שמירה |
|---------|----------|-------------|--------------|
| זיהוי | שם, ת.ז., תאריך לידה | גבוהה | כל תקופת ההתקשרות + 7 שנים |
| קשר | טלפון, אימייל, כתובת | בינונית | כל תקופת ההתקשרות + 7 שנים |
| תעסוקתי | תפקיד, מקום עבודה, הדרכות | בינונית | 7 שנים מסיום ההתקשרות |
| רפואי | חשיפה לקרינה, בדיקות | גבוהה מאוד | 30 שנה (דרישת רגולציה) |
| עסקי | דוחות, ליקויים, ממצאים | גבוהה | 10 שנים |

#### דרישות מהמערכת

```
□ מדיניות פרטיות ברורה ונגישה
□ הסכמה מפורשת לעיבוד מידע
□ יכולת מחיקה (Right to be Forgotten) - עם סייגים רגולטוריים
□ יכולת ייצוא מידע (Data Portability)
□ רישום פעילויות עיבוד
□ הודעה על אירוע אבטחה (72 שעות)
□ מינוי ממונה הגנת פרטיות (DPO) - אם נדרש
□ הסכם עיבוד מידע (DPA) עם כל לקוח
```

### 9.3 תנאי שימוש - נקודות מפתח

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TERMS OF SERVICE - KEY POINTS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. הגדרות והתקשרות                                                         │
│     • הגדרת "שירות", "לקוח", "משתמש קצה"                                   │
│     • תקופת ההתקשרות וחידושים                                              │
│     • תנאי סיום והשלכותיו                                                   │
│                                                                             │
│  2. רישיון שימוש                                                            │
│     • רישיון לא בלעדי, לא עביר                                             │
│     • שימוש מותר ואסור                                                      │
│     • הגבלות על הנדסה לאחור                                                │
│                                                                             │
│  3. אחריות ושיפוי                                                           │
│     ⚠️ סעיף קריטי:                                                          │
│     "הדוחות המופקים במערכת הם כלי עזר בלבד.                                │
│      האחריות המקצועית נותרת על הממונה/הארגון.                              │
│      החברה אינה אחראית לנזקים עקיפים או תוצאתיים."                         │
│                                                                             │
│  4. זמינות ו-SLA                                                            │
│     • יעד זמינות: 99.5% (לא כולל תחזוקה מתוכננת)                          │
│     • פיצוי על חריגה: זיכוי יחסי                                           │
│     • אין התחייבות לזמינות Offline                                         │
│                                                                             │
│  5. אבטחת מידע                                                              │
│     • התחייבות לאבטחה סבירה                                                │
│     • הליך הודעה על פריצה                                                   │
│     • חובות הלקוח (סיסמאות, גישה)                                          │
│                                                                             │
│  6. קניין רוחני                                                             │
│     • הנתונים שייכים ללקוח                                                 │
│     • המערכת והקוד שייכים לחברה                                            │
│     • רישיון שימוש באנונימי לשיפור המערכת                                  │
│                                                                             │
│  7. סודיות                                                                  │
│     • התחייבות הדדית לסודיות                                               │
│     • יוצאי דופן (צו בית משפט, רגולציה)                                    │
│                                                                             │
│  8. סיום והשלכותיו                                                          │
│     • 30 יום להורדת נתונים                                                 │
│     • מחיקה מאובטחת לאחר 90 יום                                            │
│     • שמירת נתונים לפי דרישות רגולציה                                      │
│                                                                             │
│  9. שונות                                                                   │
│     • דין ישראלי, סמכות שיפוט: תל אביב                                     │
│     • שינויים בתנאים: 30 יום הודעה מראש                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.4 הסכם עיבוד מידע (DPA Template)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│            DATA PROCESSING AGREEMENT (DPA) - STRUCTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  נספח א' - פרטי העיבוד                                                      │
│  ─────────────────────────                                                  │
│  • מטרת העיבוד: ניהול בטיחות ותיעוד ביקורות                               │
│  • סוגי מידע: פרטי עובדים, נתוני הדרכות, ממצאי ביקורות                    │
│  • קטגוריות נושאי מידע: עובדי הלקוח, אנשי קשר                             │
│  • משך העיבוד: תקופת ההתקשרות + תקופת שמירה                               │
│                                                                             │
│  נספח ב' - אמצעי אבטחה                                                      │
│  ────────────────────────                                                   │
│  • הצפנה: AES-256 at rest, TLS 1.3 in transit                              │
│  • בקרת גישה: RBAC, MFA                                                    │
│  • גיבויים: יומי, 30 יום שמירה                                            │
│  • מיקום שרתים: Google Cloud - אירופה/ישראל                               │
│                                                                             │
│  נספח ג' - קבלני משנה                                                       │
│  ───────────────────────                                                    │
│  • Google Cloud Platform - תשתית                                           │
│  • SendGrid - משלוח אימיילים                                               │
│  • חשבונית ירוקה - סליקה                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.5 אחריות משפטית על דוחות

```
⚠️ חשוב להבין:

דוח בטיחות שמופק במערכת הוא מסמך בעל משמעות משפטית.
אם מתרחשת תאונה ומתברר שהדוח היה שגוי/חלקי/מזויף - 
יכולה להיות אחריות על:

1. הממונה שערך את הביקורת
2. חברת הייעוץ שהעסיקה אותו
3. הארגון הנבדק שלא תיקן ליקויים
4. (במקרים קיצוניים) מפתח המערכת - אם הוכח פגם בתוכנה

הגנות נדרשות במערכת:
─────────────────────
✓ Audit Trail מלא - מי עשה מה ומתי
✓ חתימה דיגיטלית - הוכחה שהדוח לא שונה
✓ גרסאות - שמירת כל השינויים
✓ Timestamp מאומת - הוכחת זמן
✓ Disclaimer ברור - במסמכים ובתנאי השימוש
```

---

## 10. תוכנית פיתוח (Roadmap)

### 10.1 סקירת שלבים

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT ROADMAP                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  2024 Q4        2025 Q1        2025 Q2        2025 Q3        2025 Q4       │
│     │              │              │              │              │           │
│     ▼              ▼              ▼              ▼              ▼           │
│  ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐         │
│  │PHASE │      │PHASE │      │PHASE │      │PHASE │      │PHASE │         │
│  │  1   │─────▶│  2   │─────▶│  3   │─────▶│  4   │─────▶│  5   │         │
│  │      │      │      │      │      │      │      │      │      │         │
│  │ MVP  │      │Multi-│      │Billing│      │Fire  │      │ AI   │         │
│  │      │      │Tenant│      │      │      │Module│      │      │         │
│  └──────┘      └──────┘      └──────┘      └──────┘      └──────┘         │
│                                                                             │
│  CURRENT: Phase 1 - סיום                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Phase 1: MVP Core (Q4 2024) ✅ → סיום

**מטרה:** מערכת עובדת לביקורות לייזר בסיסיות

| משימה | סטטוס | הערות |
|--------|--------|--------|
| Authentication (Firebase Auth) | ✅ | עובד |
| User Profile & Signature | ✅ | דורש שיפורים |
| Client Management | ✅ | בסיסי |
| Equipment Registry | ✅ | עובד |
| Inspection Form (Laser) | ✅ | עובד |
| Photo Upload | ✅ | עובד |
| Findings Management | ✅ | בסיסי |
| PDF Report Generation | 🔶 | דורש שיפורים משמעותיים |
| Basic Dashboard | 🔶 | חלקי |

**Deliverable:** מערכת שמאפשרת לממונה בודד לבצע ביקורת לייזר ולהפיק דוח

### 10.3 Phase 2: Multi-Tenancy & Security (Q1 2025)

**מטרה:** תמיכה מלאה בריבוי ארגונים עם אבטחה מלאה

| משימה | תיאור | עדיפות | זמן משוער |
|--------|--------|---------|-----------|
| OrganizationID Migration | הוספת שדה לכל ה-Collections | קריטי | 1 שבוע |
| Security Rules v2 | כתיבת Rules מלאים | קריטי | 1 שבוע |
| Audit Log | מעקב כל הפעולות | קריטי | 1 שבוע |
| Admin Dashboard | ממשק ניהול ארגון | גבוה | 2 שבועות |
| User Roles & Permissions | RBAC מלא | גבוה | 1 שבוע |
| Client Assignment | הקצאת לקוחות לממונים | גבוה | 3 ימים |
| Organization Settings | הגדרות והתאמה אישית | בינוני | 1 שבוע |
| Digital Signature | חתימה קריפטוגרפית על PDF | גבוה | 1 שבוע |

**Deliverable:** מערכת שיכולה לשרת מספר ארגונים במקביל בבידוד מלא

### 10.4 Phase 3: Billing & Client Portal (Q2 2025)

**מטרה:** אוטומציה של תהליך המכירה וממשק ללקוח קצה

| משימה | תיאור | עדיפות | זמן משוער |
|--------|--------|---------|-----------|
| Subscription Plans | הגדרת חבילות ומחירים | גבוה | 3 ימים |
| חשבונית ירוקה API | אינטגרציה לסליקה | גבוה | 2 שבועות |
| Webhook Handler | עיבוד תשלומים | גבוה | 1 שבוע |
| Module Provisioning | הפעלת מודולים אוטומטית | גבוה | 1 שבוע |
| Client Portal | ממשק צפייה ללקוח קצה | גבוה | 2 שבועות |
| Evidence Upload | העלאת הוכחות תיקון | גבוה | 1 שבוע |
| Notification System | התראות Email/SMS | בינוני | 1 שבוע |
| Invoice History | היסטוריית חשבוניות | בינוני | 3 ימים |

**Deliverable:** לקוחות יכולים לרכוש מנוי ולשלם באופן עצמאי

### 10.5 Phase 4: Fire Module & Offline (Q3 2025)

**מטרה:** הרחבה למודול אש ועבודה Offline מלאה

| משימה | תיאור | עדיפות | זמן משוער |
|--------|--------|---------|-----------|
| Fire Equipment Types | הגדרת סוגי ציוד כיבוי | גבוה | 3 ימים |
| Fire Inspection Template | תבנית ביקורת אש | גבוה | 1 שבוע |
| Fire Report Template | תבנית דוח אש | גבוה | 1 שבוע |
| Offline Engine | IndexedDB + Service Worker | קריטי | 3 שבועות |
| Sync Engine | סנכרון וטיפול בקונפליקטים | קריטי | 2 שבועות |
| PWA Enhancement | התקנה כאפליקציה | בינוני | 1 שבוע |
| Offline Indicator | UI לסטטוס רשת | בינוני | 2 ימים |

**Deliverable:** עבודה מלאה בשטח ללא רשת + מודול אש

### 10.6 Phase 5: AI & Analytics (Q4 2025)

**מטרה:** הוספת יכולות חכמות ותובנות

| משימה | תיאור | עדיפות | זמן משוער |
|--------|--------|---------|-----------|
| AI Text Enhancement | שיפור ניסוח אוטומטי | גבוה | 2 שבועות |
| Image Analysis | זיהוי מתמונות | בינוני | 3 שבועות |
| Risk Scoring | ציון סיכון אוטומטי | בינוני | 2 שבועות |
| Analytics Dashboard | BI ותובנות | גבוה | 2 שבועות |
| Predictive Alerts | התראות מנבאות | בינוני | 2 שבועות |
| Auto-Categorization | סיווג ליקויים | נמוך | 1 שבוע |
| Report Templates | תבניות דוח מתקדמות | בינוני | 1 שבוע |

**Deliverable:** מערכת חכמה עם יכולות AI

### 10.7 תלויות ביניים

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DEPENDENCY GRAPH                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  OrganizationID ──┬──► Security Rules ──► Multi-Tenant Ready               │
│                   │                                                         │
│                   └──► Audit Log                                           │
│                                                                             │
│  חשבונית ירוקה API ──► Webhook Handler ──► Module Provisioning             │
│                                                                             │
│  IndexedDB ──► Sync Engine ──► Offline Ready                               │
│                                                                             │
│  Security Rules ──► Client Portal ──► Evidence Upload                      │
│                                                                             │
│  PDF Engine ──► Digital Signature ──► Legal-Grade Documents                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. מדדי הצלחה (KPIs)

### 11.1 מדדים עסקיים

| מדד | יעד שנה 1 | יעד שנה 2 | יעד שנה 3 |
|-----|-----------|-----------|-----------|
| **MRR** (Monthly Recurring Revenue) | ₪15,000 | ₪75,000 | ₪250,000 |
| **ארגונים פעילים** | 10 | 50 | 150 |
| **משתמשים פעילים** | 30 | 200 | 700 |
| **Churn Rate** (חודשי) | <10% | <5% | <3% |
| **Customer Acquisition Cost** | ₪2,000 | ₪1,500 | ₪1,000 |
| **Lifetime Value** | ₪12,000 | ₪24,000 | ₪36,000 |

### 11.2 מדדים טכניים

| מדד | יעד | מדידה |
|-----|-----|-------|
| **Uptime** | 99.5% | Firebase Monitoring |
| **API Response Time** | <500ms (p95) | Cloud Functions logs |
| **PDF Generation Time** | <10 seconds | Custom metric |
| **Offline Sync Success** | >98% | Custom metric |
| **Error Rate** | <0.1% | Error tracking |
| **Security Incidents** | 0 critical | Audit log |

### 11.3 מדדי חוויית משתמש

| מדד | יעד | מדידה |
|-----|-----|-------|
| **Time to First Inspection** | <30 min | User tracking |
| **Inspections per Month/User** | >8 | Analytics |
| **Report Generation Success** | >99% | Error tracking |
| **Support Tickets/User/Month** | <0.5 | Support system |
| **NPS Score** | >50 | Survey |

### 11.4 דשבורד מנהלים

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     EXECUTIVE DASHBOARD (Mock)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │   MRR           │ │  Active Orgs    │ │  Inspections    │               │
│  │   ₪15,000       │ │      12         │ │     156/mo      │               │
│  │   ↑ 23%         │ │   ↑ 3 new       │ │   ↑ 12%         │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Revenue Trend                                                      │   │
│  │  ₪20k │                                                    ╭────    │   │
│  │       │                                              ╭─────╯        │   │
│  │  ₪15k │                                        ╭─────╯              │   │
│  │       │                                  ╭─────╯                    │   │
│  │  ₪10k │                            ╭─────╯                          │   │
│  │       │                      ╭─────╯                                │   │
│  │   ₪5k │                ╭─────╯                                      │   │
│  │       │          ╭─────╯                                            │   │
│  │    ₪0 │────╭─────╯                                                  │   │
│  │       └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴──── │   │
│  │        Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐           │
│  │  Open Findings              │ │  Subscription Status        │           │
│  │  ┌────────────────────────┐ │ │  ┌────────────────────────┐ │           │
│  │  │ Critical    ██ 3      │ │ │  │ Active      ████████ 10│ │           │
│  │  │ High        ████ 12   │ │ │  │ Trial       ██ 2       │ │           │
│  │  │ Medium      ██████ 28 │ │ │  │ Expired     █ 1        │ │           │
│  │  │ Low         ███ 8     │ │ │  │ Cancelled   - 0        │ │           │
│  │  └────────────────────────┘ │ │  └────────────────────────┘ │           │
│  └─────────────────────────────┘ └─────────────────────────────┘           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. נספחים טכניים

### נספח א': מבנה פרויקט מומלץ

```
keren-laser/
├── src/
│   ├── components/          # React Components
│   │   ├── common/          # Shared components
│   │   ├── auth/            # Authentication
│   │   ├── dashboard/       # Dashboard views
│   │   ├── inspections/     # Inspection forms
│   │   ├── clients/         # Client management
│   │   ├── reports/         # Report generation
│   │   └── admin/           # Admin panel
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useFirestore.ts
│   │   ├── useOffline.ts
│   │   └── usePermissions.ts
│   │
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── inspection.service.ts
│   │   ├── report.service.ts
│   │   ├── billing.service.ts
│   │   └── ai.service.ts
│   │
│   ├── lib/                 # Utilities
│   │   ├── firebase.ts
│   │   ├── pdf-generator.ts
│   │   ├── encryption.ts
│   │   └── validators.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── user.types.ts
│   │   ├── inspection.types.ts
│   │   └── api.types.ts
│   │
│   ├── store/               # State management
│   │   ├── auth.store.ts
│   │   ├── app.store.ts
│   │   └── offline.store.ts
│   │
│   └── styles/              # Global styles
│
├── functions/               # Firebase Cloud Functions
│   ├── src/
│   │   ├── auth/            # Auth triggers
│   │   ├── inspections/     # Inspection APIs
│   │   ├── reports/         # Report generation
│   │   ├── billing/         # Billing webhooks
│   │   └── scheduled/       # Cron jobs
│   │
│   └── firestore.rules      # Security rules
│
├── public/                  # Static assets
│
└── docs/                    # Documentation
    ├── VISION.md
    ├── API.md
    └── SECURITY.md
```

### נספח ב': Environment Variables

```bash
# Firebase
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx

# External Services
VITE_INVOICE_API_KEY=xxx           # חשבונית ירוקה
VITE_SENDGRID_API_KEY=xxx          # Email
VITE_TWILIO_SID=xxx                # SMS
VITE_OPENAI_API_KEY=xxx            # AI

# App Config
VITE_APP_ENV=production
VITE_APP_VERSION=2.0.0
VITE_SUPPORT_EMAIL=support@kerenlaser.com
```

### נספח ג': API Endpoints (Cloud Functions)

```
Authentication:
POST   /auth/register              # הרשמת משתמש חדש
POST   /auth/verify-org            # אימות ארגון

Organizations:
GET    /orgs/:orgId                # פרטי ארגון
PUT    /orgs/:orgId                # עדכון ארגון
GET    /orgs/:orgId/users          # משתמשי ארגון
POST   /orgs/:orgId/users          # הוספת משתמש

Clients:
GET    /clients                    # רשימת לקוחות
POST   /clients                    # יצירת לקוח
GET    /clients/:clientId          # פרטי לקוח
PUT    /clients/:clientId          # עדכון לקוח

Inspections:
GET    /inspections                # רשימת ביקורות
POST   /inspections                # יצירת ביקורת
GET    /inspections/:id            # פרטי ביקורת
PUT    /inspections/:id            # עדכון ביקורת
POST   /inspections/:id/generate   # הפקת דוח

Findings:
GET    /findings                   # רשימת ליקויים
POST   /findings                   # יצירת ליקוי
PUT    /findings/:id               # עדכון ליקוי
POST   /findings/:id/evidence      # העלאת הוכחה

Reports:
GET    /reports/:id                # הורדת דוח
POST   /reports/:id/verify         # אימות חתימה

Billing (Webhooks):
POST   /billing/webhook            # חשבונית ירוקה webhook
GET    /billing/plans              # רשימת חבילות
POST   /billing/subscribe          # הרשמה לחבילה
```

---

## סיכום

מסמך זה מגדיר את החזון, הארכיטקטורה והתהליכים של מערכת Keren Laser.
הוא מהווה מסמך עבודה שיש לעדכן ככל שהפרויקט מתקדם.

**עקרונות מנחים:**
1. **אבטחה קודמת** - אין קיצורי דרך באבטחת מידע
2. **איכות לפני כמות** - עדיף מודול אחד מושלם מ-10 חצי-מוכנים
3. **משוב לקוחות** - הקשבה מתמדת למשתמשים
4. **תיעוד** - כל החלטה מתועדת

---

**נכתב על ידי:** מערכת ניתוח AI  
**תאריך:** דצמבר 2025  
**גרסה:** 2.0


---


# 📦 Keren Laser - מודל חבילות, אחסון ושדרוגים
## Subscription & Storage Management System
**גרסה:** 1.0  
**תאריך:** דצמבר 2025

---

## תוכן עניינים

1. [סקירת מודל החבילות](#1-סקירת-מודל-החבילות)
2. [הגדרת החבילות](#2-הגדרת-החבילות)
3. [ניהול אחסון](#3-ניהול-אחסון)
4. [מערכת Quotas ומגבלות](#4-מערכת-quotas-ומגבלות)
5. [תהליכי שדרוג ושינוי חבילה](#5-תהליכי-שדרוג-ושינוי-חבילה)
6. [אינטגרציה לענן חיצוני](#6-אינטגרציה-לענן-חיצוני)
7. [מנגנון חיוב אוטומטי](#7-מנגנון-חיוב-אוטומטי)
8. [ממשק ניהול מנויים](#8-ממשק-ניהול-מנויים)
9. [התראות ואוטומציות](#9-התראות-ואוטומציות)
10. [מבנה נתונים טכני](#10-מבנה-נתונים-טכני)
11. [תרחישי שימוש](#11-תרחישי-שימוש)

---

## 1. סקירת מודל החבילות

### 1.1 פילוסופיית התמחור

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PRICING PHILOSOPHY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  עקרונות מנחים:                                                             │
│  ─────────────────                                                          │
│  1. שלם רק על מה שאתה צריך (Pay for what you use)                          │
│  2. שדרוג קל וללא חיכוך (Frictionless upgrades)                            │
│  3. שקיפות מלאה (No hidden costs)                                          │
│  4. גמישות מקסימלית (Mix & Match)                                          │
│                                                                             │
│  מבנה התמחור:                                                               │
│  ─────────────────                                                          │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                       │
│  │  BASE FEE   │ + │  MODULES    │ + │  ADD-ONS    │ = MONTHLY PRICE       │
│  │  (חובה)     │   │  (לבחירה)   │   │  (אופציה)   │                       │
│  └─────────────┘   └─────────────┘   └─────────────┘                       │
│                                                                             │
│  דוגמה:                                                                     │
│  ₪149 (בסיס) + ₪99 (לייזר) + ₪49 (5GB נוסף) = ₪297/חודש                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 רכיבי המנוי

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION COMPONENTS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. חבילת בסיס (BASE PLAN)                                          │   │
│  │     • גישה למערכת                                                   │   │
│  │     • ניהול לקוחות בסיסי                                            │   │
│  │     • אחסון בסיסי (כלול)                                            │   │
│  │     • משתמש אחד                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                           │                                                 │
│                           ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  2. מודולים (MODULES) - לפחות אחד חובה                              │   │
│  │     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │     │  לייזר   │ │   אש    │ │  בטיחות  │ │ הדרכות  │            │   │
│  │     │  ₪99/mo  │ │  ₪99/mo │ │  ₪79/mo  │ │  ₪69/mo │            │   │
│  │     └──────────┘ └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                           │                                                 │
│                           ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  3. תוספות (ADD-ONS) - אופציונלי                                    │   │
│  │     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │     │ משתמשים │ │  אחסון  │ │    AI    │ │  API     │            │   │
│  │     │ נוספים  │ │  נוסף   │ │  מתקדם  │ │ Access   │            │   │
│  │     │ ₪39/user│ │ ₪49/5GB │ │ ₪149/mo │ │ ₪199/mo │            │   │
│  │     └──────────┘ └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                           │                                                 │
│                           ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  4. אחסון חיצוני (EXTERNAL STORAGE) - חלופה לאחסון מובנה           │   │
│  │     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │   │
│  │     │ Google Drive │ │   Dropbox    │ │   OneDrive   │             │   │
│  │     │   חיבור API  │ │   חיבור API  │ │   חיבור API  │             │   │
│  │     │    חינם*    │ │    חינם*    │ │    חינם*    │             │   │
│  │     └──────────────┘ └──────────────┘ └──────────────┘             │   │
│  │     * הלקוח משלם לספק הענן ישירות                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. הגדרת החבילות

### 2.1 טבלת חבילות מפורטת

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              SUBSCRIPTION PLANS                                         │
├──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬─────────────┤
│              │    STARTER   │    BASIC     │ PROFESSIONAL │  ENTERPRISE  │   CUSTOM    │
│              │    התחלה     │    בסיסי     │    מקצועי    │    ארגוני    │   מותאם    │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ מחיר חודשי   │    ₪149      │    ₪299      │    ₪599      │    ₪1,199    │  לפי הצעה  │
│ מחיר שנתי    │   ₪1,490     │   ₪2,990     │   ₪5,990     │   ₪11,990    │  לפי הצעה  │
│ (חיסכון)     │   (17%)      │   (17%)      │   (17%)      │   (17%)      │             │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ משתמשים      │      1       │      3       │      10      │      50      │  ללא הגבלה │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ לקוחות קצה   │      5       │      25      │     100      │     500      │  ללא הגבלה │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ מודולים      │      1       │      1       │      2       │      כל      │    כל      │
│              │              │              │              │   המודולים   │  המודולים  │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ אחסון מובנה  │    2 GB      │    10 GB     │    50 GB     │    200 GB    │  לפי צורך  │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ ביקורות/חודש │      10      │      50      │     200      │   ללא הגבלה  │  ללא הגבלה │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ דוחות PDF    │      10      │      50      │   ללא הגבלה  │   ללא הגבלה  │  ללא הגבלה │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ אחסון חיצוני │      ✅      │      ✅      │      ✅      │      ✅      │     ✅     │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ Offline Mode │      ❌      │      ✅      │      ✅      │      ✅      │     ✅     │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ Client Portal│      ❌      │      ✅      │      ✅      │      ✅      │     ✅     │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ AI Features  │      ❌      │      ❌      │    בסיסי     │     מלא      │    מלא     │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ API Access   │      ❌      │      ❌      │      ❌      │      ✅      │     ✅     │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ White Label  │      ❌      │      ❌      │      ❌      │      ✅      │     ✅     │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ SLA          │    99%       │    99.5%     │    99.5%     │    99.9%     │   99.9%    │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ תמיכה        │    אימייל    │ אימייל+צ'אט │ אימייל+צ'אט  │   24/7+טלפון │  Dedicated │
│              │   (48 שעות)  │  (24 שעות)   │  (8 שעות)    │   (2 שעות)   │   Manager  │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
```

### 2.2 תמחור מודולים

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MODULE PRICING                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  מודול לייזר (Laser Safety)                           ₪99/חודש             │
│  ├── ניהול מכשירי לייזר                                                    │
│  ├── ביקורות בטיחות קרינה                                                  │
│  ├── דוחות לפי תקנות משרד הבריאות                                         │
│  ├── מעקב הדרכות קרינה                                                     │
│  └── חישובי MPE/NOHD                                                       │
│                                                                             │
│  מודול אש (Fire Safety)                               ₪99/חודש             │
│  ├── ניהול ציוד כיבוי אש                                                   │
│  ├── ביקורות אש תקופתיות                                                   │
│  ├── תוכניות פינוי                                                         │
│  ├── מעקב תרגילי פינוי                                                     │
│  └── דוחות לפי תקנות כב"א                                                  │
│                                                                             │
│  מודול בטיחות כללית (General Safety)                  ₪79/חודש             │
│  ├── סקרי בטיחות                                                           │
│  ├── ניהול סיכונים                                                         │
│  ├── מעקב ליקויים                                                          │
│  ├── דוחות בטיחות                                                          │
│  └── תבניות מותאמות                                                        │
│                                                                             │
│  מודול הדרכות (Training Management)                   ₪69/חודש             │
│  ├── קטלוג הדרכות                                                          │
│  ├── ניהול משתתפים                                                         │
│  ├── מעקב נוכחות                                                           │
│  ├── הפקת תעודות                                                           │
│  └── תזכורות תוקף                                                          │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  חבילת כל המודולים (All-In-One)                      ₪249/חודש             │
│  (חיסכון של ₪97 לעומת רכישה נפרדת)                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 תמחור תוספות (Add-Ons)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ADD-ONS PRICING                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  👥 משתמשים נוספים                                                         │
│  ├── ₪39/משתמש/חודש (Inspector)                                           │
│  └── ₪69/משתמש/חודש (Admin)                                               │
│                                                                             │
│  💾 אחסון נוסף (מעבר לכלול בחבילה)                                         │
│  ├── ₪29/חודש - 5 GB נוספים                                               │
│  ├── ₪49/חודש - 15 GB נוספים                                              │
│  ├── ₪99/חודש - 50 GB נוספים                                              │
│  └── ₪199/חודש - 150 GB נוספים                                            │
│                                                                             │
│  🤖 AI מתקדם                                                               │
│  ├── ₪79/חודש - בסיסי (100 בקשות/חודש)                                    │
│  │   • שיפור ניסוח טקסטים                                                  │
│  │   • סיכום אוטומטי                                                       │
│  ├── ₪149/חודש - מתקדם (500 בקשות/חודש)                                   │
│  │   • כל הבסיסי +                                                         │
│  │   • זיהוי תמונות                                                        │
│  │   • ניתוח סיכונים                                                       │
│  └── ₪299/חודש - ללא הגבלה                                                │
│      • כל המתקדם +                                                         │
│      • דוחות אוטומטיים                                                     │
│      • תובנות וחיזוי                                                       │
│                                                                             │
│  🔌 API Access                                                              │
│  ├── ₪199/חודש - Basic (1,000 calls/day)                                  │
│  ├── ₪499/חודש - Pro (10,000 calls/day)                                   │
│  └── ₪999/חודש - Enterprise (Unlimited)                                   │
│                                                                             │
│  🏷️ White Label                                                            │
│  └── ₪299/חודש - לוגו וצבעים מותאמים, דומיין משנה                         │
│                                                                             │
│  📊 Analytics Pro                                                           │
│  └── ₪99/חודש - דשבורדים מתקדמים, ייצוא נתונים                            │
│                                                                             │
│  🔐 Security+                                                               │
│  └── ₪149/חודש - SSO, Audit מורחב, IP Whitelist                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ניהול אחסון

### 3.1 מודל האחסון

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STORAGE MODEL                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                    ┌─────────────────────────────┐                          │
│                    │      STORAGE MANAGER        │                          │
│                    │      (Central Logic)        │                          │
│                    └──────────────┬──────────────┘                          │
│                                   │                                         │
│              ┌────────────────────┼────────────────────┐                   │
│              │                    │                    │                   │
│              ▼                    ▼                    ▼                   │
│    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│    │  INTERNAL       │  │   EXTERNAL      │  │    HYBRID       │          │
│    │  (Firebase)     │  │   (Cloud)       │  │   (Combined)    │          │
│    │                 │  │                 │  │                 │          │
│    │ • Managed by us │  │ • Google Drive  │  │ • Metadata: FB  │          │
│    │ • Full control  │  │ • Dropbox       │  │ • Files: Cloud  │          │
│    │ • SLA included  │  │ • OneDrive      │  │ • Best of both  │          │
│    │ • Auto backup   │  │ • S3            │  │                 │          │
│    └─────────────────┘  └─────────────────┘  └─────────────────┘          │
│                                                                             │
│    ═══════════════════════════════════════════════════════════════════     │
│                                                                             │
│    STORAGE ALLOCATION PER TYPE:                                             │
│    ┌────────────────────────────────────────────────────────────────┐      │
│    │  📄 Documents (PDF reports)      │  ~500KB per report         │      │
│    │  📷 Images (inspection photos)   │  ~2MB per photo (compressed)│      │
│    │  ✍️ Signatures                    │  ~50KB per signature       │      │
│    │  📊 Data (JSON/Firestore)        │  Negligible (separate)     │      │
│    └────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│    STORAGE CALCULATION EXAMPLE:                                             │
│    ┌────────────────────────────────────────────────────────────────┐      │
│    │  Monthly inspection: 20 inspections                           │      │
│    │  Photos per inspection: 10 photos                             │      │
│    │  ────────────────────────────────────────                     │      │
│    │  PDF: 20 × 500KB = 10MB                                       │      │
│    │  Photos: 20 × 10 × 2MB = 400MB                                │      │
│    │  ────────────────────────────────────────                     │      │
│    │  Total/month: ~410MB                                          │      │
│    │  Total/year: ~5GB                                             │      │
│    └────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 אסטרטגיות אחסון

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STORAGE STRATEGIES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STRATEGY A: Internal Only (ברירת מחדל)                                    │
│  ════════════════════════════════════════                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │    Client App ───▶ Firebase Storage ───▶ CDN ───▶ Download         │   │
│  │                          │                                         │   │
│  │                    Auto Backup                                     │   │
│  │                          │                                         │   │
│  │                          ▼                                         │   │
│  │                   Google Cloud                                     │   │
│  │                    (Cold Tier)                                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  יתרונות: פשוט, מנוהל, גיבוי אוטומטי                                       │
│  חסרונות: עלות אחסון על הלקוח (בתשלום)                                     │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  STRATEGY B: External Cloud (אחסון חיצוני)                                 │
│  ════════════════════════════════════════                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │    Client App ───▶ Cloud Provider API ───▶ User's Cloud Storage    │   │
│  │         │                                                          │   │
│  │         └───▶ Firestore (metadata only)                            │   │
│  │                    │                                               │   │
│  │               • File reference                                     │   │
│  │               • Cloud provider ID                                  │   │
│  │               • File path                                          │   │
│  │               • Permissions                                        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  יתרונות: הלקוח משלם לספק שלו, ללא הגבלת נפח                               │
│  חסרונות: תלות בספק חיצוני, פחות שליטה                                     │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  STRATEGY C: Hybrid (משולב)                                                │
│  ════════════════════════════════════════                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │    ┌─────────────┐                   ┌─────────────┐               │   │
│  │    │  HOT DATA   │                   │  COLD DATA  │               │   │
│  │    │             │                   │             │               │   │
│  │    │ • Recent    │                   │ • Archive   │               │   │
│  │    │   files     │                   │ • Old       │               │   │
│  │    │ • Active    │────── Auto ──────▶│   reports   │               │   │
│  │    │   inspct.   │     Archive       │ • Backup    │               │   │
│  │    │             │   (90 days)       │             │               │   │
│  │    └─────────────┘                   └─────────────┘               │   │
│  │     Firebase                          External Cloud               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  יתרונות: ביצועים + חיסכון, הטוב משני העולמות                              │
│  חסרונות: מורכבות ניהול                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 תהליך בחירת אחסון

```
┌─────────────────────────────────────────────────────────────────────────────┐
│               STORAGE SELECTION FLOW (New Customer)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────┐                                                     │
│  │  Customer Signs   │                                                     │
│  │      Up           │                                                     │
│  └─────────┬─────────┘                                                     │
│            │                                                               │
│            ▼                                                               │
│  ┌───────────────────┐                                                     │
│  │  Storage Setup    │                                                     │
│  │     Wizard        │                                                     │
│  └─────────┬─────────┘                                                     │
│            │                                                               │
│            ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐          │
│  │  "איך תרצה לנהל את האחסון?"                                 │          │
│  │                                                             │          │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │          │
│  │  │ 🏠 אחסון מנוהל │  │ ☁️ ענן חיצוני  │  │ ⚡ משולב   │ │          │
│  │  │                 │  │                 │  │             │ │          │
│  │  │ הכל כלול!      │  │ Google Drive   │  │ חם + קר    │ │          │
│  │  │ גיבוי אוטומטי  │  │ Dropbox        │  │             │ │          │
│  │  │ לפי החבילה     │  │ OneDrive       │  │ מתקדם      │ │          │
│  │  │                 │  │ שלך!          │  │             │ │          │
│  │  │ [מומלץ]        │  │                 │  │             │ │          │
│  │  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘ │          │
│  └───────────┼─────────────────────┼─────────────────┼────────┘          │
│              │                     │                 │                   │
│              ▼                     ▼                 ▼                   │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐        │
│  │  Provision      │   │  OAuth Flow     │   │  Configure      │        │
│  │  Firebase       │   │  Connect Cloud  │   │  Policies       │        │
│  │  Storage        │   │  Account        │   │                 │        │
│  └─────────────────┘   └─────────────────┘   └─────────────────┘        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. מערכת Quotas ומגבלות

### 4.1 הגדרת Quotas

```typescript
// Quota configuration per plan
interface PlanQuotas {
  planId: string;
  planName: 'starter' | 'basic' | 'professional' | 'enterprise' | 'custom';
  
  // User limits
  maxUsers: number;              // Total users allowed
  maxAdminUsers: number;         // Admin users allowed
  maxInspectors: number;         // Inspector users allowed
  
  // Client limits
  maxClients: number;            // End clients allowed
  maxSitesPerClient: number;     // Sites per client
  
  // Module limits
  maxModules: number;            // Modules allowed
  includedModules: string[];     // Pre-included modules
  
  // Storage limits
  storageQuotaGB: number;        // Storage in GB
  maxFileSizeMB: number;         // Max single file size
  
  // Usage limits
  inspectionsPerMonth: number;   // Monthly inspection limit (-1 = unlimited)
  reportsPerMonth: number;       // Monthly report limit (-1 = unlimited)
  aiRequestsPerMonth: number;    // AI requests limit
  apiCallsPerDay: number;        // API calls limit
  
  // Feature flags
  features: {
    offlineMode: boolean;
    clientPortal: boolean;
    aiBasic: boolean;
    aiAdvanced: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    sso: boolean;
    customDomain: boolean;
    prioritySupport: boolean;
  };
  
  // Retention
  dataRetentionDays: number;     // How long to keep data
  archiveAfterDays: number;      // When to archive to cold storage
}

// Example: Professional plan
const professionalQuotas: PlanQuotas = {
  planId: 'professional',
  planName: 'professional',
  
  maxUsers: 10,
  maxAdminUsers: 2,
  maxInspectors: 8,
  
  maxClients: 100,
  maxSitesPerClient: 10,
  
  maxModules: 2,
  includedModules: [],
  
  storageQuotaGB: 50,
  maxFileSizeMB: 25,
  
  inspectionsPerMonth: 200,
  reportsPerMonth: -1,  // Unlimited
  aiRequestsPerMonth: 100,
  apiCallsPerDay: 0,
  
  features: {
    offlineMode: true,
    clientPortal: true,
    aiBasic: true,
    aiAdvanced: false,
    apiAccess: false,
    whiteLabel: false,
    sso: false,
    customDomain: false,
    prioritySupport: false,
  },
  
  dataRetentionDays: 2555,  // 7 years
  archiveAfterDays: 365,    // 1 year
};
```

### 4.2 מעקב צריכה (Usage Tracking)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USAGE TRACKING SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    USAGE DASHBOARD (Admin View)                     │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  📊 סיכום צריכה - דצמבר 2025                                       │   │
│  │                                                                     │   │
│  │  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐│   │
│  │  │   אחסון           │  │   משתמשים         │  │   ביקורות        ││   │
│  │  │   ████████░░ 78%  │  │   ██████░░░░ 60%  │  │   ███████░░░ 68% ││   │
│  │  │   39GB / 50GB     │  │   6 / 10          │  │   136 / 200      ││   │
│  │  └───────────────────┘  └───────────────────┘  └───────────────────┘│   │
│  │                                                                     │   │
│  │  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐│   │
│  │  │   לקוחות          │  │   AI בקשות        │  │   דוחות PDF      ││   │
│  │  │   ████░░░░░░ 42%  │  │   █████████░ 89%  │  │   ✓ ללא הגבלה   ││   │
│  │  │   42 / 100        │  │   89 / 100        │  │   הופקו: 156     ││   │
│  │  └───────────────────┘  └───────────────────┘  └───────────────────┘│   │
│  │                                                                     │   │
│  │  ⚠️ התראות:                                                        │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ ! אחסון מתקרב למגבלה (78%) - שדרג או נקה קבצים ישנים      │   │   │
│  │  │ ! בקשות AI מתקרבות למגבלה (89%)                            │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  [📈 היסטוריית צריכה]  [⚙️ הגדרות התראות]  [⬆️ שדרג חבילה]       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 התנהגות בחריגה מ-Quota

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    QUOTA ENFORCEMENT BEHAVIOR                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  QUOTA TYPE        │ 80% WARNING │ 100% REACHED    │ OVERAGE BEHAVIOR      │
│  ══════════════════╪═════════════╪═════════════════╪═════════════════════  │
│                    │             │                 │                       │
│  Storage           │ Email alert │ Warning banner  │ SOFT BLOCK:           │
│                    │             │ "Storage full"  │ Can't upload new      │
│                    │             │                 │ files, can still      │
│                    │             │                 │ view/download         │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Users             │ N/A         │ Can't add new   │ HARD BLOCK:           │
│                    │             │ users           │ Must upgrade or       │
│                    │             │                 │ remove users          │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Inspections/mo    │ Email alert │ Warning banner  │ SOFT BLOCK:           │
│                    │ at 80%      │ "Limit reached" │ Can complete current, │
│                    │             │                 │ can't start new       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  AI Requests       │ In-app      │ Feature         │ GRACEFUL DEGRADE:     │
│                    │ notification│ disabled        │ Falls back to         │
│                    │             │                 │ manual mode           │
│  ─────────────────────────────────────────────────────────────────────────  │
│  API Calls         │ API warning │ HTTP 429        │ RATE LIMIT:           │
│                    │ header      │ response        │ Retry-After header    │
│                    │             │                 │ exponential backoff   │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Clients           │ N/A         │ Can't add new   │ HARD BLOCK:           │
│                    │             │ clients         │ Must upgrade          │
│                    │             │                 │                       │
└─────────────────────────────────────────────────────────────────────────────┘

GRACE PERIOD POLICY:
═══════════════════
• Storage: 7 days grace period after reaching 100%
• Users: No grace - immediate enforcement
• Monthly limits: Reset on billing cycle
• Overage charges: Not implemented (encourage upgrade instead)
```

---

## 5. תהליכי שדרוג ושינוי חבילה

### 5.1 מפת שדרוגים אפשריים

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         UPGRADE PATHS                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌─────────────┐                                               │
│              │   STARTER   │                                               │
│              │   ₪149/mo   │                                               │
│              └──────┬──────┘                                               │
│                     │                                                      │
│         ┌──────────┬┴────────────┐                                        │
│         │          │             │                                        │
│         ▼          ▼             ▼                                        │
│  ┌────────────┐ ┌─────────┐ ┌──────────┐                                  │
│  │ + Module   │ │ + Users │ │ + Storage│                                  │
│  │ ₪69-99/mo  │ │ ₪39/user│ │ ₪29-199  │                                  │
│  └────────────┘ └─────────┘ └──────────┘                                  │
│         │          │             │                                        │
│         └──────────┼─────────────┘                                        │
│                    │                                                      │
│                    ▼                                                      │
│              ┌─────────────┐                                               │
│              │    BASIC    │                                               │
│              │   ₪299/mo   │──────┐                                       │
│              └──────┬──────┘      │                                       │
│                     │             │                                       │
│         ┌──────────┬┴────────────┐│                                       │
│         │          │             ││                                       │
│         ▼          ▼             ▼│                                       │
│  ┌────────────┐ ┌─────────┐ ┌──────────┐                                  │
│  │ + Module   │ │ + Users │ │ + Add-ons│                                  │
│  └────────────┘ └─────────┘ └──────────┘                                  │
│         │          │             │                                        │
│         └──────────┼─────────────┘                                        │
│                    │                                                      │
│                    ▼                                                      │
│              ┌─────────────┐                                               │
│              │PROFESSIONAL │◀─────┘ (או ישירות)                           │
│              │   ₪599/mo   │                                               │
│              └──────┬──────┘                                               │
│                     │                                                      │
│                     ▼                                                      │
│              ┌─────────────┐                                               │
│              │ ENTERPRISE  │                                               │
│              │  ₪1,199/mo  │                                               │
│              └─────────────┘                                               │
│                                                                             │
│  DOWNGRADE RULES:                                                          │
│  ════════════════                                                          │
│  • Effective at next billing cycle                                         │
│  • Must be within new plan limits BEFORE downgrade                         │
│  • Data over quota: archived, not deleted                                  │
│  • 30-day grace period to retrieve archived data                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 תהליך שדרוג אוטומטי

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AUTOMATIC UPGRADE FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                          │
│  │ User clicks  │                                                          │
│  │ "Upgrade"    │                                                          │
│  └──────┬───────┘                                                          │
│         │                                                                  │
│         ▼                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     UPGRADE WIZARD                                   │  │
│  │                                                                      │  │
│  │  Step 1: בחר מה לשדרג                                               │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐       │  │
│  │  │ 📦 חבילה  │ │ 📁 מודול  │ │ 💾 אחסון  │ │ 👥 משתמש  │       │  │
│  │  │   מלאה    │ │   נוסף    │ │   נוסף    │ │   נוסף    │       │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘       │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│         │                                                                  │
│         ▼                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Step 2: סיכום ואישור                                               │  │
│  │                                                                      │  │
│  │  ┌────────────────────────────────────────────────────────────────┐ │  │
│  │  │  החבילה הנוכחית: Basic (₪299/חודש)                            │ │  │
│  │  │  + מודול אש: ₪99/חודש                                         │ │  │
│  │  │  ─────────────────────────────────────                        │ │  │
│  │  │  סה"כ חדש: ₪398/חודש                                          │ │  │
│  │  │                                                                │ │  │
│  │  │  ⓘ החיוב יבוצע באופן יחסי (Pro-rata) לתקופה הנותרת           │ │  │
│  │  │    היום: 15/12, סיום מחזור: 31/12                             │ │  │
│  │  │    חיוב מיידי: ₪49.50 (16 ימים × ₪99 / 31)                   │ │  │
│  │  └────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                      │  │
│  │  [ ] אני מסכים לתנאי השימוש המעודכנים                               │  │
│  │                                                                      │  │
│  │                    [ביטול]  [אשר ושדרג ▶]                           │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│         │                                                                  │
│         ▼                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Step 3: תשלום (אם נדרש)                                            │  │
│  │                                                                      │  │
│  │  ┌────────────────────────────────────────────────────────────────┐ │  │
│  │  │  💳 כרטיס אשראי בקובץ: **** **** **** 4532                    │ │  │
│  │  │     [שנה כרטיס]                                                │ │  │
│  │  │                                                                │ │  │
│  │  │  סכום לחיוב: ₪49.50                                           │ │  │
│  │  │                                                                │ │  │
│  │  │  [חזור]  [אשר תשלום ▶]                                        │ │  │
│  │  └────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│         │                                                                  │
│         ▼                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    BACKEND PROCESS                                   │  │
│  │                                                                      │  │
│  │  1. Process payment (חשבונית ירוקה API)                             │  │
│  │     └── On success: continue                                        │  │
│  │     └── On failure: show error, don't upgrade                       │  │
│  │                                                                      │  │
│  │  2. Update subscription record                                       │  │
│  │     └── Add module to subscription.modules[]                        │  │
│  │     └── Update subscription.monthlyPrice                            │  │
│  │                                                                      │  │
│  │  3. Update user claims (Firebase Auth)                              │  │
│  │     └── Add module to user.token.modules[]                          │  │
│  │                                                                      │  │
│  │  4. Send confirmation email                                         │  │
│  │     └── Receipt + new features summary                              │  │
│  │                                                                      │  │
│  │  5. Log audit event                                                 │  │
│  │     └── "subscription_upgraded"                                      │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│         │                                                                  │
│         ▼                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Step 4: אישור                                                      │  │
│  │                                                                      │  │
│  │         ✅ השדרוג בוצע בהצלחה!                                      │  │
│  │                                                                      │  │
│  │    מודול אש הופעל בחשבונך.                                         │  │
│  │    קבלה נשלחה לאימייל שלך.                                          │  │
│  │                                                                      │  │
│  │    [התחל לעבוד עם מודול אש ▶]                                       │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 תהליך הוספת אחסון

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADD STORAGE FLOW                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TRIGGER: User reaches 80% storage OR clicks "Add Storage"                 │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  💾 הוסף אחסון                                                      │  │
│  │                                                                      │  │
│  │  מצב נוכחי: 39GB / 50GB (78%)                                       │  │
│  │  ████████████████████░░░░░░                                         │  │
│  │                                                                      │  │
│  │  בחר אפשרות:                                                        │  │
│  │                                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐│  │
│  │  │  ○  +5GB    ₪29/חודש   │ מספיק ל~1 חודש נוסף                  ││  │
│  │  ├─────────────────────────────────────────────────────────────────┤│  │
│  │  │  ●  +15GB   ₪49/חודש   │ מספיק ל~3 חודשים [מומלץ]            ││  │
│  │  ├─────────────────────────────────────────────────────────────────┤│  │
│  │  │  ○  +50GB   ₪99/חודש   │ מספיק ל~12 חודשים                    ││  │
│  │  ├─────────────────────────────────────────────────────────────────┤│  │
│  │  │  ○  +150GB  ₪199/חודש  │ ללא דאגות                            ││  │
│  │  └─────────────────────────────────────────────────────────────────┘│  │
│  │                                                                      │  │
│  │  ─── או ───                                                         │  │
│  │                                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐│  │
│  │  │  ☁️ חבר אחסון חיצוני (ללא תשלום נוסף)                          ││  │
│  │  │                                                                 ││  │
│  │  │  העבר קבצים לאחסון שלך:                                        ││  │
│  │  │  [Google Drive]  [Dropbox]  [OneDrive]                         ││  │
│  │  └─────────────────────────────────────────────────────────────────┘│  │
│  │                                                                      │  │
│  │  ─── או ───                                                         │  │
│  │                                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐│  │
│  │  │  🗑️ נקה אחסון                                                  ││  │
│  │  │                                                                 ││  │
│  │  │  מחק קבצים ישנים לפי:                                          ││  │
│  │  │  [ישנים מ-2 שנים]  [כפילויות]  [בחירה ידנית]                  ││  │
│  │  └─────────────────────────────────────────────────────────────────┘│  │
│  │                                                                      │  │
│  │                          [ביטול]  [המשך ▶]                          │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. אינטגרציה לענן חיצוני

### 6.1 ספקי ענן נתמכים

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUPPORTED CLOUD PROVIDERS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  GOOGLE DRIVE                                                       │   │
│  │  ════════════                                                       │   │
│  │  • API: Google Drive API v3                                         │   │
│  │  • Auth: OAuth 2.0                                                  │   │
│  │  • Scopes: drive.file (app-specific folder only)                    │   │
│  │  • Features:                                                        │   │
│  │    ✓ Upload files                                                   │   │
│  │    ✓ Download files                                                 │   │
│  │    ✓ Folder management                                              │   │
│  │    ✓ Search                                                         │   │
│  │    ✓ Permissions (view/edit)                                        │   │
│  │  • Rate limits: 1,000 queries/100 seconds/user                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  DROPBOX                                                            │   │
│  │  ═══════                                                            │   │
│  │  • API: Dropbox API v2                                              │   │
│  │  • Auth: OAuth 2.0                                                  │   │
│  │  • Scopes: files.content.write, files.content.read                  │   │
│  │  • Features:                                                        │   │
│  │    ✓ Upload files                                                   │   │
│  │    ✓ Download files                                                 │   │
│  │    ✓ Folder management                                              │   │
│  │    ✓ File versioning                                                │   │
│  │    ✓ Shared links                                                   │   │
│  │  • Rate limits: App-specific                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  MICROSOFT ONEDRIVE                                                 │   │
│  │  ═══════════════════                                                │   │
│  │  • API: Microsoft Graph API                                         │   │
│  │  • Auth: OAuth 2.0 (Azure AD)                                       │   │
│  │  • Scopes: Files.ReadWrite.AppFolder                                │   │
│  │  • Features:                                                        │   │
│  │    ✓ Upload files                                                   │   │
│  │    ✓ Download files                                                 │   │
│  │    ✓ Folder management                                              │   │
│  │    ✓ Search                                                         │   │
│  │    ✓ OneDrive for Business support                                  │   │
│  │  • Rate limits: Per-app throttling                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  AWS S3 (Enterprise only)                                           │   │
│  │  ════════════════════════                                           │   │
│  │  • API: AWS SDK                                                     │   │
│  │  • Auth: IAM credentials (customer provides)                        │   │
│  │  • Features:                                                        │   │
│  │    ✓ Full S3 bucket access                                          │   │
│  │    ✓ Customer-managed encryption                                    │   │
│  │    ✓ Lifecycle policies                                             │   │
│  │    ✓ CloudFront CDN support                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 תהליך חיבור ענן חיצוני

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 EXTERNAL CLOUD CONNECTION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐                                                         │
│  │ User selects  │                                                         │
│  │ "Connect      │                                                         │
│  │  Cloud"       │                                                         │
│  └───────┬───────┘                                                         │
│          │                                                                  │
│          ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                                                                    │    │
│  │  ☁️ חבר אחסון חיצוני                                              │    │
│  │                                                                    │    │
│  │  בחר ספק:                                                         │    │
│  │                                                                    │    │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │    │
│  │  │              │ │              │ │              │               │    │
│  │  │   Google     │ │   Dropbox    │ │   OneDrive   │               │    │
│  │  │   Drive      │ │              │ │              │               │    │
│  │  │              │ │              │ │              │               │    │
│  │  └──────────────┘ └──────────────┘ └──────────────┘               │    │
│  │                                                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│          │                                                                  │
│          ▼ (User selects Google Drive)                                     │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                                                                    │    │
│  │  🔐 אימות Google                                                  │    │
│  │                                                                    │    │
│  │  אנחנו צריכים גישה לתיקייה ייעודית ב-Google Drive שלך.            │    │
│  │                                                                    │    │
│  │  מה נקבל:                                                         │    │
│  │  ✓ יצירת תיקייה "Keren Laser" ב-Drive שלך                        │    │
│  │  ✓ שמירת קבצי ביקורות ודוחות                                     │    │
│  │  ✓ קריאת קבצים שהמערכת שמרה                                       │    │
│  │                                                                    │    │
│  │  מה לא נקבל:                                                      │    │
│  │  ✗ גישה לקבצים אחרים ב-Drive שלך                                  │    │
│  │  ✗ מחיקת קבצים ללא אישורך                                        │    │
│  │                                                                    │    │
│  │                [התחבר עם Google ▶]                                 │    │
│  │                                                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│          │                                                                  │
│          ▼ (OAuth popup)                                                   │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  ┌──────────────────────────────────────────────────────────────┐ │    │
│  │  │                     GOOGLE                                   │ │    │
│  │  │                                                              │ │    │
│  │  │  Sign in to continue to Keren Laser                          │ │    │
│  │  │                                                              │ │    │
│  │  │  [user@gmail.com]                                            │ │    │
│  │  │                                                              │ │    │
│  │  │  Keren Laser wants to access your Google Account             │ │    │
│  │  │                                                              │ │    │
│  │  │  This will allow Keren Laser to:                             │ │    │
│  │  │  • See, edit, create, and delete only the specific           │ │    │
│  │  │    Google Drive files you use with this app                  │ │    │
│  │  │                                                              │ │    │
│  │  │           [Cancel]     [Allow]                               │ │    │
│  │  └──────────────────────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│          │                                                                  │
│          ▼ (On success)                                                    │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                     BACKEND PROCESS                                │    │
│  │                                                                    │    │
│  │  1. Receive OAuth tokens from Google                              │    │
│  │  2. Encrypt and store refresh_token in Firestore                  │    │
│  │  3. Create "Keren Laser" folder in user's Drive                   │    │
│  │  4. Create subfolders: /Reports, /Photos, /Certificates           │    │
│  │  5. Update organization.storageConfig:                            │    │
│  │     {                                                             │    │
│  │       provider: 'google_drive',                                   │    │
│  │       connected: true,                                            │    │
│  │       rootFolderId: 'abc123...',                                  │    │
│  │       connectedAt: timestamp,                                     │    │
│  │       connectedBy: userId                                         │    │
│  │     }                                                             │    │
│  │  6. Migrate existing files (optional, user choice)                │    │
│  │                                                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│          │                                                                  │
│          ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                                                                    │    │
│  │  ✅ Google Drive מחובר בהצלחה!                                    │    │
│  │                                                                    │    │
│  │  תיקייה "Keren Laser" נוצרה ב-Drive שלך.                          │    │
│  │  מעכשיו, כל הקבצים החדשים יישמרו שם.                              │    │
│  │                                                                    │    │
│  │  ┌──────────────────────────────────────────────────────────────┐ │    │
│  │  │  מה לעשות עם הקבצים הקיימים?                                │ │    │
│  │  │                                                              │ │    │
│  │  │  ○ השאר במערכת (ללא שינוי)                                  │ │    │
│  │  │  ● העבר ל-Google Drive (מומלץ)                              │ │    │
│  │  │  ○ מחק מהמערכת (לאחר העברה)                                 │ │    │
│  │  └──────────────────────────────────────────────────────────────┘ │    │
│  │                                                                    │    │
│  │                            [סיום ▶]                               │    │
│  │                                                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 ארכיטקטורת אחסון היברידי

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HYBRID STORAGE ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        STORAGE ABSTRACTION LAYER                    │   │
│  │                                                                     │   │
│  │   ┌─────────────────────────────────────────────────────────────┐  │   │
│  │   │                    StorageService                           │  │   │
│  │   │                                                             │  │   │
│  │   │   upload(file, path) → Promise<StorageRef>                  │  │   │
│  │   │   download(ref) → Promise<Blob>                             │  │   │
│  │   │   delete(ref) → Promise<void>                               │  │   │
│  │   │   getUrl(ref) → Promise<string>                             │  │   │
│  │   │   list(path) → Promise<StorageRef[]>                        │  │   │
│  │   │                                                             │  │   │
│  │   └─────────────────────┬───────────────────────────────────────┘  │   │
│  │                         │                                          │   │
│  │         ┌───────────────┼───────────────┬───────────────┐         │   │
│  │         │               │               │               │         │   │
│  │         ▼               ▼               ▼               ▼         │   │
│  │   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐      │   │
│  │   │ Firebase │   │  Google  │   │ Dropbox  │   │ OneDrive │      │   │
│  │   │ Adapter  │   │  Drive   │   │ Adapter  │   │ Adapter  │      │   │
│  │   │          │   │ Adapter  │   │          │   │          │      │   │
│  │   └──────────┘   └──────────┘   └──────────┘   └──────────┘      │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DATA FLOW:                                                                │
│  ══════════                                                                │
│                                                                             │
│  1. UPLOAD NEW FILE                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   User uploads ──▶ Check storage config ──▶ Route to provider      │   │
│  │        file              │                        │                │   │
│  │                          │                        │                │   │
│  │                          ▼                        ▼                │   │
│  │                 ┌────────────────┐      ┌─────────────────┐        │   │
│  │                 │ If: internal   │      │ Upload to       │        │   │
│  │                 │ → Firebase     │      │ selected        │        │   │
│  │                 │                │      │ provider        │        │   │
│  │                 │ If: external   │      │                 │        │   │
│  │                 │ → Cloud API    │      └────────┬────────┘        │   │
│  │                 └────────────────┘               │                 │   │
│  │                                                  │                 │   │
│  │                                                  ▼                 │   │
│  │                                       ┌─────────────────┐          │   │
│  │                                       │ Save metadata   │          │   │
│  │                                       │ to Firestore:   │          │   │
│  │                                       │ - provider      │          │   │
│  │                                       │ - externalId    │          │   │
│  │                                       │ - path          │          │   │
│  │                                       │ - size          │          │   │
│  │                                       │ - mime          │          │   │
│  │                                       └─────────────────┘          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  2. RETRIEVE FILE                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   Request file ──▶ Get metadata ──▶ Route to correct provider      │   │
│  │                         │                     │                    │   │
│  │                         ▼                     ▼                    │   │
│  │                  ┌────────────┐      ┌─────────────────┐           │   │
│  │                  │ metadata:  │      │ If Firebase:    │           │   │
│  │                  │ provider:  │      │   getDownloadURL│           │   │
│  │                  │ 'gdrive'   │      │                 │           │   │
│  │                  │ extId:     │      │ If external:    │           │   │
│  │                  │ 'abc123'   │      │   getSignedUrl  │           │   │
│  │                  └────────────┘      │   or proxy      │           │   │
│  │                                      └─────────────────┘           │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 מבנה מטא-דאטה לקובץ

```typescript
interface FileMetadata {
  id: string;
  organizationId: string;
  
  // File info
  name: string;
  mimeType: string;
  size: number;  // bytes
  hash: string;  // SHA-256 for integrity
  
  // Storage location
  storage: {
    provider: 'firebase' | 'google_drive' | 'dropbox' | 'onedrive' | 's3';
    
    // For Firebase
    firebasePath?: string;
    
    // For external providers
    externalId?: string;      // Provider's file ID
    externalPath?: string;    // Path in provider
    externalUrl?: string;     // Direct URL (if available)
  };
  
  // Context
  context: {
    type: 'inspection_photo' | 'report_pdf' | 'certificate' | 'evidence' | 'signature' | 'logo';
    relatedTo: {
      collection: 'inspections' | 'findings' | 'trainings' | 'users' | 'organizations';
      documentId: string;
    };
  };
  
  // Access control
  access: {
    createdBy: string;
    createdAt: Timestamp;
    visibility: 'private' | 'organization' | 'client';
    allowedUsers?: string[];
  };
  
  // Lifecycle
  lifecycle: {
    archiveAfter?: Timestamp;
    deleteAfter?: Timestamp;
    archived: boolean;
    archivedAt?: Timestamp;
  };
}
```

---

## 7. מנגנון חיוב אוטומטי

### 7.1 זרימת חיוב

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BILLING FLOW                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     MONTHLY BILLING CYCLE                           │   │
│  │                                                                     │   │
│  │   Day 1          Day 25         Day 28         Day 30/31           │   │
│  │     │              │              │              │                  │   │
│  │     ▼              ▼              ▼              ▼                  │   │
│  │  ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐               │   │
│  │  │Cycle │      │Send  │      │Retry │      │Process│               │   │
│  │  │Start │      │Remind│      │Failed│      │Billing│               │   │
│  │  │      │      │      │      │      │      │      │               │   │
│  │  └──────┘      └──────┘      └──────┘      └──────┘               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  BILLING PROCESS (Day 30/31):                                              │
│  ═════════════════════════════                                             │
│                                                                             │
│  ┌───────────────┐                                                         │
│  │   Scheduled   │                                                         │
│  │   Function    │                                                         │
│  │  (Cloud Job)  │                                                         │
│  └───────┬───────┘                                                         │
│          │                                                                  │
│          ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  1. Get all subscriptions where billingDate = today                │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│          │                                                                  │
│          ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  2. For each subscription:                                         │    │
│  │     a. Calculate total amount (base + modules + addons)            │    │
│  │     b. Apply discounts (annual, loyalty, promotions)               │    │
│  │     c. Add VAT (17%)                                               │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│          │                                                                  │
│          ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  3. Create invoice via חשבונית ירוקה API                          │    │
│  │                                                                    │    │
│  │     POST /api/v1/invoices                                         │    │
│  │     {                                                              │    │
│  │       "client": { ... },                                          │    │
│  │       "items": [                                                   │    │
│  │         { "name": "מנוי Professional", "price": 599 },            │    │
│  │         { "name": "מודול לייזר", "price": 99 },                   │    │
│  │         { "name": "אחסון נוסף 15GB", "price": 49 }                │    │
│  │       ],                                                           │    │
│  │       "payment": {                                                 │    │
│  │         "type": "credit_card",                                     │    │
│  │         "token": "saved_token_xxx"                                 │    │
│  │       }                                                            │    │
│  │     }                                                              │    │
│  │                                                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│          │                                                                  │
│          ├────────────────────────────────────────┐                        │
│          │                                        │                        │
│          ▼ (Success)                              ▼ (Failure)              │
│  ┌──────────────────────┐              ┌──────────────────────┐            │
│  │ 4a. Update status    │              │ 4b. Handle failure   │            │
│  │     to "paid"        │              │                      │            │
│  │                      │              │ • Log error          │            │
│  │ • Save invoice ID    │              │ • Send alert email   │            │
│  │ • Reset quotas       │              │ • Schedule retry     │            │
│  │ • Send receipt       │              │ • Mark as "failed"   │            │
│  │ • Log audit          │              │                      │            │
│  └──────────────────────┘              └──────────┬───────────┘            │
│                                                   │                        │
│                                                   ▼                        │
│                                        ┌──────────────────────┐            │
│                                        │ RETRY LOGIC          │            │
│                                        │                      │            │
│                                        │ Retry 1: +24h        │            │
│                                        │ Retry 2: +48h        │            │
│                                        │ Retry 3: +72h        │            │
│                                        │                      │            │
│                                        │ After 3 failures:    │            │
│                                        │ • Restrict account   │            │
│                                        │ • Manual intervention│            │
│                                        └──────────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 חישוב Pro-Rata

```typescript
/**
 * Calculate pro-rata amount for mid-cycle changes
 */
function calculateProRata(
  newMonthlyAmount: number,
  oldMonthlyAmount: number,
  billingCycleStart: Date,
  billingCycleEnd: Date,
  changeDate: Date
): ProRataResult {
  
  const totalDaysInCycle = differenceInDays(billingCycleEnd, billingCycleStart);
  const remainingDays = differenceInDays(billingCycleEnd, changeDate);
  const usedDays = totalDaysInCycle - remainingDays;
  
  // Credit for unused portion of old plan
  const unusedCredit = (oldMonthlyAmount / totalDaysInCycle) * remainingDays;
  
  // Charge for new plan's remaining portion
  const newCharge = (newMonthlyAmount / totalDaysInCycle) * remainingDays;
  
  // Net amount to charge (or credit)
  const netAmount = newCharge - unusedCredit;
  
  return {
    totalDaysInCycle,
    remainingDays,
    usedDays,
    oldPlanCredit: unusedCredit,
    newPlanCharge: newCharge,
    netAmount: netAmount,
    isCredit: netAmount < 0,
    breakdown: {
      description: netAmount >= 0 
        ? `חיוב יחסי ל-${remainingDays} ימים`
        : `זיכוי יחסי ל-${remainingDays} ימים`,
      calculation: `(${newMonthlyAmount} - ${oldMonthlyAmount}) × ${remainingDays}/${totalDaysInCycle}`
    }
  };
}

interface ProRataResult {
  totalDaysInCycle: number;
  remainingDays: number;
  usedDays: number;
  oldPlanCredit: number;
  newPlanCharge: number;
  netAmount: number;
  isCredit: boolean;
  breakdown: {
    description: string;
    calculation: string;
  };
}
```

### 7.3 Webhook Handler (חשבונית ירוקה)

```typescript
// Cloud Function: Handle payment webhooks
export const handlePaymentWebhook = functions.https.onRequest(async (req, res) => {
  
  // 1. Verify webhook signature
  const signature = req.headers['x-greeninvoice-signature'];
  const isValid = verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET);
  
  if (!isValid) {
    console.error('Invalid webhook signature');
    return res.status(401).send('Unauthorized');
  }
  
  // 2. Parse event
  const event = req.body;
  
  switch (event.type) {
    
    case 'payment.success':
      await handlePaymentSuccess(event.data);
      break;
      
    case 'payment.failed':
      await handlePaymentFailed(event.data);
      break;
      
    case 'subscription.created':
      await handleSubscriptionCreated(event.data);
      break;
      
    case 'subscription.cancelled':
      await handleSubscriptionCancelled(event.data);
      break;
      
    case 'invoice.created':
      await handleInvoiceCreated(event.data);
      break;
      
    default:
      console.log('Unhandled event type:', event.type);
  }
  
  res.status(200).send('OK');
});

async function handlePaymentSuccess(data: PaymentData) {
  const { organizationId, invoiceId, amount, paymentMethod } = data;
  
  // 1. Update subscription status
  await db.collection('subscriptions').doc(organizationId).update({
    status: 'active',
    lastPaymentDate: FieldValue.serverTimestamp(),
    lastPaymentAmount: amount,
    lastInvoiceId: invoiceId,
    failedPaymentAttempts: 0,
  });
  
  // 2. Reset monthly quotas
  await resetMonthlyQuotas(organizationId);
  
  // 3. Create payment record
  await db.collection('payments').add({
    organizationId,
    invoiceId,
    amount,
    paymentMethod,
    status: 'completed',
    createdAt: FieldValue.serverTimestamp(),
  });
  
  // 4. Send receipt email
  await sendReceiptEmail(organizationId, invoiceId);
  
  // 5. Audit log
  await logAuditEvent({
    action: 'payment_received',
    organizationId,
    metadata: { invoiceId, amount },
  });
}

async function handlePaymentFailed(data: PaymentData) {
  const { organizationId, invoiceId, errorCode, errorMessage } = data;
  
  // 1. Increment failure counter
  const subRef = db.collection('subscriptions').doc(organizationId);
  const sub = await subRef.get();
  const attempts = (sub.data()?.failedPaymentAttempts || 0) + 1;
  
  await subRef.update({
    failedPaymentAttempts: attempts,
    lastFailedPayment: FieldValue.serverTimestamp(),
    lastPaymentError: errorMessage,
  });
  
  // 2. Take action based on attempt count
  if (attempts === 1) {
    // First failure - notify admin
    await sendPaymentFailedEmail(organizationId, 'first_attempt');
  } else if (attempts === 3) {
    // Third failure - restrict account
    await restrictAccount(organizationId);
    await sendPaymentFailedEmail(organizationId, 'account_restricted');
  }
  
  // 3. Schedule retry
  if (attempts < 3) {
    await schedulePaymentRetry(organizationId, attempts);
  }
  
  // 4. Audit log
  await logAuditEvent({
    action: 'payment_failed',
    organizationId,
    metadata: { invoiceId, errorCode, attempt: attempts },
  });
}
```

---

## 8. ממשק ניהול מנויים

### 8.1 דשבורד מנהל - מנויים

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION MANAGEMENT DASHBOARD                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⚙️ ניהול מנוי                                            [שינוי]  │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  📦 חבילה נוכחית                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  PROFESSIONAL                                               │   │   │
│  │  │  ₪599/חודש + מודולים ותוספות                               │   │   │
│  │  │                                                             │   │   │
│  │  │  מחזור חיוב: 1-30 לכל חודש                                 │   │   │
│  │  │  חיוב הבא: 30/12/2025                                       │   │   │
│  │  │  סה"כ צפוי: ₪796 (כולל מע"מ)                               │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  📁 מודולים פעילים                                                 │   │
│  │  ┌──────────────────┬──────────────────┬────────────────────────┐  │   │
│  │  │ ⚛️ לייזר         │ 🔥 אש            │ [+ הוסף מודול]         │  │   │
│  │  │ ₪99/חודש        │ ₪99/חודש        │                        │  │   │
│  │  │ [פעיל ✓]        │ [פעיל ✓]        │                        │  │   │
│  │  └──────────────────┴──────────────────┴────────────────────────┘  │   │
│  │                                                                     │   │
│  │  ➕ תוספות פעילות                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │ 💾 אחסון נוסף 15GB │ ₪49/חודש │ [הסר]                      │  │   │
│  │  │ 🤖 AI בסיסי        │ כלול     │ -                          │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │  [+ הוסף תוספת]                                                    │   │
│  │                                                                     │   │
│  │  👥 משתמשים                                                        │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  6 / 10 משתמשים בשימוש                                      │  │   │
│  │  │  ██████░░░░                                                  │  │   │
│  │  │  [נהל משתמשים]  [+ הוסף משתמש - ₪39/חודש]                  │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │  💾 אחסון                                                          │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  39GB / 65GB (50GB בסיס + 15GB תוספת)                       │  │   │
│  │  │  ████████████░░░░░░░ 60%                                    │  │   │
│  │  │                                                              │  │   │
│  │  │  [+ הוסף אחסון]  [☁️ חבר ענן חיצוני]  [🗑️ נקה]             │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │  💳 אמצעי תשלום                                                    │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  Visa **** 4532  │ תוקף: 08/27  │ [שנה]                     │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │  📜 היסטוריית חיובים                                               │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  30/11/2025 │ ₪796 │ שולם ✓ │ [חשבונית] [קבלה]             │  │   │
│  │  │  30/10/2025 │ ₪747 │ שולם ✓ │ [חשבונית] [קבלה]             │  │   │
│  │  │  30/09/2025 │ ₪747 │ שולם ✓ │ [חשבונית] [קבלה]             │  │   │
│  │  │  [הצג הכל...]                                               │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────     │   │
│  │  [🔄 שדרג חבילה]  [⏸️ השהה מנוי]  [❌ בטל מנוי]                   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 מסך בחירת חבילה (לקוח חדש)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PLAN SELECTION                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🎯 בחר את החבילה המתאימה לך                                       │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │  STARTER    │ │   BASIC     │ │PROFESSIONAL │ │ ENTERPRISE  │   │   │
│  │  │             │ │             │ │   ⭐ מומלץ  │ │             │   │   │
│  │  │  ₪149/mo   │ │  ₪299/mo   │ │  ₪599/mo   │ │ ₪1,199/mo  │   │   │
│  │  │             │ │             │ │             │ │             │   │   │
│  │  │ 1 משתמש    │ │ 3 משתמשים  │ │ 10 משתמשים │ │ 50 משתמשים │   │   │
│  │  │ 5 לקוחות   │ │ 25 לקוחות  │ │ 100 לקוחות │ │ 500 לקוחות │   │   │
│  │  │ 1 מודול    │ │ 1 מודול    │ │ 2 מודולים  │ │ כל המודולים│   │   │
│  │  │ 2GB אחסון  │ │ 10GB אחסון │ │ 50GB אחסון │ │ 200GB אחסון│   │   │
│  │  │             │ │ + Offline  │ │ + Offline  │ │ + API      │   │   │
│  │  │             │ │ + Portal   │ │ + AI       │ │ + SSO      │   │   │
│  │  │             │ │             │ │ + Portal   │ │ + All      │   │   │
│  │  │             │ │             │ │             │ │             │   │   │
│  │  │  [בחר]     │ │  [בחר]     │ │  [בחר]     │ │  [צור קשר] │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────     │   │
│  │                                                                     │   │
│  │  📁 בחר מודול (לפחות אחד):                                         │   │
│  │                                                                     │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │   │
│  │  │ [✓] לייזר   │ │ [ ] אש      │ │ [ ] בטיחות  │ │ [ ] הדרכות│ │   │
│  │  │ ₪99/חודש   │ │ ₪99/חודש   │ │ ₪79/חודש   │ │ ₪69/חודש  │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │   │
│  │                                                                     │   │
│  │  💰 סיכום הזמנה:                                                   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  חבילת Professional     ₪599                                │  │   │
│  │  │  מודול לייזר            ₪99                                 │  │   │
│  │  │  ─────────────────────────────────                          │  │   │
│  │  │  סה"כ לפני מע"מ         ₪698                                │  │   │
│  │  │  מע"מ (17%)             ₪119                                │  │   │
│  │  │  ═════════════════════════════════                          │  │   │
│  │  │  סה"כ לחודש             ₪817                                │  │   │
│  │  │                                                              │  │   │
│  │  │  💡 שלם שנתי וחסוך 17% (₪8,170 במקום ₪9,804)               │  │   │
│  │  │     [עבור לתשלום שנתי]                                      │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │                         [המשך לתשלום ▶]                            │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. התראות ואוטומציות

### 9.1 מפת התראות

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NOTIFICATION MAP                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TRIGGER                    │ CHANNEL         │ TIMING        │ RECIPIENT  │
│  ═══════════════════════════╪═════════════════╪═══════════════╪═══════════ │
│                             │                 │               │            │
│  QUOTA ALERTS               │                 │               │            │
│  ───────────────────────────┼─────────────────┼───────────────┼─────────── │
│  Storage 80%                │ Email + In-app  │ Immediate     │ Org Admin  │
│  Storage 95%                │ Email + SMS     │ Immediate     │ Org Admin  │
│  Storage 100%               │ Email + SMS     │ Immediate     │ Org Admin  │
│  Users limit reached        │ In-app          │ On action     │ Org Admin  │
│  Inspections 80%            │ Email + In-app  │ Daily digest  │ Org Admin  │
│  AI requests 90%            │ In-app          │ Immediate     │ User       │
│                             │                 │               │            │
│  BILLING ALERTS             │                 │               │            │
│  ───────────────────────────┼─────────────────┼───────────────┼─────────── │
│  Payment due (5 days)       │ Email           │ 5 days before │ Org Admin  │
│  Payment due (1 day)        │ Email + SMS     │ 1 day before  │ Org Admin  │
│  Payment successful         │ Email           │ Immediate     │ Org Admin  │
│  Payment failed             │ Email + SMS     │ Immediate     │ Org Admin  │
│  Payment retry scheduled    │ Email           │ Immediate     │ Org Admin  │
│  Account restricted         │ Email + SMS     │ Immediate     │ Org Admin  │
│                             │                 │               │            │
│  SUBSCRIPTION EVENTS        │                 │               │            │
│  ───────────────────────────┼─────────────────┼───────────────┼─────────── │
│  Plan upgraded              │ Email           │ Immediate     │ Org Admin  │
│  Plan downgraded            │ Email           │ Immediate     │ Org Admin  │
│  Module added               │ Email + In-app  │ Immediate     │ All users  │
│  Module removed             │ Email + In-app  │ Immediate     │ All users  │
│  Trial ending (3 days)      │ Email           │ 3 days before │ Org Admin  │
│  Trial ended                │ Email + In-app  │ Immediate     │ All users  │
│                             │                 │               │            │
│  STORAGE EVENTS             │                 │               │            │
│  ───────────────────────────┼─────────────────┼───────────────┼─────────── │
│  Cloud connected            │ Email           │ Immediate     │ Org Admin  │
│  Cloud disconnected         │ Email + SMS     │ Immediate     │ Org Admin  │
│  Migration completed        │ Email           │ Immediate     │ Org Admin  │
│  Archive completed          │ Email           │ Immediate     │ Org Admin  │
│                             │                 │               │            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Scheduled Jobs

```typescript
// Scheduled Cloud Functions

// Daily: Check quotas and send alerts
export const dailyQuotaCheck = functions.pubsub
  .schedule('0 8 * * *')  // 8:00 AM daily
  .timeZone('Asia/Jerusalem')
  .onRun(async () => {
    
    const orgs = await db.collection('organizations').get();
    
    for (const org of orgs.docs) {
      const usage = await calculateUsage(org.id);
      const quotas = await getQuotas(org.id);
      
      // Storage alerts
      const storagePercent = (usage.storage / quotas.storage) * 100;
      if (storagePercent >= 80 && storagePercent < 95) {
        await sendAlert(org.id, 'storage_warning_80', { storagePercent });
      } else if (storagePercent >= 95) {
        await sendAlert(org.id, 'storage_critical_95', { storagePercent });
      }
      
      // Monthly inspection alerts
      const inspectionPercent = (usage.inspectionsThisMonth / quotas.inspectionsPerMonth) * 100;
      if (inspectionPercent >= 80) {
        await sendAlert(org.id, 'inspections_warning', { inspectionPercent });
      }
    }
  });

// Daily: Process billing
export const dailyBilling = functions.pubsub
  .schedule('0 2 * * *')  // 2:00 AM daily
  .timeZone('Asia/Jerusalem')
  .onRun(async () => {
    
    const today = new Date();
    
    // Get subscriptions due for billing today
    const dueSubs = await db.collection('subscriptions')
      .where('billingDay', '==', today.getDate())
      .where('status', '==', 'active')
      .get();
    
    for (const sub of dueSubs.docs) {
      await processBilling(sub.id, sub.data());
    }
    
    // Retry failed payments
    const failedSubs = await db.collection('subscriptions')
      .where('status', '==', 'payment_failed')
      .where('nextRetryDate', '<=', today)
      .get();
    
    for (const sub of failedSubs.docs) {
      await retryPayment(sub.id, sub.data());
    }
  });

// Weekly: Clean up and archive
export const weeklyMaintenance = functions.pubsub
  .schedule('0 3 * * 0')  // 3:00 AM every Sunday
  .timeZone('Asia/Jerusalem')
  .onRun(async () => {
    
    // Archive old files to cold storage
    await archiveOldFiles();
    
    // Clean up expired trials
    await cleanupExpiredTrials();
    
    // Generate usage reports
    await generateWeeklyReports();
  });

// Monthly: Reset quotas
export const monthlyReset = functions.pubsub
  .schedule('0 0 1 * *')  // Midnight on 1st of month
  .timeZone('Asia/Jerusalem')
  .onRun(async () => {
    
    const orgs = await db.collection('organizations').get();
    
    for (const org of orgs.docs) {
      await db.collection('usage').doc(org.id).update({
        inspectionsThisMonth: 0,
        reportsThisMonth: 0,
        aiRequestsThisMonth: 0,
        resetDate: FieldValue.serverTimestamp(),
      });
    }
  });
```

---

## 10. מבנה נתונים טכני

### 10.1 Subscription Schema

```typescript
interface Subscription {
  id: string;  // Same as organizationId
  organizationId: string;
  
  // Plan info
  plan: {
    id: 'starter' | 'basic' | 'professional' | 'enterprise' | 'custom';
    name: string;
    basePrice: number;
  };
  
  // Active modules
  modules: {
    id: string;  // 'laser', 'fire', 'safety', 'training'
    name: string;
    price: number;
    activatedAt: Timestamp;
  }[];
  
  // Add-ons
  addons: {
    id: string;
    type: 'storage' | 'users' | 'ai' | 'api' | 'whitelabel';
    name: string;
    quantity?: number;
    price: number;
    activatedAt: Timestamp;
  }[];
  
  // Billing
  billing: {
    cycle: 'monthly' | 'annual';
    billingDay: number;  // Day of month (1-28)
    nextBillingDate: Timestamp;
    
    baseAmount: number;
    modulesAmount: number;
    addonsAmount: number;
    discount: number;
    discountReason?: string;
    taxRate: number;
    totalAmount: number;
    
    currency: 'ILS';
  };
  
  // Payment
  payment: {
    method: 'credit_card' | 'bank_transfer' | 'invoice';
    cardLastFour?: string;
    cardExpiry?: string;
    tokenId?: string;  // Stored payment token
  };
  
  // Status
  status: 'trial' | 'active' | 'past_due' | 'restricted' | 'cancelled' | 'expired';
  trialEndsAt?: Timestamp;
  cancelledAt?: Timestamp;
  cancelReason?: string;
  
  // Payment history
  lastPayment: {
    date: Timestamp;
    amount: number;
    invoiceId: string;
    status: 'success' | 'failed';
  };
  failedPaymentAttempts: number;
  nextRetryDate?: Timestamp;
  
  // Storage config
  storage: {
    mode: 'internal' | 'external' | 'hybrid';
    internalQuotaGB: number;
    externalProvider?: 'google_drive' | 'dropbox' | 'onedrive' | 's3';
    externalConnected: boolean;
    externalConfig?: {
      accessToken: string;  // Encrypted
      refreshToken: string;  // Encrypted
      rootFolderId: string;
      connectedAt: Timestamp;
    };
  };
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 10.2 Usage Tracking Schema

```typescript
interface UsageRecord {
  organizationId: string;
  
  // Current period usage
  current: {
    period: {
      start: Timestamp;
      end: Timestamp;
    };
    
    // Storage
    storage: {
      usedBytes: number;
      fileCount: number;
      byType: {
        photos: number;
        reports: number;
        certificates: number;
        other: number;
      };
    };
    
    // Users
    users: {
      total: number;
      admins: number;
      inspectors: number;
      active: number;  // Logged in this month
    };
    
    // Clients
    clients: {
      total: number;
      active: number;  // Had inspection this month
    };
    
    // Monthly quotas
    inspections: number;
    reports: number;
    aiRequests: number;
    apiCalls: number;
  };
  
  // Daily snapshots (for graphs)
  daily: {
    [dateString: string]: {
      storage: number;
      inspections: number;
      reports: number;
      activeUsers: number;
    };
  };
  
  // Historical (monthly summaries)
  history: {
    [monthString: string]: {
      peakStorage: number;
      totalInspections: number;
      totalReports: number;
      activeUsers: number;
      activeClients: number;
    };
  };
  
  lastUpdated: Timestamp;
}
```

### 10.3 Payment Record Schema

```typescript
interface PaymentRecord {
  id: string;
  organizationId: string;
  subscriptionId: string;
  
  // Amount
  amount: {
    subtotal: number;
    tax: number;
    total: number;
    currency: 'ILS';
  };
  
  // Items charged
  items: {
    type: 'plan' | 'module' | 'addon' | 'upgrade' | 'prorate';
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  
  // Payment details
  payment: {
    method: 'credit_card' | 'bank_transfer';
    transactionId: string;
    last4?: string;
    approvalCode?: string;
  };
  
  // External invoice
  invoice: {
    provider: 'greeninvoice';
    invoiceId: string;
    invoiceNumber: string;
    invoiceUrl: string;
    receiptUrl: string;
  };
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  failureReason?: string;
  
  // Timestamps
  createdAt: Timestamp;
  completedAt?: Timestamp;
}
```

---

## 11. תרחישי שימוש

### תרחיש 1: לקוח חדש נרשם

```
1. לקוח נכנס לאתר ולוחץ "התחל בחינם"
2. ממלא פרטי רישום (שם, אימייל, חברה)
3. בוחר חבילה (נגיד Professional)
4. בוחר מודול (נגיד לייזר)
5. בוחר אחסון: "אחסון מנוהל" (ברירת מחדל)
6. מזין פרטי תשלום
7. מאשר ומשלם
8. מערכת:
   - יוצרת Organization
   - יוצרת User (Admin)
   - יוצרת Subscription עם:
     * plan: professional
     * modules: [laser]
     * storage: { mode: 'internal', quota: 50GB }
   - מחייבת בחשבונית ירוקה
   - שולחת אימייל ברוכים הבאים
9. לקוח מתחיל לעבוד
```

### תרחיש 2: לקוח מוסיף מודול

```
1. לקוח (Basic עם לייזר) רוצה להוסיף מודול אש
2. נכנס ל"ניהול מנוי" > "הוסף מודול"
3. בוחר "מודול אש - ₪99/חודש"
4. רואה חישוב Pro-rata:
   "היום 15/12, סיום מחזור 30/12 = 15 ימים
    חיוב מיידי: ₪49.50"
5. מאשר
6. מערכת:
   - מחייבת ₪49.50
   - מוסיפה module לרשימה
   - מעדכנת Claims של כל המשתמשים
   - שולחת אישור
7. מודול אש זמין מיד
8. מהחודש הבא - חיוב מלא
```

### תרחיש 3: לקוח מתקרב למגבלת אחסון

```
1. לקוח מגיע ל-80% אחסון (40GB מתוך 50GB)
2. מערכת שולחת התראה אוטומטית
3. לקוח רואה באנר בממשק
4. לקוח לוחץ "הוסף אחסון"
5. רואה אפשרויות:
   a. קנה אחסון נוסף (₪49/15GB)
   b. חבר Google Drive (חינם)
   c. נקה קבצים ישנים
6. לקוח בוחר "חבר Google Drive"
7. מתחבר עם OAuth
8. מערכת:
   - שומרת tokens מוצפנים
   - יוצרת תיקייה "Keren Laser"
   - מציעה להעביר קבצים קיימים
9. לקוח בוחר להעביר
10. מערכת מעבירה ברקע ומעדכנת metadata
11. אחסון פנימי מתפנה
```

### תרחיש 4: תשלום נכשל

```
1. יום חיוב - כרטיס אשראי נדחה
2. מערכת:
   - מעדכנת failedPaymentAttempts = 1
   - שולחת אימייל "תשלום נכשל"
   - מתזמנת retry ב-24 שעות
3. יום +1: retry נכשל שוב
   - failedPaymentAttempts = 2
   - אימייל נוסף
   - retry ב-48 שעות
4. יום +3: retry נכשל שוב
   - failedPaymentAttempts = 3
   - status = 'restricted'
   - אימייל + SMS: "החשבון הוגבל"
5. לקוח:
   - לא יכול ליצור ביקורות חדשות
   - יכול לצפות בנתונים קיימים
   - רואה באנר "עדכן פרטי תשלום"
6. לקוח מעדכן כרטיס
7. מערכת מנסה לחייב מחדש
8. הצלחה - status = 'active'
```

### תרחיש 5: דאונגרייד חבילה

```
1. לקוח Professional רוצה לרדת ל-Basic
2. מערכת בודקת:
   - יש לו 8 משתמשים, Basic מאפשר 3 ❌
   - יש לו 60 לקוחות, Basic מאפשר 25 ❌
   - יש לו 45GB, Basic מאפשר 10GB ❌
3. מציגה הודעה:
   "לפני הדאונגרייד, עליך:
    - להסיר 5 משתמשים
    - להסיר 35 לקוחות או להעביר לארכיון
    - לפנות 35GB אחסון או לחבר ענן חיצוני"
4. לקוח מבצע את הנדרש
5. מערכת מאשרת דאונגרייד
6. השינוי ייכנס לתוקף בסוף מחזור החיוב הנוכחי
7. מערכת שולחת אישור
```

---

## סיכום

מסמך זה מגדיר את מודל החבילות, האחסון והתהליכים האוטומטיים של Keren Laser.

**עקרונות מרכזיים:**
1. **גמישות** - הלקוח בונה את החבילה שמתאימה לו
2. **שקיפות** - אין עלויות נסתרות
3. **אוטומציה** - הכל עובד בלי התערבות ידנית
4. **בחירה** - אחסון פנימי או חיצוני לפי העדפה

**נקודות ליישום:**
- התחל עם אחסון פנימי בלבד
- הוסף חיבור Google Drive כשלב שני
- הוסף ספקי ענן נוספים לפי דרישה

---

**גרסה:** 1.0  
**תאריך:** דצמבר 2025

---

# 📋 נספח: המלצות אסטרטגיות נוספות

## נספח 1: חבילת Micro - לקוחות קטנים

### הבעיה
ממונה בטיחות עצמאי שמתחיל, עם 2-3 לקוחות, לא יכול להצדיק ₪149/חודש + מודול. הוא ישאר עם Excel.

### ההמלצה: כן, ליצור חבילת Micro

```
┌─────────────────────────────────────────────────────────────────┐
│  MICRO PLAN - "מתחילים"                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  מחיר: ₪79/חודש (כולל מודול אחד!)                              │
│                                                                 │
│  מה כלול:                                                       │
│  • 1 משתמש                                                      │
│  • 3 לקוחות קצה                                                 │
│  • 5 ביקורות/חודש                                               │
│  • 1GB אחסון (או חיבור ענן חיצוני)                              │
│  • מודול אחד לבחירה                                             │
│  • ללא Offline                                                  │
│  • ללא Client Portal                                            │
│  • תמיכה: קהילה + דוקומנטציה                                   │
│                                                                 │
│  מגבלות:                                                        │
│  • לא ניתן להוסיף משתמשים                                       │
│  • לא ניתן להוסיף מודולים (רק לשדרג חבילה)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### למה זה חכם:

| יתרון | הסבר |
|-------|------|
| **כניסה נמוכה** | ₪79 זה "קפה ועוגה" - קל להחליט |
| **משפך שיווקי** | מתחילים ב-Micro, גדלים ל-Starter |
| **תחרות** | מתחרים ב-Excel/Google Sheets |
| **Word of Mouth** | ממונים מדברים ביניהם |

### מתי ליישם:
**אחרי שיש 10+ לקוחות משלמים ב-Starter+.** קודם לוודא שהמוצר עובד.

---

## נספח 2: תשלום לפי שימוש (Pay-as-you-go)

### ההמלצה: לא כמודל עיקרי, כן כתוספת

```
┌─────────────────────────────────────────────────────────────────┐
│  מודל היברידי מומלץ                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  בסיס: מנוי קבוע (כמו היום)                                    │
│        ┌──────────────────────────────────────────┐            │
│        │ Professional: ₪599/חודש                  │            │
│        │ כולל: 200 ביקורות                        │            │
│        └──────────────────────────────────────────┘            │
│                          │                                      │
│                          ▼                                      │
│  תוספת: Overage Billing (חיוב על עודף)                         │
│        ┌──────────────────────────────────────────┐            │
│        │ ביקורת 201+: ₪15/ביקורת                  │            │
│        │ (במקום לחסום את המשתמש)                  │            │
│        └──────────────────────────────────────────┘            │
│                                                                 │
│  למה לא Full Pay-per-use?                                      │
│  ─────────────────────────                                      │
│  • קשה לתכנן תזרים מזומנים (לך וללקוח)                         │
│  • לקוחות "מפחדים" להשתמש (אפקט המונה)                         │
│  • מסובך לחשב ולהסביר                                          │
│  • לא מתאים לשוק הישראלי (אוהבים "הכל כלול")                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## נספח 3: מדיניות שמירת נתונים - לקוח שביטל

```
┌─────────────────────────────────────────────────────────────────┐
│  DATA RETENTION POLICY - לקוח שביטל                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  שלב 1: ביטול מנוי (יום 0)                                     │
│  ────────────────────────                                       │
│  • החשבון עובר ל-"Cancelled"                                   │
│  • גישה לצפייה בלבד (30 יום)                                   │
│  • לא ניתן ליצור ביקורות חדשות                                 │
│  • יכולת להוריד את כל הנתונים (Export)                         │
│                                                                 │
│  שלב 2: תום 30 יום                                             │
│  ──────────────────                                             │
│  • החשבון עובר ל-"Archived"                                    │
│  • אין גישה לממשק                                              │
│  • הנתונים עוברים ל-Cold Storage                               │
│  • נשלח אימייל: "הנתונים שלך בארכיון"                          │
│                                                                 │
│  שלב 3: שמירה לפי סוג נתון                                     │
│  ─────────────────────────                                      │
│  ┌─────────────────┬────────────┬─────────────────────────────┐│
│  │ סוג נתון        │ שמירה      │ סיבה                        ││
│  ├─────────────────┼────────────┼─────────────────────────────┤│
│  │ דוחות בטיחות   │ 7 שנים     │ דרישת רגולציה + אחריות     ││
│  │ רשומות הדרכה   │ 7 שנים     │ דרישת משרד העבודה          ││
│  │ נתוני קרינה    │ 30 שנה     │ דרישת משרד הבריאות         ││
│  │ Audit Log      │ 7 שנים     │ דרישה משפטית               ││
│  │ פרטי משתמשים   │ 90 יום     │ GDPR - מינימום נדרש        ││
│  │ תמונות ביקורת  │ 7 שנים     │ חלק מהדוח                   ││
│  │ הגדרות/לוגו    │ 90 יום     │ לא נדרש                     ││
│  └─────────────────┴────────────┴─────────────────────────────┘│
│                                                                 │
│  שלב 4: אפשרות חזרה                                            │
│  ──────────────────                                             │
│  • תוך 90 יום: שחזור מלא, ₪199 דמי הפעלה מחדש                 │
│  • 90 יום - שנה: שחזור חלקי (רק דוחות), ₪499                  │
│  • מעל שנה: לא ניתן לשחזר                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## נספח 4: Onboarding - הדרכה כחלק מהמנוי

```
┌─────────────────────────────────────────────────────────────────┐
│  ONBOARDING TIERS                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🥉 MICRO / STARTER - Self-Service                             │
│  ────────────────────────────────                               │
│  • Welcome email עם 3 צעדים ראשונים                            │
│  • Checklist אינטראקטיבי בדשבורד                               │
│  • סרטוני הדרכה (5-10 דקות כל אחד)                             │
│  • Knowledge Base עם חיפוש                                     │
│  • Tooltips בממשק                                              │
│  • אימיילים אוטומטיים: Day 1, 3, 7                             │
│  │                                                              │
│  │  עלות לך: אפס (חד פעמי ליצור)                               │
│  │                                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🥈 BASIC / PROFESSIONAL - Guided Onboarding                   │
│  ──────────────────────────────────────────                     │
│  כל מה שב-Self-Service, ועוד:                                  │
│  • שיחת Zoom של 30 דקות (חד פעמי)                              │
│  • הגדרה ראשונית ביחד (לוגו, חתימה, לקוח ראשון)                │
│  • צ'אט תמיכה לשבועיים הראשונים                                │
│  │                                                              │
│  │  עלות לך: ~30 דקות עבודה                                    │
│  │  ROI: פחות Churn, יותר Upsell                               │
│  │                                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🥇 ENTERPRISE - White Glove                                   │
│  ─────────────────────────────                                  │
│  כל מה שלמעלה, ועוד:                                           │
│  • Implementation Manager ייעודי                                │
│  • הדרכה לכל הצוות (עד 2 שעות)                                 │
│  • מיגרציה של נתונים קיימים                                    │
│  • Customization של תבניות                                     │
│  • Check-in חודשי לרבעון הראשון                                │
│  │                                                              │
│  │  עלות לך: 4-8 שעות עבודה                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

מדד הצלחה עיקרי:
══════════════════
Time to First Value (TTFV)
יעד: דוח ראשון תוך < 24 שעות מההרשמה
```

---

## נספח 5: תוכניות צמיחה

### Referral Program - חבר מביא חבר

```
┌─────────────────────────────────────────────────────────────────┐
│  REFERRAL PROGRAM                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  המודל:                                                         │
│  • מפנה מקבל: חודש חינם (או ₪100 זיכוי)                        │
│  • מופנה מקבל: 20% הנחה לחודש הראשון                           │
│                                                                 │
│  טכנית:                                                         │
│  • לכל לקוח referral code ייחודי                               │
│  • לינק: platform.com/r/ABC123                                 │
│  • Cookie 30 יום                                               │
│  • Attribution אוטומטי                                         │
│                                                                 │
│  למה עובד בשוק הזה:                                            │
│  • ממוני בטיחות = קהילה קטנה וצפופה                            │
│  • המלצה אישית = זהב                                           │
│  • עלות רכישה רגילה: ₪500-2,000                               │
│  • עלות דרך Referral: ₪149 (חודש חינם)                        │
│                                                                 │
│  מתי להפעיל: אחרי 20+ לקוחות מרוצים                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Pause Subscription - השהיית מנוי

```
┌─────────────────────────────────────────────────────────────────┐
│  PAUSE SUBSCRIPTION - במקום ביטול                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  כשלקוח רוצה לבטל, להציע:                                       │
│                                                                 │
│  "לפני שתעזוב - אולי רק צריך הפסקה?"                           │
│                                                                 │
│  • השהה ל: 1 / 2 / 3 חודשים                                    │
│  • ללא חיוב בתקופת ההשהיה                                      │
│  • הנתונים נשמרים                                              │
│  • חזרה אוטומטית בסוף התקופה                                   │
│  • ניתן לחזור מוקדם יותר                                       │
│                                                                 │
│  הגבלות:                                                        │
│  • מקסימום 3 חודשים                                           │
│  • פעם אחת ב-12 חודשים                                        │
│  • לא זמין ב-Micro                                            │
│                                                                 │
│  למה עובד:                                                      │
│  הרבה ביטולים הם בגלל עומס זמני, לא חוסר שביעות רצון          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## נספח 6: סיכום עדיפויות ליישום

```
┌─────────────────────────────────────────────────────────────────┐
│  IMPLEMENTATION PRIORITIES                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔴 עכשיו (Phase 2):                                           │
│  ─────────────────────                                          │
│  • Security Rules - הגנה על נתונים                             │
│  • Audit Log - תיעוד פעולות                                    │
│  • Onboarding אימיילים + Checklist                             │
│  • מדיניות Data Retention מוגדרת                               │
│                                                                 │
│  🟡 Phase 3:                                                    │
│  ────────────                                                   │
│  • Overage Billing - לא לחסום, לחייב על עודף                   │
│  • Pause Subscription - להציע לפני ביטול                       │
│  • Export אוטומטי - ללקוח שמבטל                                │
│                                                                 │
│  🟢 Phase 4+:                                                   │
│  ────────────                                                   │
│  • חבילת Micro - אחרי 10+ לקוחות                               │
│  • Referral Program - אחרי 20+ לקוחות מרוצים                   │
│  • מערכת קופונים - כשיש שיווק אקטיבי                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# 🏷️ המלצות לשם המערכת

## הבעיה עם "Keren Laser"

השם הנוכחי מגביל מכמה סיבות:
1. **צר מדי** - "Laser" מצמצם למודול אחד, בעוד המערכת כוללת אש, בטיחות כללית, הדרכות
2. **לא ברור** - "Keren" לא מעביר משמעות ברורה
3. **קשה לשיווק** - לא קליט, לא בינלאומי
4. **SEO חלש** - לא מכיל מילות מפתח רלוונטיות

---

## קריטריונים לשם טוב

| קריטריון | הסבר |
|----------|------|
| **קליט** | קל לזכור, קל להגות |
| **רחב** | לא מגביל לתחום אחד |
| **מקצועי** | משדר אמינות ורצינות |
| **זמין** | דומיין פנוי, אין סימן מסחרי |
| **בינלאומי** | עובד גם באנגלית (לעתיד) |
| **SEO-friendly** | מכיל מילות מפתח או קל למתג |

---

## המלצות לשמות

### קטגוריה א': שמות עבריים מודרניים

```
┌─────────────────────────────────────────────────────────────────┐
│  1. מגן (MAGEN)                                                │
│  ─────────────                                                  │
│  • משמעות: הגנה, בטיחות                                        │
│  • יתרונות: עברי, חזק, קל לזכור                                │
│  • דומיין: magen.io / magen-safety.com                        │
│  • לוגו: מגן דוד מעוצב / מגן מודרני                            │
│  • סלוגן: "מגן - הבטיחות שלך בענן"                             │
│                                                                 │
│  ציון: ⭐⭐⭐⭐⭐                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  2. שומר (SHOMER)                                              │
│  ──────────────                                                 │
│  • משמעות: שומר, משמר                                          │
│  • יתרונות: מעביר תחושת שמירה והגנה                            │
│  • דומיין: shomer.co.il / shomer-safety.com                   │
│  • לוגו: עין/מגדל שמירה מעוצב                                  │
│  • סלוגן: "שומר - על הבטיחות שלך"                              │
│                                                                 │
│  ציון: ⭐⭐⭐⭐                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  3. בטוח (BATUACH)                                             │
│  ──────────────────                                             │
│  • משמעות: בטוח, מאובטח                                        │
│  • יתרונות: ישיר, ברור, מעביר את המסר                          │
│  • דומיין: batuach.io / batuach.co.il                         │
│  • לוגו: וי ירוק / סימן בטיחות                                 │
│  • סלוגן: "בטוח - ניהול בטיחות חכם"                            │
│                                                                 │
│  ציון: ⭐⭐⭐⭐                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### קטגוריה ב': שמות אנגליים/בינלאומיים

```
┌─────────────────────────────────────────────────────────────────┐
│  4. SafetyHub                                                  │
│  ─────────────                                                  │
│  • משמעות: מרכז הבטיחות                                        │
│  • יתרונות: ברור, מקצועי, בינלאומי                             │
│  • דומיין: safetyhub.io / safetyhub.co.il                     │
│  • לוגו: Hub גרפי עם אלמנט בטיחות                              │
│  • סלוגן: "Your Safety Command Center"                         │
│                                                                 │
│  ציון: ⭐⭐⭐⭐                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  5. Safelio                                                    │
│  ──────────                                                     │
│  • משמעות: שילוב Safe + io (טכנולוגי)                          │
│  • יתרונות: קליט, מודרני, טכנולוגי                             │
│  • דומיין: safelio.com / safelio.io                           │
│  • לוגו: S מעוצב עם מגן                                        │
│  • סלוגן: "Safety, Simplified"                                 │
│                                                                 │
│  ציון: ⭐⭐⭐⭐⭐                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  6. Guardix                                                    │
│  ──────────                                                     │
│  • משמעות: Guard (שומר) + ix (טכנולוגי)                        │
│  • יתרונות: ייחודי, חזק, מקצועי                                │
│  • דומיין: guardix.io / guardix.com                           │
│  • לוגו: מגן עם X                                              │
│  • סלוגן: "Guard Your Safety"                                  │
│                                                                 │
│  ציון: ⭐⭐⭐⭐                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  7. CompliSafe                                                 │
│  ─────────────                                                  │
│  • משמעות: Compliance + Safe                                   │
│  • יתרונות: מדגיש עמידה ברגולציה                               │
│  • דומיין: complisafe.com / complisafe.io                     │
│  • לוגו: צ'ק מארק עם מגן                                       │
│  • סלוגן: "Compliance Made Safe"                               │
│                                                                 │
│  ציון: ⭐⭐⭐                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### קטגוריה ג': שילובים יצירתיים

```
┌─────────────────────────────────────────────────────────────────┐
│  8. SafeField (המלצה חזקה)                                     │
│  ──────────────────────────                                     │
│  • משמעות: שטח בטוח / בטיחות בשטח                              │
│  • יתרונות:                                                     │
│    - מתאר את השימוש (עבודת שטח)                                │
│    - מקצועי ובינלאומי                                          │
│    - קל להגות בעברית ובאנגלית                                  │
│    - דומיין צפוי להיות פנוי                                    │
│  • דומיין: safefield.io / safefield.co.il                     │
│  • לוגו: שדה/מפה עם סימן בטיחות                                │
│  • סלוגן: "בטיחות בשטח, ניהול בענן"                            │
│                                                                 │
│  ציון: ⭐⭐⭐⭐⭐                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  9. Inspecta                                                   │
│  ────────────                                                   │
│  • משמעות: מבוסס על Inspect (ביקורת)                           │
│  • יתרונות: מתאר את הפעילות המרכזית                            │
│  • דומיין: inspecta.io / inspecta.co.il                       │
│  • לוגו: זכוכית מגדלת מעוצבת                                   │
│  • סלוגן: "ביקורת חכמה, בטיחות מלאה"                           │
│                                                                 │
│  ציון: ⭐⭐⭐⭐                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  10. Mazor Pro (שדרוג לשם הקיים)                               │
│  ──────────────────────────────────                             │
│  • משמעות: מזור = ריפוי/תיקון (מונע תאונות)                   │
│  • יתרונות:                                                     │
│    - שומר על המותג הקיים                                       │
│    - מוסיף "Pro" למקצועיות                                     │
│    - עברי אבל בינלאומי                                         │
│  • דומיין: mazorpro.com / mazor-safety.com                    │
│  • לוגו: שדרוג הלוגו הקיים                                     │
│  • סלוגן: "מזור - מונעים סכנות, לא רק מטפלים"                  │
│                                                                 │
│  ציון: ⭐⭐⭐⭐                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## טבלת השוואה מסכמת

| שם | קליטות | רוחב | מקצועיות | בינלאומי | זמינות* | ציון |
|----|--------|------|----------|----------|---------|------|
| **Safelio** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | לבדוק | **19** |
| **SafeField** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | לבדוק | **19** |
| **מגן (MAGEN)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | לבדוק | **17** |
| **Guardix** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | לבדוק | **17** |
| **Mazor Pro** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | קיים | **15** |
| **Inspecta** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | לבדוק | **15** |

*זמינות דומיין - יש לבדוק לפני החלטה סופית

---

## ההמלצה שלי

### Top 3 לבחירה:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  🥇 מקום ראשון: SafeField                                      │
│  ─────────────────────────                                      │
│  למה: משלב את שני העולמות - "Safe" (בטיחות) ו-"Field"         │
│  (שטח). מתאר בדיוק את מה שהמערכת עושה - ניהול בטיחות           │
│  לעבודת שטח. נשמע מקצועי, בינלאומי, וקל לזכור.                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         SAFEFIELD                                       │   │
│  │         בטיחות בשטח, ניהול בענן                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🥈 מקום שני: Safelio                                          │
│  ───────────────────                                            │
│  למה: קליט, מודרני, טכנולוגי. ה-"io" נותן תחושת SaaS.         │
│  קל להגות ולזכור. מתאים לסטארטאפ.                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🥉 מקום שלישי: מגן (MAGEN)                                    │
│  ──────────────────────────                                     │
│  למה: אם רוצים להישאר עבריים. השם "מגן" חזק, ברור,            │
│  ומעביר את המסר. אפשר לכתוב באנגלית MAGEN ועדיין לעבוד.       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## צעדים הבאים לבחירת שם

1. **בדוק זמינות דומיין** - namecheap.com / godaddy.com
2. **בדוק סימני מסחר** - אתר רשם הפטנטים הישראלי + USPTO
3. **בדוק רשתות חברתיות** - האם @safefield פנוי?
4. **קבל פידבק** - שאל 5-10 ממוני בטיחות מה נשמע יותר מקצועי
5. **תעשה A/B Test** - Landing page עם שני שמות ותראה מה ממיר יותר

---

**נכתב ועודכן:** דצמבר 2025  
**גרסת מסמך:** 3.0 - Master Document  
**סה"כ עמודים:** ~150 עמודים

---

# 🎯 סיכום מנהלים

מסמך זה מהווה את **אבן הדרך המרכזית** לפיתוח והשקת פלטפורמת ניהול הבטיחות.

## מה כלול:
- ✅ חזון ואסטרטגיה עסקית
- ✅ ארכיטקטורה טכנית מלאה
- ✅ מודל חבילות ותמחור
- ✅ ניהול אחסון (פנימי וחיצוני)
- ✅ אבטחת מידע ורגולציה
- ✅ תהליכי Onboarding וצמיחה
- ✅ Roadmap מפורט
- ✅ המלצות לשם המערכת

## הצעדים הבאים:
1. 🔴 השלמת Phase 1 (PDF, Dashboard)
2. 🔴 Phase 2: Security + Multi-tenancy
3. 🟡 בחירת שם סופי
4. 🟡 10 לקוחות משלמים ראשונים
5. 🟢 Phase 3: Billing + Client Portal

**בהצלחה! 🚀**
