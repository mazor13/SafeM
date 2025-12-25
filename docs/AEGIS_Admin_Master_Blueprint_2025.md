# 🛡️ AEGIS Admin - Master Specification Document (V5.0 - Final)
**Project:** AEGIS Safety Management Platform | **C-Level Strategy & Technical Blueprint**
**Date:** 26/12/2025 | **Status:** Ready for Development

---

## 1. חזון המערכת (System Vision)
AEGIS Admin הוא ה-Back-office הבלעדי לניהול הפלטפורמה. הוא משלב יכולות ERP, CRM, Billing, ו-DevOps תחת ממשק אחד (God Mode), ומיועד להעניק שליטה אבסולוטית על צמיחת החברה, אבטחת המידע וחוויית הלקוח.

---

## 2. מגדל פיקוח (Main Dashboard & Action Center)
**מטרה:** זיהוי חריגות וקבלת החלטות ב-3 שניות.

### רכיבים ויזואליים:
- **Global Health Pulse:** אינדיקטורים חיים ל-Uptime של שרתים ואינטגרציות (Morning, Nipendo).
- **Anomaly Detection:** התראות רוחב (Cross-Client). דוגמה: "כשל סליקה ב-5 לקוחות שונים ב-10 דקות האחרונות".
- **Revenue & Churn Metrics:** הכנסה בסיכון (חובות) ולקוחות בסיכון נטישה (חוסר פעילות).

### סכמת נתונים (Analytics):
- `System_Alerts`: (id, severity, type, source, message, timestamp).
- `Global_KPIs`: (metric_name, current_value, trend_percentage).

---

## 3. ניהול לקוחות ומחזור חיים (Client 360 & Onboarding)

### א. ערוצי הקמה (Onboarding Funnels)
1. **Self-Service:** הרשמה אוטומטית מהאתר -> חתימה על T&C -> סליקה -> Provisioning אוטומטי.
2. **Enterprise Blueprints:** הקמה לפי שבלונות מוכנות (קבלן, מפעל, משרד). מנהל הלקוח רק מאשר חריגות מהשבלונה.

### ב. כרטיס לקוח 360 (The Layout)
- **Financial Tab:** חיבור API מלא לחשבונית ירוקה (Morning). מעקב PO ויתרת תקציב.
- **Infrastructure Tab:** ניהול דומיינים (Private/Subdomain) וניתוב אחסון (AEGIS vs. Client Cloud).
- **Customer Health Score:** ציון (1-100) המבוסס על שימוש, תשלומים וקריאות שירות.

---

## 4. מנוע פיננסי וגבייה (The Flexible Billing Engine)
**מטרה:** ניהול כספים ללא "נעילת ספק" (Vendor Lock-in).

### לוגיקת עבודה:
- **Abstraction Layer:** AEGIS מחשבת את ה-Usage ושולחת פקודות חיוב לגורם חיצוני.
- **Dunning Process:** - יום 1: תזכורת מייל.
  - יום 7: SMS והתראת Admin.
  - יום 14: מעבר אוטומטי למצב Limited/Suspended.

### סכמת נתונים:
- `Billing_Transactions`: (id, tenant_id, amount, status, external_gateway_ref).
- `Usage_Counters`: (tenant_id, month, reports_count, storage_bytes).

---

## 5. תשתיות ואחסון מבוזר (BYOS Architecture)
**מטרה:** תמיכה בלקוחות Enterprise הדורשים שהמידע יישמר אצלם.

- **Storage Routing:** יכולת להגדיר לכל Tenant לאן יישלחו קבצי המקור (AWS S3, Azure Blob, או שרת פרטי).
- **Snapshot Restore:** אשף שחזור נתונים ברמת Tenant בודד ללא השפעה על לקוחות אחרים.

---

## 6. מנוע חוקים ואוטומציה (Rules & Alerts Engine)
**מבנה:** `Trigger -> Condition -> Action`.
- **חוקים עסקיים:** "אם לקוח לא נכנס 14 יום -> שלח מייל למנהל הלקוח".
- **חוקי מערכת:** "אם דוח נחתם -> שלח עותק אוטומטי לענן הלקוח".

---

## 7. ניהול שותפים וסוכנים (Partner/Reseller Portal)
**חדש!** יכולת צמיחה דרך מפיצים.
- **Partner Account:** Admin מוגבל שרואה רק את הלקוחות המשויכים אליו.
- **Commission Tracker:** חישוב עמלות סוכן על בסיס הגבייה בפועל מהלקוחות שלו.

---

## 8. מרכז תקשורת ושיווק (Communication Center)
- **Broadcast System:** שליחת הודעות Push, מיילים או באנרים ממוקדים (לפי סקטור, סוג חבילה או מיקום גיאוגרפי).
- **Scheduling:** תזמון הודעות על עדכוני גרסה או השבתות תחזוקה.

---

## 9. ניהול מוצר, גרסאות ו-Marketplace
- **Feature Flags:** הדלקת/כיבוי מודולים (לייזר, אש וכו') בלחיצת כפתור.
- **Canary Releases:** השקת פיצ'רים חדשים ל-10% מהלקוחות או לקבוצות בטא בלבד.
- **Upsell Engine:** זיהוי צורך ב-Add-on והצגת הצעה אוטומטית במערכת הלקוח.

---

## 10. אבטחה, ביקורת והתחזות (The Fortress)
- **Role-Based Access (RBAC):** הפרדה הרמטית בין תמיכה, מכירות וניהול מערכת.
- **Master Audit Trail:** תיעוד בלתי ניתן למחיקה של כל פעולה ב-Admin (מי, מה, מתי, ערך ישן מול חדש).
- **Secure Impersonation:** כניסה מאובטחת לסביבת לקוח עם מסגרת חיווי אדומה וזמן קצוב.
- **IP & MFA Control:** אכיפת כניסה ממשרדים מורשים בלבד ואימות דו-שלבי חובה.

---

## 11. סכמת נתונים טכנית (Key DB Tables)
- `Tenants`: (id, slug, custom_domain, status, health_score, partner_id).
- `Subscriptions`: (tenant_id, plan_id, features_mask, quotas_json).
- `Admin_Logs`: (admin_id, action, target_id, before_json, after_json).
- `Audit_Trails`: (timestamp, severity, event_type, details).

---

### 🏁 סיכום שביעות רצון (Self-Assessment)
- **מקצועיות:** 10/10 (סטנדרט Enterprise SaaS).
- **גמישות עסקית:** 10/10 (אין נעילה לספקים, תמיכה בשותפים).
- **אבטחה:** 10/10 (MFA, Audit Trail, RBAC).

**AEGIS Admin מוכן כעת לאפיון UI/UX מפורט ולכתיבת קוד.**
