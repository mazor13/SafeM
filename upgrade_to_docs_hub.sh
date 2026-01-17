#!/bin/bash

echo "📚 Upgrading Help Center to Full Documentation Hub (Wiki Style)..."

cat > frontend/src/pages/admin/help/HelpCenterPage.tsx << 'EOF'
import React, { useState, useMemo } from 'react';
import { 
  Book, Search, ChevronDown, ChevronRight, Layout, Shield, 
  Users, FileText, Settings, Menu, ExternalLink, Lightbulb, AlertTriangle
} from 'lucide-react';

// --- DATA: מאגר הידע (Hardcoded Knowledge Base) ---
// בעתיד זה יכול להגיע ממסד הנתונים
const DOCS_DATA = [
  {
    category: 'מבוא והתחלה מהירה',
    icon: Lightbulb,
    items: [
      {
        id: 'intro',
        title: 'ברוכים הבאים ל-AEGIS',
        content: (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white mb-4">ברוכים הבאים למערכת AEGIS</h1>
            <p className="text-lg text-slate-300">
              מערכת AEGIS היא פלטפורמת הניהול המרכזית של הארגון. המערכת מרכזת את כל תהליכי המכירה (CRM), הבטיחות והתפעול תחת קורת גג אחת.
            </p>
            <div className="bg-indigo-900/30 border-l-4 border-indigo-500 p-4 rounded-r-lg my-4">
              <h4 className="font-bold text-indigo-300 mb-1">למי מיועד המדריך?</h4>
              <p className="text-sm text-slate-400">המדריך מיועד לכל משתמשי המערכת: מנהלים, אנשי מכירות, ממוני בטיחות וצוותי שטח.</p>
            </div>
            <h3 className="text-xl font-bold text-white mt-6">צעדים ראשונים</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>ודא שיש לך שם משתמש וסיסמה.</li>
              <li>הגדר את הפרופיל האישי שלך (תמונה ופרטים).</li>
              <li>עבור על המדריכים הרלוונטיים לתפקידך בתפריט מימין.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    category: 'CRM ומכירות',
    icon: Layout,
    items: [
      {
        id: 'pipeline',
        title: 'ניהול הזדמנויות (Pipeline)',
        content: (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white mb-4">ניהול הזדמנויות (Pipeline)</h1>
            <p className="text-slate-300">
              מודול ההזדמנויות הוא הלב של מחלקת המכירות. הוא מאפשר מעקב ויזואלי (Kanban) אחר כל עסקה משלב הליד ועד הסגירה.
            </p>
            
            <h3 className="text-xl font-bold text-white mt-6">תהליך העבודה</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 marker:text-indigo-500">
              <li><strong>יצירת הזדמנות:</strong> לחץ על "הזדמנות חדשה" ומלא את פרטי הלקוח.</li>
              <li><strong>עדכון שלבים:</strong> גרור את הכרטיס בין העמודות בהתאם להתקדמות.</li>
              <li><strong>סגירה:</strong> סמן את העסקה כ-Won (זכייה) או Lost (הפסד).</li>
            </ol>

            <div className="bg-slate-800 p-6 rounded-xl border border-white/5 mt-6">
               <h4 className="font-bold text-white mb-4 border-b border-white/10 pb-2">מונחי יסוד</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-indigo-400 font-bold block">Weighted Value (צפי משוקלל)</span>
                    <span className="text-xs text-slate-400">סכום העסקה * אחוז ההסתברות. זהו הנתון הקובע לתחזית.</span>
                  </div>
                  <div>
                    <span className="text-indigo-400 font-bold block">Age (גיל העסקה)</span>
                    <span className="text-xs text-slate-400">מספר הימים שהעסקה פתוחה. עסקה "זקנה" דורשת תשומת לב.</span>
                  </div>
               </div>
            </div>
          </div>
        )
      },
      {
        id: 'bant',
        title: 'שיטת BANT',
        content: (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white mb-4">סינון לקוחות (BANT Qualification)</h1>
            <p className="text-slate-300">
              כדי לא לבזבז זמן על עסקאות לא רלוונטיות, אנו משתמשים במודל BANT. חובה לסמן V בכל אחד מהסעיפים כדי לקדם עסקה לשלבים מתקדמים.
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex gap-3 bg-slate-800/50 p-3 rounded-lg border border-white/5">
                <span className="font-bold text-emerald-400 w-24">Budget</span>
                <span className="text-slate-300">האם ללקוח יש תקציב מאושר לפרויקט?</span>
              </li>
              <li className="flex gap-3 bg-slate-800/50 p-3 rounded-lg border border-white/5">
                <span className="font-bold text-emerald-400 w-24">Authority</span>
                <span className="text-slate-300">האם אנחנו מדברים עם מקבל ההחלטות הסופי?</span>
              </li>
              <li className="flex gap-3 bg-slate-800/50 p-3 rounded-lg border border-white/5">
                <span className="font-bold text-emerald-400 w-24">Need</span>
                <span className="text-slate-300">האם זיהינו צורך אמיתי או כאב שהמוצר פותר?</span>
              </li>
              <li className="flex gap-3 bg-slate-800/50 p-3 rounded-lg border border-white/5">
                <span className="font-bold text-emerald-400 w-24">Timeline</span>
                <span className="text-slate-300">האם יש לו"ז מוגדר לרכישה (למשל: רבעון קרוב)?</span>
              </li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    category: 'בטיחות (Safety)',
    icon: Shield,
    items: [
      {
        id: 'safety-files',
        title: 'ניהול תיק בטיחות',
        content: (
          <div className="space-y-4">
             <h1 className="text-3xl font-bold text-white mb-4">ניהול תיק בטיחות</h1>
             <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex gap-3 text-amber-200">
                <AlertTriangle size={20} />
                <p>שים לב: מודול זה דורש הרשאת "ממונה בטיחות" ומעלה.</p>
             </div>
             <p className="text-slate-300 mt-4">
               תיק הבטיחות הוא המקום בו מרוכזים כל המסמכים, האישורים וההסמכות של האתר או הפרויקט.
             </p>
          </div>
        )
      }
    ]
  },
  {
    category: 'מערכת והגדרות',
    icon: Settings,
    items: [
      {
        id: 'users',
        title: 'ניהול משתמשים',
        content: (
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">ניהול משתמשים והרשאות</h1>
            <p className="text-slate-300">מדריך למנהל המערכת על הוספת עובדים והגדרת הרשאות גישה.</p>
          </div>
        )
      }
    ]
  }
];

export default function HelpCenterPage() {
  const [selectedDocId, setSelectedDocId] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCats, setExpandedCats] = useState<string[]>(DOCS_DATA.map(c => c.category));

  // חיפוש וסינון
  const filteredDocs = useMemo(() => {
    if (!searchQuery) return DOCS_DATA;
    return DOCS_DATA.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  // מציאת התוכן הנוכחי להצגה
  const activeContent = useMemo(() => {
    for (const cat of DOCS_DATA) {
      const found = cat.items.find(i => i.id === selectedDocId);
      if (found) return found;
    }
    return DOCS_DATA[0].items[0];
  }, [selectedDocId]);

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden" dir="rtl">
      
      {/* SIDEBAR - Navigation Tree */}
      <div className="w-80 bg-slate-900 border-l border-white/5 flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-white/5">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                 <Book size={18} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">מרכז הידע</span>
           </div>
           
           <div className="relative">
             <input 
               type="text" 
               placeholder="חפש במדריכים..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 pl-9 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
             />
             <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {filteredDocs.map((cat) => (
             <div key={cat.category}>
               <button 
                 onClick={() => toggleCat(cat.category)}
                 className="flex items-center w-full text-slate-400 hover:text-white text-sm font-bold uppercase tracking-wider mb-2 gap-2"
               >
                 {expandedCats.includes(cat.category) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                 {cat.category}
               </button>
               
               {expandedCats.includes(cat.category) && (
                 <div className="space-y-1 mr-2 border-r border-slate-800 pr-3">
                   {cat.items.map((doc) => (
                     <button
                       key={doc.id}
                       onClick={() => setSelectedDocId(doc.id)}
                       className={`w-full text-right py-2 px-3 rounded-lg text-sm transition-all ${
                         selectedDocId === doc.id 
                           ? 'bg-indigo-600/10 text-indigo-400 font-medium border border-indigo-500/20' 
                           : 'text-slate-400 hover:text-white hover:bg-slate-800'
                       }`}
                     >
                       {doc.title}
                     </button>
                   ))}
                 </div>
               )}
             </div>
           ))}
        </div>
        
        <div className="p-4 border-t border-white/5">
           <div className="bg-slate-800 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-2">לא מצאת תשובה?</p>
              <button className="w-full bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded-lg font-bold border border-white/10">
                 צור קשר עם התמיכה
              </button>
           </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-[#0f172a] p-10">
         <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs (Visual) */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
               <span>מרכז הידע</span>
               <ChevronRight size={12}/>
               <span>{DOCS_DATA.find(c => c.items.some(i => i.id === selectedDocId))?.category}</span>
               <ChevronRight size={12}/>
               <span className="text-indigo-400 font-bold">{activeContent.title}</span>
            </div>

            {/* The Article */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 min-h-[600px] shadow-2xl relative overflow-hidden">
               {/* Decorative Gradient */}
               <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-indigo-500 to-purple-500"></div>
               
               <article className="prose prose-invert prose-indigo max-w-none">
                  {activeContent.content}
               </article>
               
               <div className="mt-12 pt-6 border-t border-white/5 flex justify-between text-xs text-slate-500">
                  <span>עודכן לאחרונה: 17/01/2026</span>
                  <div className="flex gap-4">
                     <span className="cursor-pointer hover:text-white">האם מאמר זה עזר לך? 👍 👎</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
EOF

echo "✅ Documentation Hub deployed successfully."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
