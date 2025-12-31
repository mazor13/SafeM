# 📁 Phase 3: Safety Files - AEGIS Platform

## 📋 סקירה כללית

**שם המודול:** Safety Files (תיקי בטיחות)  
**מטרה:** ניהול תיקי בטיחות מלאים ללקוחות - יצירה, עריכה, מעקב ואישור  
**תלויות:** Phase 1 (Foundation), Phase 2 (Template Builder)  
**זמן פיתוח משוער:** 5-6 שבועות  

---

## 🎯 מה כולל המודול

| רכיב | תיאור | עדיפות |
|------|--------|--------|
| Safety Files List | רשימת תיקי בטיחות | 🔴 קריטי |
| Safety File Detail | צפייה ועריכת תיק | 🔴 קריטי |
| Create Safety File | יצירת תיק חדש מתבנית | 🔴 קריטי |
| Section Management | ניהול סקשנים ושדות | 🔴 קריטי |
| Status Workflow | תהליך אישור | 🔴 קריטי |
| Validity & Expiry | תוקף ופקיעה | 🟠 גבוה |
| Linked Documents | מסמכים מקושרים | 🟠 גבוה |
| History & Versions | היסטוריה וגרסאות | 🟡 בינוני |

---

## 🔄 מחזור חיים של תיק בטיחות

```
┌─────────────────────────────────────────────────────────────────┐
│                    Safety File Lifecycle                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │          │    │          │    │          │    │          │  │
│  │  טיוטה   │───▶│ בעבודה   │───▶│  ממתין   │───▶│  מאושר   │  │
│  │  Draft   │    │In Progress│   │ לאישור   │    │ Approved │  │
│  │          │    │          │    │ Pending  │    │          │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │                               │               │         │
│       │                               │               ▼         │
│       │                               │         ┌──────────┐   │
│       │                               │         │          │   │
│       │                               └────────▶│  נדחה    │   │
│       │                                         │ Rejected │   │
│       │                                         │          │   │
│       │                                         └──────────┘   │
│       │                                               │         │
│       └───────────────────────────────────────────────┘         │
│                         (חוזר לעריכה)                           │
│                                                                 │
│  ┌──────────┐                                                   │
│  │          │                                                   │
│  │ פג תוקף  │◀── (אוטומטי כשעובר validUntil)                   │
│  │ Expired  │                                                   │
│  │          │                                                   │
│  └──────────┘                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 סטטוסים

| סטטוס | תיאור | צבע | פעולות אפשריות |
|-------|-------|-----|----------------|
| `draft` | טיוטה - רק נוצר | אפור | עריכה, מחיקה |
| `in_progress` | בעבודה - מילוי פעיל | כחול | עריכה, שליחה לאישור |
| `pending_approval` | ממתין לאישור הממונה | צהוב | אישור, דחייה |
| `approved` | מאושר ותקף | ירוק | צפייה, חידוש |
| `rejected` | נדחה - דרוש תיקון | אדום | עריכה, שליחה מחדש |
| `expired` | פג תוקף | כתום | חידוש |
| `archived` | בארכיון | אפור כהה | צפייה בלבד |

---

## 📊 מבנה נתונים (Database Schema)

### 1. Safety Files Collection
**נתיב:** `/tenants/{tenantId}/clients/{clientId}/safetyFiles/{fileId}`

```typescript
interface SafetyFile {
  id: string;
  tenantId: string;
  clientId: string;
  
  // מידע בסיסי
  title: string;                   // "תוכנית בטיחות לייזר 2025"
  description?: string;
  
  // סוג ותחום
  type: SafetyFileType;            // laser, fire, general...
  templateId: string;              // התבנית שממנה נוצר
  templateVersion: number;         // גרסת התבנית
  
  // סטטוס
  status: SafetyFileStatus;
  
  // תוקף
  validFrom: Timestamp;            // תחילת תוקף
  validUntil: Timestamp;           // סוף תוקף
  
