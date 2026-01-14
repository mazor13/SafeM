# Dynamic Columns System

מערכת עמודות דינמיות בסגנון Monday.com עבור SafeM.

## 📁 קבצי המערכת

| קובץ | תיאור |
|------|-------|
| `CellFactory.tsx` | רנדור תאים לפי סוג עמודה |
| `ColumnManager.tsx` | ניהול עמודות (הוספה, מחיקה, עריכה) |
| `ColumnSettings.tsx` | הגדרות עמודה (שם, סוג, אפשרויות) |
| `ColumnReorder.tsx` | סידור מחדש של עמודות (drag & drop) |
| `DynamicTable.tsx` | טבלה דינמית עם כל הפיצ'רים |
| `columnTemplates.ts` | ספריית templates מוכנים |
| `index.ts` | ייצוא כל הקומפוננטות |

## 🚀 שימוש בסיסי
```tsx
import { DynamicTable } from '@/components/dynamic-columns';

function MyComponent() {
  return (
    <DynamicTable
      entityType="finding"
      entities={findings}
      tenantId={tenantId}
      onEntityClick={(entity) => navigate(`/findings/${entity.id}`)}
    />
  );
}
```

## 📊 סוגי עמודות נתמכים

| סוג | תיאור | שימוש |
|-----|-------|-------|
| `text` | טקסט חופשי | שמות, תיאורים, הערות |
| `number` | מספר עם פורמט | כמות, עלות, אחוזים |
| `status` | סטטוס צבעוני | מצב משימה, סטטוס ליקוי |
| `priority` | עדיפות/דחיפות | רמת סיכון, דחיפות |
| `date` | תאריך | תאריך יעד, תפוגה |
| `person` | משתמש/צוות | אחראי, מבצע |
| `file` | קובץ מצורף | מסמכים, תמונות |

## 🎨 Templates מוכנים

### קטגוריות Templates

| קטגוריה | Templates |
|---------|-----------|
| 🛡️ בטיחות | סטטוס ליקוי, רמת סיכון, תאימות, סטטוס ציוד |
| 📋 משימות | סטטוס משימה, עדיפות, אישור, התקדמות |
| 📅 תאריכים | תאריך יעד, בדיקה אחרונה/הבאה, תפוגה |
| 👥 אנשים | אחראי, צוות |
| 📝 כללי | הערות, אסמכתא, כן/לא, קבצים |
| 💰 כספים | עלות, כמות |

### שימוש ב-Templates
```tsx
import { 
  getTemplatesForEntity, 
  createColumnFromTemplate 
} from '@/components/dynamic-columns';

// קבלת templates רלוונטיים ל-entity
const templates = getTemplatesForEntity('finding');

// יצירת עמודה מ-template
const columnData = createColumnFromTemplate(
  templates[0],  // template
  'finding',     // entityType
  tenantId,      // tenantId
  5              // order
);
```

## ⚙️ הגדרת עמודה חדשה
```typescript
const newColumn: ColumnDefinition = {
  entityType: 'finding',
  type: 'status',
  title: 'סטטוס טיפול',
  width: 150,
  order: 10,
  required: false,
  visible: true,
  settings: {
    options: [
      { id: 'open', label: 'פתוח', color: '#ef4444' },
      { id: 'done', label: 'טופל', color: '#22c55e' },
    ],
    defaultOptionId: 'open',
  },
  tenantId: 'tenant-123',
};
```

## 📐 DynamicTable Props

| Prop | Type | תיאור |
|------|------|-------|
| `entityType` | `EntityType` | סוג הישות (required) |
| `entities` | `Entity[]` | רשימת הישויות (required) |
| `tenantId` | `string` | מזהה הטננט (required) |
| `onEntityClick` | `(entity) => void` | לחיצה על שורה |
| `onCellChange` | `(entityId, columnId, value) => void` | שינוי תא |
| `loading` | `boolean` | מצב טעינה |

## 🎯 ביצועים (Performance)

המערכת כוללת אופטימיזציות:

- **React.memo** על CellFactory ו-HeaderCell
- **Debounce** על שינוי רוחב עמודות (300ms)
- **Custom comparison** למניעת re-renders מיותרים

## 📝 Firestore Structure
```
tenants/{tenantId}/
  columnDefinitions/{columnId}     # הגדרות עמודות
  {entityType}/{entityId}/
    dynamicColumns/{columnId}      # ערכי תאים
```

## 🔗 קישורים

- [Types](../../types/columns.ts)
- [Hooks](../../hooks/useColumns.ts)
