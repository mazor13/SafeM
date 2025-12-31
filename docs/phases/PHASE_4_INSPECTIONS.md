# 🔍 Phase 4: Inspections - AEGIS Platform

## 📋 סקירה כללית

**שם המודול:** Inspections (ביקורות ודוחות)  
**מטרה:** ניהול ביקורות תקופתיות, בדיקות שטח ודוחות ביקורת  
**תלויות:** Phase 1 (Foundation), Phase 2 (Template Builder), Phase 3 (Safety Files)  
**זמן פיתוח משוער:** 5-6 שבועות  

---

## 🎯 מה כולל המודול

| רכיב | תיאור | עדיפות |
|------|--------|--------|
| Inspection List | רשימת ביקורות | 🔴 קריטי |
| Inspection Detail | צפייה ועריכת ביקורת | 🔴 קריטי |
| Conduct Inspection | ביצוע ביקורת (כולל מובייל) | 🔴 קריטי |
| Inspection Report | דוח ביקורת | 🔴 קריטי |
| Checklist Execution | ביצוע צ'קליסט | 🔴 קריטי |
| Photo Documentation | תיעוד צילומי | 🟠 גבוה |
| Scheduling | תזמון ביקורות | 🟠 גבוה |
| Recurring Inspections | ביקורות חוזרות | 🟡 בינוני |

---

## 📅 סוגי ביקורות

| סוג | תדירות | תיאור |
|-----|---------|-------|
| **רבעונית** | כל 3 חודשים | ביקורת תקופתית מלאה |
| **חודשית** | כל חודש | ביקורת ממוקדת |
| **שבועית** | כל שבוע | בדיקה שוטפת |
| **יומית** | כל יום | צ'קליסט יומי |
| **שנתית** | פעם בשנה | ביקורת מקיפה + בודק מוסמך |
| **מיוחדת** | חד פעמי | ביקורת לא מתוכננת |
| **מעקב** | לפי צורך | מעקב אחרי תיקון ליקויים |

---

## 🔄 מחזור חיים של ביקורת

```
┌─────────────────────────────────────────────────────────────────┐
│                    Inspection Lifecycle                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │          │    │          │    │          │    │          │  │
│  │ מתוכננת  │───▶│ בביצוע   │───▶│  ממתינה  │───▶│  הושלמה  │  │
│  │Scheduled │    │In Progress│   │ לסיכום   │    │ Completed│  │
│  │          │    │          │    │ Pending  │    │          │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │                                               │         │
│       │                                               ▼         │
│       │                                         ┌──────────┐   │
│       │                                         │          │   │
│       └─────────────────────────────────────────│  בוטלה   │   │
│                    (ביטול)                      │Cancelled │   │
│                                                 │          │   │
│                                                 └──────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 סטטוסים

| סטטוס | תיאור | צבע | פעולות אפשריות |
|-------|-------|-----|----------------|
| `scheduled` | מתוכננת לתאריך עתידי | כחול | התחל, בטל, ערוך תאריך |
| `in_progress` | בביצוע כרגע | צהוב | המשך, שמור טיוטה |
| `pending_summary` | הסתיימה, ממתינה לסיכום | כתום | סכם, הפק דוח |
| `completed` | הושלמה עם דוח | ירוק | צפה, ייצא PDF |
| `cancelled` | בוטלה | אפור | צפה בסיבה |

---

## 📊 מבנה נתונים (Database Schema)

### 1. Inspections Collection
**נתיב:** `/tenants/{tenantId}/clients/{clientId}/inspections/{inspectionId}`

```typescript
interface Inspection {
  id: string;
  tenantId: string;
  clientId: string;
  
  // מידע בסיסי
  title: string;                   // "ביקורת רבעונית Q4 2025"
  description?: string;
  
  // סוג ותבנית
  type: InspectionType;
  templateId: string;              // תבנית הביקורת
  templateVersion: number;
  
  // קישור לתיק בטיחות (אופציונלי)
  safetyFileId?: string;
  
  // תזמון
  scheduledDate: Timestamp;        // תאריך מתוכנן
  scheduledTime?: string;          // שעה מתוכננת (HH:mm)
  duration?: number;               // משך משוער בדקות
  
  // ביצוע
  startedAt?: Timestamp;           // מתי התחילה
  completedAt?: Timestamp;         // מתי הסתיימה
  actualDuration?: number;         // משך בפועל בדקות
  
