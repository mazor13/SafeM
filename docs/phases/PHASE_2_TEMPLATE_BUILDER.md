# 🛠️ Phase 2: Template Builder - AEGIS Platform

## 📋 סקירה כללית

**שם המודול:** Template Builder  
**מטרה:** מערכת ליצירת תבניות דינמיות לטפסים, דוחות ותיקי בטיחות  
**תלויות:** Phase 1 (Foundation)  
**זמן פיתוח משוער:** 6-8 שבועות  

---

## 🎯 מה כולל המודול

| רכיב | תיאור | עדיפות |
|------|--------|--------|
| Template Designer | ממשק גרפי לבניית תבניות | 🔴 קריטי |
| Field Types | סוגי שדות שונים | 🔴 קריטי |
| Sections | ניהול סקשנים בתבנית | 🔴 קריטי |
| Conditional Logic | לוגיקה מותנית (הצג/הסתר) | 🟠 גבוה |
| Validation Rules | כללי תיקוף | 🟠 גבוה |
| Template Library | ספריית תבניות מוכנות | 🟡 בינוני |
| Template Versioning | גרסאות תבניות | 🟡 בינוני |
| Import/Export | ייבוא/ייצוא תבניות | 🟢 עתידי |

---

## 🎨 עקרון מפתח: גמישות מלאה

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   כל לקוח של המערכת (Tenant) יכול:                             │
│                                                                 │
│   ✅ ליצור תבניות מותאמות אישית                                │
│   ✅ להגדיר שדות לפי הצורך שלו                                 │
│   ✅ לקבוע סדר ומבנה של סקשנים                                 │
│   ✅ להגדיר לוגיקה מותנית                                      │
│   ✅ לשכפל ולערוך תבניות קיימות                                │
│   ✅ לשתף תבניות בין לקוחות                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 סוגי תבניות

| סוג | שימוש | דוגמה |
|-----|-------|-------|
| **SafetyPlan** | תוכנית בטיחות שנתית | תוכנית בטיחות לייזר |
| **Inspection** | דוח ביקורת | ביקורת רבעונית |
| **Checklist** | צ'קליסט בדיקה | בדיקה יומית/שבועית |
| **TrainingForm** | טופס הדרכה | אישור השתתפות בהדרכה |
| **IncidentReport** | דוח אירוע | דיווח על תקרית |
| **RiskAssessment** | הערכת סיכונים | סקר סיכונים |
| **Permit** | היתר/אישור | היתר עבודה חמה |
| **Custom** | מותאם אישית | כל דבר אחר |

---

## 🧩 סוגי שדות (Field Types)

### שדות בסיסיים

| סוג | שם | תיאור | דוגמה |
|-----|-----|-------|-------|
| `text` | טקסט קצר | שורה אחת | שם, כתובת |
| `textarea` | טקסט ארוך | מספר שורות | הערות, תיאור |
| `number` | מספר | ערך מספרי | כמות, אורך גל |
| `email` | אימייל | כתובת מייל | email@company.com |
| `phone` | טלפון | מספר טלפון | 050-1234567 |
| `date` | תאריך | בחירת תאריך | 31/12/2025 |
| `time` | שעה | בחירת שעה | 14:30 |
| `datetime` | תאריך ושעה | שניהם | 31/12/2025 14:30 |

### שדות בחירה

| סוג | שם | תיאור | דוגמה |
|-----|-----|-------|-------|
| `select` | בחירה מרשימה | Dropdown | סטטוס, סוג |
| `multiselect` | בחירה מרובה | בחירת כמה אפשרויות | תחומים, קטגוריות |
| `radio` | בחירה בודדת | Radio buttons | כן/לא/לא רלוונטי |
| `checkbox` | סימון | Checkbox בודד | אישור, הסכמה |
| `checkboxGroup` | קבוצת סימון | מספר Checkboxes | רשימת בדיקות |
| `toggle` | מתג | On/Off | פעיל/לא פעיל |

### שדות מתקדמים

| סוג | שם | תיאור | דוגמה |
|-----|-----|-------|-------|
| `image` | תמונה | העלאת תמונה | צילום ממצא |
| `file` | קובץ | העלאת קובץ | מסמך, PDF |
| `signature` | חתימה | חתימה דיגיטלית | חתימת ממונה |
| `table` | טבלה | טבלה דינמית | רשימת עובדים |
| `rating` | דירוג | כוכבים/ציון | 1-5 כוכבים |
| `location` | מיקום | GPS/כתובת | מיקום הביקורת |
| `qrcode` | QR Code | סריקת QR | זיהוי ציוד |

