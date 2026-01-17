#!/bin/bash

echo "🚀 Finalizing Sales Module: Documentation, Help Center, and Git Merge..."

# 1. עדכון מקיף למדריך המשתמש (כולל כל החידושים)
cat > frontend/public/docs/SALES_USER_GUIDE.md << 'EOF'
# מדריך משתמש - AEGIS Sales Enterprise
**גרסה:** 2.1 (Sales Core Complete)
**תאריך עדכון:** 17/01/2026

## 1. מבוא
מערכת המכירות נועדה לנהל עסקאות מורכבות (B2B) בצורה חכמה, תוך מעקב אחרי הלקוח, בעלי התפקידים והתקשורת השוטפת.

## 2. יצירת הזדמנות (Opportunity)
תהליך פתיחת עסקה חדשה כולל:
1.  **חיפוש לקוח:** השתמש בשדה החיפוש החכם. אם הלקוח (Tenant) קיים, המערכת תציע אותו. אם לא - צור אותו.
2.  **BANT Qualification:** חובה למלא את 4 מדדי הסינון (תקציב, סמכות, צורך, לו"ז) כדי לקבל ציון איכות.
3.  **Forecast:** סכום העסקה כפול ההסתברות (Probability) נותן את הצפי המשוקלל.

## 3. ניהול צוות העסקה (Buying Committee)
עסקה לא נסגרת מול אדם אחד. בלשונית "פרטים" עליך למפות את האנשים:
* 👑 **Decision Maker:** מקבל ההחלטה הסופית (חובה לסמן לפני סגירה!).
* 💰 **Economic Buyer:** מאשר התקציב.
* 🛡️ **Blocker:** גורם עוין שעלול לטרפד את העסקה.
* 🚀 **Champion:** התומך שלנו בתוך הארגון.

## 4. יומן פעילות (Timeline)
כל אינטראקציה עם הלקוח חייבת להיות מתועדת בלשונית **Timeline**:
* 📞 **שיחות:** סיכום קצר של השיחה.
* 📅 **פגישות:** סיכום פגישה ומשימות להמשך.
* 📧 **מיילים:** תיעוד הצעות שנשלחו.
* 📝 **הערות:** מידע פנימי לצוות.

## 5. לוח הבקרה (Kanban)
* **גרירה:** ניתן לגרור כרטיסים בין שלבים. ההסתברות מתעדכנת אוטומטית.
* **מחיקה:** ניתן למחוק הזדמנויות (אייקון פח בפינה).
* **אינדיקטורים:** נקודות ירוקות על הכרטיס מסמנות את ציון ה-BANT.
EOF

# 2. יצירת דף "מרכז עזרה" בתוך המערכת
mkdir -p frontend/src/pages/admin/help

cat > frontend/src/pages/admin/help/HelpCenterPage.tsx << 'EOF'
import React, { useState } from 'react';
import { Book, FileText, Layout, Users, Activity, HelpCircle, ChevronRight } from 'lucide-react';

const DocSection = ({ title, icon: Icon, children }: any) => (
  <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 mb-6">
    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <Icon className="text-indigo-400" /> {title}
    </h3>
    <div className="text-slate-300 space-y-2 leading-relaxed">
      {children}
    </div>
  </div>
);

export default function HelpCenterPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto" dir="rtl">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
          <Book size={32} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">מרכז הידע והספרות</h1>
        <p className="text-slate-400 text-lg">תיעוד, מדריכים ונהלי עבודה למערכת AEGIS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-3">
          <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
            <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">נושאים</h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 text-indigo-400 bg-indigo-500/10 p-2 rounded-lg cursor-pointer font-medium">
                <ChevronRight size={16} /> מודול מכירות (CRM)
              </li>
              <li className="flex items-center gap-2 text-slate-400 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                <ChevronRight size={16} /> ניהול בטיחות (בקרוב)
              </li>
              <li className="flex items-center gap-2 text-slate-400 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                <ChevronRight size={16} /> דוחות ו-BI (בקרוב)
              </li>
            </ul>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2">
          
          <DocSection title="תהליך המכירה (Pipeline)" icon={Layout}>
            <p>תהליך המכירה במערכת בנוי מ-7 שלבים, החל מסינון ראשוני (Qualification) ועד לסגירה (Closed Won).</p>
            <ul className="list-disc list-inside mt-2 text-slate-400 space-y-1">
              <li>השתמשו בלוח ה-Kanban כדי לגרור עסקאות בין שלבים.</li>
              <li>כל שלב מעדכן אוטומטית את אחוז ההסתברות לסגירה.</li>
              <li>הקפידו למלא תאריך סגירה צפוי לצורך חישוב ה-Forecast.</li>
            </ul>
          </DocSection>

          <DocSection title="ועדת רכישה (Buying Committee)" icon={Users}>
            <p>עסקה בארגון גדול דורשת מיפוי של כל מקבלי ההחלטות.</p>
            <p className="mt-2">יש להגדיר לכל איש קשר תפקיד:</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div className="bg-emerald-500/10 text-emerald-300 p-2 rounded">👑 Decision Maker</div>
              <div className="bg-yellow-500/10 text-yellow-300 p-2 rounded">💰 Economic Buyer</div>
              <div className="bg-blue-500/10 text-blue-300 p-2 rounded">🚀 Champion</div>
              <div className="bg-rose-500/10 text-rose-300 p-2 rounded">🛡️ Blocker</div>
            </div>
          </DocSection>

          <DocSection title="תיעוד פעילויות (Timeline)" icon={Activity}>
            <p>הזיכרון הארגוני הוא קריטי. כל שיחה, מייל או פגישה חייבים להיות מתועדים בכרטיס העסקה.</p>
            <p className="mt-2 text-sm text-slate-500">טיפ: השתמשו בתיעוד כדי להכין סיכומי פגישה לפני השיחה הבאה עם הלקוח.</p>
          </DocSection>

        </div>
      </div>
    </div>
  );
}
EOF

# 3. הוספת הנתיב (Route) לקובץ App.tsx
# אנחנו משתמשים ב-sed כדי להזריק את ה-Import וה-Route במיקומים הנכונים
sed -i "1s/^/import HelpCenterPage from '.\/pages\/admin\/help\/HelpCenterPage';\n/" frontend/src/App.tsx
# הוספת ה-Route לפני הסגירה של ה-Routes
sed -i '/<Route path="settings" element={<SettingsPage \/>} \/>/a \          <Route path="help" element={<HelpCenterPage />} />' frontend/src/App.tsx

echo "✅ Documentation & Help Center Created."

# 4. ביצוע GIT MERGE
echo "🔄 Starting Git Merge Process..."

git add .
git commit -m "feat(sales): complete sales core with timeline, buying committee, and help center"

# מעבר ל-Main ומיזוג
git checkout main
git pull origin main
git merge feat/sales-core --no-edit

echo "🚀 Pushing to Production..."
git push origin main

# פריסה ל-Firebase
cd frontend && npm run build
cd ..
firebase deploy --only hosting

echo "🎉 MISSION COMPLETE! Sales Module is LIVE on Main Branch."
echo "👉 Check the new Help Center at: /admin/help"