  // מיקום
  location: {
    address: string;               // כתובת הביקורת
    notes?: string;                // הערות מיקום
    coordinates?: {                // GPS (אופציונלי)
      lat: number;
      lng: number;
    };
  };
  
  // סטטוס
  status: InspectionStatus;
  
  // צוות
  inspectorId: string;             // מי מבצע את הביקורת
  inspectorName: string;
  assistantIds?: string[];         // עוזרים (אם יש)
  
  // אנשי קשר מהלקוח שנכחו
  attendees: Attendee[];
  
  // תוכן הביקורת
  sections: InspectionSection[];
  
  // ליקויים שנמצאו
  findingsCount: number;
  findingIds: string[];            // קישור לליקויים שנוצרו
  
  // תמונות כלליות
  photos: InspectionPhoto[];
  
  // סיכום
  summary?: {
    overallStatus: 'pass' | 'pass_with_remarks' | 'fail';
    notes: string;
    recommendations?: string;
    nextInspectionDate?: Timestamp;
  };
  
  // חתימות
  signatures: InspectionSignature[];
  
  // דוח
  reportGenerated: boolean;
  reportUrl?: string;              // קישור ל-PDF
  reportGeneratedAt?: Timestamp;
  
  // ביקורות חוזרות
  isRecurring: boolean;
  recurringScheduleId?: string;    // קישור ללו"ז חוזר
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  
  // ביטול
  cancelledAt?: Timestamp;
  cancelledBy?: string;
  cancellationReason?: string;
}

type InspectionType = 
  | 'quarterly'      // רבעונית
  | 'monthly'        // חודשית
  | 'weekly'         // שבועית
  | 'daily'          // יומית
  | 'annual'         // שנתית
  | 'special'        // מיוחדת
  | 'follow_up';     // מעקב

type InspectionStatus = 
  | 'scheduled'
  | 'in_progress'
  | 'pending_summary'
  | 'completed'
  | 'cancelled';
```

### 2. Inspection Sections
```typescript
interface InspectionSection {
  id: string;
  templateSectionId: string;
  
  // מידע
  title: string;
  order: number;
  
  // סטטוס
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  skippedReason?: string;          // סיבה לדילוג
  
  // שדות
  fields: InspectionField[];
  
  // פריטי צ'קליסט
  checklistItems?: ChecklistItem[];
  
  // הערות לסקשן
  notes?: string;
  
  // תמונות
  photos: InspectionPhoto[];
  
  // מטא
  startedAt?: Timestamp;
  completedAt?: Timestamp;
}
```

### 3. Inspection Fields
```typescript
interface InspectionField {
  id: string;
  templateFieldId: string;
  sectionId: string;
  
  // הגדרות
  type: FieldType;
  label: string;
  required: boolean;
  
  // ערך
  value: any;
  
  // מצב
  isCompleted: boolean;
  isValid: boolean;
  validationErrors?: string[];
  
  // תמונה (אם רלוונטי)
  photo?: InspectionPhoto;
  
  // מטא
  updatedAt?: Timestamp;
}
```

### 4. Checklist Items
```typescript
interface ChecklistItem {
  id: string;
  templateItemId: string;
  
  // פרטי הפריט
  label: string;                   // "משקפי מגן נעולים בארון"
  description?: string;
  order: number;
  
  // תוצאה
  status: 'pass' | 'fail' | 'na' | 'not_checked';
  // pass = תקין
  // fail = לא תקין (יוצר ליקוי)
  // na = לא רלוונטי
  // not_checked = לא נבדק
  
  // פרטים נוספים
  notes?: string;
  quantity?: number;               // כמות (למשל: 5 מטפים)
  
  // ליקוי (אם status = fail)
  findingId?: string;              // קישור לליקוי שנוצר
  findingSeverity?: 'critical' | 'high' | 'medium' | 'low';
  
  // תמונה
  photo?: InspectionPhoto;
  
  // מטא
  checkedAt?: Timestamp;
  checkedBy?: string;
}
```

### 5. Inspection Photos
```typescript
interface InspectionPhoto {
  id: string;
  
  // קובץ
  url: string;                     // Storage URL
  thumbnailUrl?: string;           // תמונה מוקטנת
  
  // מידע
  caption?: string;                // כיתוב
  category?: 'general' | 'finding' | 'equipment' | 'safety_measure';
  
