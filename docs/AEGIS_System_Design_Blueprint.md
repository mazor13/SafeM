# 🛡️ AEGIS Admin - System Design Blueprint (Final Edition)
**Project:** AEGIS Safety Management Platform | **Version:** 4.0 | **Confidential**

---

## 1. ארכיטקטורת Onboarding (הקמת לקוח)

### א. תרשים זרימה: ערוץ Self-Service (אוטומטי)
1. **התחלה:** לקוח בוחר חבילה באתר השיווקי.
2. **קלט:** פרטי חברה + אשראי.
3. **ולידציה:** בדיקת ח"פ + בדיקת זמינות תת-דומיין (Slug).
4. **סליקה:** פנייה ל-Credit Card Gateway (Grow/Cardcom).
   - *כישלון:* שליחת הודעת שגיאה וחזרה לשלב התשלום.
   - *הצלחה:* הפקת Token אשראי (ללא שמירת פרטי כרטיס).
5. **ביצוע (Provisioning):**
   - יצירת Tenant ב-DB.
   - הקצאת Namespace לאחסון.
   - שליחת API ל-"חשבונית ירוקה" לפתיחת מנוי.
6. **סיום:** שליחת מייל ברוך הבא עם פרטי התחברות.



### ב. סכמת נתונים (Tables)
- `Tenants`: (id, slug, status, creation_source).
- `Onboarding_Logs`: (tenant_id, step_name, status, error_message).

---

## 2. מנוע הגבייה והפיננסים (The Billing Engine)

### א. תרשים זרימה: מחזור חיוב חודשי
1. **טריגר:** 1 לחודש, שעה 00:01 (Cron Job).
2. **איסוף נתונים:** סריקת טבלת `Usage_Metrics` (כמות דוחות, נפח אחסון).
3. **חישוב:** חבילת בסיס + (חריגה * תעריף חריגה).
4. **בדיקת מסלול (Track):**
   - **B2C:** ניסיון סליקה אוטומטי -> הצלחה? הפקת קבלה ב-Morning.
   - **Enterprise:** הפקת דרישת תשלום -> שיגור ל-Nipendo/Email -> עדכון סטטוס ל-`Pending Payment`.
5. **חריגה:** אם סליקה נכשלה -> הפעלת מנגנון Retry (3 ניסיונות) -> התראת Admin.



### ב. סכמת נתונים (Tables)
- `Invoices`: (id, tenant_id, amount, status, external_ref, billing_date).
- `Billing_Profiles`: (tenant_id, payment_method_token, payment_terms_days).

---

## 3. ניהול אחסון מבוזר (Infrastructure & BYOS)

### א. תרשים זרימה: העלאת קובץ (Routing Logic)
1. **קלט:** משתמש קצה מעלה דוח עם תמונות.
2. **שאילתה:** Admin API בודק את הגדרת `Storage_Config` של הלקוח.
3. **ניתוב:**
   - **Internal:** העלאה ל-S3 של AEGIS.
   - **External:** הצפנת הקובץ -> פתיחת Connection מול ענן הלקוח (AWS/Azure) -> העלאה -> קבלת אישור (ACK).
4. **רישום:** שמירת ה-URL של הקובץ בטבלת הדוחות (גם אם הוא חיצוני).



### ב. סכמת נתונים (Tables)
- `Storage_Configs`: (tenant_id, provider_type, api_credentials_encrypted, bucket_name).
- `File_Registry`: (id, tenant_id, file_path, is_external, sync_status).

---

## 4. מנוע חוקים ואוטומציה (Rules Engine)

### א. תרשים זרימה: עיבוד חוקים (Rule Execution)
1. **אירוע (Event):** לקוח לא התחבר 14 יום.
2. **מנוע סריקה:** סריקת טבלת `Business_Rules` לפי סוג אירוע `INACTIVITY`.
3. **בדיקת תנאי:** האם הלקוח בסטטוס `Active`? האם הוא לקוח `Enterprise`?
4. **פעולה:**
   - שליחת התראה ל-Slack של מנהל הלקוח.
   - שליחת מייל "התגעגענו" אוטומטי ללקוח.



### ב. סכמת נתונים (Tables)
- `Business_Rules`: (id, trigger_event, conditions_json, action_type, payload).
- `Automated_Actions_Log`: (rule_id, tenant_id, executed_at, result).

---

## 5. ניהול משפטי וחוזים (Legal & Compliance)

### א. תרשים זרימה: חתימה דיגיטלית
1. **הפקה:** מנהל הלקוח בוחר שבלונה -> המערכת ממזגת נתונים ל-PDF.
2. **שליחה:** קריאת API ל-DocuSign עם פרטי המנכ"ל של הלקוח.
3. **מעקב:** המערכת מאזינה ל-Webhook של חברת החתימות.
4. **סיום:** החוזה נחתם -> עדכון סטטוס ב-Admin -> שמירת עותק חתום בארכיון הלקוח -> הפעלת החשבון.

### ב. סכמת נתונים (Tables)
- `Contracts`: (id, tenant_id, status, file_url, signing_link, expiry_date).
- `SLA_Compliance`: (tenant_id, guaranteed_uptime, actual_uptime, breach_alerts).

---

## 6. אבטחה, ביקורת והתחזות (Security & Audit)

### א. תרשים זרימה: מצב התחזות (Impersonation)
1. **בקשה:** Admin לוחץ על `Impersonate` בכרטיס לקוח.
2. **אימות:** המערכת בודקת האם ל-Admin יש הרשאת `Super_Admin`.
3. **תיעוד:** רישום ב-Audit Log: "Admin X נכנס בשם לקוח Y".
4. **ביצוע:** יצירת Token זמני (JWT) עם הרשאות הלקוח + סימון `is_impersonated: true`.
5. **ניתוק:** בסגירת הטאב, ה-Session פוקע וה-Admin חוזר למסך הניהול.

### ב. סכמת נתונים (Tables)
- `Admin_Audit_Trail`: (id, admin_id, action, target_id, old_value, new_value, ip_address).

---

## 7. ניהול דומיינים (White Labeling)

### א. תרשים זרימה: חיבור דומיין פרטי
1. **בקשה:** לקוח מזין `safety.client.co.il` בממשק.
2. **הנחיה:** המערכת מייצרת רשומת CNAME ו-TXT לאימות.
3. **בדיקה:** המערכת מנסה לבצע Resolve לדומיין בכל שעה.
4. **הפעלה:** אימות הצליח -> קריאת API ל-Let's Encrypt להנפקת SSL -> עדכון ה-Reverse Proxy של AEGIS.



---

## סיכום סופי
המפרט הזה מהווה את ה"תנ"ך" של AEGIS Admin. הוא מגדיר את כל הקשרים בין בסיס הנתונים, הלוגיקה העסקית והממשקים החיצוניים.
