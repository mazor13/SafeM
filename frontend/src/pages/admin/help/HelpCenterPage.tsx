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
