# ⚠️ Phase 5: Findings & Escalation - AEGIS Platform

## 📋 סקירה כללית

**שם המודול:** Findings & Escalation (ליקויים ואסקלציה)  
**מטרה:** ניהול ליקויים, מעקב תיקונים ותהליכי אסקלציה אוטומטיים  
**תלויות:** Phase 1 (Foundation), Phase 4 (Inspections)  
**זמן פיתוח משוער:** 6-7 שבועות  

---

## 🎯 מה כולל המודול

| רכיב | תיאור | עדיפות |
|------|--------|--------|
| Findings List | רשימת ליקויים | 🔴 קריטי |
| Finding Detail | צפייה ועריכת ליקוי | 🔴 קריטי |
| Correction Submission | העלאת תיקון ע"י לקוח | 🔴 קריטי |
| Approval Workflow | אישור/דחיית תיקון | 🔴 קריטי |
| Escalation Engine | מנוע אסקלציה אוטומטי | 🔴 קריטי |
| Severity Levels | רמות חומרה | 🔴 קריטי |
| Notifications | התראות ותזכורות | 🔴 קריטי |
| History & Audit | היסטוריה מלאה | 🟠 גבוה |
| Dashboard & Reports | דשבורד וסטטיסטיקות | 🟡 בינוני |

---

## 🚨 רמות חומרה

| רמה | שם | צבע | זמן ברירת מחדל | דוגמאות |
|-----|-----|-----|----------------|---------|
| 🔴 | **קריטי** | אדום | 48 שעות | סכנת חיים, חשיפה לקרינה, אינטרלוק לא עובד |
| 🟠 | **גבוה** | כתום | 7 ימים | ציוד מגן חסר, שילוט אזהרה פגום |
| 🟡 | **בינוני** | צהוב | 30 ימים | תיעוד חסר, שלט דהוי |
| 🟢 | **נמוך** | ירוק | 90 ימים | שיפורים מומלצים, עדכון נהלים |

---

## 🔄 מחזור חיים של ליקוי