  // גרסה
  version: number;                 // 1, 2, 3...
  previousVersionId?: string;      // קישור לגרסה קודמת
  
  // התקדמות
  progress: {
    totalSections: number;
    completedSections: number;
    totalRequiredFields: number;
    completedRequiredFields: number;
    percentage: number;            // 0-100
  };
  
  // תוכן הסקשנים
  sections: SafetyFileSection[];
  
  // אישורים
  approvals: Approval[];
  
  // מסמכים מצורפים
  attachments: Attachment[];
  
  // אחראים
  responsibleOfficerId: string;    // ממונה בטיחות אחראי
  assignedUserId: string;          // עובד שמטפל
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  lastEditedBy: string;
  
  // Audit
  submittedAt?: Timestamp;         // מתי נשלח לאישור
  approvedAt?: Timestamp;          // מתי אושר
  approvedBy?: string;             // מי אישר
  rejectedAt?: Timestamp;          // מתי נדחה
  rejectedBy?: string;             // מי דחה
  rejectionReason?: string;        // סיבת דחייה
}

type SafetyFileType = 
  | 'laser'           // בטיחות לייזר
  | 'fire'            // בטיחות אש
  | 'radiation'       // קרינה
  | 'chemical'        // כימיקלים
  | 'heights'         // עבודה בגובה
  | 'construction'    // אתרי בנייה
  | 'electrical'      // חשמל
  | 'general'         // כללי
  | 'combined';       // משולב

type SafetyFileStatus = 
  | 'draft'
  | 'in_progress'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'archived';
```

### 2. Safety File Sections
```typescript
interface SafetyFileSection {
  id: string;
  templateSectionId: string;       // קישור לסקשן בתבנית
  
  // מידע
  title: string;
  description?: string;
  order: number;
  
  // סטטוס הסקשן
  status: 'not_started' | 'in_progress' | 'completed';
  
  // שדות ממולאים
  fields: SafetyFileField[];
  
  // התקדמות
  progress: {
    totalFields: number;
    completedFields: number;
    requiredFields: number;
    completedRequiredFields: number;
  };
  
  // הערות
  notes?: string;
  
  // מטא
  lastEditedAt?: Timestamp;
  lastEditedBy?: string;
}
```

### 3. Safety File Fields
```typescript
interface SafetyFileField {
  id: string;
  templateFieldId: string;         // קישור לשדה בתבנית
  sectionId: string;
  
  // הגדרות מהתבנית (cached)
  type: FieldType;
  label: string;
  required: boolean;
  
  // ערך
  value: any;                      // הערך שהוזן
  
  // מצב
  isCompleted: boolean;            // האם הושלם
  isValid: boolean;                // האם תקף
  validationErrors?: string[];     // שגיאות תיקוף
  
  // מטא
  updatedAt?: Timestamp;
  updatedBy?: string;
}
```

### 4. Approvals
```typescript
interface Approval {
  id: string;
  
  // מי אישר
  userId: string;
  userName: string;
  userRole: string;
  
  // פעולה
  action: 'submitted' | 'approved' | 'rejected' | 'revision_requested';
  
  // פרטים
  comments?: string;
  
  // חתימה
  signature?: {
    dataUrl: string;               // Base64 של החתימה
    signedAt: Timestamp;
    ipAddress?: string;
  };
  
  // מטא
  timestamp: Timestamp;
}
```

### 5. Attachments
```typescript
interface Attachment {
  id: string;
  
  // קובץ
  fileName: string;
  fileType: string;                // MIME type
  fileSize: number;                // bytes
  fileUrl: string;                 // Storage URL
  
  // מידע
  description?: string;
  category?: string;               // 'permit', 'certificate', 'photo'...
  
  // קשר לסקשן (אופציונלי)
  sectionId?: string;
  
  // מטא
  uploadedAt: Timestamp;
  uploadedBy: string;
}
```

### 6. Safety File History
**נתיב:** `/tenants/{tenantId}/clients/{clientId}/safetyFiles/{fileId}/history/{historyId}`

```typescript
interface SafetyFileHistory {
  id: string;
  safetyFileId: string;
  
