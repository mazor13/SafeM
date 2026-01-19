import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0E1A35] text-white font-sans selection:bg-[#00D8FF]/30" dir="rtl">
      {/* Header */}
      <header className="bg-[#1C2435]/80 backdrop-blur-md border-b border-[#00D8FF]/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2 text-[#00D8FF] hover:text-white transition-all font-bold group">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            חזרה להתחברות
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00D8FF] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,216,255,0.4)]">
              <Shield size={18} className="text-[#0E1A35]" />
            </div>
            <span className="font-black text-xl tracking-tighter">AEGIS</span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-16 relative">
        <div className="absolute top-20 left-0 w-64 h-64 bg-[#00D8FF]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="p-4 bg-[#1C2435] rounded-2xl border border-[#00D8FF]/30 shadow-[0_0_20px_rgba(0,216,255,0.1)]">
            <Lock className="w-10 h-10 text-[#00D8FF]" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">מדיניות פרטיות</h1>
            <p className="text-[#A9B3C1] mt-1 font-mono text-sm uppercase tracking-widest">Privacy & Data Security Protocols</p>
          </div>
        </motion.div>

        <div className="bg-[#1C2435] rounded-[2.5rem] p-10 space-y-10 border border-[#00D8FF]/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#00D8FF]/40 to-transparent" />
          
          <p className="text-[#A9B3C1] font-bold text-sm bg-[#0E1A35]/50 inline-block px-4 py-2 rounded-full border border-[#00D8FF]/5">עדכון אחרון: ינואר 2026</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-6 bg-[#00D8FF] rounded-full" /> 1. איסוף נתונים ובינה מלאכותית
            </h2>
            <p className="text-[#A9B3C1] leading-relaxed text-lg">
              מערכת AEGIS אוספת מידע תפעולי המועבר על ידך לצורך ניתוח סיכונים וניהול בטיחות. המידע כולל נתוני משתמש, פרטי ארגון, ונתוני ציוד המעובדים באמצעות ה-Cortex BI Engine שלנו.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-6 bg-[#00D8FF] rounded-full" /> 2. פרוטוקולי אבטחה (Encryption)
            </h2>
            <p className="text-[#A9B3C1] leading-relaxed text-lg">
              אנו מיישמים אמצעי אבטחה בדרגת Enterprise. כל המידע מוצפן במנוחה ובמעבר (At-rest & In-transit) תוך שימוש בטכנולוגיות המתקדמות ביותר להגנה על הקניין הרוחני והבטיחותי שלך.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-6 bg-[#00D8FF] rounded-full" /> 3. זכויות צפייה ובקרה
            </h2>
            <p className="text-[#A9B3C1] leading-relaxed text-lg">
              למשתמשי המערכת קיימת זכות גישה מלאה לנתונים המשויכים אליהם. ניתן לבקש ייצוא נתונים או מחיקה מוחלטת של ה-Node המשויך לארגון דרך מרכז הבקרה.
            </p>
          </section>
        </div>

        {/* Global Support Info */}
        <div className="mt-12 text-center">
           <p className="text-[#6B7C93] text-sm">לשאלות נוספות בנושאי אבטחה: <span className="text-[#00D8FF] font-mono">security@aegis-intel.io</span></p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