```
┌─────────────────────────────────────────────────────────────────┐
│                      Finding Lifecycle                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │          │    │          │    │          │    │          │  │
│  │  פתוח    │───▶│  ממתין   │───▶│  נסגר    │    │  באיחור  │  │
│  │   Open   │    │ לאישור   │    │  Closed  │    │ Overdue  │  │
│  │          │    │ Pending  │    │          │    │          │  │
│  └──────────┘    └────┬─────┘    └──────────┘    └──────────┘  │
│       │               │               ▲               ▲         │
│       │               │               │               │         │
│       │         ┌─────┴─────┐         │               │         │
│       │         ▼           ▼         │               │         │
│       │    ┌────────┐  ┌────────┐     │               │         │
│       │    │        │  │        │     │               │         │
│       │    │ אושר   │──│  נדחה  │─────┘               │         │
│       │    │Approved│  │Rejected│                     │         │
│       │    │        │  │        │                     │         │
│       │    └────────┘  └───┬────┘                     │         │
│       │                    │                          │         │
│       │                    └──────────────────────────┘         │
│       │                         (חוזר לפתוח)                    │
│       │                                                         │
│       └──────────(עובר dueDate)───────────────────────▶         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 סטטוסים

| סטטוס | תיאור | צבע | פעולות |
|-------|-------|-----|--------|
| `open` | ליקוי פתוח, ממתין לטיפול הלקוח | אדום | לקוח יכול להעלות תיקון |
| `pending_review` | לקוח העלה תיקון, ממתין לאישור | צהוב | ממונה יכול לאשר/לדחות |
| `approved` | תיקון אושר, ממתין לסגירה סופית | כחול | ממונה יכול לסגור |
| `rejected` | תיקון נדחה, חוזר ללקוח | כתום | לקוח יכול להעלות שוב |
| `closed` | ליקוי נסגר | ירוק | צפייה בלבד |
| `overdue` | עבר זמן הטיפול | אדום כהה | כל הפעולות + אסקלציה פעילה |

---

## 📈 תהליך אסקלציה

```
┌─────────────────────────────────────────────────────────────────┐
│                 🔺 Escalation Process                           │
│                                                                 │
│  ליקוי 🟠 גבוה - זמן לטיפול: 7 ימים                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📅 יום 0: ליקוי נפתח                                          │
│  ────────────────────────────────────────────────────────────── │
│  📧 הודעה לאחראי תחום (רמה 1)                                  │
│     + העתק לממונה בטיחות                                       │
│                                                                 │
│  📅 יום 3: תזכורת ראשונה (אין מענה)                            │
│  ────────────────────────────────────────────────────────────── │
│  📧 תזכורת לאחראי תחום                                         │
│     ⚠️ "נותרו 4 ימים לטיפול"                                   │
│                                                                 │
│  📅 יום 5: אסקלציה רמה 2 (אין מענה)                            │
│  ────────────────────────────────────────────────────────────── │
│  🔺 הודעה למנהל ישיר (רמה 2)                                   │
│     📧 "ליקוי לא טופל - נדרשת התערבותך"                        │
│     ⚠️ "נותרו 2 ימים"                                          │
│                                                                 │
│  📅 יום 6: אסקלציה רמה 3 (אין מענה)                            │
│  ────────────────────────────────────────────────────────────── │
│  🔺🔺 הודעה למנכ"ל (רמה 3)                                     │
│     📧 "התראה: ליקוי בטיחות לא טופל!"                          │
│     ⚠️ "נותר יום אחד"                                          │
│                                                                 │
│  📅 יום 7+: OVERDUE                                             │
│  ────────────────────────────────────────────────────────────── │
│  🚨 status: open → overdue                                      │
│  📧 הודעה יומית לכל הרמות                                      │
│  📧 הודעה לממונה בטיחות (בעל המערכת)                           │
│  ⚠️ סימון באדום בדשבורד                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⏰ טבלת זמני אסקלציה (ברירת מחדל)

| חומרה | זמן כולל | תזכורת 1 | אסקלציה רמה 2 | אסקלציה רמה 3 | OVERDUE |
|--------|---------|----------|---------------|---------------|---------|
| 🔴 קריטי | 48 שעות | 12 שעות | 24 שעות | 36 שעות | 48 שעות |
| 🟠 גבוה | 7 ימים | 3 ימים | 5 ימים | 6 ימים | 7 ימים |
| 🟡 בינוני | 30 ימים | 14 ימים | 21 ימים | 27 ימים | 30 ימים |
| 🟢 נמוך | 90 ימים | 45 ימים | 70 ימים | 85 ימים | 90 ימים |

**חשוב:** הזמנים ניתנים להתאמה לכל לקוח בנפרד!

---

## 📊 מבנה נתונים (Database Schema)

### 1. Findings Collection
**נתיב:** `/tenants/{tenantId}/clients/{clientId}/findings/{findingId}`

```typescript
interface Finding {
  id: string;
  tenantId: string;
  clientId: string;
  
  // מקור הליקוי
  source: {
    type: 'inspection' | 'safety_file' | 'manual' | 'client_report';
    inspectionId?: string;
    safetyFileId?: string;
    checklistItemId?: string;
  };
  
  // פרטי הליקוי
  title: string;                   // "שילוט אזהרה דהוי"
  description: string;             // תיאור מפורט
  category: string;                // קטגוריה (שילוט, ציוד מגן, תיעוד...)
  location?: string;               // מיקום בחברה
  
  // חומרה
  severity: FindingSeverity;
  
  // סטטוס
  status: FindingStatus;
  
  // זמנים
  dueDate: Timestamp;              // תאריך יעד לטיפול
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
  closedAt?: Timestamp;
  
  // אחראי נוכחי
  assignedTo: {
    contactId: string;
    contactName: string;
    contactEmail: string;
    escalationLevel: 1 | 2 | 3;
  };
  
  // אסקלציה
  escalation: {
    currentLevel: 1 | 2 | 3;
    history: EscalationEvent[];
    lastEscalatedAt?: Timestamp;
    isOverdue: boolean;
    overdueNotificationsSent: number;
  };
  
  // תיקונים
  corrections: Correction[];
  
  // תמונות
  photos: FindingPhoto[];
  
  // היסטוריה
  history: FindingHistoryEntry[];
  
  // מטא
  createdBy: string;
  createdByName: string;
  
  // נתונים נוספים
  internalNotes?: string;          // הערות פנימיות (לא נראות ללקוח)
  clientVisible: boolean;          // האם הלקוח רואה את הליקוי
}

type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';

type FindingStatus = 
  | 'open'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'closed'
  | 'overdue';
```