  // מה השתנה
  action: 'created' | 'updated' | 'status_changed' | 'approved' | 'rejected' | 'renewed';
  
  // פרטים
  changes?: {
    field: string;
    previousValue: any;
    newValue: any;
  }[];
  
  // מי ומתי
  userId: string;
  userName: string;
  timestamp: Timestamp;
  
  // הערות
  notes?: string;
}
```

---

## 🖥️ ממשקים (UI Screens)

### Admin Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| Safety Files List | `/admin/clients/:clientId/safety-files` | רשימת תיקים ללקוח |
| Safety File Detail | `/admin/clients/:clientId/safety-files/:fileId` | צפייה/עריכת תיק |
| Create Safety File | `/admin/clients/:clientId/safety-files/new` | יצירת תיק חדש |
| All Safety Files | `/admin/safety-files` | כל התיקים (כל הלקוחות) |
| Pending Approvals | `/admin/safety-files/pending` | ממתינים לאישור |
| Expiring Soon | `/admin/safety-files/expiring` | עומדים לפוג |

---

## 🎨 עיצוב מסכים

### רשימת תיקי בטיחות

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 תיקי בטיחות - רול פרופיל בע"מ              [+ תיק חדש]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 [חיפוש...________]  סוג: [הכל ▼]  סטטוס: [הכל ▼]          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📋 תוכנית בטיחות לייזר 2025                             │   │
│  │                                                         │   │
│  │ סוג: 🔴 לייזר    סטטוס: ✅ מאושר    תוקף: 31/12/2025   │   │
│  │                                                         │   │
│  │ ████████████████████████████████████░░░░ 85%           │   │
│  │                                                         │   │
│  │ עודכן: 22/12/2025    ע"י: מישל מזור                     │   │
│  │                                              [צפה →]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📋 תוכנית בטיחות אש 2025                                │   │
│  │                                                         │   │
│  │ סוג: 🔥 אש    סטטוס: 🟡 ממתין לאישור    תוקף: --       │   │
│  │                                                         │   │
│  │ ████████████████████████░░░░░░░░░░░░░░░░ 60%           │   │
│  │                                                         │   │
│  │ עודכן: 30/12/2025    ע"י: מישל מזור                     │   │
│  │                                              [צפה →]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📋 סקר סיכונים כללי                                     │   │
│  │                                                         │   │
│  │ סוג: ⚠️ כללי    סטטוס: ⚪ טיוטה    תוקף: --            │   │
│  │                                                         │   │
│  │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%           │   │
│  │                                                         │   │
│  │ עודכן: 28/12/2025    ע"י: עובד א'                       │   │
│  │                                              [צפה →]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### יצירת תיק חדש

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 יצירת תיק בטיחות חדש - רול פרופיל בע"מ                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  שלב 1 מתוך 3: בחירת תבנית                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  🔴 לייזר                                               │   │
│  │  ────────────────────────────────────────────────────── │   │
│  │  ○ תוכנית בטיחות לייזר (8 סקשנים)                      │   │
│  │  ○ ביקורת רבעונית לייזר (4 סקשנים)                     │   │
│  │  ○ צ'קליסט יומי לייזר (2 סקשנים)                       │   │
│  │                                                         │   │
│  │  🔥 אש                                                  │   │
│  │  ────────────────────────────────────────────────────── │   │
│  │  ○ תוכנית בטיחות אש (6 סקשנים)                         │   │
│  │  ○ ביקורת מטפים (3 סקשנים)                             │   │
│  │                                                         │   │
│  │  ⚠️ כללי                                                │   │
│  │  ────────────────────────────────────────────────────── │   │
│  │  ○ סקר סיכונים (5 סקשנים)                              │   │
│  │  ● דוח תקרית (4 סקשנים)  ← נבחר                        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [ביטול]                                    [הבא: פרטים →]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### עריכת תיק בטיחות

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 תוכנית בטיחות לייזר 2025                                   │
│  רול פרופיל בע"מ                                               │
│                                                                 │
│  סטטוס: 🔵 בעבודה    תוקף: 31/12/2025    גרסה: 1              │
│  ████████████████████████████░░░░░░░░░░░░ 70%                  │
│                                                                 │
│  [שמור טיוטה]  [שלח לאישור]  [תצוגה מקדימה]  [ייצא PDF]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📑 סקשנים                           📝 תוכן הסקשן             │
│  ┌────────────────────┐              ┌──────────────────────────┤
│  │                    │              │                          │
│  │ ✅ 1. נתוני רקע    │              │ 1. נתוני רקע             │
│  │ ✅ 2. מערך בטיחות  │              │ ═══════════════════════  │
│  │ 🔵 3. פרטי הלייזר │◀─ נבחר      │                          │
│  │ ⚪ 4. הערכת סיכונים │              │ שם החברה: *              │
│  │ ⚪ 5. אמצעי בטיחות │              │ [רול פרופיל בע"מ____]    │
│  │ ⚪ 6. הדרכות       │              │                          │
│  │ ⚪ 7. נהלי חירום   │              │ כתובת: *                 │
│  │ ⚪ 8. חתימות       │              │ [צור 9, כרמיאל________]  │
│  │                    │              │                          │
│  │                    │              │ טלפון:                   │
│  │                    │              │ [04-1234567_____________] │
│  │                    │              │                          │
│  │                    │              │ ─────────────────────────│
│  │                    │              │                          │
│  │                    │              │ 📊 רשימת מערכות לייזר    │
│  │                    │              │                          │
│  │                    │              │ [+ הוסף שורה]            │
│  │                    │              │ ┌────┬──────┬─────┬────┐ │
│  │                    │              │ │יצרן│ דגם  │דרגה │הערות│ │
│  │                    │              │ ├────┼──────┼─────┼────┤ │
│  │                    │              │ │IPG │YTTER │ 4   │סיב │ │
│  │                    │              │ └────┴──────┴─────┴────┘ │
│  │                    │              │                          │
│  └────────────────────┘              │ [שמור סקשן]              │
│                                      └──────────────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### צפייה בתיק מאושר

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 תוכנית בטיחות לייזר 2025                                   │
│  רול פרופיל בע"מ                                               │
│                                                                 │
│  סטטוס: ✅ מאושר    תוקף: 31/12/2025    גרסה: 1               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✅ אושר בתאריך 01/01/2025                              │   │
│  │  ע"י: מישל מזור (ממונה בטיחות לייזר)                    │   │
│  │  ✍️ [חתימה]                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [ייצא PDF]  [שכפל לשנה הבאה]  [היסטוריה]                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📑 תוכן העניינים                                              │
│  ────────────────────────────────────────────────────────────── │
│  1. נתוני רקע ................................................ 2│
│  2. מערך הבטיחות ............................................ 3│
│  3. פרטי הלייזר ............................................. 4│
│  4. הערכת סיכונים ........................................... 5│
│  5. אמצעי בטיחות ............................................ 6│
│  6. הדרכות .................................................. 7│
│  7. נהלי חירום .............................................. 8│
│  8. חתימות ואישורים ......................................... 9│
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📄 1. נתוני רקע                                               │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  שם החברה:        רול פרופיל בע"מ                              │
│  כתובת:           צור 9, כרמיאל                                │
│  טלפון:           04-1234567                                   │
│                                                                 │
│  ... (המשך התוכן)                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### מסך אישור (לממונה)

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 אישור תיק בטיחות                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📁 תוכנית בטיחות לייזר 2025                                   │
│  🏢 רול פרופיל בע"מ                                            │
│  📅 נשלח לאישור: 30/12/2025                                    │
│  👤 נשלח ע"י: עובד א'                                          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📊 סיכום:                                                     │
│  • 8 סקשנים הושלמו מתוך 8                                      │
│  • 45 שדות חובה מולאו מתוך 45                                  │
│  • 3 מסמכים מצורפים                                            │
│                                                                 │
│  [צפה בתיק המלא]                                               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✍️ חתימה דיגיטלית:                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │                    [אזור חתימה]                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│  [נקה חתימה]                                                   │
│                                                                 │
│  📝 הערות (אופציונלי):                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [❌ דחה]                                      [✅ אשר תיק]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 תהליכי עבודה (Workflows)

### 1. יצירת תיק בטיחות חדש

```
┌─────────────────────────────────────────────────────────────────┐
│  1. בחירת לקוח                                                 │
│     └── מהרשימה או מדף הלקוח                                   │
│                              ↓                                  │
│  2. בחירת תבנית                                                │
│     ├── מתבניות הTenant                                        │
│     └── מספריית תבניות מערכת                                   │
│                              ↓                                  │
│  3. הזנת פרטים בסיסיים                                         │
│     ├── כותרת                                                  │
│     ├── תיאור                                                  │
│     ├── תאריך תוקף                                             │
│     └── אחראי                                                  │
│                              ↓                                  │
│  4. נוצר SafetyFile                                            │
│     ├── status: draft                                          │
│     ├── sections נוצרים מהתבנית                                │
│     └── fields נוצרים ריקים                                    │
│                              ↓                                  │
│  5. Audit Log נרשם                                              │
│                              ↓                                  │
│  6. מעבר למסך עריכה                                            │
└─────────────────────────────────────────────────────────────────┘
```

### 2. מילוי ועריכת תיק

```
┌─────────────────────────────────────────────────────────────────┐
│  1. כניסה למסך עריכה                                           │
│                              ↓                                  │
│  2. בחירת סקשן                                                 │
│                              ↓                                  │
│  3. מילוי שדות                                                 │
│     ├── תיקוף בזמן אמת                                         │
│     └── שמירה אוטומטית (כל שינוי)                              │
│                              ↓                                  │
│  4. עדכון התקדמות                                              │
│     ├── progress.completedFields++                             │
│     └── progress.percentage מחושב                              │
│                              ↓                                  │
│  5. status: draft → in_progress (אוטומטי)                      │
│                              ↓                                  │
│  6. Audit Log נרשם (כל שינוי משמעותי)                          │
└─────────────────────────────────────────────────────────────────┘
```

### 3. שליחה לאישור

```
┌─────────────────────────────────────────────────────────────────┐
│  1. לחיצה על "שלח לאישור"                                      │
│                              ↓                                  │
│  2. בדיקת שלמות                                                │
│     ├── כל שדות החובה מולאו?                                   │
│     └── כל הסקשנים הושלמו?                                     │
│                              ↓                                  │
│            ┌────────┴────────┐                                  │
│            ↓                 ↓                                  │
│        ❌ חסר            ✅ שלם                                 │
│     הצג שגיאות       status: pending_approval                  │
│                              ↓                                  │
│                    3. יצירת Approval record                    │
│                       action: submitted                        │
│                              ↓                                  │
│                    4. שליחת התראה לממונה                       │
│                       (Email + Push)                           │
│                              ↓                                  │
│                    5. Audit Log נרשם                            │
└─────────────────────────────────────────────────────────────────┘
```

### 4. אישור/דחייה

```
┌─────────────────────────────────────────────────────────────────┐
│  ממונה בטיחות מקבל התראה                                       │
│                              ↓                                  │
│  כניסה למסך אישור                                              │
│                              ↓                                  │
│  סקירת התיק                                                    │
│                              ↓                                  │
│            ┌────────┴────────┐                                  │
│            ↓                 ↓                                  │
│        ❌ דחייה          ✅ אישור                              │
│            │                 │                                  │
│            ↓                 ↓                                  │
│     הזנת סיבה          חתימה דיגיטלית                         │
│            │                 │                                  │
│            ↓                 ↓                                  │
│  status: rejected     status: approved                         │
│            │                 │                                  │
│            ↓                 ↓                                  │
│  התראה לשולח          approvedAt = now                        │
│  "דרוש תיקון"         approvedBy = userId                     │
│            │                 │                                  │
│            ↓                 ↓                                  │
│     Audit Log           Audit Log                              │
│            │                 │                                  │
│            ↓                 ↓                                  │
│     חוזר לעריכה        התראה ללקוח                            │
│                        "התיק אושר"                             │
└─────────────────────────────────────────────────────────────────┘
```

### 5. חידוש תיק שפג תוקפו

```
┌─────────────────────────────────────────────────────────────────┐
│  1. תיק עם validUntil < today                                  │
│     └── status: approved → expired (אוטומטי)                   │
│                              ↓                                  │
│  2. התראה לממונה ולקוח                                         │
│     └── "תיק בטיחות פג תוקף"                                   │
│                              ↓                                  │
│  3. לחיצה על "חדש תיק"                                         │
│                              ↓                                  │
│  4. נוצר תיק חדש                                               │
│     ├── version++                                              │
│     ├── previousVersionId = oldFileId                          │
│     ├── תוכן מועתק מהתיק הקודם                                 │
│     ├── validFrom = today                                      │
│     └── validUntil = today + 1 year                            │
│                              ↓                                  │
│  5. תיק ישן מועבר לארכיון                                      │
│     └── status: archived                                       │
│                              ↓                                  │
│  6. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 מבנה קבצים

