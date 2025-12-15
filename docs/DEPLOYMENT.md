# SafeM - מדריך התקנה ופריסה

## דרישות מקדימות

- Node.js 18 או גרסה חדשה יותר
- npm 9 או גרסה חדשה יותר
- חשבון Firebase
- Git

## התקנה ראשונית

### 1. Clone הפרויקט

```bash
git clone https://github.com/mazor13/SafeM.git
cd SafeM
```

### 2. התקנת Dependencies

```bash
npm install
```

### 3. הגדרת Firebase

#### יצירת פרויקט Firebase

1. גש ל-[Firebase Console](https://console.firebase.google.com)
2. לחץ על "Add project" / "הוסף פרויקט"
3. הזן שם לפרויקט (למשל: "safem-production")
4. אופציונלי: הפעל Google Analytics
5. לחץ "Create project" / "צור פרויקט"

#### הגדרת Authentication

1. בקונסול Firebase, עבור ל-Authentication
2. לחץ "Get started"
3. הפעל את "Email/Password" provider
4. שמור

#### הגדרת Firestore

1. בקונסול Firebase, עבור ל-Firestore Database
2. לחץ "Create database"
3. בחר מיקום (Europe - west2 או קרוב ללקוחות)
4. התחל ב-production mode (Security rules ייפרסו בשלב הבא)

#### קבלת Configuration

1. בקונסול Firebase, עבור להגדרות הפרויקט (גלגל שיניים ליד Project Overview)
2. גלול למטה ל-"Your apps"
3. לחץ על הסמל של Web (</>)
4. רשום את הפרויקט
5. העתק את אובייקט ה-firebaseConfig

### 4. הגדרת משתני סביבה

```bash
cp .env.example .env
```

ערוך את `.env` והזן את הערכים מה-Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. התקנת Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init
```

בחר:
- ✓ Firestore
- ✓ Hosting
- בחר את הפרויקט שיצרת
- השתמש בקבצים הקיימים (firestore.rules, firestore.indexes.json)
- Public directory: dist
- Single-page app: Yes
- GitHub deploys: לא (בשלב זה)

## פריסת Security Rules

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

**חשוב:** בדוק שה-rules נפרסו בהצלחה בקונסול Firebase.

## יצירת משתמש SuperAdmin ראשון

לאחר שהמערכת עולה, צריך ליצור משתמש SuperAdmin באמצעות Firebase Console:

### שלב 1: יצירת משתמש ב-Authentication

1. עבור ל-Authentication → Users
2. לחץ "Add user"
3. הזן email וסיסמה
4. העתק את ה-UID של המשתמש

### שלב 2: הוספת Custom Claims

**דרך 1: Firebase CLI (מומלץ)**

צור קובץ JavaScript זמני:

```javascript
// set-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'USER_UID_HERE'; // הזן את ה-UID

admin.auth().setCustomUserClaims(uid, {
  role: 'super_admin',
  organizationId: 'system'
}).then(() => {
  console.log('Custom claims set for user:', uid);
}).catch((error) => {
  console.error('Error setting custom claims:', error);
});
```

הרץ:
```bash
node set-admin.js
```

**דרך 2: Cloud Functions**

צור Cloud Function שמוסיף custom claims בהרשמה.

### שלב 3: יצירת רשומת משתמש ב-Firestore

1. עבור ל-Firestore Database
2. צור collection חדש: `users`
3. צור document עם ה-UID של המשתמש
4. הוסף שדות:
   ```json
   {
     "email": "admin@example.com",
     "displayName": "Super Admin",
     "role": "super_admin",
     "organizationId": "system",
     "isActive": true,
     "createdAt": [timestamp],
     "updatedAt": [timestamp]
   }
   ```

### שלב 4: יצירת ארגון ראשון

1. התחבר עם משתמש ה-SuperAdmin
2. צור ארגון ראשון דרך הממשק או Firestore:
   ```json
   {
     "name": "Organization Name",
     "nameHebrew": "שם הארגון",
     "email": "org@example.com",
     "phone": "050-1234567",
     "address": "כתובת הארגון",
     "organizationId": "[auto-id]",
     "isActive": true,
     "createdAt": [timestamp],
     "updatedAt": [timestamp],
     "settings": {
       "language": "he",
       "timezone": "Asia/Jerusalem"
     },
     "modules": [
       {
         "module": "radiation",
         "enabled": true
       },
       {
         "module": "laser",
         "enabled": true
       }
     ]
   }
   ```

## הרצת המערכת

### Development

```bash
npm run dev
```

המערכת תעלה על: http://localhost:5173

### Production Build

```bash
npm run build
```

הקבצים יווצרו בתיקיית `dist/`.

### Preview Production Build

```bash
npm run preview
```

## פריסה לפרודקשן

### Firebase Hosting

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### Hosting אחר (Vercel, Netlify וכו')

1. Build:
   ```bash
   npm run build
   ```

2. העלה את תיקיית `dist/` לשרת

3. הגדר redirects ל-SPA:
   - כל הנתיבים צריכים להפנות ל-`index.html`

## אבטחה

### חשוב לזכור:

1. **אל תשתף את קובץ `.env`** - הוא מכיל secrets
2. **הפעל Security Rules** - בדוק שהן פעילות לפני production
3. **Custom Claims** - ודא שכל משתמש מקבל role ו-organizationId
4. **HTTPS Only** - השתמש רק ב-HTTPS בפרודקשן
5. **Regular Backups** - גבה את Firestore באופן קבוע

## Monitoring

### Firebase Console

1. **Authentication** - עקוב אחר כניסות ויציאות
2. **Firestore** - בדוק שימוש ו-reads/writes
3. **Performance** - נטר ביצועים
4. **Crashlytics** - (אופציונלי) תקלות

### Logging

בדוק logs ב:
- Firebase Console → Functions (אם משתמש)
- Browser Console (לבעיות client-side)

## בעיות נפוצות

### בעיה: "Permission denied" ב-Firestore

**פתרון:** בדוק ש:
1. Security rules נפרסו
2. המשתמש יש לו custom claims
3. organizationId תואם

### בעיה: "User not found"

**פתרון:** 
1. צור document ב-`users` collection
2. ה-ID של ה-document חייב להיות ה-UID מ-Authentication

### בעיה: "Module not found" בבנייה

**פתרון:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## עדכונים

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Deploy security rules if changed
firebase deploy --only firestore:rules

# Build and deploy
npm run build
firebase deploy --only hosting
```

## תמיכה

- **תיעוד:** [docs/MASTER_DOCUMENT.md](./MASTER_DOCUMENT.md)
- **Issues:** https://github.com/mazor13/SafeM/issues
- **Email:** support@safem.example

## Checklist לפני Production

- [ ] Security rules נבדקו ונפרסו
- [ ] משתמש SuperAdmin נוצר
- [ ] ארגון ראשון נוצר
- [ ] משתני סביבה מוגדרים
- [ ] Build מצליח ללא שגיאות
- [ ] Linting עובר ללא warnings
- [ ] TypeScript strict mode פעיל
- [ ] HTTPS מוגדר
- [ ] Backup strategy מוגדר
- [ ] Monitoring פעיל
