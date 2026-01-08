import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
          <Lock className="w-10 h-10 text-cyan-400" />
          <h1 className="text-3xl font-bold">מדיניות פרטיות</h1>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 space-y-6">
          <p className="text-slate-400">עודכן לאחרונה: ינואר 2025</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">1. מידע שאנו אוספים</h2>
            <p className="text-slate-300 leading-relaxed">
              אנו אוספים מידע שאתה מספק לנו ישירות, כולל: שם מלא, כתובת דוא"ל, מספר טלפון, 
              פרטי ארגון, ומידע הקשור לציוד ובדיקות בטיחות.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">2. שימוש במידע</h2>
            <p className="text-slate-300 leading-relaxed">
              המידע שנאסף משמש אותנו למטרות הבאות:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1 mr-4">
              <li>אספקת שירותי המערכת ותמיכה טכנית</li>
              <li>שליחת התראות ועדכונים חשובים</li>
              <li>שיפור השירות והתאמתו לצרכיך</li>
              <li>עמידה בדרישות חוקיות ורגולטוריות</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">3. שיתוף מידע</h2>
            <p className="text-slate-300 leading-relaxed">
              איננו מוכרים או משכירים את המידע האישי שלך לצדדים שלישיים. 
              מידע עשוי להיות משותף רק במקרים הבאים:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1 mr-4">
              <li>עם הסכמתך המפורשת</li>
              <li>לספקי שירות הפועלים מטעמנו</li>
              <li>כנדרש על פי חוק או צו בית משפט</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">4. אבטחת מידע</h2>
            <p className="text-slate-300 leading-relaxed">
              אנו מיישמים אמצעי אבטחה מתקדמים להגנה על המידע שלך, כולל הצפנה, 
              גיבויים תקופתיים, ובקרות גישה מחמירות. עם זאת, אין שיטת העברה או אחסון מאובטחת ב-100%.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">5. שמירת מידע</h2>
            <p className="text-slate-300 leading-relaxed">
              אנו שומרים את המידע שלך כל עוד חשבונך פעיל או כנדרש לאספקת השירותים. 
              מידע עשוי להישמר לתקופות ארוכות יותר לצורך עמידה בדרישות חוקיות.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">6. זכויותיך</h2>
            <p className="text-slate-300 leading-relaxed">
              יש לך זכות לגשת למידע האישי שלך, לתקן אותו, או לבקש את מחיקתו. 
              לבקשות אלה, אנא פנה אלינו בכתובת הדוא"ל שלהלן.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">7. עוגיות (Cookies)</h2>
            <p className="text-slate-300 leading-relaxed">
              המערכת משתמשת בעוגיות לצורך שמירת העדפות, ניהול התחברות, 
              ושיפור חווית המשתמש. ניתן לשלוט בהגדרות העוגיות דרך הדפדפן שלך.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-400">8. יצירת קשר</h2>
            <p className="text-slate-300 leading-relaxed">
              לשאלות בנוגע למדיניות הפרטיות שלנו, ניתן לפנות אלינו בכתובת: privacy@safem.co.il
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-slate-400">
          <Link to="/terms" className="hover:text-cyan-400 transition-colors">
            תנאי שימוש
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

export default PrivacyPolicy;