```
frontend/src/
├── types/
│   └── safetyFile.ts              # SafetyFile, Section, Field, etc.
│
├── hooks/
│   ├── useSafetyFiles.ts          # CRUD safety files
│   ├── useSafetyFile.ts           # Single file operations
│   ├── useSafetyFileSections.ts   # Section operations
│   └── useSafetyFileApproval.ts   # Approval workflow
│
├── pages/admin/
│   └── safety-files/
│       ├── SafetyFilesPage.tsx        # רשימת תיקים (כל הלקוחות)
│       ├── ClientSafetyFilesPage.tsx  # רשימת תיקים ללקוח
│       ├── SafetyFileDetailPage.tsx   # צפייה/עריכה
│       ├── CreateSafetyFilePage.tsx   # יצירת תיק חדש
│       ├── SafetyFileApprovalPage.tsx # מסך אישור
│       ├── PendingApprovalsPage.tsx   # ממתינים לאישור
│       └── ExpiringSoonPage.tsx       # עומדים לפוג
│
├── components/
│   └── safety-files/
│       ├── SafetyFileCard.tsx         # כרטיס תיק
│       ├── SafetyFileStatusBadge.tsx  # תג סטטוס
│       ├── SafetyFileProgress.tsx     # מד התקדמות
│       ├── SectionsList.tsx           # רשימת סקשנים
│       ├── SectionEditor.tsx          # עריכת סקשן
│       ├── FieldRenderer.tsx          # רינדור שדה לפי סוג
│       ├── ApprovalPanel.tsx          # פאנל אישור
│       ├── SignatureCanvas.tsx        # קנבס חתימה
│       ├── AttachmentsList.tsx        # רשימת מצורפים
│       ├── AttachmentUploader.tsx     # העלאת קבצים
│       └── VersionHistory.tsx         # היסטוריית גרסאות
│
└── utils/
    ├── safetyFileValidation.ts    # תיקוף שלמות
    └── safetyFileProgress.ts      # חישוב התקדמות
```

