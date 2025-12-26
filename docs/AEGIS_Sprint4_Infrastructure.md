# 🛡️ AEGIS Technical Specification: Infrastructure & Multi-Cloud Core
**Version:** 1.0.0 (Sprint #4 Complete)
**Date:** 2025-12-26
**Module:** Infrastructure Integrity & White-Labeling

---

## 1. תקציר מנהלים (Executive Summary)
ספרינט זה התמקד בבניית תשתית ה-Backend וה-Frontend שתומכת בלקוחות Enterprise ו-SMB כאחד. המערכת עברה לארכיטקטורת **Provider-Agnostic**, המאפשרת ל-AEGIS להתחבר לכל ספק אחסון חיצוני (BYOS), לנהל לוגים בזמן אמת לדיאגנוסטיקה, ולספק חווית מותג (White Label) מלאה הכוללת דומיינים פרטיים.

---

## 2. ארכיטקטורת אחסון (Universal Storage Hub)

המערכת משתמשת בתבנית עיצוב **Modular Adapter Pattern**. הרכיב המרכזי (`CloudHub`) משמש כ"מנצח" (Orchestrator), והוא טוען דינמית את הקונפיגורציה המתאימה בהתאם לספק שנבחר.

### 2.1 ספקי Enterprise (High-Throughput)
נועדו לאחסון מאסיבי של תמונות, וידאו ודוחות גולמיים.
* **AWS S3:** אימות באמצעות `Access Key` ו-`Secret Key`. כולל בחירת `Region`.
* **Azure Blob Storage:** אימות באמצעות `Connection String` (תמיכה ב-Key1/Key2).
* **Google Cloud Platform (GCP):** אימות באמצעות `Service Account JSON` (כולל Parsing של המפתח בצד הלקוח).
* **Local Server (On-Premise):**
    * **פרוטוקול:** SFTP over SSH.
    * **אבטחה:** תמיכה ב-SSH Public Key Authentication.
    * **דרישות רשת:** המערכת מציגה ללקוח את ה-IPs של AEGIS לצורך Whitelisting ב-Firewall הארגוני (TCP Port 22).

### 2.2 אינטגרציות משרדיות (Office Cloud)
נועדו לייצוא דוחות סופיים (PDF) לתיקיות ארגוניות נגישות.
* **Supported Providers:** Google Drive, Dropbox Business, Microsoft OneDrive.
* **Smart Folder Structure:**
    * מנגנון לוגי המייצר אוטומטית עץ תיקיות: `Root > Project Name > Year`.
    * מופעל ע"י דגל `autoStructure: true` בלוגיקה העסקית.
    * כולל אזהרת Rate Limiting מובנית בממשק.

---

## 3. מערכת לוגים ודיאגנוסטיקה (Telemetry & Logging)

כדי לאפשר תמיכה טכנית מהירה (MTTR נמוך), בנינו מערכת לוגים מרכזית המנתקת את הלקוח מהצורך להבין שגיאות טכניות.

### 3.1 מבנה הנתונים (Firestore Schema)
הלוגים נשמרים ב-Collection בשם `infrastructure_logs`.

```json
{
  "tenantId": "string (UUID)",
  "provider": "string (AWS_S3 | LOCAL_SFTP | ...)",
  "status": "string (SUCCESS | ERROR)",
  "timestamp": "Timestamp",
  "details": {
    "error": "string (Technical error message)",
    "bucket": "string (Optional context)",
    "region": "string (Optional context)"
  }
}
