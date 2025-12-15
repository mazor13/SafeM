# SafeM - מודל אבטחה

## סקירה כללית

מערכת SafeM בנויה על שכבות אבטחה מרובות להבטיח בידוד מלא בין ארגונים ובקרת גישה מבוססת תפקידים.

## Multi-tenancy Architecture

### עקרון ה-organizationId

כל רשומה במערכת **חייבת** להכיל שדה `organizationId`. זהו עקרון הליבה של ה-multi-tenancy.

```typescript
interface BaseRecord {
  id: string;
  organizationId: string; // ✓ חובה!
  // שדות נוספים...
}
```

### בידוד נתונים

```
Organization A          Organization B
├── Users               ├── Users
├── Records             ├── Records
└── Modules             └── Modules
    ❌ אין גישה →           ← ❌ אין גישה
```

## Role-Based Access Control (RBAC)

### היררכיית תפקידים

```
SuperAdmin (רמה 4)
    ↓ מנהל את כל המערכת
OrgAdmin (רמה 3)
    ↓ מנהל ארגון ספציפי
Inspector (רמה 2)
    ↓ מבצע בדיקות
Client (רמה 1)
    ↓ צפייה בלבד
```

### הרשאות לפי תפקיד

#### SuperAdmin
- ✓ גישה לכל הארגונים
- ✓ יצירת וניהול ארגונים
- ✓ ניהול כל המשתמשים
- ✓ גישה לכל המודולים והנתונים

#### OrgAdmin
- ✓ ניהול ארגון ספציפי
- ✓ יצירת וניהול משתמשים בארגון
- ✓ הגדרת מודולים פעילים
- ✓ מחיקת רשומות
- ❌ אין גישה לארגונים אחרים

#### Inspector
- ✓ יצירת בדיקות ורשומות
- ✓ עדכון רשומות קיימות
- ✓ צפייה בנתוני הארגון
- ❌ לא יכול למחוק
- ❌ לא יכול לנהל משתמשים

#### Client
- ✓ צפייה בדוחות ורשומות
- ❌ לא יכול ליצור או לערוך
- ❌ לא יכול למחוק
- ❌ לא יכול לנהל משתמשים

## Firestore Security Rules

### שכבות הגנה

1. **Authentication Check** - בדיקה שהמשתמש מחובר
2. **organizationId Validation** - בדיקה שהרשומה שייכת לארגון
3. **Role Check** - בדיקת רמת הרשאה
4. **Data Validation** - אימות שדות נדרשים

### דוגמה לזרימת אבטחה

```javascript
// 1. משתמש מנסה לקרוא רשומת קרינה
GET /radiationRecords/{recordId}

// 2. Security Rules בודקות:
if (
  isAuthenticated() &&                    // ✓ מחובר?
  hasOrganizationId() &&                  // ✓ יש organizationId?
  belongsToOrganization(                  // ✓ שייך לאותו ארגון?
    resource.data.organizationId
  )
) {
  allow read; // ✓ מאושר
} else {
  deny;       // ❌ נדחה
}
```

### Helper Functions

```javascript
// בדיקת אימות
function isAuthenticated() {
  return request.auth != null;
}

// קבלת תפקיד מ-custom claims
function getUserRole() {
  return request.auth.token.role;
}

// קבלת organizationId מ-custom claims
function getUserOrgId() {
  return request.auth.token.organizationId;
}

// בדיקה שהמשתמש שייך לארגון
function belongsToOrganization(orgId) {
  return isAuthenticated() && getUserOrgId() == orgId;
}

// בדיקת רמת הרשאה
function hasRoleLevel(requiredLevel) {
  let userLevel = getUserRole() == 'super_admin' ? 4 :
                  getUserRole() == 'org_admin' ? 3 :
                  getUserRole() == 'inspector' ? 2 :
                  getUserRole() == 'client' ? 1 : 0;
  return userLevel >= requiredLevel;
}
```

## Custom Claims

### מה זה Custom Claims?

Custom claims הם metadata שמצורפים ל-Firebase Auth token של כל משתמש.

```json
{
  "role": "org_admin",
  "organizationId": "org_12345"
}
```

### הגדרת Custom Claims

```javascript
// Node.js Admin SDK
admin.auth().setCustomUserClaims(uid, {
  role: 'org_admin',
  organizationId: 'org_12345'
});
```

### שימוש ב-Custom Claims

```typescript
// Client-side
const user = auth.currentUser;
const idTokenResult = await user.getIdTokenResult();
const role = idTokenResult.claims.role;
const orgId = idTokenResult.claims.organizationId;
```

## Client-Side Security

### Validation לפני API Call

```typescript
// בדיקה שיש organizationId
if (!user.organizationId) {
  throw new Error('Missing organizationId');
}

// בדיקת הרשאה
if (!hasRoleLevel(UserRole.INSPECTOR)) {
  throw new Error('Insufficient permissions');
}

// רק אז - קריאה לשרת
await createRadiationRecord(data);
```

### זכור!

**Client-side validation היא לנוחות בלבד!**

האבטחה האמיתית היא ב-**Firestore Security Rules**.

## Server-Side Security

### Firestore Security Rules

```javascript
match /radiationRecords/{recordId} {
  // קריאה - משתמש מאותו ארגון
  allow read: if isAuthenticated() && 
                 hasOrganizationId() && 
                 belongsToOrganization(resource.data.organizationId);
  
  // יצירה - בודק ומעלה + organizationId תקין
  allow create: if hasRoleLevel(2) && 
                   organizationMatches() &&
                   incomingHasOrganizationId();
  
  // עדכון - בודק ומעלה באותו ארגון
  allow update: if hasRoleLevel(2) && 
                   belongsToOrganization(resource.data.organizationId) &&
                   organizationMatches();
  
  // מחיקה - מנהל ארגון ומעלה
  allow delete: if hasRoleLevel(3) && 
                   belongsToOrganization(resource.data.organizationId);
}
```

