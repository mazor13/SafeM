import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Search, Filter, ArrowUpRight, AlertTriangle, Plus,
  FileCheck, Clock, AlertCircle, CheckCircle2, Building2,
  Flame, Radiation, FlaskConical, FileText
} from 'lucide-react';
import { SafetyFile, SafetyFileType, SafetyFileStatus, SAFETY_FILE_TYPES } from '../../../types/crm';

// --- Glass Card Component ---
const GlassCard = ({ children, className = '', onClick }: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
}) => (
  <div 
    className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${onClick ? 'cursor-pointer hover:border-white/10' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// --- Status Badge ---
const StatusBadge = ({ status }: { status: SafetyFileStatus }) => {
  const styles: Record<SafetyFileStatus, { bg: string; text: string; label: string; icon: any }> = {
    draft: { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'טיוטה', icon: FileText },
    in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'בתהליך', icon: Clock },
    pending_approval: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'ממתין לאישור', icon: AlertCircle },
    approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'מאושר', icon: CheckCircle2 },
    expired: { bg: 'bg-rose-500/10', text: 'text-rose-400', label: 'פג תוקף', icon: AlertTriangle },
  };
  
  const style = styles[status] || styles.draft;
  const Icon = style.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} border-current/20`}>
      <Icon size={12} />
      {style.label}
    </span>
  );
};

// --- Type Icon ---
const TypeIcon = ({ type }: { type: SafetyFileType }) => {
  const icons: Record<SafetyFileType, { icon: any; color: string }> = {
    laser: { icon: () => <span className="text-lg">🔴</span>, color: 'bg-red-500/10' },
    fire: { icon: Flame, color: 'bg-orange-500/10 text-orange-400' },
    general: { icon: Shield, color: 'bg-blue-500/10 text-blue-400' },
    radiation: { icon: Radiation, color: 'bg-yellow-500/10 text-yellow-400' },
    chemical: { icon: FlaskConical, color: 'bg-purple-500/10 text-purple-400' },
    combined: { icon: FileCheck, color: 'bg-indigo-500/10 text-indigo-400' },
  };
  
  const config = icons[type] || icons.general;
  const Icon = config.icon;
  
  return (
    <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center`}>
      <Icon size={20} />
    </div>
  );
};

