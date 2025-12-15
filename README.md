# SafeM - מערכת ניהול בטיחות

## תיאור

SafeM היא מערכת B2B SaaS מתקדמת לניהול בטיחות בארגונים. המערכת מספקת כלים מקיפים לניהול קרינה, לייזר, בטיחות אש, בטיחות בעבודה והדרכות.

## טכנולוגיות

- **Frontend:** React 18 + TypeScript (strict mode)
- **Backend:** Firebase (Authentication + Firestore)
- **State Management:** Zustand + React Query
- **Build Tool:** Vite
- **Language:** Hebrew RTL

## תכונות Phase 2

### Multi-tenancy
- בידוד מלא בין ארגונים
- כל רשומה מכילה `organizationId`
- אבטחה ברמת Firestore Security Rules

### Role-Based Access Control
- **SuperAdmin** - גישה מלאה לכל המערכת
- **OrgAdmin** - ניהול ארגון ספציפי
- **Inspector** - ביצוע בדיקות ובקרה
- **Client** - צפייה בלבד

### Security
- Firestore Security Rules מקיפות
- Custom claims ב-Firebase Auth
- Validation ב-client וב-server

## התקנה

```bash
# התקנת dependencies
npm install

# הגדרת environment variables
cp .env.example .env
# ערוך את .env עם פרטי Firebase שלך

# הרצה במצב פיתוח
npm run dev

# Build לפרודקשן
npm run build
```

## הגדרת Firebase

1. צור פרוייקט ב-[Firebase Console](https://console.firebase.google.com)
2. הפעל Authentication (Email/Password)
3. הפעל Firestore Database
4. העתק את ה-configuration ל-`.env`
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   ```

## מבנה הפרויקט

```
src/
├── components/          # React components
├── services/            # Firebase services
├── types/               # TypeScript types
├── stores/              # Zustand stores
└── hooks/               # Custom hooks

firestore.rules          # Security rules
docs/MASTER_DOCUMENT.md  # תיעוד מלא
```

## Scripts

```bash
npm run dev              # הרצה במצב development
npm run build            # Build לפרודקשן
npm run lint             # בדיקת ESLint
npm run preview          # תצוגה מקדימה של build
```

## תיעוד

תיעוד מפורט זמין ב-[docs/MASTER_DOCUMENT.md](./docs/MASTER_DOCUMENT.md)

## License

Proprietary - All rights reserved

## תמיכה

לשאלות ובעיות, פתח issue ב-GitHub או פנה לצוות הפיתוח.