---

## 🔥 Firestore Security Rules (הוספה)

```javascript
// בתוך /tenants/{tenantId}/clients/{clientId}
match /safetyFiles/{fileId} {
  allow read: if isTenantMember(tenantId) && canViewClient(tenantId, clientId);
  allow create: if isTenantMember(tenantId) && 
    canViewClient(tenantId, clientId) &&
    getTenantUser(tenantId).permissions.safetyFiles.create == true;
  allow update: if isTenantMember(tenantId) && 
    canViewClient(tenantId, clientId) &&
    getTenantUser(tenantId).permissions.safetyFiles.edit == true;
  allow delete: if isTenantAdmin(tenantId);
  
  // היסטוריה
  match /history/{historyId} {
    allow read: if isTenantMember(tenantId) && canViewClient(tenantId, clientId);
    allow create: if isTenantMember(tenantId);
    allow update, delete: if false;
  }
}
```

---

## ⏰ התראות אוטומטיות

| אירוע | מתי | למי | ערוץ |
|-------|-----|-----|------|
| תיק נשלח לאישור | מיידי | ממונה בטיחות | Email, Push |
| תיק אושר | מיידי | יוצר התיק + לקוח | Email, Push |
| תיק נדחה | מיידי | יוצר התיק | Email, Push |
| תיק עומד לפוג | 60, 30, 14, 7 ימים לפני | ממונה + לקוח | Email |
| תיק פג תוקף | מיידי | ממונה + לקוח | Email, Push |

