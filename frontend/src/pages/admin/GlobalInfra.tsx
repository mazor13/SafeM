import React, { useState } from 'react';
import { 
  Database, Globe, Shield, Layout, Activity, 
  Zap, Save, AlertCircle, ChevronRight, Plus, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// אימפורטים של רכיבים קיימים
import { AWSConfig } from '../../components/admin/storage-providers/AWSConfig';
import { InfraLogViewer } from '../../components/admin/InfraLogViewer';

export default function GlobalInfra() {
  const [activeTab, setActiveTab] = useState<'cloud' | 'branding' | 'automation' | 'logs'>('cloud');
  const [provider, setProvider] = useState('aws');
  const [lastError, setLastError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans" dir="rtl">
      
      {/* GLOBAL HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <Database className="text-indigo-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Infrastructure Hub</h1>
            <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase">Control • Brading • Automation</p>
          </div>
        </div>

        {/* Unified Navigation */}
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 shadow-xl">
          {[
            { id: 'cloud', label: 'ספקי ענן', icon: Globe },
            { id: 'branding', label: 'מיתוג', icon: Layout },
            { id: 'automation', label: 'אוטומציה', icon: Zap },
            { id: 'logs', label: 'לוגים', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-md relative overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* CLOUD & BRANDING (כפי שכתבנו קודם...) */}
              {activeTab === 'cloud' && (
                <motion.div key="cloud" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                   <div className="flex gap-3 p-2 bg-black/20 rounded-2xl w-fit border border-white/5">
                      {['aws', 'azure', 'gcp', 'onedrive'].map(p => (
                        <button key={p} onClick={() => setProvider(p)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase ${provider === p ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-white'}`}>{p}</button>
                      ))}
                   </div>
                   <div className="min-h-[300px]"><AWSConfig tenantId="global" onError={(id) => setLastError(id)} /></div>
                </motion.div>
              )}

              {/* TAB: AUTOMATION ENGINE (Self-Healing) */}
              {activeTab === 'automation' && (
                <motion.div key="automation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                   <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-white font-bold text-xl flex items-center gap-3"><Zap size={20} className="text-amber-400" /> Automation & Self-Healing</h3>
                        <p className="text-slate-500 text-sm mt-1">הגדרת חוקים עסקיים ותגובות אוטומטיות לאירועי מערכת</p>
                      </div>
                      <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 flex items-center gap-2 transition-all">
                        <Plus size={14}/> חוק חדש
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Trigger Logic */}
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">כאשר קורה האירוע (Trigger)</label>
                         <select className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white font-bold text-sm outline-none">
                            <option>STORAGE_DISCONNECTED (ניתוק ענן)</option>
                            <option>LATENCY_HIGH (איטיות חריגה)</option>
                            <option>QUOTA_EXCEEDED (חריגת מכסה)</option>
                            <option>SYSTEM_ERROR_L2 (תקלת תשתית)</option>
                         </select>
                      </div>

                      {/* Action Logic */}
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">בצע פעולת תיקון (Action)</label>
                         <select className="w-full bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-4 text-indigo-200 font-bold text-sm outline-none">
                            <option>TRIGGER_AUTO_HEALER (הפעל תיקון אוטומטי)</option>
                            <option>SWITCH_STORAGE_NODE (החלפת שרת גיבוי)</option>
                            <option>ALERT_LEVEL_3 (הסלמה מיידית ל-R&D)</option>
                            <option>SEND_WEBHOOK (התראה למערכת חיצונית)</option>
                         </select>
                      </div>
                   </div>

                   <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                      <div className="flex items-center gap-3 text-indigo-400 mb-2">
                        <Terminal size={16}/>
                        <span className="text-xs font-bold uppercase">Preview Logic</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        IF (event === "STORAGE_DISCONNECTED") { "{" } execute("TRIGGER_AUTO_HEALER"); notify("ADMIN_GROUP"); { "}" }
                      </p>
                   </div>

                   <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg transition-all">
                      הפעל חוק אוטומציה גלובלי
                   </button>
                </motion.div>
              )}

              {/* LOGS TAB */}
              {activeTab === 'logs' && (
                <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <InfraLogViewer />
                </motion.div>
              )}

            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
