import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { ArrowRight, Users, Database, ShieldAlert, Globe, Zap, LayoutDashboard, CreditCard, Contact, Clock, History, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UsersTab from '../../components/admin/UsersTab';
import InfraHub from '../../components/admin/InfraHub';
import OpsCenter from '../../components/admin/ops/OpsCenter';
import ContactsTab from '../../components/admin/ContactsTab';
import EscalationTab from '../../components/admin/EscalationTab';
import AuditLogTab from '../../components/admin/AuditLogTab';
import FacilitiesTab from '../../components/admin/FacilitiesTab';

export default function Client360() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'escalation' | 'users' | 'facilities' | 'infra' | 'ops' | 'history' | 'billing'>('overview');

  useEffect(() => {
    if (!clientId) return;
    const unsub = onSnapshot(doc(firestore, 'clients', clientId), (sn) => {
      if (sn.exists()) setClient({ id: sn.id, ...sn.data() });
    });
    return () => unsub();
  }, [clientId]);

  if (!client) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-500 italic">טוען...</div>;

  const tabs = [
    { id: 'overview', label: 'סקירה', icon: LayoutDashboard },
    { id: 'contacts', label: 'אנשי קשר', icon: Contact },
    { id: 'escalation', label: 'הסלמה', icon: Clock },
    { id: 'users', label: 'צוות', icon: Users },
    { id: 'facilities', label: 'מתחמים', icon: Building2 },
    { id: 'infra', label: 'תשתיות', icon: Database },
    { id: 'ops', label: 'מרכז בקרה', icon: ShieldAlert },
    { id: 'history', label: 'היסטוריה', icon: History },
    { id: 'billing', label: 'פיננסים', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 border-l border-white/5 hidden lg:flex flex-col p-6">
        <div className="text-xl font-black text-white mb-10 tracking-tighter italic">AEGIS ADMIN</div>
        <nav className="space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5'}`}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/clients')} className="p-2 hover:bg-white/5 rounded-full"><ArrowRight size={20}/></button>
            <div>
              <h1 className="text-xl font-bold text-white">{client.name}</h1>
              <div className="text-[10px] text-slate-500 flex items-center gap-2 uppercase font-mono tracking-widest">
                <Globe size={10}/> {client.domain} • <Zap size={10} className="text-amber-400"/> {client.plan} Plan
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeTab === 'overview' && (
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5">
                   <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Health Score</h3>
                   <p className="text-4xl font-black text-emerald-400">{client.healthScore}%</p>
                </div>
              )}
              
              {activeTab === 'contacts' && (
                <ContactsTab clientId={client.id} clientName={client.name} />
              )}
              
              {activeTab === 'escalation' && (
                <EscalationTab clientId={client.id} clientName={client.name} />
              )}
              
              {activeTab === 'users' && <UsersTab clientId={client.id} clientName={client.name} limit={client.usersLimit} currentCount={client.usersCount || 0} />}
              {activeTab === 'facilities' && <FacilitiesTab clientId={client.id} clientName={client.name} />}
              {activeTab === 'infra' && <InfraHub clientId={client.id} clientName={client.name} clientPlan={client.plan} initialData={client} />}
              
              {/* החיבור למרכז הבקרה */}
              {activeTab === 'ops' && (
                <OpsCenter clientId={client.id} supportLevel={3} />
              )}
              
              {activeTab === 'history' && (
                <AuditLogTab clientId={client.id} clientName={client.name} />
              )}

              {activeTab === 'billing' && <div className="p-20 text-center text-slate-600 italic">מודול פיננסי בקרוב...</div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}