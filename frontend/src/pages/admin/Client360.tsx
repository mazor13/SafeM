import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { 
  ArrowRight, ShieldCheck, Zap, Globe, Users, 
  Database, Activity, AlertCircle, Settings, CreditCard, Lock, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientData {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended' | 'maintenance';
  healthScore: number;
  plan: string;
  usersLimit: number;
  usersCount?: number;
  activeModules: string[];
  storageConfig: string;
  adminEmail: string;
  contactPerson: string;
}

export default function Client360() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'infra' | 'billing' | 'security'>('overview');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    const unsub = onSnapshot(doc(firestore, 'tenants', clientId), (doc) => {
      if (doc.exists()) {
        setClient({ id: doc.id, ...doc.data() } as ClientData);
      }
    });
    return () => unsub();
  }, [clientId]);

  const toggleStatus = async () => {
    if (!client || !clientId) return;
    const nextStatus = client.status === 'active' ? 'suspended' : 'active';
    const confirmMsg = nextStatus === 'suspended' 
      ? `האם אתה בטוח שברצונך להשבית את ${client.name}? המשתמשים ינותקו מיידית.`
      : `האם להחזיר את ${client.name} לפעילות מלאה?`;

    if (window.confirm(confirmMsg)) {
      setIsUpdating(true);
      try {
        await updateDoc(doc(firestore, 'tenants', clientId), {
          status: nextStatus,
          lastUpdated: serverTimestamp()
        });
        
        // Audit Log Recording
        await addDoc(collection(firestore, 'audit_logs'), {
            action: 'CHANGE_STATUS',
            targetId: clientId,
            targetName: client.name,
            newValue: nextStatus,
            performedBy: 'Admin',
            timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Error updating status:", err);
        alert("שגיאה בעדכון סטטוס");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (!client) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-slate-500 animate-pulse flex flex-col items-center gap-2">
            <Activity className="animate-spin" /> טוען פרופיל לקוח...
        </div>
    </div>
  );

  // Safe Math for Progress Bars
  const usagePercent = client.usersLimit > 0 
    ? Math.min(((client.usersCount || 0) / client.usersLimit) * 100, 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30" dir="rtl">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 p-4 mb-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => navigate('/admin/clients')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowRight size={20} className="text-slate-400" />
            </button>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/20">
              {client.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{client.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  client.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {client.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1 font-mono"><Globe size={12}/> {client.domain}.safe-m.app</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="flex items-center gap-1"><Zap size={12} className="text-amber-400"/> {client.plan.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
             <div className="text-left ml-4 hidden lg:block">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Health Score</p>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full shadow-[0_0_8px_rgba(16,185,129,0.5)] ${client.healthScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${client.healthScore}%` }}></div>
                </div>
                <span className="text-sm font-black text-emerald-400">{client.healthScore}</span>
              </div>
            </div>
            
            <button 
              onClick={toggleStatus}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                client.status === 'active' 
                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
              }`}
            >
              {client.status === 'active' ? <Lock size={14}/> : <Zap size={14}/>}
              {client.status === 'active' ? 'השבת גישה' : 'הפעל לקוח'}
            </button>
            
            <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2 transition-all">
              <ExternalLink size={14} /> כניסה
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        
        {/* TABS */}
        <div className="flex gap-1 bg-slate-900/50 p-1 rounded-2xl border border-white/5 w-fit mb-8 overflow-x-auto max-w-full">
          {[
            { id: 'overview', label: 'סקירה כללית', icon: Activity },
            { id: 'infra', label: 'תשתית ו-BYOS', icon: Database },
            { id: 'billing', label: 'פיננסים וגבייה', icon: CreditCard },
            { id: 'security', label: 'אבטחה והרשאות', icon: ShieldCheck }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Usage Card */}
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm hover:border-white/10 transition-colors">
                  <h3 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <Users size={14} /> ניצול משאבים
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-300">משתמשים פעילים</span>
                        <span className="text-white font-bold">{client.usersCount || 0} / {client.usersLimit}</span>
                      </div>
                      <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <div className={`h-full ${usagePercent > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${usagePercent}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-300">נפח אחסון</span>
                        <span className="text-white font-bold">BYOS Mode</span>
                      </div>
                      <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modules Card */}
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm hover:border-white/10 transition-colors">
                  <h3 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <Settings size={14} /> מודולים פעילים
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {client.activeModules && client.activeModules.map((mod) => (
                      <div key={mod} className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                        <span className="text-xs font-bold text-slate-200 capitalize">{mod.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-indigo-500/10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <ShieldCheck size={120} />
                  </div>
                  <h3 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2">
                    <AlertCircle size={14} /> פרטי התקשרות
                  </h3>
                  <div className="space-y-3 relative z-10">
                    <p className="text-xs text-slate-300">איש קשר: <span className="text-white font-bold">{client.contactPerson}</span></p>
                    <p className="text-xs text-slate-300">אימייל: <span className="text-white font-bold">{client.adminEmail}</span></p>
                    <p className="text-xs text-slate-300">תמיכה: <span className="text-white font-bold">Priority Support</span></p>
                    <button className="mt-6 w-full bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20">
                      צור קשר עם {client.contactPerson.split(' ')[0]}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {activeTab !== 'overview' && (
                <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-slate-900/20">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
                        <Settings size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">מודול בפיתוח</h3>
                    <p className="text-slate-400 text-sm">אזור זה ({activeTab}) יכיל הגדרות מתקדמות בגרסה הבאה.</p>
                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
