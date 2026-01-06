# 🔄 Migration Plan: tenants → clients

## מצב נוכחי

### Collections:
- `clients` (1 doc) - אינטל חיפה + equipment, findings
- `tenants` (4 docs) - מערכת Admin ישנה
- `users` (~11 docs) - מעורבב clientId/tenantId

### קבצים שמשתמשים ב-tenants:
- src/pages/admin/Clients.tsx
- src/pages/admin/CreateClient.tsx
- src/pages/admin/Client360.tsx
- src/pages/admin/CommandCenter.tsx
- src/pages/admin/FinancialDashboard.tsx
- src/components/admin/UsersTab.tsx
- src/hooks/useClients.ts
- src/hooks/useAnalytics.ts
- src/hooks/useSystemStats.ts

### קבצים שמשתמשים ב-clients (נשמור!):
- src/pages/client-dashboard/* (כל ה-Portal)
- src/pages/admin/PendingApprovals.tsx
- src/providers/ClientProvider.tsx

## שלבי המיגרציה

### שלב 1: הוספת שדות ל-clients collection
- plan, healthScore, domain, activeModules, usersCount, maxUsers

### שלב 2: עדכון Admin pages
- Clients.tsx → clients במקום tenants
- CreateClient.tsx → clients במקום tenants
- Client360.tsx → clients במקום tenants

### שלב 3: עדכון users
- כל המשתמשים יעברו ל-clientId (ללא tenantId)

### שלב 4: עדכון hooks
- useClients.ts → clients

### שלב 5: Firestore Rules
- עדכון חוקים לתמוך במבנה החדש

## סיכונים
- ❌ לא לגעת ב-Portal files שעובדים
- ❌ לא למחוק tenants עד שהכל עובד
- ✅ לבדוק כל שלב לפני המשך

