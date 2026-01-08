import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
            <ArrowRight className="w-5 h-5" />
            חזרה להתחברות
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-xl">SafeM</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-10 h-10 text-cyan-400" />
          <h1 className="text-3xl font-bold">תנאי שימוש</h1>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 space-y-6">
          <p className="text-slate-400">עודכן לאחרונה: ינואר 2025</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">1. הסכמה לתנאים</h2>
            <p className="text-slate-300 leading-relaxed">
              בעצם הגישה והשימוש במערכת SafeM, אתה מסכים להיות כפוף לתנאי שימוש אלה. 
              אם אינך מסכים לתנאים אלה, אנא הימנע משימוש במערכת.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">2. תיאור השירות</h2>
            <p className="text-slate-300 leading-relaxed">
              SafeM היא מערכת לניהול בטיחות וציוד המאפשרת לארגונים לנהל בדיקות תקופתיות, 
              מעקב אחר ציוד, וניהול ממצאים. השירות מיועד לשימוש עסקי בלבד.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">3. חשבון משתמש</h2>
            <p className="text-slate-300 leading-relaxed">
              אתה אחראי לשמירה על סודיות פרטי הגישה שלך ולכל הפעילות המתבצעת תחת חשבונך. 
              עליך להודיע לנו מיד על כל שימוש לא מורשה בחשבונך.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">4. שימוש מותר</h2>
            <p className="text-slate-300 leading-relaxed">
              השימוש במערכת מותר אך ורק למטרות חוקיות ובהתאם לתנאים אלה. 
              חל איסור על שימוש לרעה, העתקה, או הפצה של תוכן המערכת ללא אישור.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">5. הגבלת אחריות</h2>
            <p className="text-slate-300 leading-relaxed">
              המערכת מסופקת "כמות שהיא". איננו אחראים לנזקים ישירים או עקיפים הנובעים מהשימוש במערכת. 
              האחריות על נכונות הנתונים המוזנים למערכת היא על המשתמש בלבד.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">6. שינויים בתנאים</h2>
            <p className="text-slate-300 leading-relaxed">
              אנו שומרים לעצמנו את הזכות לעדכן תנאים אלה בכל עת. 
              שינויים ייכנסו לתוקף עם פרסומם באתר. המשך השימוש לאחר השינויים מהווה הסכמה לתנאים המעודכנים.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">7. יצירת קשר</h2>
            <p className="text-slate-300 leading-relaxed">
              לשאלות בנוגע לתנאי השימוש, ניתן לפנות אלינו בכתובת: support@safem.co.il
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-slate-400">
          <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
            מדיניות פרטיות
          </Link>
          <span>|</span>
          <Link to="/login" className="hover:text-cyan-400 transition-colors">
            התחברות
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
