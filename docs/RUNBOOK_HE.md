# ספר הפעלה: חתימת PDF (KMS) ואימות – SafeM

## סטטוס נוכחי
- **סביבה:** ozen-staging-2025 (GCP)
- **פונקציות:** `generatePdfReport`, `verifySignatureEndpoint` (Gen‑2, Node 20, region `us-central1`)
- **מפתח הצפנה (KMS):** `projects/ozen-staging-2025/locations/us-central1/keyRings/ozen-keyring/cryptoKeys/ozen-signing-key`
- **כלי אימות (CLI):** `scripts/verify_document.js`
- **סקריפט רוטציה:** `scripts/rotate_kms_key.js`
- **אוטומציה לאימות (CI):** `.github/workflows/post-deploy.yml`
- **אוטומציה לרוטציה:** `.github/workflows/rotate-kms.yml`

## תוכן העניינים
1. מטרה
2. תפקידים והרשאות
3. מושגי יסוד
4. רשימת בדיקות לפני רוטציה
5. רוטציה ידנית (צעד-אחר-צעד)
6. רוטציה אוטומטית (CI)
7. אימות לאחר עדכון
8. נוהל שחזור (Rollback)
9. ביטול חירום (פריצה/דליפה)
10. פתרון תקלות
11. ניטור והתראות
12. ביקורת ולוגים (Audit)
13. אנשי קשר

## 1. מטרה
מסמך זה מתעד את הנהלים הבטוחים לביצוע רוטציה (החלפה) של גרסאות מפתח KMS המשמשות לחתימה על מסמכי PDF, אימות החתימות, והתאוששות מכשלים.

## 2. תפקידים והרשאות
- **חשבון שירות לרוטציה (Rotation SA):**
  - נדרש: הרשאה ליצירת גרסאות מפתח ועדכון משתני סביבה ב-Cloud Run:
    - `roles/cloudkms.admin` (או `cloudkms.cryptoKeyVersions.create`)
    - `roles/run.admin` (לעדכון השירות)
- **חשבון שירות לאימות (Verifier SA):**
  - `roles/datastore.viewer` (קריאה מ-Firestore)
  - `roles/storage.objectViewer` (קריאה מה-Bucket)
  - `roles/cloudkms.publicKeyViewer` (קבלת המפתח הציבורי לאימות)
- **חשבון שירות לפריסה (CI/Deployment):**
  - כתיבה ל-Artifact Registry, פריסת פונקציות וכו'.

*הערה: יש להשתמש בעקרון ההרשאה המינימלית (Least Privilege).*

## 3. מושגי יסוד
- גרסאות מפתח KMS מזוהות על ידי שם משאב מלא:
  `projects/<proj>/locations/<loc>/keyRings/<ring>/cryptoKeys/<key>/cryptoKeyVersions/<n>`
- אנו שומרים את ה-`keyVersion` המדויק ששימש לחתימה בתוך מסמך ה-Firestore (בשדה `keyVersion`) לצורך ביקורת ותאימות.
- אימות חתימה מתבצע ע"י שליפת המפתח הציבורי (PEM) של אותה גרסה, ואימות RSA-SHA256 מול הקובץ המקורי.

## 4. רשימת בדיקות לפני רוטציה (Pre-rotation)
1. וודא שקיים מסמך בדיקה (Smoke Doc) תקין וה-`documentId` שלו מעודכן בסוד `SMOKE_DOC_ID` ב-GitHub.
2. וודא שמפתח ה-Service Account לרוטציה שמור בסוד `ROTATE_SA_KEY` ב-GitHub.
3. וודא שסקריפט האימות `scripts/verify_document.js` עובד תקין בהרצה מקומית.
4. בחר חלון תחזוקה מתאים (אם מבצעים בסביבת ייצור).
5. מומלץ: גיבוי של מדיניות ה-IAM הנוכחית:
   ```bash
   gcloud projects get-iam-policy ozen-staging-2025 --format=json > iam-policy.backup.json