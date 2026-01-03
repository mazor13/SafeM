# AEGIS - ניהול משימות

## 📚 קבצי תיעוד

| קובץ | תיאור |
|------|--------|
| [docs/WORKPLAN.md](docs/WORKPLAN.md) | תוכנית עבודה מפורטת עם משימות |
| [docs/BUGS.md](docs/BUGS.md) | מעקב באגים |
| [docs/SPEC_EQUIPMENT_FORM.md](docs/SPEC_EQUIPMENT_FORM.md) | אפיון טופס ציוד |
| [CHANGELOG.md](CHANGELOG.md) | היסטוריית שינויים |

---

## 🎯 Sprint נוכחי: Client Portal

**מטרה:** חיבור Client Dashboard הקיים

| # | משימה | סטטוס | עדיפות |
|---|--------|--------|---------|
| 001 | הוספת Routes | ⬜ | 🔴 |
| 002 | בדיקת ClientEquipment | ⬜ | 🔴 |
| 003 | Firestore Rules | ⬜ | 🔴 |
| 004 | השלמת Overview | ⬜ | 🟡 |
| 005 | השלמת Inspections | ⬜ | 🟡 |

**לפרטים מלאים:** [docs/WORKPLAN.md](docs/WORKPLAN.md)

---

## ⚡ פקודות מהירות
```bash
# התחל לעבוד על משימה
git checkout -b feature/TASK-XXX

# סיים משימה
git add .
git commit -m "feat: TASK-XXX - תיאור"
git push origin feature/TASK-XXX

# מזג ל-main
git checkout main
git merge feature/TASK-XXX
git push
```

---

## 🏗️ ארכיטקטורה
```
/admin/*     → Super Admin (Platform Owner)
/dashboard/* → Tenant (Safety Consultant)  
/portal/*    → Client Portal (End Customer)
```

עודכן: 2026-01-03