  // קשר
  sectionId?: string;
  fieldId?: string;
  checklistItemId?: string;
  findingId?: string;
  
  // מיקום
  location?: {
    lat: number;
    lng: number;
  };
  
  // מטא
  takenAt: Timestamp;
  takenBy: string;
  deviceInfo?: string;             // סוג מכשיר
}
```

### 6. Attendees
```typescript
interface Attendee {
  contactId?: string;              // קישור לאיש קשר (אם קיים)
  name: string;
  role: string;                    // "ממונה בטיחות" / "מנהל ייצור"
  email?: string;
  phone?: string;
  signature?: {
    dataUrl: string;
    signedAt: Timestamp;
  };
}
```

### 7. Inspection Signatures
```typescript
interface InspectionSignature {
  id: string;
  
  // מי חתם
  signerId: string;
  signerName: string;
  signerRole: 'inspector' | 'client_contact' | 'witness';
  
  // חתימה
  signatureDataUrl: string;
  
  // מטא
  signedAt: Timestamp;
  ipAddress?: string;
}
```

### 8. Recurring Schedules
**נתיב:** `/tenants/{tenantId}/clients/{clientId}/recurringSchedules/{scheduleId}`

```typescript
interface RecurringSchedule {
  id: string;
  tenantId: string;
  clientId: string;
  
  // מידע
  title: string;                   // "ביקורת רבעונית לייזר"
  description?: string;
  
  // תבנית
  templateId: string;
  inspectionType: InspectionType;
  
  // תדירות
  frequency: RecurringFrequency;
  
  // זמנים
  preferredTime?: string;          // שעה מועדפת (HH:mm)
  duration?: number;               // משך משוער
  
  // מבצע
  defaultInspectorId: string;
  
  // התחלה וסיום
  startDate: Timestamp;
  endDate?: Timestamp;             // אם ריק = אינסופי
  
  // סטטוס
  isActive: boolean;
  
  // ביקורות שנוצרו
  generatedInspectionIds: string[];
  lastGeneratedDate?: Timestamp;
  nextScheduledDate?: Timestamp;
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

interface RecurringFrequency {
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  
  // לפי סוג
  interval?: number;               // כל X ימים/שבועות/חודשים
  dayOfWeek?: number;              // 0-6 (ראשון-שבת)
  dayOfMonth?: number;             // 1-31
  monthOfYear?: number;            // 1-12
  
