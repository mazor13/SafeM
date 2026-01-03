# אפיון טופס הוספת/עריכת ציוד

## 📋 סקירה כללית

| פרט | ערך |
|-----|-----|
| Route (הוספה) | `/admin/equipment/new` |
| Route (עריכה) | `/admin/equipment/:id/edit` |
| קומפוננטה | `EquipmentFormPage.tsx` |
| Hook | `useEquipment` מ-`phase4-equipment` |
| פעולות | `addEquipment()`, `updateEquipment()` |

---

## 🏗️ מבנה הטופס

### שלב 1: פרטים בסיסיים (חובה)

| שדה | סוג | חובה | תיאור |
|-----|-----|------|-------|
| `name` | text | ✅ | שם הציוד |
| `domain` | select | ✅ | תחום בטיחות (SafetyDomain) |
| `equipmentTypeId` | select | ✅ | סוג ציוד (מסונן לפי domain) |
| `clientId` | select | ✅ | לקוח |
| `status` | select | ✅ | סטטוס (active/inactive/maintenance/retired) |

### שלב 2: זיהוי

| שדה | סוג | חובה | תיאור |
|-----|-----|------|-------|
| `serialNumber` | text | ❌ | מספר סידורי |
| `internalId` | text | ❌ | מזהה פנימי |
| `registrationNumber` | text | ❌ | מספר רישום משרד העבודה |

### שלב 3: יצרן ומפרט

| שדה | סוג | חובה | תיאור |
|-----|-----|------|-------|
| `manufacturer` | text | ❌ | יצרן |
| `model` | text | ❌ | דגם |
| `manufactureYear` | number | ❌ | שנת ייצור (1950-2026) |
| `installationDate` | date | ❌ | תאריך התקנה |

### שלב 4: מיקום

| שדה | סוג | חובה | תיאור |
|-----|-----|------|-------|
| `locationId` | select | ❌ | מיקום (מתוך מיקומי הלקוח) |
| `locationDescription` | text | ❌ | תיאור מיקום חופשי |

### שלב 5: בדיקות

| שדה | סוג | חובה | תיאור |
|-----|-----|------|-------|
| `inspectionFrequencyMonths` | number | ✅ | תדירות בדיקה (חודשים) - נקבע אוטומטית לפי סוג |
| `lastInspectionDate` | date | ❌ | תאריך בדיקה אחרונה |
| `nextInspectionDate` | date | ❌ | תאריך בדיקה הבאה (מחושב אוטומטית) |
| `certificateNumber` | text | ❌ | מספר תעודה |
| `certificateExpiry` | date | ❌ | תוקף תעודה |

### שלב 6: הערות

| שדה | סוג | חובה | תיאור |
|-----|-----|------|-------|
| `description` | textarea | ❌ | תיאור |
| `notes` | textarea | ❌ | הערות |

---

## 🔄 לוגיקה דינמית

### 1. סינון סוגי ציוד לפי תחום
```typescript
// כשמשתנה domain, מסננים את equipmentTypeId
const filteredTypes = EQUIPMENT_TYPES.filter(t => t.domain === selectedDomain);
```

### 2. תדירות בדיקה אוטומטית
```typescript
// כשנבחר סוג ציוד, מוגדרת תדירות בדיקה אוטומטית
const selectedType = EQUIPMENT_TYPES.find(t => t.id === equipmentTypeId);
if (selectedType) {
  setInspectionFrequencyMonths(selectedType.inspectionFrequency);
}
```

### 3. חישוב בדיקה הבאה
```typescript
// אם יש תאריך בדיקה אחרונה, מחשבים את הבאה
if (lastInspectionDate && inspectionFrequencyMonths) {
  const next = new Date(lastInspectionDate);
  next.setMonth(next.getMonth() + inspectionFrequencyMonths);
  setNextInspectionDate(next);
}
```

### 4. טעינת לקוחות
```typescript
// טוענים לקוחות מ-Firestore
const { clients } = useClients(); // או fetch ישיר
```

---

## ✅ Validation Rules

| שדה | כללים |
|-----|--------|
| `name` | חובה, מינימום 2 תווים, מקסימום 100 |
| `domain` | חובה, ערך מ-SafetyDomain |
| `equipmentTypeId` | חובה, ערך מ-EQUIPMENT_TYPES |
| `clientId` | חובה, קיים ב-clients collection |
| `status` | חובה, ערך מ-EquipmentStatus |
| `manufactureYear` | אם קיים: 1950-שנה נוכחית |
| `inspectionFrequencyMonths` | חובה, 1-60 |
| `serialNumber` | אם קיים: מקסימום 50 תווים |

---

## 🎨 עיצוב UI