### שדות תצוגה

| סוג | שם | תיאור | דוגמה |
|-----|-----|-------|-------|
| `header` | כותרת | כותרת סקשן | "פרטי הארגון" |
| `paragraph` | פסקה | טקסט הסבר | הנחיות למילוי |
| `divider` | קו הפרדה | הפרדה ויזואלית | --- |
| `image_display` | תמונה קבועה | תמונה בתבנית | לוגו, תרשים |
| `calculated` | שדה מחושב | חישוב אוטומטי | סכום, ממוצע |

---

## 📐 מבנה תבנית (Template Structure)

```
┌─────────────────────────────────────────────────────────────────┐
│                        TEMPLATE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 מידע כללי (Metadata)                                       │
│  ├── שם התבנית                                                 │
│  ├── סוג התבנית                                                │
│  ├── תיאור                                                     │
│  └── גרסה                                                      │
│                                                                 │
│  📑 סקשנים (Sections)                                          │
│  │                                                              │
│  ├── 📁 סקשן 1: פרטי הארגון                                    │
│  │   ├── 📝 שדה: שם החברה (text)                               │
│  │   ├── 📝 שדה: כתובת (text)                                  │
│  │   └── 📝 שדה: טלפון (phone)                                 │
│  │                                                              │
│  ├── 📁 סקשן 2: פרטי הציוד                                     │
│  │   ├── 📝 שדה: סוג (select)                                  │
│  │   ├── 📝 שדה: יצרן (text)                                   │
│  │   ├── 📝 שדה: דגם (text)                                    │
│  │   └── 📊 טבלה: רשימת ציוד (table)                           │
│  │                                                              │
│  ├── 📁 סקשן 3: בדיקות                                         │
│  │   └── ☑️ צ'קליסט: פריטי בדיקה (checkboxGroup)               │
│  │                                                              │
│  └── 📁 סקשן 4: סיכום וחתימות                                  │
│      ├── 📝 שדה: הערות (textarea)                              │
│      ├── ✍️ שדה: חתימת ממונה (signature)                       │
│      └── 📅 שדה: תאריך (date)                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 מבנה נתונים (Database Schema)

### 1. Templates Collection
**נתיב:** `/tenants/{tenantId}/templates/{templateId}`

```typescript
interface Template {
  id: string;
  tenantId: string;
  
  // מידע בסיסי
  name: string;                    // "תוכנית בטיחות לייזר"
  description: string;             // תיאור התבנית
  type: TemplateType;              // סוג התבנית
  
  // קטגוריה ותגיות
  category: string;                // "לייזר" / "אש" / "כללי"
  tags: string[];                  // תגיות לחיפוש
  
  // גרסה
  version: number;                 // 1, 2, 3...
  versionNotes?: string;           // הערות לגרסה
  
  // מבנה התבנית
  sections: TemplateSection[];
  
  // הגדרות
  settings: TemplateSettings;
  
  // סטטוס
  status: 'draft' | 'published' | 'archived';
  
  // שיתוף
  isShared: boolean;               // משותף עם לקוחות
  sharedWithClientIds?: string[];  // לקוחות ספציפיים
  
  // ספריית תבניות (System)
  isSystemTemplate: boolean;       // תבנית מערכת
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  lastEditedBy: string;
}

type TemplateType = 
  | 'safety_plan'      // תוכנית בטיחות
  | 'inspection'       // דוח ביקורת
  | 'checklist'        // צ'קליסט
  | 'training_form'    // טופס הדרכה
  | 'incident_report'  // דוח אירוע
  | 'risk_assessment'  // הערכת סיכונים
  | 'permit'           // היתר
  | 'custom';          // מותאם אישית

interface TemplateSettings {
  // תצוגה
  showProgressBar: boolean;        // הצג התקדמות
  showSectionNumbers: boolean;     // מספור סקשנים
  allowSaveAsDraft: boolean;       // אפשר שמירה כטיוטה
  
  // PDF
  pdfSettings: {
    includeHeader: boolean;        // כותרת עליונה
    includeFooter: boolean;        // כותרת תחתונה
    includeLogo: boolean;          // לוגו
    pageSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
  };
  