---

## ✅ Checklist לפיתוח

### Types
- [ ] `types/safetyFile.ts` - SafetyFile, Section, Field, Approval, Attachment

### Hooks
- [ ] `useSafetyFiles.ts` - List, create, delete
- [ ] `useSafetyFile.ts` - Get, update, submit, approve, reject
- [ ] `useSafetyFileSections.ts` - Section operations
- [ ] `useSafetyFileApproval.ts` - Approval workflow

### Pages
- [ ] SafetyFilesPage - רשימה כללית
- [ ] ClientSafetyFilesPage - רשימה ללקוח
- [ ] SafetyFileDetailPage - צפייה/עריכה
- [ ] CreateSafetyFilePage - יצירת תיק
- [ ] SafetyFileApprovalPage - מסך אישור
- [ ] PendingApprovalsPage - ממתינים
- [ ] ExpiringSoonPage - עומדים לפוג

### Components
- [ ] SafetyFileCard
- [ ] SafetyFileStatusBadge
- [ ] SafetyFileProgress
- [ ] SectionsList
- [ ] SectionEditor
- [ ] FieldRenderer (כל סוגי השדות)
- [ ] ApprovalPanel
- [ ] SignatureCanvas
- [ ] AttachmentsList
- [ ] AttachmentUploader
- [ ] VersionHistory