### 2. Corrections
```typescript
interface Correction {
  id: string;
  findingId: string;
  
  // מי הגיש
  submittedBy: {
    contactId: string;
    contactName: string;
    contactEmail: string;
  };
  
  // פרטי התיקון
  description: string;             // תיאור מה תוקן
  photos: CorrectionPhoto[];       // תמונות התיקון
  attachments?: Attachment[];      // קבצים מצורפים
  
  // סטטוס
  status: 'pending' | 'approved' | 'rejected';
  
  // תגובת הממונה
  review?: {
    reviewedAt: Timestamp;
    reviewedBy: string;
    reviewerName: string;
    decision: 'approved' | 'rejected';
    comments?: string;
  };
  
  // זמנים
  submittedAt: Timestamp;
}
```

### 3. Escalation Events
```typescript
interface EscalationEvent {
  id: string;
  
  // מתי ולמה
  timestamp: Timestamp;
  reason: 'scheduled' | 'no_response' | 'manual' | 'overdue';
  
  // לאיזו רמה
  fromLevel: 1 | 2 | 3;
  toLevel: 1 | 2 | 3;
  
  // למי נשלח
  notifiedContacts: {
    contactId: string;
    contactName: string;
    contactEmail: string;
    notificationSent: boolean;
    notificationChannel: 'email' | 'whatsapp' | 'sms';
  }[];
  
  // הערות
  notes?: string;
  
  // מי יזם (אם ידני)
  triggeredBy?: string;
}
```

### 4. Finding History
```typescript
interface FindingHistoryEntry {
  id: string;
  timestamp: Timestamp;
  
  // מי עשה
  userId: string;
  userName: string;
  userType: 'tenant_user' | 'client_contact';
  
  // מה קרה
  action: 
    | 'created'
    | 'updated'
    | 'status_changed'
    | 'assigned'
    | 'escalated'
    | 'correction_submitted'
    | 'correction_approved'
    | 'correction_rejected'
    | 'closed'
    | 'reopened'
    | 'comment_added';
  
  // פרטים
  details: {
    previousValue?: any;
    newValue?: any;
    comment?: string;
  };
}
```

### 5. Client Escalation Settings
**נתיב:** `/tenants/{tenantId}/clients/{clientId}` (חלק מ-Client)

```typescript
interface ClientEscalationSettings {
  // הגדרות לפי חומרה
  critical: EscalationTiming;
  high: EscalationTiming;
  medium: EscalationTiming;
  low: EscalationTiming;
  
  // הגדרות כלליות
  notifyOnNewFinding: boolean;
  notifyOnOverdue: boolean;
  dailyOverdueReminder: boolean;
  notifyExternalOfficer: boolean;  // לשלוח גם לממונה החיצוני
}

interface EscalationTiming {
  totalTimeHours: number;          // זמן כולל לטיפול
  firstReminderHours: number;      // תזכורת ראשונה
  escalateLevel2Hours: number;     // אסקלציה לרמה 2
  escalateLevel3Hours: number;     // אסקלציה לרמה 3
}
```

---

## 🖥️ ממשקים (UI Screens)