## איומי אבטחה ואיך אנחנו מגנים

### איום: Cross-Organization Data Access

**סיכון:** משתמש מארגון A מנסה לגשת לנתוני ארגון B

**הגנה:**
1. כל רשומה עם `organizationId`
2. Security rules בודקות `belongsToOrganization()`
3. Custom claims מכילים את ה-`organizationId` של המשתמש

### איום: Privilege Escalation

**סיכון:** Client מנסה לבצע פעולות של Inspector

**הגנה:**
1. Role שמור ב-custom claims (לא ניתן לשינוי מה-client)
2. Security rules בודקות `hasRoleLevel()`
3. Client-side validation למניעת טעויות

### איום: Data Tampering

**סיכון:** שינוי `organizationId` להשיג גישה לארגון אחר

**הגנה:**
1. Security rules מונעות שינוי `organizationId` ב-update
2. Service layer מסיר `organizationId` מ-update data
3. Validation ברמת הקוד

### איום: Missing organizationId

**סיכון:** רשומה ללא `organizationId` נגישה לכולם

**הגנה:**
1. TypeScript types מאלצים `organizationId`
2. Security rules דורשות `incomingHasOrganizationId()`
3. Service layer validate לפני create

## Best Practices

### 1. תמיד בדוק organizationId

```typescript
// ✓ טוב
if (!data.organizationId) {
  throw new Error('organizationId is required');
}

// ❌ רע - לא בודק
await db.collection('records').add(data);
```

### 2. השתמש ב-TypeScript Types

```typescript
// ✓ טוב - TypeScript יזהה חוסר organizationId
interface Record extends BaseModuleRecord {
  organizationId: string; // נדרש!
}

// ❌ רע - any מסתיר בעיות
const record: any = { ... };
```

### 3. בדוק הרשאות ב-Client וב-Server

```typescript
// ✓ טוב - בדיקה משולבת
// Client
if (!hasRoleLevel(UserRole.INSPECTOR)) {
  return; // UX טוב
}

// Security Rules גם בודקות
allow create: if hasRoleLevel(2);
```

### 4. אל תסמוך על Client-Side בלבד

```typescript
// ❌ רע - רק client validation
if (userRole === 'admin') {
  // לא מספיק!
}

// ✓ טוב - Security rules תמיד בודקות
match /records/{id} {
  allow write: if hasRoleLevel(3);
}
```

### 5. השתמש ב-Custom Claims

```typescript
// ✓ טוב - custom claims מהשרת
const claims = await user.getIdTokenResult();
const role = claims.claims.role;

// ❌ רע - נתונים מ-Firestore ניתנים לזיוף
const userData = await getDoc(doc(db, 'users', uid));
const role = userData.data().role; // לא בטוח!
```

## Testing Security

### בדיקות ידניות

1. נסה לגשת לארגון אחר
2. נסה לשנות `organizationId`
3. נסה לבצע פעולה ללא הרשאה
4. נסה ליצור רשומה ללא `organizationId`

### Firestore Emulator

```bash
firebase emulators:start --only firestore

# Run security tests
npm run test:rules
```

### דוגמת Test

```javascript
it('denies read to different organization', async () => {
  const db = firebase.firestore();
  
  await firebase.assertFails(
    db.collection('radiationRecords')
      .doc('record_from_org_B')
      .get()
  );
});

it('requires organizationId on create', async () => {
  await firebase.assertFails(
    db.collection('radiationRecords').add({
      deviceName: 'Test'
      // Missing organizationId!
    })
  );
});
```

## Monitoring & Alerts

### מה לנטר

1. **Failed Authentication Attempts**
   - מישהו מנסה לפרוץ?

2. **Permission Denied Errors**
   - יותר מדי denials = בעיה אפשרית

3. **Cross-Organization Access Attempts**
   - Alert אם מישהו מנסה לגשת לארגון אחר

4. **Unusual Activity Patterns**
   - פעילות חריגה לפי תפקיד

### Firebase Console

- Authentication → Users - עקוב אחר כניסות
- Firestore → Usage - בדוק reads/writes
- Alerts - הגדר alerts על פעילות חריגה

## Compliance & Privacy

### GDPR

- **Right to Access** - משתמש יכול לקבל את כל הנתונים שלו
- **Right to Erasure** - מחיקת משתמש מוחקת את כל הרשומות שלו
- **Data Portability** - ייצוא נתונים ב-JSON

### Data Retention

- Soft delete (`status: 'deleted'`) לשמירת היסטוריה
- Hard delete אחרי תקופת retention מוגדרת
- Backup קבוע לפני מחיקה

## Summary

### שכבות האבטחה

1. **Firebase Authentication** - מי המשתמש?
2. **Custom Claims** - מה התפקיד והארגון?
3. **Firestore Security Rules** - האם יש הרשאה?
4. **Client Validation** - UX וטיפול בשגיאות
5. **TypeScript Types** - תפיסת שגיאות בזמן פיתוח

### עקרונות זהב

✓ כל רשומה עם `organizationId`
✓ Security rules תמיד אוכפות
✓ Custom claims לא ניתנים לשינוי מהלקוח
✓ Validation ב-client וב-server
✓ TypeScript strict mode

---

**זכור:** אבטחה היא לא תוספת - היא חלק בלתי נפרד מהארכיטקטורה!