### Utils
- [ ] safetyFileValidation.ts
- [ ] safetyFileProgress.ts

### Notifications
- [ ] התראת שליחה לאישור
- [ ] התראת אישור/דחייה
- [ ] התראות תפוגה

---

## 📅 אבני דרך

| שבוע | משימות |
|------|---------|
| **1** | Types, Hooks בסיסיים, מבנה נתונים |
| **2** | SafetyFilesPage, CreateSafetyFilePage |
| **3** | SafetyFileDetailPage - צפייה ועריכה בסיסית |
| **4** | SectionEditor, FieldRenderer - כל סוגי השדות |
| **5** | Approval workflow, SignatureCanvas |
| **6** | Attachments, Versions, Notifications, Testing |

---

## 🔗 קשר למודולים אחרים

| מודול | קשר |
|-------|------|
| **Phase 1: Foundation** | משתמש ב-Client, User, Permissions |
| **Phase 2: Template Builder** | תיק נוצר מתבנית |
| **Phase 4: Inspections** | דוח ביקורת יכול להיות מקושר לתיק |
| **Phase 5: Findings** | ליקויים יכולים להיות מקושרים לתיק |
| **Phase 6: Client Portal** | לקוח רואה את התיקים שלו |
| **Phase 9: PDF Export** | ייצוא תיק ל-PDF |

---

*מסמך זה יעודכן במהלך הפיתוח*

**גרסה:** 1.0  
**תאריך:** 31/12/2025  
**נכתב ע"י:** Claude + Michel Mazor