### Layout
```
┌─────────────────────────────────────────────────┐
│  [←] הוספת ציוד חדש                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ פרטים בסיסיים                            │   │
│  │ ┌─────────────┐ ┌─────────────────────┐ │   │
│  │ │ שם הציוד *  │ │ תחום בטיחות *       │ │   │
│  │ └─────────────┘ └─────────────────────┘ │   │
│  │ ┌─────────────────────┐ ┌─────────────┐ │   │
│  │ │ סוג ציוד *           │ │ לקוח *      │ │   │
│  │ └─────────────────────┘ └─────────────┘ │   │
│  │ ┌─────────────┐                         │   │
│  │ │ סטטוס *     │                         │   │
│  │ └─────────────┘                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ זיהוי                                    │   │
│  │ ┌─────────────┐ ┌─────────────┐         │   │
│  │ │ מ"ס סידורי │ │ מזהה פנימי │         │   │
│  │ └─────────────┘ └─────────────┘         │   │
│  │ ┌─────────────────────┐                 │   │
│  │ │ מ"ס רישום מש"ע      │                 │   │
│  │ └─────────────────────┘                 │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ... (המשך סקשנים)                             │
│                                                 │
│  ┌──────────┐  ┌──────────────┐               │
│  │  ביטול   │  │  שמור ציוד   │               │
│  └──────────┘  └──────────────┘               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### צבעים
- Header: emerald-600 (ירוק)
- שדות חובה: כוכבית אדומה
- כפתור שמירה: emerald-600
- כפתור ביטול: slate-700
- שגיאות: rose-500

### רספונסיביות
- Desktop: 2 עמודות
- Tablet: 2 עמודות
- Mobile: עמודה אחת

---

## 📤 Submit Flow
```typescript
const handleSubmit = async (data: EquipmentFormData) => {
  try {
    setLoading(true);
    
    // Prepare data
    const equipmentData: Partial<Equipment> = {
      ...data,
      createdAt: new Date(),
      createdBy: user.uid,
      updatedAt: new Date(),
      updatedBy: user.uid,
      isDeleted: false,
    };
    
    // Save to Firestore
    const id = await addEquipment(equipmentData);
    
    // Show success
    toast.success('הציוד נוסף בהצלחה');
    
    // Navigate back
    navigate('/admin/equipment');
    
  } catch (error) {
    toast.error('שגיאה בשמירת הציוד');
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

---

## 📁 קבצים נדרשים

| קובץ | תיאור |
|------|-------|
| `pages/admin/equipment/EquipmentFormPage.tsx` | דף הטופס הראשי |
| `components/equipment/EquipmentForm.tsx` | קומפוננטת הטופס (אופציונלי) |

---

## 🔗 Dependencies

- `useEquipment` - לשמירת הציוד
- `useClients` או `useClientsSimple` - לטעינת לקוחות
- `EQUIPMENT_TYPES` - רשימת סוגי ציוד
- `SafetyDomain` - enum תחומים
- `EquipmentStatus` - enum סטטוסים
- `react-hook-form` - ניהול טופס (אופציונלי)
- `lucide-react` - אייקונים

---

## 🧪 Test Cases

1. **הוספת ציוד בסיסי** - מילוי שדות חובה בלבד
2. **הוספת ציוד מלא** - מילוי כל השדות
3. **Validation** - ניסיון לשמור ללא שדות חובה
4. **שינוי תחום** - וידוא שסוגי הציוד מתעדכנים
5. **ביטול** - חזרה לרשימה ללא שמירה
6. **עריכה** - טעינת נתונים קיימים ועדכון

---

## 📝 הערות ליישום

1. להשתמש ב-`useState` פשוט או `react-hook-form`
2. להוסיף loading state בזמן שמירה
3. להציג שגיאות validation ליד כל שדה
4. לא לשכוח RTL support
5. לטפל במקרה של לקוח ללא מיקומים


---

## 🔄 עדכון: תדירות בדיקה מותאמת אישית

### לוגיקה מעודכנת

תדירות הבדיקה נקבעת כך:
1. **ברירת מחדל**: לפי סוג הציוד (`EQUIPMENT_TYPES`)
2. **התאמה אישית**: הבודק יכול לשנות לפי הסכם עם הלקוח

### שדות נוספים

| שדה | סוג | תיאור |
|-----|-----|-------|
| `customFrequency` | boolean | האם תדירות מותאמת אישית |
| `frequencyNotes` | text | הערות לגבי התדירות המותאמת |

### UI Component
```
┌─────────────────────────────────────────────────────────┐
│ תדירות בדיקה                                            │
│                                                         │
│ ⚪ לפי תקן (12 חודשים - מטף אבקה)                       │
│ ⚫ תדירות מותאמת אישית                                  │
│                                                         │
│ ┌─────────────────┐                                     │
│ │ 6    │ חודשים   │  ← מופעל רק כשנבחר "מותאמת אישית"  │
│ └─────────────────┘                                     │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ הערות: הסכם מיוחד עם הלקוח - בדיקה חצי שנתית       │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### קוד לדוגמה
```typescript
const [useCustomFrequency, setUseCustomFrequency] = useState(false);
const [frequencyMonths, setFrequencyMonths] = useState(12);

// כשמשתנה סוג הציוד
useEffect(() => {
  if (!useCustomFrequency && selectedType) {
    setFrequencyMonths(selectedType.inspectionFrequency);
  }
}, [selectedType, useCustomFrequency]);
```