export default function SafetyFilesPage() {
  const [files, setFiles] = useState<SafetyFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SafetyFileStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<SafetyFileType | 'all'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const filesRef = collection(firestore, 'safetyFiles');
      const q = query(filesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const filesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SafetyFile[];
      
      setFiles(filesData);
    } catch (err: any) {
      console.error('Error fetching safety files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = 
      file.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tenantName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    const matchesType = typeFilter === 'all' || file.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: files.length,
    approved: files.filter(f => f.status === 'approved').length,
    inProgress: files.filter(f => f.status === 'in_progress').length,
    expired: files.filter(f => f.status === 'expired').length,
    pendingApproval: files.filter(f => f.status === 'pending_approval').length,
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (validUntil: any) => {
    if (!validUntil) return null;
    const expiryDate = validUntil.toDate ? validUntil.toDate() : new Date(validUntil);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-4">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <div className="text-slate-500">טוען תיקי בטיחות...</div>
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
            onClick={fetchFiles}
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
          <h1 className="text-2xl font-bold text-white mb-1">תיקי בטיחות</h1>
          <p className="text-slate-400 text-sm">ניהול ומעקב תיקי בטיחות ארגוניים</p>
        </div>
        <button 
          onClick={() => navigate('/admin/safety/files/new')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          תיק בטיחות חדש
        </button>
      </div>

      {/* Alert Banner - Expired Files */}
      {stats.expired > 0 && (
        <div className="bg-rose-900/30 border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 rounded-xl">
              <AlertTriangle className="text-rose-400" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-rose-200">תיקים שפג תוקפם</h4>
              <p className="text-sm text-rose-300/70">{stats.expired} תיקי בטיחות דורשים חידוש מיידי</p>
            </div>
          </div>
          <button 
            onClick={() => setStatusFilter('expired')}
            className="px-4 py-2 bg-rose-500/20 text-rose-300 rounded-xl text-sm font-bold hover:bg-rose-500/30 transition-colors"
          >
            הצג תיקים
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <GlassCard className="p-5" onClick={() => setStatusFilter('all')}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">סה״כ תיקים</div>
          <div className="text-3xl font-black text-white">{stats.total}</div>
        </GlassCard>
        <GlassCard className="p-5" onClick={() => setStatusFilter('approved')}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">מאושרים</div>
          <div className="text-3xl font-black text-emerald-400">{stats.approved}</div>
        </GlassCard>
        <GlassCard className="p-5" onClick={() => setStatusFilter('in_progress')}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">בתהליך</div>
          <div className="text-3xl font-black text-blue-400">{stats.inProgress}</div>
        </GlassCard>
        <GlassCard className="p-5" onClick={() => setStatusFilter('pending_approval')}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">ממתינים לאישור</div>
          <div className="text-3xl font-black text-amber-400">{stats.pendingApproval}</div>
        </GlassCard>
        <GlassCard className="p-5" onClick={() => setStatusFilter('expired')}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">פג תוקף</div>
          <div className="text-3xl font-black text-rose-400">{stats.expired}</div>
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
              placeholder="חיפוש לפי כותרת או לקוח..." 
              className="w-full bg-slate-800 text-white pl-4 pr-10 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as SafetyFileType | 'all')}
            className="bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">כל הסוגים</option>
            {SAFETY_FILE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SafetyFileStatus | 'all')}
            className="bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="draft">טיוטה</option>
            <option value="in_progress">בתהליך</option>
            <option value="pending_approval">ממתין לאישור</option>
            <option value="approved">מאושר</option>
            <option value="expired">פג תוקף</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">תיק בטיחות</th>
                <th className="px-6 py-4">לקוח</th>
                <th className="px-6 py-4">סוג</th>
                <th className="px-6 py-4">סטטוס</th>
                <th className="px-6 py-4">תוקף</th>
                <th className="px-6 py-4">אחראי</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'לא נמצאו תיקים התואמים לחיפוש'
                      : (
                        <div className="flex flex-col items-center">
                          <Shield size={48} className="text-slate-600 mb-4" />
                          <p className="mb-4">עדיין אין תיקי בטיחות במערכת</p>
                          <button 
                            onClick={() => navigate('/admin/safety/files/new')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-colors"
                          >
                            צור תיק בטיחות ראשון
                          </button>
                        </div>
                      )
                    }
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => {
                  const daysUntilExpiry = getDaysUntilExpiry(file.validUntil);
                  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                  
                  return (
                    <tr 
                      key={file.id} 
                      onClick={() => navigate(`/admin/safety/files/${file.id}`)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <TypeIcon type={file.type} />
                          <div>
                            <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {file.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {SAFETY_FILE_TYPES.find(t => t.value === file.type)?.label}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-slate-500" />
                          <span className="text-sm text-slate-300">{file.tenantName || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400">
                          {SAFETY_FILE_TYPES.find(t => t.value === file.type)?.icon}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={file.status} />
                      </td>
                      <td className="px-6 py-4">
                        {file.validUntil ? (
                          <div className="flex flex-col">
                            <span className={`text-sm ${isExpiringSoon ? 'text-amber-400' : file.status === 'expired' ? 'text-rose-400' : 'text-slate-300'}`}>
                              {file.validUntil.toDate?.()?.toLocaleDateString('he-IL') || '-'}
                            </span>
                            {isExpiringSoon && (
                              <span className="text-[10px] text-amber-400">
                                ⚠️ {daysUntilExpiry} ימים לתפוגה
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {file.responsibleOfficerName || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" size={20} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
