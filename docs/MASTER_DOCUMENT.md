# SafeM - מסמך ארכיטקטורה ראשי
## B2B SaaS לניהול בטיחות

### תקציר מנהלים

SafeM היא מערכת B2B SaaS מקיפה לניהול בטיחות בארגונים. המערכת מתמחה במודולים מרכזיים כגון קרינה, לייזר, אש, בטיחות בעבודה והדרכות.

**סטאק טכנולוגי:**
- Frontend: React 18 + TypeScript (strict mode)
- Backend: Firebase (Authentication, Firestore)
- State Management: Zustand (client state) + React Query (server state)
- Build Tool: Vite
- Language: Hebrew RTL

---

## Phase 2: Security Rules + Multi-tenancy

### מבנה היררכיית משתמשים

```
SuperAdmin (מנהל על)
    ↓
OrgAdmin (מנהל ארגון)
    ↓
Inspector (בודק)
    ↓
Client (לקוח)
```

#### תיאור תפקידים

1. **SuperAdmin** (רמה 4)
   - גישה מלאה לכל הארגונים
   - יצירת וניהול ארגונים
   - ניהול כל המשתמשים במערכת
   - גישה לכל המודולים והנתונים

2. **OrgAdmin** (רמה 3)
   - ניהול ארגון ספציפי
   - יצירת וניהול משתמשים בארגון
   - הגדרת מודולים פעילים
   - גישה לכל הנתונים של הארגון

3. **Inspector** (רמה 2)
   - ביצוע בדיקות ואינספקציות
   - יצירה ועדכון רשומות בטיחות
   - גישה לנתוני הארגון
   - לא יכול למחוק או לנהל משתמשים

4. **Client** (רמה 1)
   - צפייה בלבד
   - גישה לדוחות ורשומות בטיחות
   - אין אפשרות ליצירה או עריכה

---

## ארכיטקטורת Multi-tenancy

### עקרון ה-organizationId

**כלל זהב:** כל collection במערכת **חייב** להכיל שדה `organizationId`.

זה מבטיח:
1. **בידוד נתונים** - ארגון אחד לא יכול לגשת לנתונים של ארגון אחר
2. **אבטחה** - Security rules אוכפות בידוד ברמת Firestore
3. **אופטימיזציה** - אינדקסים על `organizationId` למשיכת נתונים מהירה
4. **סקלביליות** - תמיכה במספר בלתי מוגבל של ארגונים

### Collections במערכת

```typescript
organizations/
  {orgId}/
    - organizationId: string (self-reference)
    - name: string
    - nameHebrew: string
    - modules: OrganizationModule[]
    - settings: OrganizationSettings

users/
  {userId}/
    - organizationId: string (required!)
    - role: UserRole
    - email: string
    - displayName: string

radiationRecords/
  {recordId}/
    - organizationId: string (required!)
    - module: 'radiation'
    - inspectorId: string
    - measurements: RadiationMeasurement[]

laserRecords/
  {recordId}/
    - organizationId: string (required!)
    - module: 'laser'
    - laserClass: string

fireSafetyRecords/
  {recordId}/
    - organizationId: string (required!)
    - module: 'fire'
    - equipmentType: string

workSafetyRecords/
  {recordId}/
    - organizationId: string (required!)
    - module: 'work_safety'
    - hazards: string[]

trainingRecords/
  {recordId}/
    - organizationId: string (required!)
    - module: 'training'
    - participantIds: string[]
```

---

## Firestore Security Rules

### מבנה ה-Rules

הקובץ `firestore.rules` מכיל:

1. **Helper Functions** - פונקציות עזר לבדיקת הרשאות
   - `isAuthenticated()` - בדיקה אם המשתמש מחובר
   - `getUserRole()` - קבלת תפקיד מה-custom claims
   - `getUserOrgId()` - קבלת ה-organizationId מה-custom claims
   - `belongsToOrganization(orgId)` - בדיקה אם המשתמש שייך לארגון
   - `hasRoleLevel(level)` - בדיקת רמת הרשאה

