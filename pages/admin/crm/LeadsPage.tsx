import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, Search, Filter, MoreHorizontal, 
  ArrowUpRight, Phone, Mail, Building2, AlertTriangle,
  Flame, Sun, Snowflake, Plus, X
} from 'lucide-react';
import { Lead, LeadStatus, LEAD_STATUSES, LEAD_SOURCES, LEAD_RATINGS } from '../../../types/crm';

// --- Glass Card Component ---
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

// --- Create Lead Modal ---
interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateLeadModal = ({ isOpen, onClose, onSuccess }: CreateLeadModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    source: 'website',
    rating: 'warm',
    notes: ''
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
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        company: '', title: '', source: 'website', rating: 'warm', notes: ''
      });
    } catch (err) {
      console.error('Error creating lead:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <UserPlus size={20} className="text-indigo-400" />
            </div>
            ליד חדש
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">שם פרטי *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="ישראל"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">שם משפחה *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="ישראלי"
              />
            </div>
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">אימייל *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="israel@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">טלפון</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="050-1234567"
              />
            </div>
          </div>

          {/* Company Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">חברה</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="שם החברה"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">תפקיד</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="מנהל בטיחות"
              />
            </div>
          </div>

          {/* Source & Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">מקור</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {LEAD_SOURCES.map(source => (
                  <option key={source.value} value={source.value}>{source.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">דירוג</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {LEAD_RATINGS.map(rating => (
                  <option key={rating.value} value={rating.value}>{rating.emoji} {rating.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">הערות</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="הערות נוספות..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={18} />
                  צור ליד
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const leadsRef = collection(firestore, 'leads');
      const q = query(leadsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      
      setLeads(leadsData);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: LeadStatus) => {
    const styles: Record<LeadStatus, string> = {
      new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      qualified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      unqualified: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      converted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    return styles[status] || styles.new;
  };

  const getStatusLabel = (status: LeadStatus) => {
    return LEAD_STATUSES.find(s => s.value === status)?.label || status;
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'hot': return <Flame size={14} className="text-rose-500" />;
      case 'warm': return <Sun size={14} className="text-amber-500" />;
      case 'cold': return <Snowflake size={14} className="text-blue-400" />;
      default: return null;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  if (loading) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-4">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <div className="text-slate-500">טוען לידים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 flex justify-center">
        <GlassCard className="max-w-2xl w-full p-8 text-center border-rose-500/30">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">שגיאה בטעינת הנתונים</h2>
          <p className="text-rose-200 mb-6">{error}</p>
          <button 
            onClick={fetchLeads}
            className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded-xl font-bold transition-all"
          >
            נסה שוב
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-fadeIn" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">ניהול לידים</h1>
          <p className="text-slate-400 text-sm">מעקב והמרת לידים ללקוחות</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <UserPlus size={18} />
          ליד חדש
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-5 cursor-pointer hover:border-white/10 transition-colors" onClick={() => setStatusFilter('all')}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">סה״כ לידים</div>
          <div className="text-3xl font-black text-white">{stats.total}</div>
        </GlassCard>
        <GlassCard className="p-5 cursor-pointer hover:border-blue-500/30 transition-colors" onClick={() => setStatusFilter('new')}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">חדשים</div>
          <div className="text-3xl font-black text-blue-400">{stats.new}</div>
        </GlassCard>
        <GlassCard className="p-5 cursor-pointer hover:border-emerald-500/30 transition-colors" onClick={() => setStatusFilter('qualified')}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">מוסמכים</div>
          <div className="text-3xl font-black text-emerald-400">{stats.qualified}</div>
        </GlassCard>
        <GlassCard className="p-5 cursor-pointer hover:border-purple-500/30 transition-colors" onClick={() => setStatusFilter('converted')}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">הומרו</div>
          <div className="text-3xl font-black text-purple-400">{stats.converted}</div>
        </GlassCard>
      </div>

      {/* Table Container */}
      <GlassCard className="overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש לפי שם, אימייל או חברה..." 
              className="w-full bg-slate-800 text-white pl-4 pr-10 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">כל הסטטוסים</option>
            {LEAD_STATUSES.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">שם</th>
                <th className="px-6 py-4">חברה</th>
                <th className="px-6 py-4">סטטוס</th>
                <th className="px-6 py-4">מקור</th>
                <th className="px-6 py-4">דירוג</th>
                <th className="px-6 py-4">תאריך</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'לא נמצאו לידים התואמים לחיפוש'
                      : 'עדיין אין לידים במערכת. לחץ על "ליד חדש" כדי להתחיל.'
                    }
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => navigate(`/admin/crm/leads/${lead.id}`)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                          {lead.firstName?.[0]}{lead.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <Mail size={12} /> {lead.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-500" />
                        <span className="text-sm text-slate-300">{lead.company || '-'}</span>
                      </div>
                      {lead.title && (
                        <div className="text-xs text-slate-500 mt-1">{lead.title}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">
                        {LEAD_SOURCES.find(s => s.value === lead.source)?.label || lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRatingIcon(lead.rating)}
                        <span className="text-sm text-slate-400">
                          {LEAD_RATINGS.find(r => r.value === lead.rating)?.label || lead.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {lead.createdAt?.toDate?.()?.toLocaleDateString('he-IL') || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" size={20} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Create Lead Modal */}
      <CreateLeadModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchLeads}
      />
    </div>
  );
}