  // חריגים
  excludeDates?: Timestamp[];      // תאריכים לדילוג
  excludeWeekends?: boolean;       // דלג על סופ"ש
}
```

---

## 🖥️ ממשקים (UI Screens)

### Admin Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| Inspections List | `/admin/inspections` | כל הביקורות (כל הלקוחות) |
| Client Inspections | `/admin/clients/:clientId/inspections` | ביקורות ללקוח |
| Inspection Detail | `/admin/inspections/:id` | צפייה בביקורת |
| Conduct Inspection | `/admin/inspections/:id/conduct` | ביצוע ביקורת |
| Schedule Inspection | `/admin/inspections/new` | תזמון ביקורת חדשה |
| Recurring Schedules | `/admin/inspections/recurring` | לוחות זמנים חוזרים |
| Calendar View | `/admin/inspections/calendar` | תצוגת לוח שנה |

### Mobile View (Responsive)

| מסך | תיאור |
|-----|--------|
| Today's Inspections | ביקורות להיום |
| Conduct Inspection | ביצוע במובייל |
| Camera Capture | צילום תמונות |
| Quick Checklist | צ'קליסט מהיר |
| Signature Capture | חתימה במובייל |

---

## 🎨 עיצוב מסכים

### רשימת ביקורות

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 ביקורות                               [+ תזמן ביקורת]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📅 היום  |  השבוע  |  החודש  |  הכל                          │
│                                                                 │
│  🔍 [חיפוש...____]  לקוח: [הכל ▼]  סטטוס: [הכל ▼]             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  📅 היום - 31/12/2025                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔵 09:00  ביקורת רבעונית Q4                             │   │
│  │                                                         │   │
│  │ 🏢 רול פרופיל בע"מ                                      │   │
│  │ 📍 צור 9, כרמיאל                                        │   │
│  │ 👤 מישל מזור                                            │   │
│  │                                                         │   │
│  │ סטטוס: 🟡 בביצוע (45%)                                  │   │
│  │                                              [המשך →]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔵 14:00  בדיקה חודשית                                  │   │
│  │                                                         │   │
│  │ 🏢 ABC תעשיות                                           │   │
│  │ 📍 רח' התעשייה 5, חיפה                                  │   │
│  │ 👤 עובד א'                                              │   │
│  │                                                         │   │
│  │ סטטוס: ⚪ מתוכננת                                       │   │
│  │                                              [התחל →]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### ביצוע ביקורת (Conduct Inspection)

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 ביקורת רבעונית Q4 - רול פרופיל                             │
│                                                                 │
│  ████████████████████████░░░░░░░░░░░░░░░░ 60%                  │
│                                                                 │
│  [💾 שמור]  [📷 צלם]  [⏸️ השהה]  [✅ סיים ביקורת]             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📑 סקשנים                        📋 תוכן                      │
│  ┌────────────────────┐           ┌─────────────────────────────┤
│  │                    │           │                             │
│  │ ✅ 1. פרטי האתר   │           │ 3. בדיקת ציוד בטיחות       │
│  │ ✅ 2. נוכחים      │           │ ══════════════════════════  │
│  │ 🔵 3. ציוד בטיחות │◀─         │                             │
│  │ ⚪ 4. הדרכות      │           │ ☑️ משקפי מגן               │
│  │ ⚪ 5. סיכום       │           │    סטטוס: [תקין ▼]          │
│  │                    │           │    כמות: [5__]              │
│  │                    │           │    📷 [צלם]                 │
│  │                    │           │    הערות: [____________]    │
│  │                    │           │                             │
│  │                    │           │ ────────────────────────────│
│  │                    │           │                             │
│  │                    │           │ ☑️ כפתור חירום             │
│  │                    │           │    סטטוס: [תקין ▼]          │
│  │                    │           │    📷 [צלם]                 │
│  │                    │           │    הערות: [____________]    │
│  │                    │           │                             │
│  │                    │           │ ────────────────────────────│
│  │                    │           │                             │
│  │                    │           │ ❌ שילוט אזהרה             │
│  │                    │           │    סטטוס: [לא תקין ▼] ⚠️   │
│  │                    │           │    חומרה: [🟠 גבוה ▼]      │
│  │                    │           │    📷 [צלם] 📷 (1 תמונה)   │
│  │                    │           │    תיאור: [שלט דהוי וקשה   │
│  │                    │           │            לקריאה________]  │
│  │                    │           │    [📋 צור ליקוי]          │
│  │                    │           │                             │
│  └────────────────────┘           │ [הבא: הדרכות →]            │
│                                   └─────────────────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### תצוגת מובייל - ביצוע ביקורת

```
┌─────────────────────────┐
│ 🔍 ביקורת רבעונית Q4   │
│ רול פרופיל              │
├─────────────────────────┤
│ ████████████░░░░ 60%    │
│                         │
│ [💾] [📷] [⏸️] [✅]      │
├─────────────────────────┤
│                         │
│ 3. ציוד בטיחות (3/5)   │
│                         │
│ ┌─────────────────────┐ │
│ │ ☑️ משקפי מגן       │ │
│ │ [✅ תקין ▼]         │ │
│ │ כמות: [5__]         │ │
│ │ [📷 צלם] [💬 הערה]  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ❌ שילוט אזהרה     │ │
│ │ [⚠️ לא תקין ▼]      │ │
│ │ חומרה: [🟠 גבוה]    │ │
│ │ [📷 צלם] 1 📷       │ │
│ │ [תיאור הליקוי...]   │ │
│ │ [📋 צור ליקוי]      │ │
│ └─────────────────────┘ │
│                         │
│ [◀ הקודם] [הבא ▶]     │
│                         │
└─────────────────────────┘
```

### סיום ביקורת וחתימות

```
┌─────────────────────────────────────────────────────────────────┐
│  ✅ סיום ביקורת - רול פרופיל                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 סיכום הביקורת                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  סטטוס כללי:                                                   │
│  ○ ✅ תקין                                                     │
│  ● ⚠️ תקין עם הערות                                           │
│  ○ ❌ לא תקין                                                  │
│                                                                 │
│  📋 ליקויים שנמצאו: 2                                          │
│  ├── 🟠 שילוט אזהרה דהוי (גבוה)                                │
│  └── 🟡 תיעוד הדרכה חסר (בינוני)                               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📝 הערות וסיכום:                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ הביקורת הסתיימה בהצלחה. נמצאו 2 ליקויים שדורשים        │   │
│  │ טיפול. מומלץ לבצע ביקורת מעקב תוך 14 יום.              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📅 ביקורת הבאה: [15/03/2026____]                              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✍️ חתימות                                                     │
│                                                                 │
│  מבצע הביקורת:              נציג הלקוח:                        │
│  ┌───────────────────┐      ┌───────────────────┐              │
│  │                   │      │                   │              │
│  │    [חתימה]        │      │    [חתימה]        │              │
│  │                   │      │                   │              │
│  └───────────────────┘      └───────────────────┘              │
│  מישל מזור                   עדי דובלרו                        │
│  ממונה בטיחות לייזר          ממונה בטיחות                      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [ביטול]              [📄 הפק דוח PDF]    [✅ סיים וסגור]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### תצוגת לוח שנה

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 לוח ביקורות - ינואר 2026                    [◀] [▶]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  א      ב      ג      ד      ה      ו      ש                  │
│  ──────────────────────────────────────────────────────────    │
│                1      2      3      4      5                   │
│                       🔵                                       │
│                                                                 │
│  6      7      8      9      10     11     12                  │
│                🔵            🔵🔵                               │
│                                                                 │
│  13     14     15     16     17     18     19                  │
│  🔵            🟡     🔵                                        │
│                                                                 │
│  20     21     22     23     24     25     26                  │
│                       🔵                    🔵                  │
│                                                                 │
│  27     28     29     30     31                                │
│                                     🔵                          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  🔵 מתוכננת    🟡 בביצוע    🟢 הושלמה    🔴 באיחור            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 תהליכי עבודה (Workflows)

### 1. תזמון ביקורת חדשה

```
┌─────────────────────────────────────────────────────────────────┐
│  1. בחירת לקוח                                                 │
│                              ↓                                  │
│  2. בחירת סוג ותבנית                                           │
│     ├── סוג: רבעונית/חודשית/מיוחדת...                         │
│     └── תבנית: מהתבניות הקיימות                                │
│                              ↓                                  │
│  3. קביעת תאריך ושעה                                           │
│     ├── תאריך מתוכנן                                           │
│     ├── שעה (אופציונלי)                                        │
│     └── משך משוער                                              │
│                              ↓                                  │
│  4. הגדרת מבצע                                                 │
│     └── בחירת עובד שיבצע                                       │
│                              ↓                                  │
│  5. נוצרת ביקורת                                               │
│     └── status: scheduled                                      │
│                              ↓                                  │
│  6. התראות                                                     │
│     ├── למבצע: "ביקורת חדשה נוספה ליומן"                       │
│     └── ללקוח: "ביקורת מתוכננת לתאריך X"                       │
│                              ↓                                  │
│  7. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2. ביצוע ביקורת

```
┌─────────────────────────────────────────────────────────────────┐
│  1. התחלת ביקורת                                               │
│     ├── לחיצה על "התחל"                                        │
│     ├── status: scheduled → in_progress                        │
│     └── startedAt = now                                        │
│                              ↓                                  │
│  2. רישום נוכחים                                               │
│     └── הזנת אנשי קשר שנכחו                                    │
│                              ↓                                  │
│  3. מעבר על סקשנים                                             │
│     ┌────────────────────────────────────────┐                 │
│     │ לכל סקשן:                              │                 │
│     │ ├── מילוי שדות                         │                 │
│     │ ├── סימון פריטי צ'קליסט               │                 │
│     │ ├── צילום תמונות                       │                 │
│     │ └── יצירת ליקויים (אם נמצאו)           │                 │
│     └────────────────────────────────────────┘                 │
│                              ↓                                  │
│  4. שמירה אוטומטית                                             │
│     └── כל שינוי נשמר בזמן אמת                                 │
│                              ↓                                  │
│  5. סיום ביקורת                                                │
│     ├── status: in_progress → pending_summary                  │
│     └── completedAt = now                                      │
│                              ↓                                  │
│  6. סיכום וחתימות                                              │
│     ├── סטטוס כללי                                             │
│     ├── הערות וסיכום                                           │
│     ├── חתימת מבצע                                             │
│     └── חתימת נציג לקוח                                        │
│                              ↓                                  │
│  7. הפקת דוח                                                   │
│     ├── יצירת PDF                                              │
│     └── status: pending_summary → completed                    │
│                              ↓                                  │
│  8. שליחה ללקוח                                                │
│     └── Email עם PDF מצורף                                     │
│                              ↓                                  │
│  9. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 3. יצירת ליקוי מהביקורת

```
┌─────────────────────────────────────────────────────────────────┐
│  1. סימון פריט כ"לא תקין"                                      │
│                              ↓                                  │
│  2. הזנת פרטי ליקוי                                            │
│     ├── תיאור                                                  │
│     ├── חומרה                                                  │
│     ├── תמונה                                                  │
│     └── מיקום                                                  │
│                              ↓                                  │
│  3. לחיצה על "צור ליקוי"                                       │
│                              ↓                                  │
│  4. נוצר Finding חדש                                           │
│     ├── קישור לביקורת (inspectionId)                           │
│     ├── קישור לתיק בטיחות (אם יש)                              │
│     └── status: open                                           │
│                              ↓                                  │
│  5. עדכון הביקורת                                              │
│     ├── findingsCount++                                        │
│     └── findingIds.push(newFindingId)                          │
│                              ↓                                  │
│  6. התראה ללקוח                                                │
│     └── "נמצא ליקוי חדש בביקורת"                               │
│                              ↓                                  │
│  7. תהליך אסקלציה מתחיל                                        │
│     └── (ראה Phase 5: Findings)                                │
└─────────────────────────────────────────────────────────────────┘
```

### 4. ביקורות חוזרות (Recurring)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. הגדרת לו"ז חוזר                                            │
│     ├── תדירות: רבעונית                                        │
│     ├── יום בחודש: 1                                           │
│     ├── תבנית: ביקורת רבעונית לייזר                            │
│     └── מבצע: מישל מזור                                        │
│                              ↓                                  │
│  2. נוצר RecurringSchedule                                      │
│     └── isActive: true                                         │
│                              ↓                                  │
│  3. Job יומי (Cloud Function)                                   │
│     ├── בודק לוחות זמנים פעילים                                │
│     └── יוצר ביקורות לתאריכים הבאים                            │
│                              ↓                                  │
│  4. נוצרת ביקורת חדשה                                          │
│     ├── isRecurring: true                                      │
│     └── recurringScheduleId = scheduleId                       │
│                              ↓                                  │
│  5. התראה למבצע                                                │
│     └── "ביקורת רבעונית נוספה ליומן ל-01/04/2026"              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 מבנה קבצים

```
frontend/src/
├── types/
│   └── inspection.ts              # Inspection, Section, ChecklistItem, etc.
│
├── hooks/
│   ├── useInspections.ts          # CRUD inspections
│   ├── useInspection.ts           # Single inspection operations
│   ├── useConductInspection.ts    # ביצוע ביקורת
│   ├── useRecurringSchedules.ts   # לוחות זמנים חוזרים
│   └── useInspectionCalendar.ts   # תצוגת לוח שנה
│
├── pages/admin/
│   └── inspections/
│       ├── InspectionsPage.tsx        # רשימת ביקורות
│       ├── InspectionDetailPage.tsx   # צפייה בביקורת
│       ├── ConductInspectionPage.tsx  # ביצוע ביקורת
│       ├── ScheduleInspectionPage.tsx # תזמון ביקורת
│       ├── RecurringSchedulesPage.tsx # לו"ז חוזר
│       ├── InspectionCalendarPage.tsx # לוח שנה
│       └── InspectionReportPage.tsx   # צפייה בדוח
│
├── components/
│   └── inspections/
│       ├── InspectionCard.tsx
│       ├── InspectionStatusBadge.tsx
│       ├── InspectionProgress.tsx
│       ├── SectionNavigation.tsx
│       ├── ChecklistItemRow.tsx
│       ├── PhotoCapture.tsx           # צילום/העלאת תמונות
│       ├── PhotoGallery.tsx
│       ├── AttendeesList.tsx
│       ├── SignaturePanel.tsx
│       ├── InspectionSummary.tsx
│       ├── CalendarView.tsx
│       ├── RecurringScheduleForm.tsx
│       └── InspectionReportPreview.tsx
│
└── utils/
    ├── inspectionProgress.ts      # חישוב התקדמות
    ├── recurringDates.ts          # חישוב תאריכים חוזרים
    └── inspectionReport.ts        # הפקת דוח
```

---

## 🔥 Firestore Security Rules (הוספה)

```javascript
// בתוך /tenants/{tenantId}/clients/{clientId}
match /inspections/{inspectionId} {
  allow read: if isTenantMember(tenantId) && canViewClient(tenantId, clientId);
  allow create: if isTenantMember(tenantId) && 
    canViewClient(tenantId, clientId) &&
    getTenantUser(tenantId).permissions.inspections.create == true;
  allow update: if isTenantMember(tenantId) && 
    canViewClient(tenantId, clientId) &&
    getTenantUser(tenantId).permissions.inspections.edit == true;
  allow delete: if isTenantAdmin(tenantId);
}

match /recurringSchedules/{scheduleId} {
  allow read: if isTenantMember(tenantId) && canViewClient(tenantId, clientId);
  allow write: if isTenantMember(tenantId) && 
    canViewClient(tenantId, clientId) &&
    getTenantUser(tenantId).permissions.inspections.create == true;
}
```

---

## ⏰ התראות

| אירוע | מתי | למי | ערוץ |
|-------|-----|-----|------|
| ביקורת חדשה נוספה | מיידי | מבצע | Email, Push |
| תזכורת ביקורת מחר | יום לפני | מבצע | Email, Push |
| תזכורת ביקורת היום | בוקר היום | מבצע | Push |
| ביקורת הושלמה | מיידי | לקוח | Email (עם PDF) |
| ליקוי נמצא | מיידי | לקוח | Email, WhatsApp |
| ביקורת באיחור | יום אחרי התאריך | מנהל + מבצע | Email |

---

## ✅ Checklist לפיתוח

### Types
- [ ] `types/inspection.ts` - Inspection, Section, ChecklistItem, Photo, etc.

### Hooks
- [ ] `useInspections.ts` - List, filter, search
- [ ] `useInspection.ts` - Get, update, complete
- [ ] `useConductInspection.ts` - ביצוע עם שמירה אוטומטית
- [ ] `useRecurringSchedules.ts` - CRUD לו"ז חוזר
- [ ] `useInspectionCalendar.ts` - נתונים ללוח שנה

### Pages
- [ ] InspectionsPage - רשימה כללית
- [ ] InspectionDetailPage - צפייה
- [ ] ConductInspectionPage - ביצוע (Desktop + Mobile)
- [ ] ScheduleInspectionPage - תזמון
- [ ] RecurringSchedulesPage - לו"ז חוזר
- [ ] InspectionCalendarPage - לוח שנה
- [ ] InspectionReportPage - דוח

### Components
- [ ] InspectionCard
- [ ] InspectionStatusBadge
- [ ] InspectionProgress
- [ ] SectionNavigation
- [ ] ChecklistItemRow (עם כל הסטטוסים)
- [ ] PhotoCapture (מצלמה + העלאה)
- [ ] PhotoGallery
- [ ] AttendeesList
- [ ] SignaturePanel
- [ ] InspectionSummary
- [ ] CalendarView
- [ ] RecurringScheduleForm

### Mobile Responsive
- [ ] תצוגה מותאמת לביצוע במובייל
- [ ] צילום מהמצלמה
- [ ] חתימה במובייל

### Cloud Functions
- [ ] יצירת ביקורות חוזרות אוטומטית
- [ ] התראות

---

## 📅 אבני דרך

| שבוע | משימות |
|------|---------|
| **1** | Types, Hooks בסיסיים, מבנה נתונים |
| **2** | InspectionsPage, ScheduleInspectionPage |
| **3** | ConductInspectionPage - מבנה בסיסי |
| **4** | ChecklistItems, Photos, Findings integration |
| **5** | Signatures, Summary, Report generation |
| **6** | Calendar, Recurring, Mobile optimization |

---

## 🔗 קשר למודולים אחרים

| מודול | קשר |
|-------|------|
| **Phase 2: Template Builder** | ביקורת נוצרת מתבנית |
| **Phase 3: Safety Files** | ביקורת יכולה להיות מקושרת לתיק |
| **Phase 5: Findings** | ליקויים נוצרים מהביקורת |
| **Phase 6: Client Portal** | לקוח רואה דוחות ביקורת |
| **Phase 7: Notifications** | התראות על ביקורות |
| **Phase 9: PDF Export** | הפקת דוח ביקורת |

---

*מסמך זה יעודכן במהלך הפיתוח*

**גרסה:** 1.0  
**תאריך:** 31/12/2025  
**נכתב ע"י:** Claude + Michel Mazor
