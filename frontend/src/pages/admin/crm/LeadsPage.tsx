import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Filter, ArrowUpRight, Mail, Building2, AlertTriangle, Flame, Sun, Snowflake, Plus, X } from 'lucide-react';
import { Lead, LeadStatus, LEAD_STATUSES, LEAD_SOURCES, LEAD_RATINGS } from '../../../types/crm';

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const CreateLeadModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', title: '', source: 'website', rating: 'warm', notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'leads'), {
        ...formData,
        status: 'new' as LeadStatus,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      onSuccess();
      onClose();
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', title: '', source: 'website', rating: 'warm', notes: '' });
    } catch (err) { console.error('Error creating lead:', err); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <UserPlus size={20} className="text-indigo-400" /> ליד חדש
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="שם פרטי *" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="שם משפחה *" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="אימייל *" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="טלפון" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="חברה" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="תפקיד" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold">ביטול</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">{loading ? 'שומר...' : 'צור ליד'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const q = query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      setLeads(sn.docs.map(d => ({ id: d.id, ...d.data() })) as Lead[]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">ניהול לידים</h1>
          <p className="text-slate-400 text-sm">ניהול לידים נכנסים והזדמנויות</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2">
          <UserPlus size={18} /> ליד חדש
        </button>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">שם</th>
                <th className="px-6 py-4">חברה</th>
                <th className="px-6 py-4">סטטוס</th>
                <th className="px-6 py-4">אימייל</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? <tr><td colSpan={5} className="p-8 text-center text-slate-500">טוען...</td></tr> : leads.map(lead => (
                <tr key={lead.id} onClick={() => navigate(`/admin/crm/leads/${lead.id}`)} className="hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-bold text-white">{lead.firstName} {lead.lastName}</td>
                  <td className="px-6 py-4 text-slate-300">{lead.company || '-'}</td>
                  <td className="px-6 py-4"><span className="bg-slate-800 px-2 py-1 rounded text-xs">{LEAD_STATUSES.find(s=>s.value===lead.status)?.label}</span></td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{lead.email}</td>
                  <td className="px-6 py-4"><ArrowUpRight size={18} className="text-slate-500" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <CreateLeadModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchLeads} />
    </div>
  );
}
