# AEGIS - תוכנית עבודה

## 📋 מתודולוגיה

### מבנה משימות
כל Sprint מכיל משימות עם:
- `[ ]` = ממתין
- `[~]` = בתהליך  
- `[x]` = הושלם
- `[!]` = חסום

### קונבנציית Commits
```
feat: תכונה חדשה
fix: תיקון באג
refactor: שיפור קוד
docs: תיעוד
style: עיצוב
```

### Branch Strategy
```
main ← production
  └── develop ← integration
        ├── feature/client-portal
        ├── feature/tenant-dashboard
        └── fix/equipment-form
```

---

## 🎯 Sprint 1: Client Portal (נוכחי)

**תאריך:** 2026-01-03 → 2026-01-10  
**מטרה:** חיבור Client Dashboard הקיים ל-Routes

### TASK-001: הוספת Routes ל-Client Portal
**סטטוס:** `[ ]` ממתין  
**עדיפות:** 🔴 קריטי  
**קבצים:**
- `src/App.tsx`
- `src/layouts/ClientLayout.tsx`

**משימות משנה:**
- [ ] 001.1 - הוסף import ל-client-dashboard components
- [ ] 001.2 - הוסף Route `/portal/:clientId` עם ClientDashboardLayout
- [ ] 001.3 - הוסף nested routes: overview, equipment, inspections, documents, facilities
- [ ] 001.4 - בדוק שה-routes עובדים

**Definition of Done:**
- [ ] ניתן לגשת ל-`/portal/{clientId}`
- [ ] הסיידבר מציג את שם הלקוח
- [ ] כל הטאבים נטענים

---

### TASK-002: בדיקת ClientEquipment
**סטטוס:** `[ ]` ממתין  
**עדיפות:** 🔴 קריטי  
**תלוי ב:** TASK-001  
**קבצים:**
- `src/pages/client-dashboard/ClientEquipment.tsx`
- `src/providers/ClientProvider.tsx`

**משימות משנה:**
- [ ] 002.1 - וודא קריאה מ-`clients/{clientId}/equipment`
- [ ] 002.2 - בדוק טופס הוספת ציוד
- [ ] 002.3 - בדוק עריכת ציוד
- [ ] 002.4 - בדוק מחיקת ציוד

**Definition of Done:**
- [ ] ניתן לראות רשימת ציוד של לקוח
- [ ] ניתן להוסיף ציוד חדש
- [ ] הציוד נשמר ב-Firestore

---

### TASK-003: Firestore Rules ל-Client Portal
**סטטוס:** `[ ]` ממתין  
**עדיפות:** 🔴 קריטי  
**קבצים:**
- `firestore.rules`

**משימות משנה:**
- [ ] 003.1 - הוסף rule ל-`clients/{clientId}/equipment`
- [ ] 003.2 - וודא client יכול לקרוא רק את עצמו
- [ ] 003.3 - וודא tenant יכול לקרוא את כל הלקוחות שלו
- [ ] 003.4 - פרוס rules

**Definition of Done:**
- [ ] Client user רואה רק את הציוד שלו
- [ ] Tenant user רואה ציוד של כל הלקוחות שלו
- [ ] אין שגיאות permission denied

---

### TASK-004: השלמת Client Overview
**סטטוס:** `[ ]` ממתין  
**עדיפות:** 🟡 בינוני  
**תלוי ב:** TASK-002  
**קבצים:**
- `src/pages/client-dashboard/ClientOverview.tsx`

**משימות משנה:**
- [ ] 004.1 - הצג סטטיסטיקות ציוד (סה"כ, תקין, באיחור)
- [ ] 004.2 - הצג בדיקות קרובות
- [ ] 004.3 - הצג ממצאים פתוחים
- [ ] 004.4 - הצג ציון בריאות/ציות

**Definition of Done:**
- [ ] דף Overview מציג נתונים אמיתיים
- [ ] העיצוב תואם למערכת

---

### TASK-005: השלמת Client Inspections
**סטטוס:** `[ ]` ממתין  
**עדיפות:** 🟡 בינוני  
**תלוי ב:** TASK-002  
**קבצים:**
- `src/pages/client-dashboard/ClientInspections.tsx`

**משימות משנה:**
- [ ] 005.1 - הצג רשימת בדיקות (היסטוריה)
- [ ] 005.2 - הצג בדיקות מתוכננות
- [ ] 005.3 - אפשר צפייה בפרטי בדיקה
- [ ] 005.4 - אפשר הורדת דוח PDF

**Definition of Done:**
- [ ] לקוח רואה היסטוריית בדיקות
- [ ] לקוח רואה בדיקות קרובות

---

## 📊 סיכום Sprint 1

| משימה | סטטוס | עדיפות | הערות |
|--------|--------|---------|--------|
| TASK-001 | ממתין | 🔴 | Routes |
| TASK-002 | ממתין | 🔴 | Equipment |
| TASK-003 | ממתין | 🔴 | Rules |
| TASK-004 | ממתין | 🟡 | Overview |
| TASK-005 | ממתין | 🟡 | Inspections |

**Progress:** 0/5 (0%)

---

## 🔮 Sprint 2: Tenant Dashboard (הבא)

### TASK-006: TenantDashboardLayout
- [ ] יצירת layout לדשבורד יועץ
- [ ] Routes `/dashboard/*`
- [ ] סיידבר עם לקוחות

### TASK-007: רשימת לקוחות (Tenant View)
- [ ] דף רשימת לקוחות
- [ ] סטטיסטיקות לכל לקוח
- [ ] חיפוש וסינון

### TASK-008: הוספת לקוח חדש
- [ ] טופס יצירת לקוח
- [ ] הגדרת מודולים
- [ ] הגדרת אנשי קשר

---

## 🔮 Sprint 3: Integration & Polish

### TASK-009: Refactor Phase 4 Equipment
- [ ] תמיכה ב-clientId
- [ ] חיבור ל-sub-collection

### TASK-010: Inspection Execution
- [ ] טופס ביצוע בדיקה
- [ ] חתימה דיגיטלית
- [ ] יצירת דוח

---

## 📝 Change Log

| תאריך | משימה | סטטוס | הערות |
|--------|--------|--------|--------|
| 2026-01-03 | Initial | ✅ | יצירת תוכנית עבודה |