2. **Collection Rules** - כללי אבטחה לכל collection
   - בדיקת הרשאות לפי תפקיד
   - אימות קיום `organizationId`
   - אכיפת התאמת `organizationId` למשתמש

3. **Default Deny** - סגירת גישה כברירת מחדל

### דוגמת Rule

```javascript
match /radiationRecords/{recordId} {
  // קריאה: משתמש מאומת שייך לאותו ארגון
  allow read: if isAuthenticated() && 
                 hasOrganizationId() && 
                 belongsToOrganization(resource.data.organizationId);
  
  // יצירה: בודק ומעלה, עם organizationId תקין
  allow create: if hasRoleLevel(2) && 
                   organizationMatches() &&
                   incomingHasOrganizationId();
  
  // עדכון: בודק ומעלה באותו ארגון
  allow update: if hasRoleLevel(2) && 
                   hasOrganizationId() && 
                   belongsToOrganization(resource.data.organizationId) &&
                   organizationMatches();
  
  // מחיקה: מנהל ארגון ומעלה
  allow delete: if hasRoleLevel(3) && 
                   hasOrganizationId() && 
                   belongsToOrganization(resource.data.organizationId);
}
```

---

## State Management

### Zustand Stores (Client State)

1. **authStore** - ניהול מצב אימות
   ```typescript
   - user: User | null
   - isAuthenticated: boolean
   - hasRole(role): boolean
   - hasRoleLevel(role): boolean
   ```

2. **organizationStore** - ניהול מצב ארגון
   ```typescript
   - currentOrganization: Organization | null
   - organizations: Organization[]
   - hasModule(module): boolean
   ```

### React Query (Server State)

- **Caching** - שמירת נתוני שרת זמנית
- **Background Updates** - עדכון אוטומטי
- **Optimistic Updates** - עדכונים אופטימיים
- **Stale Time** - 5 דקות

---

## TypeScript Strict Mode

### הגדרות tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### כללי קוד

1. **כל משתנה חייב להיות עם type מפורש או inferred**
2. **אין any - רק unknown אם הכרחי**
3. **Optional properties - שימוש ב-undefined במפורש**
4. **Array access - בדיקת undefined**
5. **Object properties - בדיקת קיום**

---

## RTL Hebrew Support

### עקרונות

1. **Direction** - `direction: rtl` בכל רכיב ראשי
2. **Text Alignment** - `text-align: right` לטקסט עברי
3. **Input Direction** - אימייל ומספרים `direction: ltr`
4. **Layout** - Flexbox/Grid עם `flex-direction: row-reverse`

### דוגמה

```tsx
<div style={{ direction: 'rtl' }}>
  <h1>כותרת בעברית</h1>
  <input 
    type="email" 
    style={{ direction: 'ltr', textAlign: 'right' }}
  />
</div>
```

---

## מודולי בטיחות

### מודולים זמינים

1. **RADIATION** (קרינה)
   - מדידות קרינה
   - מכשירי קרינה
   - מעקב אחר רמות חשיפה

2. **LASER** (לייזר)
   - סיווג לייזרים
   - אמצעי בטיחות
   - בדיקות תקופתיות

3. **FIRE** (בטיחות אש)
   - מטפים
   - מערכות כיבוי
   - אזעקות אש

4. **WORK_SAFETY** (בטיחות בעבודה)
   - סיכונים
   - המלצות
   - מעקב תיקונים

5. **TRAINING** (הדרכות)
   - קורסים
   - משתתפים
   - תעודות

6. **CHEMICAL** (כימיקלים)
7. **ELECTRICAL** (חשמל)

---

## מבנה תיקיות

```
SafeM/
├── src/
│   ├── components/      # React components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/        # Firebase services
│   │   ├── firebase.service.ts
│   │   ├── auth.service.ts
│   │   └── organization.service.ts
│   ├── types/           # TypeScript types
│   │   ├── user.types.ts
│   │   ├── organization.types.ts
│   │   └── module.types.ts
│   ├── stores/          # Zustand stores
│   │   ├── auth.store.ts
│   │   └── organization.store.ts
│   ├── hooks/           # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useOrganization.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── docs/
│   └── MASTER_DOCUMENT.md
├── firestore.rules      # Security rules
├── firestore.indexes.json
├── firebase.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## אבטחה - נקודות מפתח

### 1. Custom Claims

כל משתמש חייב לקבל custom claims ב-Firebase Auth:
```javascript
{
  role: 'org_admin',
  organizationId: 'org_12345'
}
```

### 2. Client-Side Validation

```typescript
// בדיקה לפני קריאה ל-API
if (!user.organizationId) {
  throw new Error('Missing organizationId');
}

