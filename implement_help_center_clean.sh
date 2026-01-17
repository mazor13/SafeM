#!/bin/bash

echo "🧹 Organizing Help Center Implementation (Clean & Safe)..."

# --- 1. יצירת דף האינדקס (Help Page) ---
echo "📄 Creating Help Center Index Page..."
mkdir -p frontend/src/pages/admin/help

cat > frontend/src/pages/admin/help/HelpCenterPage.tsx << 'EOF'
import React from 'react';
import { Book, FileText, Shield, Users, Layout, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpCard = ({ icon: Icon, title, desc, onClick }: any) => (
  <div onClick={onClick} className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group">
    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="text-indigo-400" size={24} />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default function HelpCenterPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-6xl mx-auto" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
          <Book size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">מרכז עזרה ותיעוד</h1>
          <p className="text-slate-400">מדריכים, נהלים ומידע על מערכת AEGIS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HelpCard 
          icon={Layout} 
          title="מערכת ה-CRM" 
          desc="מדריך לניהול לידים, הזדמנויות, ועדת רכישה ויומן פעילות."
        />
        <HelpCard 
          icon={Shield} 
          title="בטיחות וסקרים" 
          desc="כיצד לנהל תיקי בטיחות, לבצע מבדקים ולהפיק דוחות."
        />
        <HelpCard 
          icon={Users} 
          title="ניהול משתמשים" 
          desc="הוספת עובדים, ניהול הרשאות וצוותים במערכת."
        />
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-indigo-900/20 to-slate-900 rounded-2xl border border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">צריך עזרה נוספת?</h3>
          <p className="text-slate-400 text-sm">צוות התמיכה זמין עבורך בכל שאלה.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
          פתיחת קריאת שירות
        </button>
      </div>
    </div>
  );
}
EOF

# --- 2. סידור הניתוב ב-App.tsx ---
echo "🔗 Wiring up the Route in App.tsx..."
APP_FILE="frontend/src/App.tsx"
cp "$APP_FILE" "$APP_FILE.bak"

# הוספת Import אם חסר
if ! grep -q "HelpCenterPage" "$APP_FILE"; then
    sed -i '/import .*from .react.;/a import HelpCenterPage from ".\/pages\/admin\/help\/HelpCenterPage";' "$APP_FILE"
fi

# הוספת ה-Route בצורה בטוחה (אחרי cloud-hub שהוא ייחודי ולא מתנגש עם BI)
if ! grep -q 'path="help"' "$APP_FILE"; then
    if grep -q 'path="cloud-hub"' "$APP_FILE"; then
        sed -i '/path="cloud-hub"/a \          <Route path="help" element={<HelpCenterPage />} />' "$APP_FILE"
        echo "✅ Route /admin/help added safely."
    else
        # גיבוי: אם אין cloud-hub, נחפש את ה-Dashboard הרגיל
        sed -i '/index element={<AdminDashboard \/>}/a \          <Route path="help" element={<HelpCenterPage />} />' "$APP_FILE"
        echo "✅ Route /admin/help added (fallback position)."
    fi
else
    echo "ℹ️ Route already exists."
fi

# --- 3. חיבור הכפתור הקיים (הספר הירוק) ב-AdminLayout ---
echo "🔌 Connecting the Green Book Button..."
LAYOUT_FILE="frontend/src/layouts/AdminLayout.tsx"
cp "$LAYOUT_FILE" "$LAYOUT_FILE.bak"

# שינוי הפעולה של הכפתור הקיים: במקום לפתוח מודאל -> לנווט לדף
# מחפש את הלוגיקה הישנה ומחליף בחדשה
sed -i "s/onClick={() => setShowHelp(true)}/onClick={() => navigate('\/admin\/help')}/" "$LAYOUT_FILE"

echo "🚀 Deploying Clean Version..."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
