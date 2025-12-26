# 🛡️ AEGIS Admin - Full Technical & Functional Specification (V3.0)
**Project:** AEGIS Safety Management Platform | **Date:** 26/12/2025 | **Confidential**

---

## 1. ארכיטקטורת נתונים מרכזית (Core Database Schema)
לפני שנרד לרמת הרכיבים, אלו הטבלאות הראשיות שמחזיקות את המערכת:

### טבלת `Tenants` (הלקוחות)
- `id` (UUID): מזהה ייחודי.
- `company_name` (String): שם החברה.
- `tax_id` (String): ח"פ.
- `slug` (String): תת-דומיין (e.g., 'denya').
- `custom_domain` (String): דומיין פרטי (e.g., 'safety.denya.co.il').
- `status` (Enum): Active, Suspended, Pending, Trial.
- `billing_track` (Enum): Automated, Enterprise, External_Portal.
- `created_at` (Timestamp).

### טבלת `Subscriptions` (חבילות ורישוי)
- `id` (UUID).
- `tenant_id` (FK): מקושר לטבלת Tenants.
- `plan_type` (Enum): Starter, Pro, Enterprise, Custom.
- `max_users` (Int): מכסת משתמשים.
- `max_storage_gb` (Int): מכסת אחסון.
- `max_reports_monthly` (Int): מכסת דוחות.
- `features_mask` (JSON): רשימת מודולים פתוחים (e.g., {"laser": true, "fire": false}).

---

## 2. מנוע ההקמה (Onboarding & Provisioning Flow)

### א. לוגיקת הקמה אוטומטית (Self-Service)
1. **Input:** נתונים מהאתר השיווקי (Package_ID, Credit_Card_Token).
2. **Logic:**
   - המערכת בודקת שה-`slug` פנוי.
   - יצירת רשומה ב-`Tenants` וב-`Subscriptions`.
   - קריאת API ל-"חשבונית ירוקה": `Create_Customer` + `Create_Subscription`.
3. **Database:** עדכון `billing_external_id` (המזהה בחשבונית ירוקה).

### ב. לוגיקת שבלונות (Enterprise Templates)
- **טבלת `Onboarding_Templates`:**
  - `template_name`, `default_modules`, `default_quotas`, `contract_template_id`.
- **Workflow:** מנהל הלקוח בוחר שבלונה -> המערכת מעתיקה את הערכים לטבלת `Subscriptions` של הלקוח החדש.

---

## 3. פיננסים וגבייה (The Billing Engine)

### סכמת נתונים פיננסית:
- **טבלת `Invoices`:**
  - `id`, `tenant_id`, `amount`, `currency`, `status` (Paid, Overdue, Draft), `external_link` (PDF), `due_date`.
- **טבלת `Usage_Logs` (לחישוב חריגות):**
  - `tenant_id`, `metric_type` (Storage, Reports), `current_value`, `billing_cycle`.

### תהליך גבייה (The Pipeline):
1. **Calculation:** ב-1 לחודש, הרצת Script שמשווה בין `Usage_Logs` לבין המכסות ב-`Subscriptions`.
2. **Adapter Execution:** אם `billing_track == 'Automated'`, המערכת שולחת פקודת `Charge_Token` לספק הסליקה.
3. **Nipendo Integration:** אם הלקוח מסומן כ-`External_Portal`, המערכת מפיקה קובץ XML ושולחת לפורטל הספקים.

---

## 4. אחסון ותשתיות (Storage & BYOS)

### סכמת נתונים:
- **טבלת `Storage_Config`:**
  - `tenant_id`.
  - `provider` (Internal_S3, Azure_Blob, Google_Cloud, Customer_FTP).
  - `credentials` (Encrypted JSON): מפתחות גישה לענן הלקוח.
  - `is_mirrored` (Boolean): האם לשמור עותק גם אצלנו.

### לוגיקת ניתוב (Routing Logic):
בכל העלאת קובץ (Upload):
`IF storage_provider != 'Internal' THEN: Upload_to_External(credentials) AND Log_Success()`.

---

## 5. מנוע חוקים ואוטומציה (Rules Engine)

### סכמת נתונים:
- **טבלת `Business_Rules`:**
  - `id`, `tenant_id` (או Global), `trigger_event` (Low_Activity, Over_Quota, Payment_Failed).
  - `conditions` (JSON): `{"days_inactive": 14, "unpaid_amount_gt": 1000}`.
  - `action` (Enum): Send_Email, Suspend_Account, Alert_Admin.

### תהליך עבודה:
מנוע (Cron Job) רץ כל שעה, סורק את חוקי ה-JSON ומבצע פעולות (Actions) לפי התנאים.

---

## 6. ניהול משפטי (Legal & Contracts)

### סכמת נתונים:
- **טבלת `Contracts`:**
  - `id`, `tenant_id`, `document_url`, `signing_status` (Sent, Opened, Signed), `expiry_date`, `signed_at`.
- **טבלת `SLA_Policies`:**
  - `tenant_id`, `response_time_hours`, `uptime_guarantee_percent`.

---

## 7. אבטחה וביקורת (Security & Audit)

### סכמת נתונים:
- **טבלת `Admin_Audit_Logs`:**
  - `admin_id` (FK).
  - `action_type` (Update_Quota, Login_Impersonate, Change_Price).
  - `target_tenant_id`.
  - `payload_before` (JSON).
  - `payload_after` (JSON).
  - `ip_address`, `user_agent`.

---

## 8. הגדרות UI וצד לקוח (White Labeling)
- **טבלת `Tenant_Branding`:**
  - `tenant_id`, `logo_url`, `primary_color`, `secondary_color`, `favicon_url`.

---

### תהליכי עבודה (Workflows) מסכמים:

1. **חריגת אחסון:**
   - `Usage_Monitor` מזהה חריגה -> `Rules_Engine` בודק אם קיים חוק ללקוח -> `Notification_Service` שולח מייל אוטומטי -> ה-Admin Dashboard מציג התראה אדומה.

2. **אישור תשלום בשוטף+:**
   - מנהל חשבונות מעדכן "שולם" ב-"חשבונית ירוקה" -> ה-Webhook של חשבונית ירוקה פוגע ב-AEGIS Admin API -> טבלת `Invoices` מתעדכנת ל-`Paid` -> ה-`Tenant_Status` חוזר ל-`Active`.

3. **שחזור נתונים:**
   - Admin בוחר `Tenant` ו-`Timestamp` -> המערכת מקימה זמנית `Database_Instance` חדש מה-Snapshot -> המערכת מעתיקה רק את רשומות ה-Table המשויכות ל-`Tenant_ID` הספציפי חזרה ל-Production.
