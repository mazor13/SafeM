import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Search, Shield, AlertTriangle, CheckCircle, 
  Clock, Flame, Settings, FlaskConical, ArrowUpRight, User, Archive, Activity
} from 'lucide-react';
import { SafetyFile, SafetyFileStatus, SafetyFileType, SAFETY_FILE_TYPES } from '../../../types/crm';

const GlassCard = ({ children, className = '', onClick }: any) => (
  <div onClick={onClick} className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

export default function SafetyFilesPage() {
  const [files, setFiles] = useState<SafetyFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SafetyFileStatus | 'all'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const q = query(collection(firestore, 'safety_files'), orderBy('createdAt', 'desc'));
        const sn = await getDocs(q);
        setFiles(sn.docs.map(d => ({ id: d.id, ...d.data() })) as SafetyFile[]);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchFiles();
  }, []);

  // ✅ תיקון: הגדרת כל הסטטוסים הקיימים ב-Type החדש
  const styles: Record<SafetyFileStatus, { bg: string; text: string; label: string; icon: any }> = {
    draft: { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'טיוטה', icon: FileText },
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'פעיל', icon: CheckCircle }, // Added
    review_needed: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'נדרש סקר', icon: AlertTriangle }, // Added
    archived: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'בארכיון', icon: Archive }, // Added
    in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'בתהליך', icon: Clock },
    pending_approval: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'ממתין לאישור', icon: Activity },
    approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'מאושר', icon: CheckCircle },
    expired: { bg: 'bg-rose-500/10', text: 'text-rose-400', label: 'פג תוקף', icon: AlertTriangle },
  };

  // ✅ תיקון: שימוש במפתחות נכונים (fire_risk במקום fire) והוספת חוסרים
  const typeIcons: Record<SafetyFileType, { icon: any; color: string }> = {
    fire_risk: { icon: Flame, color: 'text-orange-400' }, // Fixed key
    machinery: { icon: Settings, color: 'text-slate-400' },
    chemical: { icon: FlaskConical, color: 'text-green-400' },
    general: { icon: FileText, color: 'text-gray-400' },
    heights: { icon: ArrowUpRight, color: 'text-blue-400' },
    accessibility: { icon: User, color: 'text-purple-400' },
    laser: { icon: AlertTriangle, color: 'text-red-400' }, // Added
    radiation: { icon: AlertTriangle, color: 'text-yellow-400' }, // Added
  };

  const getDaysUntilExpiry = (date: any) => {
    if (!date) return 999;
    const expiry = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredFiles = files.filter(file => {
    // הגנה מפני קריסה אם שדות חסרים בקבצים ישנים
    const titleMatch = (file.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const tenantMatch = (file.tenantName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    return (titleMatch || tenantMatch) && matchesStatus;
  });

  const stats = {
    total: files.length,
    approved: files.filter(f => f.status === 'approved').length,
    inProgress: files.filter(f => f.status === 'in_progress').length,
    pending: files.filter(f => f.status === 'pending_approval').length,
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">תיקי בטיחות</h1>
          <p className="text-slate-400 text-sm">ניהול ומעקב אחר תיקי שטח ואישורים</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex gap-2 items-center">
          <Shield size={18} /> תיק חדש
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-5 cursor-pointer" onClick={() => setStatusFilter('all')}>
           <div className="text-slate-400 text-xs font-bold uppercase mb-2">סה״כ תיקים</div>
           <div className="text-3xl font-black text-white">{stats.total}</div>
        </GlassCard>
        <GlassCard className="p-5 cursor-pointer" onClick={() => setStatusFilter('approved')}>
           <div className="text-slate-400 text-xs font-bold uppercase mb-2">מאושרים</div>
           <div className="text-3xl font-black text-emerald-400">{stats.approved}</div>
        </GlassCard>
        <GlassCard className="p-5 cursor-pointer" onClick={() => setStatusFilter('in_progress')}>
           <div className="text-slate-400 text-xs font-bold uppercase mb-2">בתהליך</div>
           <div className="text-3xl font-black text-blue-400">{stats.inProgress}</div>
        </GlassCard>
        <GlassCard className="p-5 cursor-pointer" onClick={() => setStatusFilter('pending_approval')}>
           <div className="text-slate-400 text-xs font-bold uppercase mb-2">ממתינים</div>
           <div className="text-3xl font-black text-amber-400">{stats.pending}</div>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4">
           <div className="relative flex-1">
             <Search className="absolute right-3 top-2.5 text-slate-500" size={18}/>
             <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="חיפוש לפי שם תיק או לקוח..." className="w-full bg-slate-800 text-white px-10 py-2 rounded-xl border border-white/10" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">שם התיק</th>
                <th className="px-6 py-4">לקוח</th>
                <th className="px-6 py-4">סוג</th>
                <th className="px-6 py-4">סטטוס</th>
                <th className="px-6 py-4">תוקף</th>
                <th className="px-6 py-4">אחראי</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFiles.map(file => {
                const style = styles[file.status] || styles.draft;
                const StatusIcon = style.icon;
                const daysUntilExpiry = getDaysUntilExpiry(file.validUntil);
                const TypeIcon = (typeIcons[file.type] && typeIcons[file.type].icon) ? typeIcons[file.type].icon : FileText;
                const typeColor = (typeIcons[file.type] && typeIcons[file.type].color) ? typeIcons[file.type].color : 'text-slate-400';
                const typeLabel = SAFETY_FILE_TYPES.find(t => t.value === file.type)?.label || file.type;
                
                return (
                  <tr key={file.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-bold text-white">{file.title}</td>
                    <td className="px-6 py-4 text-slate-300">{file.tenantName || '-'}</td>
                    <td className="px-6 py-4">
                       <div className={`flex items-center gap-2 ${typeColor}`}>
                         <TypeIcon size={16} />
                         <span>{typeLabel}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-bold ${style.bg} ${style.text}`}>
                        <StatusIcon size={14} /> {style.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${daysUntilExpiry < 30 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {file.validUntil?.toDate?.()?.toLocaleDateString('he-IL') || '-'}
                        {daysUntilExpiry < 30 && <span className="mr-2 text-xs bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">פג בקרוב</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2 text-slate-400">
                      <User size={14} /> {file.responsibleOfficerName || '-'}
                    </td>
                    <td className="px-6 py-4"><ArrowUpRight size={18} className="text-slate-500" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