### Admin Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| All Findings | `/admin/findings` | כל הליקויים (כל הלקוחות) |
| Client Findings | `/admin/clients/:clientId/findings` | ליקויים ללקוח |
| Finding Detail | `/admin/findings/:id` | צפייה/עריכת ליקוי |
| Create Finding | `/admin/findings/new` | יצירת ליקוי ידני |
| Review Correction | `/admin/findings/:id/review` | בדיקת תיקון |
| Overdue Dashboard | `/admin/findings/overdue` | ליקויים באיחור |

### Client Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| My Findings | `/portal/findings` | הליקויים שלי |
| Finding Detail | `/portal/findings/:id` | צפייה בליקוי |
| Submit Correction | `/portal/findings/:id/submit` | העלאת תיקון |

---

## 🎨 עיצוב מסכים

### רשימת ליקויים (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ ליקויים                                   [+ ליקוי חדש]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  סטטוס: 🔴 5 באיחור  🟡 8 ממתינים  🟢 23 סגורים               │
│                                                                 │
│  🔍 [חיפוש...____]  לקוח: [הכל ▼]  חומרה: [הכל ▼]  סטטוס: [פתוחים ▼] │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  🔴 באיחור                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔴 אינטרלוק לא פעיל                         ⏰ +3 ימים │   │
│  │                                                         │   │
│  │ 🏢 רול פרופיל    🔴 קריטי    📅 28/12/2025              │   │
│  │ 👤 אחראי: אלכס באומל (רמה 3 - מנכ"ל)                   │   │
│  │                                                         │   │
│  │ 🔺 אסקלציה מלאה - הודעה יומית                          │   │
│  │                                              [טפל →]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  🟡 ממתין לאישור                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟠 שילוט אזהרה דהוי                        📷 2 תמונות │   │
│  │                                                         │   │
│  │ 🏢 ABC תעשיות    🟠 גבוה    📅 יעד: 05/01/2026          │   │
│  │ 👤 הוגש ע"י: עדי דובלרו                                │   │
│  │                                                         │   │
│  │ 💬 "הוחלף שלט חדש, מצורפות תמונות"                      │   │
│  │                                    [❌ דחה] [✅ אשר]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  🔵 פתוחים                                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟡 תיעוד הדרכה חסר                        ⏰ 15 ימים    │   │
│  │                                                         │   │
│  │ 🏢 XYZ בע"מ    🟡 בינוני    📅 יעד: 15/01/2026          │   │
│  │ 👤 אחראי: משה כהן (רמה 1)                              │   │
│  │                                                         │   │
│  │ 📧 נשלחה הודעה ב-30/12/2025                             │   │
│  │                                              [צפה →]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### פרטי ליקוי (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ שילוט אזהרה דהוי                               [← חזור]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────┐  ┌─────────────────────────┐│
│  │ 📋 פרטי הליקוי                │  │ 📊 סטטוס                ││
│  │                               │  │                         ││
│  │ 🏢 לקוח: רול פרופיל בע"מ     │  │ 🟡 ממתין לאישור         ││
│  │ 📍 מיקום: אזור הלייזר        │  │                         ││
│  │ 📅 נוצר: 25/12/2025          │  │ ⏰ נותרו: 4 ימים        ││
│  │ 👤 יוצר: מישל מזור           │  │ 📅 יעד: 05/01/2026      ││
│  │                               │  │                         ││
│  │ 🔴 חומרה: גבוה               │  │ 🔺 רמת אסקלציה: 1       ││
│  │ 🏷️ קטגוריה: שילוט            │  │                         ││
│  └───────────────────────────────┘  └─────────────────────────┘│
│                                                                 │
│  📝 תיאור                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  שלט האזהרה באזור הלייזר דהוי וקשה לקריאה.                     │
│  יש להחליף לשלט חדש בהתאם לתקן.                                │
│                                                                 │
│  📷 תמונות                                                     │
│  ─────────────────────────────────────────────────────────────  │
│  ┌────────┐ ┌────────┐                                         │
│  │  📷    │ │  📷    │                                         │
│  │ תמונה1 │ │ תמונה2 │                                         │
│  └────────┘ └────────┘                                         │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📤 תיקון שהוגש                                    30/12/2025  │
│  ─────────────────────────────────────────────────────────────  │
│  👤 הוגש ע"י: עדי דובלרו (ממונה בטיחות)                        │
│                                                                 │
│  💬 "הוחלף שלט אזהרה חדש בהתאם לתקן. מצורפות תמונות של השלט    │
│     החדש לפני ואחרי ההתקנה."                                   │
│                                                                 │
│  📷 תמונות התיקון                                              │
│  ┌────────┐ ┌────────┐                                         │
│  │  📷    │ │  📷    │                                         │
│  │ לפני   │ │ אחרי   │                                         │
│  └────────┘ └────────┘                                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📝 הערות לדחייה (אופציונלי):                            │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │                                                     │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │              [❌ דחה תיקון]    [✅ אשר וסגור]           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📜 היסטוריה                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  30/12 10:45  עדי דובלרו הגיש תיקון                            │
│  28/12 09:00  📧 תזכורת נשלחה לאלכס באומל                      │
│  25/12 14:30  📧 הודעה נשלחה לאלכס באומל                       │
│  25/12 14:30  מישל מזור יצר את הליקוי                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### הגשת תיקון (Client Portal)

```
┌─────────────────────────────────────────────────────────────────┐
│  📤 הגשת תיקון                                     [← חזור]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⚠️ שילוט אזהרה דהוי                                           │
│  חומרה: 🟠 גבוה    יעד: 05/01/2026    נותרו: 6 ימים            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📝 תאר את התיקון שבוצע: *                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ הוחלף שלט אזהרה חדש בהתאם לתקן. השלט הותקן במיקום       │   │
│  │ הנדרש ונבדק שהוא נראה וברור לכל העובדים.               │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📷 תמונות (חובה לפחות אחת): *                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  ┌────────┐  ┌────────┐  ┌────────────┐                │   │
│  │  │  📷    │  │  📷    │  │            │                │   │
│  │  │ תמונה1 │  │ תמונה2 │  │  + הוסף    │                │   │
│  │  │  [🗑️]  │  │  [🗑️]  │  │   תמונה    │                │   │
│  │  └────────┘  └────────┘  └────────────┘                │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📎 קבצים נוספים (אופציונלי):                                  │
│  [+ העלה קובץ]                                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ☑️ אני מאשר/ת שהתיקון בוצע בהתאם לדרישות                      │
│                                                                 │
│  [ביטול]                                      [📤 שלח תיקון]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### דשבורד ליקויים באיחור

```
┌─────────────────────────────────────────────────────────────────┐
│  🚨 ליקויים באיחור                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📊 סיכום                                               │   │
│  │                                                         │   │
│  │  🔴 5 באיחור    ⏰ 3 יפוגו היום    📧 12 הודעות נשלחו    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  לפי לקוח                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🏢 רול פרופיל בע"מ                                  3 באיחור │
│  ├── 🔴 אינטרלוק לא פעיל (+3 ימים) - קריטי                    │
│  ├── 🟠 ציוד מגן חסר (+1 יום) - גבוה                          │
│  └── 🟡 תיעוד הדרכה (+5 ימים) - בינוני                        │
│                                                                 │
│  🏢 ABC תעשיות                                       2 באיחור │
│  ├── 🟠 שילוט אזהרה (+2 ימים) - גבוה                          │
│  └── 🟡 בדיקת מטפים (+10 ימים) - בינוני                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  פעולות מהירות                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [📧 שלח תזכורת לכולם]  [📊 ייצא דוח]  [📞 רשימת טלפונים]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 תהליכי עבודה (Workflows)

### 1. יצירת ליקוי מביקורת

```
┌─────────────────────────────────────────────────────────────────┐
│  1. בזמן ביקורת - פריט מסומן כ"לא תקין"                        │
│                              ↓                                  │
│  2. הזנת פרטים                                                 │
│     ├── תיאור                                                  │
│     ├── חומרה                                                  │
│     ├── תמונות                                                 │
│     └── מיקום                                                  │
│                              ↓                                  │
│  3. נוצר Finding                                                │
│     ├── status: open                                           │
│     ├── source: { type: 'inspection', inspectionId }           │
│     ├── dueDate = now + severityTime                           │
│     └── assignedTo = Contact רמה 1                             │
│                              ↓                                  │
│  4. שליחת התראות                                               │
│     ├── Email לאחראי (רמה 1)                                   │
│     ├── Email העתק לממונה בטיחות                               │
│     └── WhatsApp (אם מופעל)                                    │
│                              ↓                                  │
│  5. תזמון אסקלציות                                             │
│     └── Cloud Function מתזמנת בדיקות עתידיות                   │
│                              ↓                                  │
│  6. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2. הגשת תיקון ע"י לקוח

```
┌─────────────────────────────────────────────────────────────────┐
│  1. לקוח נכנס לפורטל                                           │
│     └── רואה ליקויים פתוחים                                    │
│                              ↓                                  │
│  2. בוחר ליקוי ולוחץ "הגש תיקון"                               │
│                              ↓                                  │
│  3. ממלא פרטים                                                 │
│     ├── תיאור התיקון                                           │
│     ├── מעלה תמונות                                            │
│     └── מצרף קבצים (אופציונלי)                                 │
│                              ↓                                  │
│  4. נוצר Correction                                             │
│     └── status: pending                                        │
│                              ↓                                  │
│  5. Finding מתעדכן                                              │
│     └── status: open → pending_review                          │
│                              ↓                                  │
│  6. התראה לממונה                                               │
│     └── "תיקון הוגש לליקוי X - ממתין לאישורך"                  │
│                              ↓                                  │
│  7. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 3. אישור/דחיית תיקון

```
┌─────────────────────────────────────────────────────────────────┐
│  ממונה בטיחות בודק את התיקון                                   │
│                              ↓                                  │
│            ┌────────────────┴────────────────┐                  │
│            ↓                                 ↓                  │
│        ✅ אישור                          ❌ דחייה              │
│            │                                 │                  │
│            ↓                                 ↓                  │
│  Correction.status = approved       Correction.status = rejected│
│  Finding.status = approved          Finding.status = rejected   │
│            │                                 │                  │
│            ↓                                 ↓                  │
│  ממונה יכול לסגור                   Finding.status = open       │
│  Finding.status = closed            (חוזר לפתוח)               │
│            │                                 │                  │
│            ↓                                 ↓                  │
│  התראה ללקוח:                       התראה ללקוח:               │
│  "התיקון אושר ✅"                   "התיקון נדחה ❌"            │
│                                     + סיבת הדחייה               │
│            │                                 │                  │
│            ↓                                 ↓                  │
│     Audit Log                          Audit Log               │
└─────────────────────────────────────────────────────────────────┘
```

### 4. תהליך אסקלציה אוטומטי (Cloud Function)

```
┌─────────────────────────────────────────────────────────────────┐
│  Cloud Function - כל שעה                                       │
│                              ↓                                  │
│  1. שליפת ליקויים פתוחים                                       │
│     └── status in ['open', 'rejected']                         │
│                              ↓                                  │
│  2. לכל ליקוי - בדיקת זמנים                                    │
│     ├── האם הגיע זמן תזכורת?                                   │
│     ├── האם הגיע זמן אסקלציה רמה 2?                            │
│     ├── האם הגיע זמן אסקלציה רמה 3?                            │
│     └── האם עבר dueDate (overdue)?                             │
│                              ↓                                  │
│  3. לפי הצורך:                                                 │
│     ├── שליחת תזכורת                                           │
│     ├── העברה לרמה הבאה                                        │
│     ├── שינוי סטטוס ל-overdue                                  │
│     └── עדכון escalation.history                               │
│                              ↓                                  │
│  4. שליחת התראות                                               │
│     ├── Email                                                  │
│     └── WhatsApp                                               │
│                              ↓                                  │
│  5. Audit Log לכל פעולה                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 מבנה קבצים

```
frontend/src/
├── types/
│   └── finding.ts                 # Finding, Correction, Escalation, etc.
│
├── hooks/
│   ├── useFindings.ts             # CRUD findings
│   ├── useFinding.ts              # Single finding operations
│   ├── useCorrections.ts          # הגשת ובדיקת תיקונים
│   ├── useEscalation.ts           # פעולות אסקלציה
│   └── useFindingsStats.ts        # סטטיסטיקות
│
├── pages/admin/
│   └── findings/
│       ├── FindingsPage.tsx           # רשימת ליקויים
│       ├── FindingDetailPage.tsx      # פרטי ליקוי
│       ├── CreateFindingPage.tsx      # יצירת ליקוי ידני
│       ├── ReviewCorrectionPage.tsx   # בדיקת תיקון
│       ├── OverdueDashboardPage.tsx   # דשבורד באיחור
│       └── FindingsStatsPage.tsx      # סטטיסטיקות
│
├── pages/portal/
│   └── findings/
│       ├── MyFindingsPage.tsx         # הליקויים שלי
│       ├── FindingDetailPage.tsx      # צפייה בליקוי
│       └── SubmitCorrectionPage.tsx   # הגשת תיקון
│
├── components/
│   └── findings/
│       ├── FindingCard.tsx
│       ├── FindingSeverityBadge.tsx
│       ├── FindingStatusBadge.tsx
│       ├── FindingTimeline.tsx        # היסטוריה
│       ├── EscalationIndicator.tsx    # מד אסקלציה
│       ├── CorrectionForm.tsx         # טופס הגשת תיקון
│       ├── CorrectionReview.tsx       # בדיקת תיקון
│       ├── PhotoUploader.tsx
│       ├── PhotoGallery.tsx
│       ├── OverdueAlert.tsx
│       └── FindingsStats.tsx          # גרפים וסטטיסטיקות
│
└── utils/
    ├── escalationCalculator.ts    # חישוב זמני אסקלציה
    └── findingStatus.ts           # לוגיקת סטטוסים
```

---

## ☁️ Cloud Functions

```typescript
// functions/src/findings/escalation.ts

// רץ כל שעה
export const processEscalations = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    // 1. שליפת ליקויים פתוחים
    // 2. בדיקת זמנים
    // 3. שליחת התראות
    // 4. עדכון סטטוסים
  });

