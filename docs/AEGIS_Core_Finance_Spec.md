# 🛡️ AEGIS Technical Specification: Core, Billing & Enterprise
**Version:** 1.0.0 (Sprints 1-3 Complete)
**Date:** 2025-12-26
**Modules:** Multi-Tenancy, Billing Engine, Enterprise PO System

---

## 1. תקציר מנהלים (Executive Summary)
מסמך זה מרכז את הארכיטקטורה של ליבת המערכת (Core Infrastructure) ואת המנועים הפיננסיים שנבנו בשלושת הספרינטים הראשונים. המערכת הוקמה בתצורת **SaaS Multi-Tenant** מלאה, עם הפרדת נתונים לוגית, מנוע חיוב אוטומטי מול ספק חיצוני (Morning), ותמיכה בתהליכי רכש מורכבים (PO/Nipendo) עבור לקוחות Enterprise.

---

## 2. Sprint #1: Core Multi-Tenancy (תשתית דיירים)

### 2.1 ארכיטקטורת נתונים (Data Isolation)
המערכת משתמשת במודל **Logical Separation** בתוך Firestore.
* **Tenant ID:** כל רשומה במערכת (משתמש, דוח, לוג) מקושרת ל-`tenantId` ייחודי (UUID).
* **Security Rules:** חוקי האבטחה (Firestore Rules) אוכפים הפרדה ברמת ה-Database, כך שלקוח א' לעולם לא יוכל לקרוא מידע של לקוח ב'.

### 2.2 מנגנון הקמה (Provisioning Wizard)
תהליך ה-Onboarding של לקוח חדש (`CreateClient.tsx`) מבצע שרשרת פעולות אטומיות:
1.  **Validation:** בדיקת ייחודיות של ה-Slug (למניעת כפילויות URL) ואימות שדות חובה מול `reservedSlugs.ts`.
2.  **DB Initialization:** יצירת מסמך האב ב-Collection `tenants`.
3.  **Admin Assignment:** יצירת משתמש אדמין ראשוני וקישורו ל-Tenant החדש.

---

## 3. Sprint #2: Billing & Finance Engine (מנוע כספים)

### 3.1 מודל החיוב (Pricing Logic)
המערכת תומכת ב-3 מודלים עסקיים המוגדרים בקוד (`billingEngine.ts`):
* **Starter:** חיוב קבוע (Fixed Price) ללקוחות קטנים.
* **Pro:** חיוב מבוסס שימוש (Usage-Based) – מחיר למשתמש/חודש.
* **Enterprise:** תמחור מותאם אישית (Custom Quote).

### 3.2 אינטגרציית סליקה (Morning / Green Invoice)
* **Tokenization:** פרטי האשראי לא נשמרים ב-AEGIS. המערכת מקבלת Token מוצפן מ-Morning ושומרת אותו ב-`billingConfig`.
* **Automation:** מנוע ה-Billing רץ כ-Scheduled Function (מתוכנן לרוץ ב-1 לחודש), מחשב את הצריכה ומפיק חשבונית מס אוטומטית דרך ה-API.

---

## 4. Sprint #3: Enterprise Workflow (ניהול תקציב ו-PO)

### 4.1 ניהול הזמנות רכש (Purchase Orders)
עבור לקוחות שאינם משלמים באשראי (Enterprise), פותח מנגנון "ארנק תקציבי":
* **PO Tracking:** לכל לקוח מוגדר `poTotalBudget` (תקרה) ו-`poUsedBudget` (ניצול בפועל).
* **Burn-down Logic:** בכל חודש, המערכת מפחיתה את עלות השימוש מיתרת ה-PO במקום לחייב אשראי.
* **Alerts:** התראות אוטומטיות כשהניצול מגיע ל-80% ו-95% מהתקציב.

### 4.2 דשבורד פיננסי (`FinancialDashboard.tsx`)
ממשק ניהול מרכזי עבור ה-Super Admin:
* **Approval Queue:** דרישות תשלום הממתינות לאישור ידני לפני שליחה ל-Nipendo.
* **Status Monitor:** טבלה המציגה בזמן אמת חריגות תקציב אצל לקוחות גדולים.

---

## 5. מבנה הנתונים ב-DB (Schema Reference)

להלן מבנה מסמך `Tenant` טיפוסי המאחד את כל הפיתוחים:

```typescript
interface Tenant {
  id: string;              // Sprint 1: UUID
  name: string;            // Sprint 1: Client Name
  slug: string;            // Sprint 1: Subdomain ID
  
  // Sprint 2: Billing Configuration
  billingConfig: {
    plan: 'starter' | 'pro' | 'enterprise';
    creditCardToken?: string; // Token from Morning
    nextBillingDate: Timestamp;
  };

  // Sprint 3: Enterprise Configuration
  enterpriseConfig?: {
    poNumber: string;         // "PO-99212"
    poTotalBudget: number;    // 50,000 NIS
    poUsedBudget: number;     // 12,500 NIS
    requiresAdminApproval: boolean; // Manual review trigger
    externalSystemId?: string; // Nipendo Vendor ID
  };
}
