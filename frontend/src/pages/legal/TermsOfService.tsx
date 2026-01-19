import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0E1A35] text-white font-sans" dir="rtl">
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="p-4 bg-[#1C2435] rounded-2xl border border-[#00D8FF]/30">
            <FileText className="w-10 h-10 text-[#00D8FF]" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">תנאי שימוש במערכת</h1>
            <p className="text-[#A9B3C1] mt-1 font-mono text-sm uppercase tracking-widest">Platform Operational Agreement</p>
          </div>
        </motion.div>

        <div className="bg-[#1C2435] rounded-[2.5rem] p-10 space-y-10 border border-[#00D8FF]/10 shadow-2xl relative">
          <p className="text-[#A9B3C1] font-bold text-sm bg-[#0E1A35]/50 inline-block px-4 py-2 rounded-full border border-[#00D8FF]/5">גרסה: 2.4.0 (Aegis Core)</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">1. תנאי רישוי ושימוש</h2>
            <p className="text-[#A9B3C1] leading-relaxed text-lg">
              השימוש במערכת AEGIS מוגבל למשתמשים מורשים בלבד. כל ניסיון לגישה לא מורשת ל-Cortex BI או שכפול של אלגוריתמי הניתוח מהווה הפרה יסודית של תנאים אלו.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">2. אחריות מוגבלת</h2>
            <p className="text-[#A9B3C1] leading-relaxed text-lg">
              AEGIS מספקת כלים לקבלת החלטות מבוססי נתונים. המערכת אינה מחליפה שיקול דעת מקצועי של ממונה בטיחות מוסמך, והאחריות הסופית על ביצוע בדיקות מוטלת על הארגון.
            </p>
          </section>

          <div className="p-6 bg-[#00D8FF]/5 border border-[#00D8FF]/20 rounded-2xl flex items-start gap-4">
            <CheckCircle2 className="text-[#00D8FF] shrink-0" />
            <p className="text-sm text-[#A9B3C1] italic">בעצם ההתחברות למערכת, הינך מאשר כי קראת והבנת את תנאי הפלטפורמה המודיעינית של AEGIS.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