// רץ כל בוקר ב-08:00
export const dailyOverdueReminder = functions.pubsub
  .schedule('0 8 * * *')
  .timeZone('Asia/Jerusalem')
  .onRun(async (context) => {
    // שליחת תזכורת יומית על ליקויים באיחור
  });

// Trigger על שינוי סטטוס
export const onFindingStatusChange = functions.firestore
  .document('tenants/{tenantId}/clients/{clientId}/findings/{findingId}')
  .onUpdate(async (change, context) => {
    // בדיקה אם הסטטוס השתנה ושליחת התראות
  });
```

---

## 🔥 Firestore Security Rules (הוספה)

```javascript
// בתוך /tenants/{tenantId}/clients/{clientId}
match /findings/{findingId} {
  // קריאה - גם Tenant users וגם Client contacts
  allow read: if isTenantMember(tenantId) && canViewClient(tenantId, clientId)
              || isClientContact(clientId);
  
  // יצירה - רק Tenant users
  allow create: if isTenantMember(tenantId) && 
    canViewClient(tenantId, clientId) &&
    getTenantUser(tenantId).permissions.findings.create == true;
  
  // עדכון - Tenant users או Client contacts (לתיקונים)
  allow update: if (isTenantMember(tenantId) && 
    canViewClient(tenantId, clientId) &&
    getTenantUser(tenantId).permissions.findings.edit == true)
    || (isClientContact(clientId) && isValidCorrectionUpdate());
  
  // מחיקה - רק Admin
  allow delete: if isTenantAdmin(tenantId);
}