  // תפוגה
  validityPeriod?: {
    enabled: boolean;
    months: number;                // תוקף בחודשים
  };
  
  // הרשאות
  permissions: {
    whoCanFill: 'tenant_users' | 'client_contacts' | 'both';
    requireApproval: boolean;      // דרוש אישור
    approverRoles: string[];       // מי יכול לאשר
  };
}
```

### 2. Template Sections
```typescript
interface TemplateSection {
  id: string;
  
  // מידע בסיסי
  title: string;                   // "פרטי הארגון"
  description?: string;            // הסבר לסקשן
  
  // סדר
  order: number;                   // 1, 2, 3...
  
  // שדות בסקשן
  fields: TemplateField[];
  
  // לוגיקה מותנית
  conditionalLogic?: ConditionalLogic;
  
  // הגדרות
  settings: {
    collapsible: boolean;          // ניתן לכווץ
    startCollapsed: boolean;       // מתחיל מכווץ
    repeatable: boolean;           // ניתן לשכפל (לסקשנים חוזרים)
    maxRepetitions?: number;       // מקסימום חזרות
  };
}
```

### 3. Template Fields
```typescript
interface TemplateField {
  id: string;
  sectionId: string;
  
  // סוג השדה
  type: FieldType;
  
  // מידע בסיסי
  label: string;                   // "שם החברה"
  placeholder?: string;            // "הזן שם..."
  helpText?: string;               // טקסט עזרה
  
  // סדר
  order: number;
  
  // ערך ברירת מחדל
  defaultValue?: any;
  
  // אפשרויות (לשדות בחירה)
  options?: FieldOption[];
  
  // הגדרות טבלה (לשדה table)
  tableConfig?: TableConfig;
  
  // תיקוף
  validation: FieldValidation;
  
  // לוגיקה מותנית
  conditionalLogic?: ConditionalLogic;
  
  // תצוגה
  display: {
    width: 'full' | 'half' | 'third'; // רוחב בשורה
    hidden: boolean;               // מוסתר כברירת מחדל
  };
}

type FieldType = 
  // בסיסיים
  | 'text' | 'textarea' | 'number' | 'email' | 'phone' 
  | 'date' | 'time' | 'datetime'
  // בחירה
  | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'checkboxGroup' | 'toggle'
  // מתקדמים
  | 'image' | 'file' | 'signature' | 'table' | 'rating' | 'location' | 'qrcode'
  // תצוגה
  | 'header' | 'paragraph' | 'divider' | 'image_display' | 'calculated';

interface FieldOption {
  value: string;
  label: string;
  color?: string;                  // צבע (לסטטוסים)
  icon?: string;                   // אייקון
}

interface FieldValidation {
  required: boolean;               // שדה חובה
  minLength?: number;              // אורך מינימלי
  maxLength?: number;              // אורך מקסימלי
  min?: number;                    // ערך מינימלי (למספרים)
  max?: number;                    // ערך מקסימלי
  pattern?: string;                // Regex pattern
  customMessage?: string;          // הודעת שגיאה מותאמת
}
```

### 4. Table Configuration
```typescript
interface TableConfig {
  columns: TableColumn[];
  minRows?: number;                // מינימום שורות
  maxRows?: number;                // מקסימום שורות
  allowAddRows: boolean;           // אפשר הוספת שורות
  allowDeleteRows: boolean;        // אפשר מחיקת שורות
  showRowNumbers: boolean;         // הצג מספור שורות
}

interface TableColumn {
  id: string;
  header: string;                  // כותרת העמודה
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  width?: string;                  // רוחב (px או %)
  options?: FieldOption[];         // לשדות select
  validation?: FieldValidation;
}
```

### 5. Conditional Logic
```typescript
interface ConditionalLogic {
  action: 'show' | 'hide' | 'require' | 'disable';
  conditions: Condition[];
  operator: 'and' | 'or';          // בין התנאים
}

interface Condition {
  fieldId: string;                 // איזה שדה בודקים
  operator: ConditionOperator;
  value: any;                      // הערך להשוואה
}

