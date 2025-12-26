import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Shield, Users, CreditCard, Activity, Database, Globe, BarChart2, Zap } from 'lucide-react';

export default function CommandCenter() {
  const [stats, setStats] = useState({ activeTenants: 0, totalRevenue: 0, alerts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(firestore, 'tenants'));
        const snapshot = await getDocs(q);
        setStats({ activeTenants: snapshot.size, totalRevenue: 0, alerts: 0 });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 font-sans text-slate-800 animate-fadeIn" dir="rtl">
      
      {/* Header Area */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
             <Shield className="text-indigo-600" size={32} />
             AEGIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">God-Mode</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">מגדל פיקוח ניהולי • סקירת מערכת גלובלית</p>
        </div>
        <Link to="/admin/create-client" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 transform hover:scale-105">
          <Users size={20} /> + הקמת לקוח חדש
        </Link>
      </header>

      {/* Hero Banner: The BI Command Center */}
      <div className="mb-10">
        <Link to="/admin/dashboard-bi" className="group relative overflow-hidden bg-[#0f172a] rounded-[2.5rem] p-12 flex justify-between items-center shadow-2xl hover:shadow-indigo-500/20 transition-all border border-slate-800 cursor-pointer">
          
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>

          <div className="relative z-10 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-indigo-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/40 animate-pulse">Live Beta</span>
              <span className="text-indigo-300 font-bold text-sm tracking-wider flex items-center gap-2">
                  <Zap size={14} /> בינה עסקית 5.0
              </span>
            </div>
            <h2 className="text-5xl font-black italic mb-3 group-hover:translate-x-2 transition-transform tracking-tight">
              The Command Center <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">BI</span>
            </h2>
            <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
                מגדל הפיקוח הראשי: תובנות בזמן אמת, חיזוי נטישה (Churn Prediction), ומעקב פיננסי גלובלי.
            </p>
          </div>
          
          <div className="relative z-10 w-28 h-28 bg-white/5 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:border-indigo-400 transition-all duration-500 shadow-2xl">
            <BarChart2 size={48} className="text-white opacity-80 group-hover:opacity-100" />
          </div>
        </Link>
      </div>

      {/* Feature Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Link to="/admin/finance" className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all hover:-translate-y-1 group">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform group-hover:bg-emerald-600 group-hover:text-white"><CreditCard size={28} /></div>
          <h3 className="font-bold text-xl text-slate-800 mb-1">ניהול פיננסי & PO</h3>
          <p className="text-xs text-slate-400">חיובים, גבייה ותקציבים</p>
        </Link>

        <Link to="/admin/branding" className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all hover:-translate-y-1 group">
          <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform group-hover:bg-pink-600 group-hover:text-white"><Globe size={28} /></div>
          <h3 className="font-bold text-xl text-slate-800 mb-1">מיתוג ודומיין</h3>
          <p className="text-xs text-slate-400">White Label Suite</p>
        </Link>

        <Link to="/admin/cloud-hub" className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all hover:-translate-y-1 group">
          <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 transition-transform group-hover:bg-sky-600 group-hover:text-white"><Database size={28} /></div>
          <h3 className="font-bold text-xl text-slate-800 mb-1">תשתית ענן</h3>
          <p className="text-xs text-slate-400">ניהול אחסון (BYOS)</p>
        </Link>

        <Link to="/admin/audit" className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 group">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mb-6 group-hover:scale-110 transition-transform group-hover:bg-slate-800 group-hover:text-white"><Activity size={28} /></div>
          <h3 className="font-bold text-xl text-slate-800 mb-1">יומן ביקורת</h3>
          <p className="text-xs text-slate-400">Audit Logs & Security</p>
        </Link>
      </div>
      
      {/* Footer Stats Summary */}
      <div className="mt-10 grid grid-cols-3 gap-6 opacity-60">
        <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200">
            <span className="block text-xs font-bold uppercase text-slate-400">לקוחות פעילים</span>
            <span className="text-2xl font-black text-slate-700">{stats.activeTenants || '--'}</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200">
            <span className="block text-xs font-bold uppercase text-slate-400">שרתים</span>
            <span className="text-2xl font-black text-emerald-600">Online</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200">
            <span className="block text-xs font-bold uppercase text-slate-400">גרסה</span>
            <span className="text-2xl font-black text-indigo-600">v5.2.0</span>
        </div>
      </div>

    </div>
  );
}
