import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { 
  Shield, Users, CreditCard, Activity, Database, 
  Globe, BarChart3, Zap, ChevronRight,
  ShieldAlert, Terminal, Box
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommandCenter() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ activeTenants: 0, systemHealth: 98, pendingAlerts: 3 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(firestore, 'clients'));
        const sn = await getDocs(q);
        setStats(prev => ({ ...prev, activeTenants: sn.size }));
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans selection:bg-indigo-500/30" dir="rtl">
      
      {/* --- GLOBAL HEADER --- */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 border border-indigo-400/20">
            <Shield className="text-white" size={30} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">AEGIS COMMAND</h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em] mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Global NOC Level 3 • Session: Active
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
            <button onClick={() => navigate('/admin/audit')} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2 group">
                <Terminal size={14} className="text-indigo-400 group-hover:rotate-12 transition-transform"/> 
                System Ledger
            </button>
            <button onClick={() => navigate('/admin/create-client')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-indigo-600/30 transition-all active:scale-95">
                + הקמת לקוח חדש
            </button>
        </div>
      </header>

      {/* --- TOP PERFORMANCE METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'טננטים בניהול', value: stats.activeTenants, icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'בריאות מערכת', value: `${stats.systemHealth}%`, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'אירועי אבטחה', value: stats.pendingAlerts, icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          ].map((stat, i) => (
            <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden group hover:border-white/10 transition-colors"
            >
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                        <stat.icon size={24}/>
                    </div>
                    <div className="h-2 w-12 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color.replace('text', 'bg')} opacity-40`} style={{ width: '70%' }}></div>
                    </div>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-white font-mono tracking-tighter">{stat.value}</p>
            </motion.div>
          ))}
      </div>

      {/* --- MAIN STRATEGIC GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* BIG BI HUB CARD */}
        <Link to="/admin/dashboard-bi" className="lg:col-span-8 group relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-[#0f172a] rounded-[3rem] p-12 border border-indigo-500/20 shadow-2xl transition-all hover:border-indigo-500/40">
           <div className="relative z-10 flex justify-between items-center h-full">
              <div className="max-w-xl">
                 <div className="flex items-center gap-3 mb-6">
                    <Zap size={20} className="text-amber-400 animate-pulse"/>
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Master Insights AI</span>
                 </div>
                 <h2 className="text-5xl font-black text-white mb-6 group-hover:translate-x-3 transition-transform duration-500 leading-tight">
                    The Control Center <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">Business Intelligence</span>
                 </h2>
                 <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    ניתוח מגמות גלובלי, ניטור MRR, וחיזוי סיכוני נטישה מבוסס בינה מלאכותית. קבל החלטות מבוססות דאטה בזמן אמת.
                 </p>
                 <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest">Revenue Tracking</div>
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest">Churn Prediction</div>
                 </div>
              </div>
              <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                 <BarChart3 size={56} className="text-white" />
              </div>
           </div>
           {/* Decor */}
           <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        </Link>

        {/* --- MANAGEMENT DEPARTMENTS (THE UPDATE) --- */}
        <div className="lg:col-span-4 space-y-4">
            <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-4 pr-4 border-r-2 border-indigo-500 mr-2">מחלקות ניהול גלובליות</h3>
            <div className="grid grid-cols-1 gap-4">
                {[
                    { label: 'תשתיות & אוטומציה', desc: 'ענן, דומיינים ו-Healing', icon: Database, path: '/admin/infra-global', color: 'text-sky-400', bg: 'group-hover:bg-sky-500/10' },
                    { label: 'ניהול פיננסי', desc: 'MRR, גבייה ו-POs', icon: CreditCard, path: '/admin/finance', color: 'text-emerald-400', bg: 'group-hover:bg-emerald-500/10' },
                    { label: 'קטלוג שירותים', desc: 'ניהול מודולים ותמחור', icon: Box, path: '/admin/product-management', color: 'text-amber-400', bg: 'group-hover:bg-amber-500/10' },
                    { label: 'ניהול לקוחות', desc: 'טננטים ומשתמשי קצה', icon: Users, path: '/admin/clients', color: 'text-indigo-400', bg: 'group-hover:bg-indigo-500/10' },
                ].map((item, i) => (
                    <Link 
                        key={i} 
                        to={item.path} 
                        className="flex items-center justify-between p-5 bg-slate-900/40 rounded-[1.5rem] border border-white/5 hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 bg-slate-800 rounded-xl transition-colors ${item.color} ${item.bg}`}>
                                <item.icon size={20}/>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-white block">{item.label}</span>
                                <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-700 group-hover:text-white group-hover:translate-x-[-4px] transition-all" />
                    </Link>
                ))}
            </div>
        </div>
      </div>

      {/* --- RECENT ACTIVITY PREVIEW --- */}
      <footer className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <Activity size={16} className="text-indigo-500" />
                 <h3 className="font-black text-white uppercase tracking-widest text-xs">System Pulse</h3>
              </div>
              <button onClick={() => navigate('/admin/audit')} className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest border-b border-indigo-400/20 pb-0.5">
                Full Audit Ledger
              </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { time: '14:02', action: 'TENANT_CREATED', detail: 'Electra Infrastructure', actor: 'ADMIN_01' },
                { time: '13:45', action: 'STORAGE_LINKED', detail: 'S3 Node: Frankfurt', actor: 'SYSTEM' },
                { time: '12:10', action: 'BILLING_GEN', detail: 'Monthly MRR Cycle', actor: 'FIN_BOT' },
              ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                      <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] text-slate-600 font-mono">{log.time}</span>
                             <span className="text-[10px] font-black text-indigo-400">{log.action}</span>
                          </div>
                          <span className="text-xs text-slate-400 italic">"{log.detail}"</span>
                      </div>
                      <span className="text-[9px] text-slate-700 font-bold uppercase">{log.actor}</span>
                  </div>
              ))}
          </div>
      </footer>

    </div>
  );
}