// פונקציה לבדיקה שהעדכון הוא רק הוספת Correction
function isValidCorrectionUpdate() {
  return request.resource.data.diff(resource.data).affectedKeys()
    .hasOnly(['corrections', 'status', 'updatedAt']);
}
```

---

## ⏰ התראות

| אירוע | מתי | למי | ערוץ |
|-------|-----|-----|------|
| ליקוי חדש נפתח | מיידי | אחראי רמה 1 + ממונה בטיחות | Email, WhatsApp |
| תזכורת ראשונה | לפי הגדרה | אחראי נוכחי | Email, WhatsApp |
| אסקלציה לרמה 2 | לפי הגדרה | מנהל (רמה 2) | Email, WhatsApp |
| אסקלציה לרמה 3 | לפי הגדרה | מנכ"ל (רמה 3) | Email, WhatsApp, SMS |
| ליקוי באיחור | מיידי + יומי | כל הרמות + ממונה חיצוני | Email |
| תיקון הוגש | מיידי | ממונה בטיחות | Email, Push |
| תיקון אושר | מיידי | לקוח (מגיש) | Email, WhatsApp |
| תיקון נדחה | מיידי | לקוח (מגיש) | Email, WhatsApp |
| ליקוי נסגר | מיידי | כל המעורבים | Email |

---

## ✅ Checklist לפיתוח

### Types
- [ ] `types/finding.ts` - Finding, Correction, EscalationEvent, etc.

### Hooks
- [ ] `useFindings.ts` - List, filter, search
- [ ] `useFinding.ts` - Get, update, close
- [ ] `useCorrections.ts` - Submit, approve, reject
- [ ] `useEscalation.ts` - Manual escalation
- [ ] `useFindingsStats.ts` - Statistics

### Pages - Admin
- [ ] FindingsPage - רשימה
- [ ] FindingDetailPage - פרטים
- [ ] CreateFindingPage - יצירה ידנית
- [ ] ReviewCorrectionPage - בדיקת תיקון
- [ ] OverdueDashboardPage - באיחור
- [ ] FindingsStatsPage - סטטיסטיקות

### Pages - Client Portal
- [ ] MyFindingsPage - הליקויים שלי
- [ ] FindingDetailPage - צפייה
- [ ] SubmitCorrectionPage - הגשת תיקון

### Components
- [ ] FindingCard
- [ ] FindingSeverityBadge
- [ ] FindingStatusBadge
- [ ] FindingTimeline
- [ ] EscalationIndicator
- [ ] CorrectionForm
- [ ] CorrectionReview
- [ ] PhotoUploader
- [ ] OverdueAlert
- [ ] FindingsStats

### Cloud Functions
- [ ] processEscalations (שעתי)
- [ ] dailyOverdueReminder (יומי)
- [ ] onFindingStatusChange (trigger)
- [ ] sendFindingNotification

### Notifications
- [ ] Email templates
- [ ] WhatsApp integration
- [ ] Push notifications

---

## 📅 אבני דרך

| שבוע | משימות |
|------|---------|
| **1** | Types, Hooks בסיסיים, מבנה נתונים |
| **2** | FindingsPage, FindingDetailPage (Admin) |
| **3** | CreateFinding, Integration with Inspections |
| **4** | Client Portal - MyFindings, SubmitCorrection |
| **5** | Correction Review, Approval workflow |
| **6** | Cloud Functions - Escalation engine |
| **7** | Notifications, Overdue dashboard, Stats |

---

## 🔗 קשר למודולים אחרים

| מודול | קשר |
|-------|------|
| **Phase 1: Foundation** | משתמש ב-Client, Contact, Permissions |
| **Phase 4: Inspections** | ליקויים נוצרים מביקורות |
| **Phase 6: Client Portal** | לקוח רואה ומגיש תיקונים |
| **Phase 7: Notifications** | התראות ותזכורות |

---

*מסמך זה יעודכן במהלך הפיתוח*

**גרסה:** 1.0  
**תאריך:** 31/12/2025  
**נכתב ע"י:** Claude + Michel Mazor