type ConditionOperator = 
  | 'equals'           // שווה
  | 'not_equals'       // לא שווה
  | 'contains'         // מכיל
  | 'not_contains'     // לא מכיל
  | 'greater_than'     // גדול מ
  | 'less_than'        // קטן מ
  | 'is_empty'         // ריק
  | 'is_not_empty'     // לא ריק
  | 'in'               // אחד מ (לרשימות)
  | 'not_in';          // לא אחד מ
```

### 6. Template Versions (History)
**נתיב:** `/tenants/{tenantId}/templates/{templateId}/versions/{versionId}`

```typescript
interface TemplateVersion {
  id: string;
  templateId: string;
  version: number;
  
  // תוכן הגרסה (snapshot מלא)
  snapshot: Template;
  
  // מידע
  notes?: string;                  // הערות לגרסה
  
  // מטא
  createdAt: Timestamp;
  createdBy: string;
}
```

---

## 🎨 ממשק בונה התבניות (Template Designer UI)

### מסך ראשי

```
┌─────────────────────────────────────────────────────────────────┐
│  🛠️ בונה תבניות                              [שמור] [תצוגה מקדימה] [פרסם] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐ ┌─────────────────────────────────────────────┐│
│  │             │ │                                             ││
│  │  📦 שדות   │ │              🖼️ אזור עריכה                   ││
│  │             │ │                                             ││
│  │  ─────────  │ │  ┌─────────────────────────────────────┐   ││
│  │  📝 טקסט   │ │  │ 📁 סקשן 1: פרטי הארגון      [⚙️] [🗑️] │   ││
│  │  🔢 מספר   │ │  │                                     │   ││
│  │  📅 תאריך  │ │  │  ┌─────────────────────────────┐   │   ││
│  │  📧 אימייל │ │  │  │ שם החברה          [⚙️] [🗑️] │   │   ││
│  │  📱 טלפון  │ │  │  │ [________________]          │   │   ││
│  │             │ │  │  └─────────────────────────────┘   │   ││
│  │  ─────────  │ │  │                                     │   ││
│  │  ☑️ בחירה  │ │  │  ┌─────────────────────────────┐   │   ││
│  │  📋 רשימה  │ │  │  │ כתובת             [⚙️] [🗑️] │   │   ││
│  │  🔘 רדיו   │ │  │  │ [________________]          │   │   ││
│  │             │ │  │  └─────────────────────────────┘   │   ││
│  │  ─────────  │ │  │                                     │   ││
│  │  📷 תמונה  │ │  └─────────────────────────────────────┘   ││
│  │  📎 קובץ   │ │                                             ││
│  │  ✍️ חתימה  │ │  [+ הוסף סקשן]                              ││
│  │  📊 טבלה   │ │                                             ││
│  │             │ │                                             ││
│  │  ─────────  │ └─────────────────────────────────────────────┘│
│  │  📌 כותרת  │ ┌─────────────────────────────────────────────┐│
│  │  📄 פסקה   │ │              ⚙️ הגדרות שדה                  ││
│  │  ➖ קו     │ │                                             ││
│  │             │ │  תווית: [שם החברה_______]                  ││
│  └─────────────┘ │  Placeholder: [הזן שם החברה]               ││
│                  │  טקסט עזרה: [_______________]              ││
│                  │                                             ││
│                  │  ☑️ שדה חובה                                ││
│                  │  ☐ הסתר שדה                                 ││
│                  │                                             ││
│                  │  רוחב: [● מלא ○ חצי ○ שליש]                ││
│                  │                                             ││
│                  │  [לוגיקה מותנית ▼]                          ││
│                  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### עריכת הגדרות שדה

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ הגדרות שדה: שם החברה                                [✕]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 כללי                                                       │
│  ────────────────────────────────────────────────────────────── │
│  תווית:        [שם החברה___________________]                   │
│  Placeholder:  [הזן את שם החברה המלא_______]                   │
│  טקסט עזרה:    [השם הרשום של החברה__________]                  │
│                                                                 │
│  ✓ תיקוף                                                       │
│  ────────────────────────────────────────────────────────────── │
│  ☑️ שדה חובה                                                   │
│  אורך מינימלי: [2__] תווים                                     │
│  אורך מקסימלי: [100_] תווים                                    │
│  הודעת שגיאה:  [נא להזין שם חברה תקין______]                   │
│                                                                 │
│  🎨 תצוגה                                                      │
│  ────────────────────────────────────────────────────────────── │
│  רוחב: [● מלא (100%) ○ חצי (50%) ○ שליש (33%)]                │
│  ☐ הסתר שדה כברירת מחדל                                        │
│                                                                 │
│  🔀 לוגיקה מותנית                                              │
│  ────────────────────────────────────────────────────────────── │
│  ☐ הפעל לוגיקה מותנית                                          │
│                                                                 │
│  [ביטול]                                           [שמור]      │
└─────────────────────────────────────────────────────────────────┘
```

### עריכת לוגיקה מותנית

```
┌─────────────────────────────────────────────────────────────────┐
│  🔀 לוגיקה מותנית                                       [✕]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  פעולה: [הצג שדה זה ▼]                                         │
│                                                                 │
│  כאשר [כל ▼] התנאים הבאים מתקיימים:                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ שדה: [סוג ציוד ▼]  תנאי: [שווה ל ▼]  ערך: [לייזר ▼]   │   │
│  │                                                  [🗑️]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ שדה: [דרגת סיכון ▼] תנאי: [גדול מ ▼]  ערך: [3____]    │   │
│  │                                                  [🗑️]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [+ הוסף תנאי]                                                 │
│                                                                 │
│  [ביטול]                                           [שמור]      │
└─────────────────────────────────────────────────────────────────┘
```

### עריכת טבלה

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 הגדרות טבלה: רשימת עובדים                           [✕]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  עמודות:                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ # │ כותרת        │ סוג      │ רוחב  │ חובה │         │   │
│  ├───┼──────────────┼──────────┼───────┼──────┼─────────┤   │
│  │ 1 │ שם העובד     │ טקסט     │ 30%   │ ☑️   │ [⚙️][🗑️] │   │
│  │ 2 │ ת.ז          │ מספר     │ 20%   │ ☑️   │ [⚙️][🗑️] │   │
│  │ 3 │ תפקיד        │ בחירה    │ 20%   │ ☐    │ [⚙️][🗑️] │   │
│  │ 4 │ תאריך הדרכה  │ תאריך    │ 15%   │ ☑️   │ [⚙️][🗑️] │   │
│  │ 5 │ בתוקף        │ סימון    │ 15%   │ ☐    │ [⚙️][🗑️] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [+ הוסף עמודה]                                                │
│                                                                 │
│  הגדרות:                                                       │
│  ────────────────────────────────────────────────────────────── │
│  מינימום שורות: [1__]                                          │
│  מקסימום שורות: [50_]                                          │
│  ☑️ אפשר הוספת שורות                                           │
│  ☑️ אפשר מחיקת שורות                                           │
│  ☑️ הצג מספור שורות                                            │
│                                                                 │
│  [ביטול]                                           [שמור]      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ ממשקים (UI Screens)

### Admin Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| Templates List | `/admin/templates` | רשימת תבניות |
| Template Designer | `/admin/templates/:id/edit` | עורך התבנית |
| Template Preview | `/admin/templates/:id/preview` | תצוגה מקדימה |
| Create Template | `/admin/templates/new` | יצירת תבנית חדשה |
| Template Library | `/admin/templates/library` | ספריית תבניות מוכנות |
| Template Versions | `/admin/templates/:id/versions` | היסטוריית גרסאות |

---

## 🔄 תהליכי עבודה (Workflows)

### 1. יצירת תבנית חדשה

```
┌─────────────────────────────────────────────────────────────────┐
│  1. בחירת סוג תבנית                                            │
│     └── inspection / safety_plan / checklist / custom          │
│                              ↓                                  │
│  2. בחירת נקודת התחלה                                          │
│     ├── מאפס (ריק)                                             │
│     ├── משכפול תבנית קיימת                                     │
│     └── מספריית תבניות                                         │
│                              ↓                                  │
│  3. הגדרת מידע בסיסי                                           │
│     ├── שם התבנית                                              │
│     ├── תיאור                                                  │
│     └── קטגוריה ותגיות                                         │
│                              ↓                                  │
│  4. בניית התבנית                                               │
│     ├── הוספת סקשנים                                           │
│     ├── הוספת שדות (גרירה)                                     │
│     ├── הגדרת תיקוף                                            │
│     └── הגדרת לוגיקה מותנית                                    │
│                              ↓                                  │
│  5. תצוגה מקדימה                                               │
│     └── בדיקת התבנית לפני פרסום                                │
│                              ↓                                  │
│  6. פרסום                                                      │
│     └── status: draft → published                              │
│                              ↓                                  │
│  7. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2. עדכון תבנית קיימת

