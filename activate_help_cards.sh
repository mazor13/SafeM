#!/bin/bash

echo "⚡ Activating Help Center Cards with Content..."

cat > frontend/src/pages/admin/help/HelpCenterPage.tsx << 'EOF'
import React, { useState } from 'react';
import { Book, FileText, Shield, Users, Layout, ChevronRight, ArrowRight, Activity, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- תוכן המדריכים (Hardcoded Content) ---
const GUIDES: any = {
  crm: {
    title: 'מערכת ה-CRM והמכירות',
    icon: Layout,
    color: 'text-indigo-400',
    content: (
      <div className="space-y-6 text-slate-300">
        <section>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Target size={20}/> ניהול הזדמנויות (Pipeline)</h3>
          <p>תהליך המכירה במערכת בנוי מ-7 שלבים, החל מסינון ראשוני (Qualification) ועד לסגירה. השתמשו בלוח ה-Kanban כדי לגרור עסקאות בין שלבים.</p>
        </section>
        
        <section className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
          <h4 className="font-bold text-white mb-2">סינון BANT (חובה למילוי)</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Budget:</strong> האם יש ללקוח תקציב מאושר?</li>
            <li><strong>Authority:</strong> האם אנחנו מדברים עם מקבל ההחלטות?</li>
            <li><strong>Need:</strong> האם יש צורך אמיתי במוצר?</li>
            <li><strong>Timeline:</strong> מהו לו"ז הרכישה?</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Users size={20}/> ועדת רכישה (Buying Committee)</h3>
          <p>בעסקאות B2B מורכבות, חובה למפות את בעלי התפקידים:</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
             <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20 text-sm">👑 <strong>Decision Maker:</strong> המחליט הסופי</div>
             <div className="bg-yellow-500/10 p-2 rounded border border-yellow-500/20 text-sm">💰 <strong>Economic Buyer:</strong> מאשר התקציב</div>
             <div className="bg-blue-500/10 p-2 rounded border border-blue-500/20 text-sm">🚀 <strong>Champion:</strong> התומך שלנו בארגון</div>
             <div className="bg-rose-500/10 p-2 rounded border border-rose-500/20 text-sm">🛡️ <strong>Blocker:</strong> גורם חוסם/מתנגד</div>
          </div>
        </section>

        <section>
           <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Activity size={20}/> יומן פעילות (Timeline)</h3>
           <p>כל אינטראקציה (שיחה, מייל, פגישה) חייבת להיות מתועדת בלשונית ה-Timeline בכרטיס העסקה.</p>
        </section>
      </div>
    )
  },
  safety: {
    title: 'בטיחות וסקרים',
    icon: Shield,
    color: 'text-emerald-400',
    content: (
      <div className="space-y-4 text-slate-300">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-200">
           🚧 <strong>מודול זה נמצא בפיתוח (Phase 2)</strong>
           <br/>בקרוב תוכלו לנהל כאן תיקי בטיחות, לבצע מבדקים דיגיטליים ולהפיק דוחות ליקויים אוטומטיים.
        </div>
      </div>
    )
  },
  users: {
    title: 'ניהול משתמשים והרשאות',
    icon: Users,
    color: 'text-blue-400',
    content: (
      <div className="space-y-4 text-slate-300">
        <p>מערכת AEGIS תומכת במספר רמות הרשאה:</p>
        <ul className="list-disc list-inside space-y-2">
            <li><strong>Admin:</strong> גישה מלאה לכל ההגדרות.</li>
            <li><strong>Manager:</strong> גישה לנתונים ודוחות, ללא הגדרות מערכת.</li>
            <li><strong>Field User:</strong> גישה לטפסים וביצוע סקרים בלבד.</li>
        </ul>
      </div>
    )
  }
};

const HelpCard = ({ id, icon: Icon, title, desc, onClick }: any) => (
  <div onClick={() => onClick(id)} className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group h-full flex flex-col">
    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
      <Icon className="text-indigo-400" size={24} />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed flex-1">{desc}</p>
    <div className="mt-4 flex items-center text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        קרא עוד <ArrowRight size={16} className="mr-1" />
    </div>
  </div>
);

export default function HelpCenterPage() {
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  // אם יש מדריך פעיל, מציגים את תוכן המדריך
  if (activeGuide && GUIDES[activeGuide]) {
      const guide = GUIDES[activeGuide];
      const Icon = guide.icon;
      
      return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen" dir="rtl">
            <button 
                onClick={() => setActiveGuide(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ChevronRight size={20} /> חזרה למרכז העזרה
            </button>
            
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                    <div className={`p-3 bg-slate-800 rounded-xl ${guide.color}`}>
                        <Icon size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white">{guide.title}</h1>
                </div>
                
                <div className="leading-relaxed">
                    {guide.content}
                </div>
            </div>
        </div>
      );
  }

  // אחרת, מציגים את התפריט הראשי
  return (
    <div className="p-8 max-w-6xl mx-auto" dir="rtl">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
          <Book size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">מרכז עזרה ותיעוד</h1>
          <p className="text-slate-400">בחר נושא כדי לצפות במדריכים ובנהלים</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HelpCard 
          id="crm"
          onClick={setActiveGuide}
          icon={Layout} 
          title="מערכת ה-CRM" 
          desc="מדריך מקיף לניהול תהליך המכירה: יצירת הזדמנויות, ניהול ועדת רכישה, תיעוד פעילויות ושימוש ב-Kanban."
        />
        <HelpCard 
          id="safety"
          onClick={setActiveGuide}
          icon={Shield} 
          title="בטיחות וסקרים" 
          desc="כיצד לנהל תיקי בטיחות, לבצע מבדקים בשטח, להפיק דוחות ליקויים ולנהל מעקב טיפול."
        />
        <HelpCard 
          id="users"
          onClick={setActiveGuide}
          icon={Users} 
          title="ניהול משתמשים" 
          desc="הגדרת משתמשים חדשים, ניהול צוותים, חלוקת הרשאות ופרופילים במערכת."
        />
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-indigo-900/20 to-slate-900 rounded-2xl border border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">לא מצאת את מה שחיפשת?</h3>
          <p className="text-slate-400 text-sm">צוות התמיכה זמין עבורך לכל שאלה טכנית או תפעולית.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20">
          פתיחת קריאת שירות
        </button>
      </div>
    </div>
  );
}
EOF

echo "✅ Help Center functionality deployed."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