if (!hasRoleLevel(UserRole.INSPECTOR)) {
  throw new Error('Insufficient permissions');
}
```

### 3. Server-Side Enforcement

Security rules אוכפות ברמת Firestore:
- אין דרך לעקוף אותן מהצד client
- כל בקשה עוברת דרכן
- לא תלוי בקוד JavaScript

---

## תהליך פיתוח

### 1. הוספת Collection חדש

```typescript
// 1. הוסף Type
export interface NewRecord extends BaseModuleRecord {
  organizationId: string; // חובה!
  // שדות נוספים...
}

// 2. הוסף Service
export const createNewRecord = async (data: NewRecord) => {
  // ודא organizationId
  if (!data.organizationId) {
    throw new Error('organizationId is required');
  }
  // ...
};

// 3. הוסף Security Rule
match /newRecords/{recordId} {
  allow read: if isAuthenticated() && 
                 belongsToOrganization(resource.data.organizationId);
  // ...
}

// 4. הוסף Index
{
  "collectionGroup": "newRecords",
  "fields": [
    { "fieldPath": "organizationId", "order": "ASCENDING" }
  ]
}
```

### 2. הוספת Role חדש

```typescript
// 1. עדכן Enum
export enum UserRole {
  // ...
  NEW_ROLE = 'new_role',
}

// 2. עדכן Hierarchy
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  // ...
  [UserRole.NEW_ROLE]: 2.5,
};

// 3. עדכן Security Rules
function hasRoleLevel(requiredLevel) {
  let userLevel = 
    getUserRole() == 'new_role' ? 2.5 :
    // ...
}
```

---

## Deployment

### הכנה לפרודקשן

1. **Environment Variables**
   ```bash
   cp .env.example .env
   # מלא את המשתנים עם ערכי Firebase
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Deploy Indexes**
   ```bash
   firebase deploy --only firestore:indexes
   ```

5. **Deploy Hosting**
   ```bash
   firebase deploy --only hosting
   ```

---

## Testing Security Rules

### שימוש ב-Firestore Emulator

```bash
firebase emulators:start --only firestore

# Run tests
npm run test:rules
```

### דוגמאות Test Cases

```javascript
// Test 1: User can only read their org data
it('denies read to different organization', async () => {
  await firebase.assertFails(
    db.collection('users')
      .doc('user_from_org_B')
      .get()
  );
});

// Test 2: organizationId is required
it('denies create without organizationId', async () => {
  await firebase.assertFails(
    db.collection('radiationRecords').add({
      deviceName: 'Test'
      // Missing organizationId!
    })
  );
});
```

---

## תחזוקה ושדרוגים

### בדיקות תקופתיות

1. **Security Rules Audit** - אחת לרבעון
2. **Dependencies Update** - אחת לחודש
3. **TypeScript Version** - עם כל major release
4. **Firebase SDK** - אחת לרבעון

### Monitoring

1. **Firebase Console** - שימוש ב-security rules
2. **Error Tracking** - Sentry/Similar
3. **Performance** - Firebase Performance Monitoring
4. **Analytics** - Firebase Analytics

---

## נספחים

### A. סכמת Database מלאה

ראה: [database-schema.md](./database-schema.md)

### B. API Reference

ראה: [api-reference.md](./api-reference.md)

### C. Security Best Practices

ראה: [security-guide.md](./security-guide.md)

---

## תמיכה

לשאלות וסיוע:
- Email: support@safem.example
- Documentation: https://docs.safem.example
- GitHub Issues: https://github.com/mazor13/SafeM/issues

---

**גרסה:** 2.0.0  
**עדכון אחרון:** דצמבר 2025  
**מחבר:** SafeM Development Team
