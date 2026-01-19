import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, orderBy, query, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, Search, Filter, ArrowUpRight, Mail, Building2, 
  Flame, Sun, Snowflake, X, 
  TrendingUp, Target, Zap, Users, Phone,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, LeadStatus, LEAD_STATUSES, LEAD_SOURCES, LEAD_RATINGS } from '../../../types/crm';

// Intelligence Card Component
const IntelligenceCard = ({ 
  title, value, change, trend, icon: Icon, color = '#00D8FF' 
}: { 
  title: string; value: string | number; change?: string; trend?: 'up' | 'down'; icon: any; color?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative bg-[#1C2435] rounded-2xl p-6 border border-[rgba(0,216,255,0.2)] overflow-hidden group hover:border-[rgba(0,216,255,0.5)] transition-all duration-300 shadow-[0_0_30px_rgba(0,216,255,0.05)]"
  >
    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500" style={{ backgroundColor: color }}></div>
    <div className="relative z-10 text-right">
      <div className="flex items-start justify-between mb-4 flex-row-reverse">
        <div>
          <p className="text-[#A9B3C1] text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-black text-white">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 shadow-inner" style={{ boxShadow: `0 0 20px ${color}30` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-2 flex-row-reverse">
          <span className={`text-sm font-bold ${trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{change}</span>
          <span className="text-[#6B7C93] text-[10px] uppercase tracking-wider">vs Last Month</span>
        </div>
      )}
    </div>
  </motion.div>
);

// Slide-over Panel
const LeadSlideOver = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '', title: '', source: 'website', rating: 'warm', notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'leads'), {
        ...formData, status: 'new' as LeadStatus, createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
      });
      onSuccess(); onClose();
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', title: '', source: 'website', rating: 'warm', notes: '' });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-[#0E1A35]/80 backdrop-blur-sm z-50" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed left-0 top-0 bottom-0 w-full max-w-xl bg-[#1C2435] border-r border-[#00D8FF]/30 z-50 overflow-y-auto" dir="rtl">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h2 className="text-2xl font-black text-white">הוספת ליד למערכת</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-[#6B7C93]"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="שם פרטי" value={formData.firstName} onChange={v => setFormData({...formData, firstName: v})} />
                  <Input label="שם משפחה" value={formData.lastName} onChange={v => setFormData({...formData, lastName: v})} />
                </div>
                <Input label="אימייל" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                <Input label="חברה" value={formData.company} onChange={v => setFormData({...formData, company: v})} />
                <button type="submit" disabled={loading} className="w-full bg-[#00D8FF] text-[#0E1A35] py-4 rounded-xl font-black shadow-[0_0_20px_rgba(0,216,255,0.3)]">
                  {loading ? 'מעבד...' : 'אישור והזנת נתונים'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-[#A9B3C1] uppercase tracking-widest px-1">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#0E1A35] border border-white/10 rounded-xl p-3 text-white focus:border-[#00D8FF] outline-none" />
  </div>
);

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateSlideOverOpen, setIsCreateSlideOverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const q = query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      setLeads(sn.docs.map(d => ({ id: d.id, ...d.data() })) as Lead[]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const metrics = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter(l => l.rating === 'hot').length;
    const converted = leads.filter(l => l.status === 'converted').length;
    return {
      total,
      conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : '0',
      avgScore: total > 0 ? ((hot / total) * 100).toFixed(0) : '0',
      hotLeads: hot
    };
  }, [leads]);

  const filteredLeads = leads.filter(l => 
    `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: LeadStatus) => {
    const colors: any = { new: 'bg-[#00D8FF]/10 text-[#00D8FF]', converted: 'bg-emerald-500/10 text-emerald-400', lost: 'bg-red-500/10 text-red-400' };
    return colors[status] || 'bg-white/5 text-[#A9B3C1]';
  };

  return (
    <div className="min-h-screen bg-[#0E1A35] p-8 space-y-10" dir="rtl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Lead Intelligence Center</h1>
          <p className="text-[#A9B3C1] text-lg">ניהול ובקרת לידים - AEGIS CRM</p>
        </div>
        <button onClick={() => setIsCreateSlideOverOpen(true)} className="bg-[#00D8FF] text-[#0E1A35] px-8 py-3 rounded-xl font-black shadow-[0_0_30px_rgba(0,216,255,0.4)] flex items-center gap-2">
          <UserPlus size={20} /> ליד חדש
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <IntelligenceCard title="סך לידים" value={metrics.total} change="+12%" trend="up" icon={Users} color="#00D8FF" />
        <IntelligenceCard title="שיעור המרה" value={`${metrics.conversionRate}%`} change="+8%" trend="up" icon={TrendingUp} color="#10B981" />
        <IntelligenceCard title="AI Score" value={metrics.avgScore} change="+5%" trend="up" icon={Zap} color="#F59E0B" />
        <IntelligenceCard title="לידים חמים" value={metrics.hotLeads} change="+15%" trend="up" icon={Flame} color="#EF4444" />
      </div>

      <div className="bg-[#1C2435] rounded-[2.5rem] border border-[#00D8FF]/20 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7C93]" size={20} />
            <input placeholder="חיפוש מהיר ב-Cortex Intelligence..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-[#0E1A35] border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white outline-none focus:border-[#00D8FF]/50 transition-all" />
          </div>
        </div>
        <table className="w-full text-right">
          <thead className="bg-[#0E1A35]/50 border-b border-white/5">
            <tr className="text-[#6B7C93] text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="p-6">ליד</th>
              <th className="p-6">חברה</th>
              <th className="p-6">סטטוס</th>
              <th className="p-6">דירוג</th>
              <th className="p-6">אימייל</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLeads.map(lead => (
              <tr key={lead.id} onClick={() => navigate(`/admin/crm/leads/${lead.id}`)} className="hover:bg-[#00D8FF]/5 cursor-pointer transition-colors group border-r-4 border-transparent hover:border-r-[#00D8FF]">
                <td className="p-6 font-bold text-white text-lg">{lead.firstName} {lead.lastName}</td>
                <td className="p-6 text-[#A9B3C1]">{lead.company || '-'}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusColor(lead.status)}`}>
                    {LEAD_STATUSES.find(s => s.value === lead.status)?.label || lead.status}
                  </span>
                </td>
                <td className="p-6 text-[#A9B3C1]">{lead.rating}</td>
                <td className="p-6 text-[#6B7C93] font-mono text-xs">{lead.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LeadSlideOver isOpen={isCreateSlideOverOpen} onClose={() => setIsCreateSlideOverOpen(false)} onSuccess={fetchLeads} />
    </div>
  );
}