```
┌─────────────────────────────────────────────────────────────────┐
│  1. עריכת תבנית                                                │
│     └── שינויים בשדות/סקשנים/הגדרות                            │
│                              ↓                                  │
│  2. שמירה כטיוטה                                               │
│     └── status: published → draft                              │
│                              ↓                                  │
│  3. פרסום גרסה חדשה                                            │
│     ├── version++                                              │
│     ├── נשמר snapshot בהיסטוריה                                │
│     └── status: draft → published                              │
│                              ↓                                  │
│  ⚠️ שים לב:                                                    │
│  ├── מסמכים קיימים נשארים עם הגרסה הישנה                       │
│  └── מסמכים חדשים ישתמשו בגרסה החדשה                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 מבנה קבצים

```
frontend/src/
├── types/
│   └── template.ts                # Template, Section, Field, etc.
│
├── hooks/
│   ├── useTemplates.ts            # CRUD templates
│   ├── useTemplateDesigner.ts     # לוגיקת עורך התבנית
│   └── useTemplateVersions.ts     # ניהול גרסאות
│
├── pages/admin/
│   └── templates/
│       ├── TemplatesPage.tsx      # רשימת תבניות
│       ├── TemplateDesigner.tsx   # עורך התבנית (המסך הראשי)
│       ├── TemplatePreview.tsx    # תצוגה מקדימה
│       ├── CreateTemplatePage.tsx # יצירת תבנית חדשה
│       ├── TemplateLibrary.tsx    # ספריית תבניות
│       └── TemplateVersions.tsx   # היסטוריית גרסאות
│
├── components/
│   └── templates/
│       ├── designer/
│       │   ├── DesignerCanvas.tsx     # אזור העריכה
│       │   ├── FieldPalette.tsx       # לוח השדות (שמאל)
│       │   ├── FieldSettingsPanel.tsx # פאנל הגדרות (ימין)
│       │   ├── SectionEditor.tsx      # עריכת סקשן
│       │   ├── FieldEditor.tsx        # עריכת שדה
│       │   ├── ConditionalLogicEditor.tsx
│       │   └── TableConfigEditor.tsx
│       │
│       ├── fields/                    # רכיבי שדות לרינדור
│       │   ├── TextField.tsx
│       │   ├── TextareaField.tsx
│       │   ├── NumberField.tsx
│       │   ├── DateField.tsx
│       │   ├── SelectField.tsx
│       │   ├── CheckboxField.tsx
│       │   ├── RadioField.tsx
│       │   ├── ImageField.tsx
│       │   ├── FileField.tsx
│       │   ├── SignatureField.tsx
│       │   ├── TableField.tsx
│       │   ├── RatingField.tsx
│       │   └── index.ts               # Field renderer
│       │
│       ├── preview/
│       │   ├── TemplatePreviewRenderer.tsx
│       │   └── SectionPreview.tsx
│       │
│       └── common/
│           ├── TemplateCard.tsx
│           ├── TemplateTypeSelector.tsx
│           └── VersionHistory.tsx
│
└── utils/
    ├── templateValidation.ts      # תיקוף ערכים לפי הגדרות
    ├── conditionalLogic.ts        # הערכת תנאים
    └── templateExport.ts          # ייצוא/ייבוא JSON
