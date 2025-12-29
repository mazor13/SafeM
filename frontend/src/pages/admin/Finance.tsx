import React from 'react';
import { 
  ArrowTrendingUpIcon, BoltIcon, ExclamationTriangleIcon,
  SparklesIcon, CheckBadgeIcon, ClockIcon
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function Finance() {
  const transactions = [
    { id: 'INV-001', client: 'אינטל אלקטרוניקה', amount: 12500, riskScore: 5, status: 'paid' },
    { id: 'INV-002', client: 'מפעלי ים המלח', amount: 4200, riskScore: 85, status: 'overdue' },
    { id: 'INV-003', client: 'אלביט מערכות', amount: 28000, riskScore: 12, status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans" dir="rtl">
      
      <header className="flex justify-between items-end mb-12">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-white tracking-tighter">REVENUE INTEL</h1>
              <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest flex items-center gap-1">
                <SparklesIcon className="h-3 w-3" /> AI Engine Active
              </span>
           </div>
           <p className="text-slate-500 text-sm">ניטור הכנסות גלובלי וחיזוי סיכוני גבייה</p>
        </div>
        <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/5">
           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total MRR</p>
           <p className="text-3xl font-black text-white font-mono">₪65,000</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Revenue Prediction */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
           <div className="flex justify-between items-center mb-10">
             <h3 className="font-bold text-white flex items-center gap-2">
               <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-500"/> מגמת הכנסות ותחזית AI
             </h3>
             <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">+15% Forecast</span>
           </div>
           <div className="h-48 flex items-end justify-between gap-4">
              {[40, 55, 45, 70, 65, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/20 rounded-xl relative group transition-all hover:bg-indigo-500/40" style={{ height: `${h}%` }}>
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-indigo-300">₪{h}k</div>
                </div>
              ))}
              <div className="flex-1 bg-white/5 border-2 border-dashed border-indigo-500/30 rounded-xl animate-pulse" style={{ height: '95%' }}></div>
           </div>
        </div>

        {/* AI Action Insights */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
           {/* תיקון השגיאה כאן: השתמשנו ב-className במקום ב-size */}
           <BoltIcon className="absolute -right-10 -bottom-10 text-white/5 w-48 h-48" />
           
           <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
             <SparklesIcon className="h-5 w-5 text-amber-300"/> תובנות חכמות
           </h3>
           <div className="space-y-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-bold leading-relaxed">חברת "טבע" בסיכון נטישה עקב פיגור בתשלומים.</p>
                <button className="mt-3 w-full py-2 bg-white text-indigo-900 rounded-xl text-[10px] font-black uppercase">הפעל נוהל Retention</button>
              </div>
           </div>
        </div>
      </div>

      {/* Risk Table */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
         <table className="w-full text-right">
            <thead className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
               <tr>
                 <th className="px-8 py-4">לקוח</th>
                 <th className="px-8 py-4">סכום</th>
                 <th className="px-8 py-4 text-center">AI Risk</th>
                 <th className="px-8 py-4">סטטוס</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {transactions.map(tx => (
                 <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="font-bold text-white text-sm">{tx.client}</div>
                       <div className="text-[10px] text-slate-600 font-mono">{tx.id}</div>
                    </td>
                    <td className="px-8 py-6 font-mono font-bold text-white">₪{tx.amount.toLocaleString()}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center justify-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full ${tx.riskScore > 50 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500'}`} style={{ width: `${tx.riskScore}%` }}></div>
                          </div>
                          <span className="text-[10px] font-black text-slate-500">{tx.riskScore}%</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-emerald-400">{tx.status}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
