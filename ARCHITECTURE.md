# 🏛️ AEGIS System Architecture & Master Spec

> **Version:** 1.0.0
> **Last Updated:** 2026-01-17
> **Status:** Approved for Development

---

## 1. 🎯 חזון המערכת (System Vision)
פלטפורמת SaaS Enterprise לניהול 360° של ארגונים, המשלבת CRM מתקדם, ניהול בטיחות, תפעול ופיננסים. המערכת תומכת במבנה Multi-Tenant עם הפרדת נתונים מוחלטת, מודל הרשאות דינמי, ויכולות התאמה אישית (Customization) לכל לקוח.

---

## 2. 🏗️ ארכיטקטורת ליבה (Core Architecture)

### 2.1 מבנה הנתונים (Data Hierarchy)
* **System (Root):** ניהול-על של הפלטפורמה.
* **Tenant (Organization):** הלקוח (חברה). יש לו מזהה ייחודי (`tenantId`) שמקושר לכל מסמך.
* **User:** משתמש בתוך Tenant, משוייך ל-Role ול-Department.

### 2.2 מודל אבטחה (Security Model)
* **Tenant Isolation:** כל שאילתה ל-DB חייבת לכלול `where('tenantId', '==', user.tenantId)`.
* **Soft Delete:** אין מחיקה פיזית. מסמכים מסומנים כ-`isDeleted: true` ונשמרים ל-Audit.
* **Audit Logs:** תיעוד מלא של כל פעולת Write (מי עשה, מתי, ומה הערך הישן/חדש).

### 2.3 ניהול רישוי וזכאויות (Entitlements Engine)
כל Tenant מחזיק אובייקט `settings` המגדיר:
* **Modules:** איזה מודולים פתוחים (CRM, Safety, Automation).
* **Quotas:** מגבלות שימוש (נפח אחסון, כמות משתמשים).
* **Features:** דגלים לפיצ'רים ספציפיים (Feature Flags) לניהול גרסאות בטא.

---

## 3. 🧩 מודולים עסקיים (Business Modules)

### 3.1 מנוע מכירות (Sales Engine)
* **Leads:** ניהול מתעניינים, מקורות הגעה, סטטוסים.
* **Opportunities (Pipeline):** ניהול עסקאות, שלבי מכירה (Kanban), הסתברות סגירה, קישור מוצרים.
* **Contacts:** אנשי קשר המקושרים ל-Tenant.
* **Goals & KPIs:** ניהול יעדים לסוכנים (כספי/כמותי) ומעקב ביצועים.
* **Commissions:** מנוע חישוב תמלוגים (מודל מדורג/בסיס).

### 3.2 בטיחות ותפעול (Safety & Ops)
* **Safety Files:** תיקי בטיחות לפי סוגים (אש, קרינה, לייזר).
* **Inspections:** ניהול סקרים ובדיקות תקופתיות.
* **Equipment:** ניהול ציוד, מלאי, וקטלוג גלובלי.

### 3.3 פיננסים ובילינג (Finance & Billing)
* **Internal Billing:** הפקת חשבוניות ללקוחות שלנו (SaaS Billing).
* **External Contracts (CLM):** מחולל חוזים דיגיטליים, חתימה מרחוק, ניהול חידושים.
* **Client Finance:** מודול עבור הלקוח לניהול הצעות מחיר וחשבוניות ללקוחותיו.

### 3.4 שותפים וסוכנים (PRM)
* **Partner Portal:** גישה מוגבלת למשווקים חיצוניים.
* **Attribution:** שיוך לידים לשותף וחישוב עמלות שותף.

---

## 4. 🌐 מעטפת אינטגרציה וחווית משתמש (UX & Connectivity)

### 4.1 Omnichannel Sync
* **Email Sync:** תצוגת תכתובות מייל בתוך כרטיס הלקוח.
* **Calendar:** סנכרון דו-כיווני (Google/Outlook) לפגישות.
* **Notifications:** מרכז התראות חכם (In-app, Email, SMS, Push) עם חוקים מותאמים אישית.

### 4.2 נגישות וגלובליזציה
* **Global Search:** חיפוש אחוד בכל הישויות (`Cmd+K`).
* **i18n:** תמיכה מלאה בריבוי שפות (RTL/LTR) ללא טקסטים Hardcoded.
* **Mobile First:** התאמת מסכי סוכנים ואנשי שטח למובייל.

### 4.3 API & Data
* **Webhooks:** נקודות קצה לקליטת לידים (Incoming) ועדכון מערכות חיצוניות (Outgoing).
* **Import/Export:** אשפי ייבוא (CSV Wizard) וייצוא נתונים גורף.

---

## 5. 🛠️ אופרציה וניהול (DevOps & Back-Office)

### 5.1 ניהול-על (Super Admin)
* **Tenant Management:** הקמה, הקפאה, וניהול חבילות של לקוחות.
* **Impersonation:** יכולת התחברות כמשתמש קצה לצורך תמיכה (Debug).
* **System Health:** דשבורד טכני לניטור שגיאות וביצועים.

### 5.2 אסטרטגיית הפצה (Deployment)
* **Feature Flags:** הפצת פיצ'רים כבויים והדלקה הדרגתית.
* **Release Rings:** הפצה מדורגת (Internal -> Beta -> GA).
* **Backward Compatibility:** שמירה על מבנה נתונים תואם לאחור למניעת שבירת גרסאות.

---

## 6. 📅 תוכנית עבודה (Roadmap Phases)

1.  **Phase 1: Sales Core:** לידים, הזדמנויות (Pipeline), אנשי קשר.
2.  **Phase 2: Entitlements:** תשתית הרשאות, חבילות, ומחיקה רכה.
3.  **Phase 3: Safety & Ops:** חיבור מלא של מודול הבטיחות והציוד ל-Core.
4.  **Phase 4: Commercial:** חוזים, בילינג, ופורטל שותפים.
5.  **Phase 5: Ecosystem:** API, Mobile App, Notifications.


## 7. Enterprise Sales Logic (Added v1.1)
Based on Expert Gap Analysis.

### 7.1 Data Model Enhancements
* **Opportunity Roles:** Multi-contact relationship mapping (Decision Maker, Blocker, Champion).
* **Activity Tracking:** Full history of interactions (Calls, Emails, Meetings).
* **Competitor Intelligence:** Tracking win/loss against specific competitors.

### 7.2 Pipeline Governance
* **BANT Qualification:** Mandatory scoring (Budget, Authority, Need, Timeline) before Discovery.
* **Stage Gating:** Validation rules preventing stage progression without required data.
* **Lost Analysis:** Mandatory reason codes for Closed-Lost deals.

### 7.3 Forecasting
* **Categories:** Pipeline, Best Case, Commit, Closed, Omitted.
* **Logic:** Weighted probability based on stage + manual override with justification.