```

---

## 🔥 Firestore Security Rules (הוספה)

```javascript
// בתוך /tenants/{tenantId}
match /templates/{templateId} {
  allow read: if isTenantMember(tenantId);
  allow create: if isTenantMember(tenantId) && 
    getTenantUser(tenantId).permissions.settings.manageTemplates == true;
  allow update: if isTenantMember(tenantId) && 
    getTenantUser(tenantId).permissions.settings.manageTemplates == true;
  allow delete: if isTenantAdmin(tenantId);
  
  // גרסאות תבנית
  match /versions/{versionId} {
    allow read: if isTenantMember(tenantId);
    allow create: if isTenantMember(tenantId) && 
      getTenantUser(tenantId).permissions.settings.manageTemplates == true;
    allow update, delete: if false; // לא ניתן לשנות היסטוריה
  }
}
```

---

## 📋 ספריית תבניות מוכנות (System Templates)

### תבניות לייזר

| תבנית | תיאור |
|-------|-------|
| תוכנית בטיחות לייזר | תוכנית שנתית מלאה |
| ביקורת רבעונית לייזר | דוח ביקורת רבעוני |
| צ'קליסט יומי לייזר | בדיקה יומית |
| טופס הדרכת לייזר | אישור הדרכה |

### תבניות אש

| תבנית | תיאור |
|-------|-------|
| תוכנית בטיחות אש | תוכנית שנתית |
| ביקורת מטפים | בדיקת מטפי כיבוי |
| תרגיל פינוי | דוח תרגיל |

### תבניות כלליות

| תבנית | תיאור |
|-------|-------|
| סקר סיכונים | הערכת סיכונים |
| דוח תקרית | דיווח על אירוע |
| היתר עבודה חמה | אישור עבודה מסוכנת |
| צ'קליסט בטיחות כללי | בדיקה כללית |

---

## ✅ Checklist לפיתוח

### Types
- [ ] `types/template.ts` - Template, Section, Field, FieldType, etc.

### Hooks
- [ ] `useTemplates.ts` - CRUD operations
- [ ] `useTemplateDesigner.ts` - Designer state management
- [ ] `useTemplateVersions.ts` - Version history

### Pages
- [ ] TemplatesPage - רשימת תבניות
- [ ] TemplateDesigner - עורך ראשי
- [ ] CreateTemplatePage - אשף יצירה
- [ ] TemplatePreview - תצוגה מקדימה
- [ ] TemplateLibrary - ספריית תבניות
- [ ] TemplateVersions - היסטוריה

### Components - Designer
- [ ] DesignerCanvas - אזור עריכה עם Drag & Drop
- [ ] FieldPalette - לוח שדות
- [ ] FieldSettingsPanel - פאנל הגדרות
- [ ] SectionEditor - עריכת סקשן
- [ ] ConditionalLogicEditor - עורך לוגיקה
- [ ] TableConfigEditor - עורך טבלה

### Components - Fields
- [ ] TextField, TextareaField, NumberField
- [ ] DateField, TimeField, DateTimeField
- [ ] SelectField, MultiselectField
- [ ] RadioField, CheckboxField, ToggleField
- [ ] ImageField, FileField
- [ ] SignatureField
- [ ] TableField
- [ ] RatingField
- [ ] Header, Paragraph, Divider

### Utils
- [ ] templateValidation.ts
- [ ] conditionalLogic.ts
- [ ] templateExport.ts

### System Templates
- [ ] תבניות לייזר
- [ ] תבניות אש
- [ ] תבניות כלליות

---

## 📅 אבני דרך

| שבוע | משימות |
|------|---------|
| **1** | Types, Hooks בסיסיים, מבנה נתונים |
| **2** | TemplatesPage, CreateTemplatePage |
| **3** | DesignerCanvas, FieldPalette, Drag & Drop |
| **4** | FieldSettingsPanel, כל סוגי השדות הבסיסיים |
| **5** | שדות מתקדמים (Table, Signature, Image) |
| **6** | Conditional Logic, Validation |
| **7** | Preview, Versions, Library |
| **8** | System Templates, Testing, Polish |

---

## 🔗 קשר למודולים אחרים

| מודול | קשר |
|-------|------|
| **Phase 3: Safety Files** | משתמש בתבניות ליצירת תיקי בטיחות |
| **Phase 4: Inspections** | משתמש בתבניות ליצירת דוחות ביקורת |
| **Phase 6: Client Portal** | מציג טפסים למילוי ע"י הלקוח |
| **Phase 9: PDF Export** | מייצא תבניות ממולאות ל-PDF |

---

## 📝 הערות טכניות

1. **Drag & Drop:** להשתמש ב-`@dnd-kit/core` או `react-beautiful-dnd`
2. **חתימה דיגיטלית:** להשתמש ב-`react-signature-canvas`
3. **העלאת תמונות:** Firebase Storage
4. **שמירה אוטומטית:** Debounce של 2 שניות
5. **Undo/Redo:** לשמור היסטוריית פעולות

---

*מסמך זה יעודכן במהלך הפיתוח*

**גרסה:** 1.0  
**תאריך:** 31/12/2025  
**נכתב ע"י:** Claude + Michel Mazor
