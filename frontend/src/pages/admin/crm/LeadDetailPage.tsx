import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, deleteDoc, setDoc, collection, Timestamp, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../../../firebase';
import { useAuth } from '../../../providers/AuthProvider'; // Real Auth Hook
import { 
  ArrowRight, Mail, Phone, Building2, UserCheck, Clock, 
  X, Send, PhoneCall, Zap, Globe, MessageSquare, ChevronDown, 
  Briefcase, Fingerprint, Calendar, Star, ShieldCheck, Target,
  Flame, Sun, Snowflake, FileText, Download, Layout, History,
  Upload, Lock, CheckCircle2, MoreHorizontal, AlertCircle,
  Activity as ActivityIcon, Trash2, Eye, Settings, Sliders, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, Activity, LEAD_STATUSES, ACTIVITY_TYPES, ActivityType, LeadStatus } from '../../../types/crm';

// --- CONSTANTS & MAPS ---

const STATUS_LABELS_MAP: Record<string, string> = {
  new: 'חדש',
  contacted: 'נוצר קשר',
  qualified: 'מוסמך',
  proposal: 'הצעה',
  negotiation: 'מו"מ',
  converted: 'הומר',
  lost: 'אבד',
  disqualified: 'נפסל'
};

const DOCUMENT_CATEGORIES = [
  { value: 'general', label: 'כללי (General)' },
  { value: 'contract', label: 'חוזים והסכמים (Contracts)' },
  { value: 'proposal', label: 'הצעות מחיר (Proposals)' },
  { value: 'technical', label: 'מפרט טכני (Technical)' },
  { value: 'finance', label: 'חשבוניות ופיננסי (Finance)' },
  { value: 'legal', label: 'משפטי (Legal)' }
];

interface ScoringModel {
  budgetWeight: number;
  authorityWeight: number;
  needWeight: number;
  timelineWeight: number;
  contactInfoWeight: number;
  activityWeight: number;
  hotThreshold: number;
  warmThreshold: number;
}

const DEFAULT_MODEL: ScoringModel = {
  budgetWeight: 20,
  authorityWeight: 20,
  needWeight: 20,
  timelineWeight: 20,
  contactInfoWeight: 10,
  activityWeight: 10,
  hotThreshold: 80,
  warmThreshold: 50
};

// --- LOGIC ---

const calculateLeadScore = (lead: Lead, bant: any, model: ScoringModel) => {
  let score = 0;
  if (lead.email && lead.phone) score += model.contactInfoWeight;
  if (bant.budget) score += model.budgetWeight;
  if (bant.authority) score += model.authorityWeight;
  if (bant.need) score += model.needWeight;
  if (bant.timeline) score += model.timelineWeight;
  return Math.min(score, 100);
};

const getLeadTemperature = (score: number, model: ScoringModel) => {
  if (score >= model.hotThreshold) return { label: 'Hot Lead (לוהט)', color: '#EF4444', icon: Flame };
  if (score >= model.warmThreshold) return { label: 'Warm Lead (חם)', color: '#F59E0B', icon: Sun };
  return { label: 'Cold Lead (קר)', color: '#3B82F6', icon: Snowflake };
};

// --- COMPONENTS ---

const UploadModal = ({ isOpen, onClose, file, onUpload }: { isOpen: boolean, onClose: () => void, file: File | null, onUpload: (category: string) => void }) => {
  const [category, setCategory] = useState('general');
  if (!isOpen || !file) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" dir="rtl">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1C2435] border border-[#00D8FF]/30 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">סיווג מסמך חדש</h3>
        <div className="bg-[#0E1A35] p-4 rounded-xl mb-4 border border-white/5">
          <p className="text-[#A9B3C1] text-xs mb-1">שם הקובץ:</p>
          <p className="text-white font-mono text-sm truncate">{file.name}</p>
          <p className="text-[#6B7C93] text-xs mt-1">גודל: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <div className="mb-6">
          <label className="block text-[#A9B3C1] text-sm font-bold mb-2">בחר קטגוריה / סיווג:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#0E1A35] border border-white/10 text-white p-3 rounded-xl outline-none focus:border-[#00D8FF]">
            {DOCUMENT_CATEGORIES.map(cat => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-[#A9B3C1] font-bold hover:text-white">ביטול</button>
          <button onClick={() => onUpload(category)} className="flex-1 py-3 bg-[#00D8FF] text-[#0E1A35] font-black rounded-xl hover:shadow-lg transition-all">שמור והעלה</button>
        </div>
      </motion.div>
    </div>
  );
};

const DocumentPreviewModal = ({ isOpen, onClose, doc }: { isOpen: boolean, onClose: () => void, doc: any }) => {
  if (!isOpen || !doc) return null;
  return (
    <div className="fixed inset-0 bg-black/90 z-[200] flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-4">
        <a href={doc.url} download={doc.name} target="_blank" rel="noreferrer" className="text-white hover:text-[#00D8FF]"><Download size={24} /></a>
        <button onClick={onClose} className="text-white hover:text-red-500"><X size={24} /></button>
      </div>
      <div className="bg-[#1C2435] p-2 rounded-xl max-w-6xl w-full h-[85vh] border border-white/10 flex flex-col items-center justify-center relative">
        {doc.type?.startsWith('image/') ? (
          <img src={doc.url} alt={doc.name} className="max-w-full max-h-full rounded-lg object-contain" />
        ) : doc.type === 'application/pdf' ? (
          <iframe src={doc.url} className="w-full h-full rounded-lg" title={doc.name}></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <FileText size={64} className="text-[#00D8FF] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{doc.name}</h3>
            <p className="text-[#A9B3C1] mb-6">תצוגה מקדימה לא זמינה לקובץ זה.</p>
            <a href={doc.url} target="_blank" rel="noreferrer" className="bg-[#00D8FF] text-[#0E1A35] px-6 py-2 rounded-xl font-bold">פתח בכרטיסייה חדשה</a>
          </div>
        )}
      </div>
    </div>
  );
};

const CalibrationModal = ({ isOpen, onClose, model, onSave }: { isOpen: boolean, onClose: () => void, model: ScoringModel, onSave: (m: ScoringModel) => void }) => {
  const [localModel, setLocalModel] = useState(model);
  const handleChange = (key: keyof ScoringModel, value: number) => setLocalModel(prev => ({ ...prev, [key]: parseInt(value.toString()) }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" dir="rtl">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1C2435] border border-[#00D8FF]/30 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-black text-white">Cortex Calibration</h2>
          <button onClick={onClose}><X className="text-[#6B7C93] hover:text-white" /></button>
        </div>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold">משקלי BANT</h3>
            <RangeInput label="תקציב (Budget)" value={localModel.budgetWeight} onChange={v => handleChange('budgetWeight', v)} />
            <RangeInput label="סמכות (Authority)" value={localModel.authorityWeight} onChange={v => handleChange('authorityWeight', v)} />
            <RangeInput label="צורך (Need)" value={localModel.needWeight} onChange={v => handleChange('needWeight', v)} />
            <RangeInput label="לוח זמנים (Timeline)" value={localModel.timelineWeight} onChange={v => handleChange('timelineWeight', v)} />
          </div>
        </div>
        <div className="flex gap-3 pt-8 mt-4 border-t border-white/10">
          <button onClick={onClose} className="flex-1 py-3 text-[#A9B3C1] font-bold">ביטול</button>
          <button onClick={() => { onSave(localModel); onClose(); }} className="flex-1 py-3 bg-[#00D8FF] text-[#0E1A35] font-black rounded-xl">שמור מודל</button>
        </div>
      </motion.div>
    </div>
  );
};

const RangeInput = ({ label, value, onChange, max = 50, color = 'text-[#00D8FF]' }: any) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-[#A9B3C1] text-xs font-bold">{label}</span>
      <span className={`text-xs font-black ${color}`}>{value} pts</span>
    </div>
    <input type="range" min="0" max={max} step="5" value={value} onChange={e => onChange(e.target.value)} className="w-full h-2 bg-[#0E1A35] rounded-lg appearance-none cursor-pointer accent-[#00D8FF] border border-white/10" />
  </div>
);

const AIScoreMeter = ({ score, model, onCalibrate }: { score: number, model: ScoringModel, onCalibrate: () => void }) => {
  const data = getLeadTemperature(score, model);
  const Icon = data.icon;
  return (
    <div className="relative group">
      <button onClick={onCalibrate} className="absolute top-0 left-0 p-1.5 bg-[#0E1A35] rounded-lg text-[#6B7C93] hover:text-[#00D8FF] border border-white/5 opacity-0 group-hover:opacity-100 z-10 transition-all"><Settings size={14} /></button>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><Icon size={20} style={{ color: data.color }} /><span className="text-white font-bold text-base">{data.label}</span></div>
        <span className="text-3xl font-black text-white">{score}</span>
      </div>
      <div className="h-4 bg-[#0E1A35] rounded-full overflow-hidden border border-white/10 relative">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.5 }} className="h-full rounded-full relative" style={{ background: `linear-gradient(90deg, ${data.color}, ${data.color}dd)` }} />
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label, color, onClick }: any) => (
  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick} className="flex flex-col items-center gap-3 p-5 bg-[#0E1A35] rounded-xl border border-white/10 hover:border-[#00D8FF]/50 transition-all group">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}><Icon size={24} style={{ color }} /></div>
    <span className="text-[#A9B3C1] text-sm font-bold group-hover:text-white transition-colors">{label}</span>
  </motion.button>
);

const StatusProgressTimeline = ({ currentStatus, onStatusChange }: { currentStatus: LeadStatus, onStatusChange: (s: LeadStatus) => void }) => {
  const statusFlow = [
    { value: 'new', label: 'חדש', color: '#00D8FF' },
    { value: 'contacted', label: 'נוצר קשר', color: '#0EA5E9' },
    { value: 'qualified', label: 'מוסמך', color: '#10B981' },
    { value: 'proposal', label: 'הצעה', color: '#F59E0B' },
    { value: 'negotiation', label: 'מו"מ', color: '#8B5CF6' },
    { value: 'converted', label: 'הומר', color: '#10B981' }
  ];
  const currentIndex = statusFlow.findIndex(s => s.value === currentStatus);
  return (
    <div className="flex items-center justify-between px-2 w-full overflow-x-auto pb-2">
      {statusFlow.map((status, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <React.Fragment key={status.value}>
            <div onClick={() => onStatusChange(status.value as LeadStatus)} className="flex flex-col items-center gap-3 cursor-pointer group relative z-10 min-w-[60px]">
              <motion.div whileHover={{ scale: 1.1 }} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-[#00D8FF] bg-[#00D8FF]/10' : 'border-white/10 bg-[#0E1A35]'}`} style={{ borderColor: isCurrent ? status.color : undefined }}>
                {index < currentIndex ? <CheckCircle2 size={20} className="text-[#00D8FF]" /> : <span className={`text-sm font-black ${isCurrent ? 'text-[#0E1A35]' : 'text-white'}`}>{index + 1}</span>}
              </motion.div>
              <span className={`text-xs font-bold whitespace-nowrap transition-colors ${isActive ? 'text-white' : 'text-[#6B7C93]'}`}>{status.label}</span>
            </div>
            {index < statusFlow.length - 1 && <div className={`h-1 flex-1 mx-2 rounded-full transition-all min-w-[20px] ${index < currentIndex ? 'bg-[#00D8FF]' : 'bg-white/10'}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// --- Documents Tab with Real User & Delete ---
const DocumentsTab = ({ leadId }: { leadId: string }) => {
  const [docs, setDocs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  
  // Use Real Auth Hook
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(firestore, `leads/${leadId}/documents`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => setDocs(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [leadId]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { 
        alert("הקובץ גדול מדי. הגודל המקסימלי המותר הוא 10MB.");
        return;
      }
      setSelectedFile(file);
      setIsUploadModalOpen(true);
    }
  };

  const handleDelete = async (docId: string, fileUrl: string) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק מסמך זה? פעולה זו היא בלתי הפיכה.")) return;
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(firestore, `leads/${leadId}/documents`, docId));
      
      // 2. Delete from Storage (Optional - requires path parsing)
      // Note: We try/catch this because sometimes the URL might be external or mock
      try {
        const storageRef = ref(storage, fileUrl);
        await deleteObject(storageRef);
      } catch (storageErr) {
        console.warn("Storage delete skipped or failed (might be external link or permission issue)", storageErr);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("שגיאה במחיקת המסמך");
    }
  };

  const handleUploadConfirm = async (category: string) => {
    if (!selectedFile || !user) {
        alert("עליך להיות מחובר כדי להעלות קבצים.");
        return;
    }
    setUploading(true);
    try {
      // Use Tenant ID from User or default
      const tenantId = (user as any).tenantId || 'default_tenant'; 
      
      // 1. Upload to Real Storage Bucket (Multi-Tenant Path)
      const storagePath = `tenants/${tenantId}/leads/${leadId}/documents/${selectedFile.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, selectedFile);
      const url = await getDownloadURL(storageRef);

      // 2. Save Metadata to Firestore
      await addDoc(collection(firestore, `leads/${leadId}/documents`), {
        name: selectedFile.name, 
        type: selectedFile.type, 
        size: selectedFile.size, 
        url: url,
        category: category, 
        uploaderName: user.displayName || user.email || 'System', // Real Name
        uploaderId: user.uid, // Real ID
        tenantId: tenantId,
        createdAt: Timestamp.now()
      });
      
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    } catch (err) { 
      console.error(err);
      alert("שגיאה בהעלאה.");
    } finally { 
      setUploading(false); 
    }
  };

  const getCategoryLabel = (val: string) => DOCUMENT_CATEGORIES.find(c => c.value === val)?.label || val;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#1C2435] p-4 rounded-2xl border border-white/5">
        <h3 className="text-white font-bold flex items-center gap-2"><Lock size={20} className="text-[#00D8FF]" /> מסמכים מאובטחים (Secure Vault)</h3>
        <label className={`bg-[#00D8FF]/10 text-[#00D8FF] px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#00D8FF]/20 transition-all border border-[#00D8FF]/30 cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
          <input type="file" className="hidden" onChange={onFileSelect} disabled={uploading} />
          {uploading ? <ActivityIcon className="animate-spin" size={16} /> : <Upload size={16} />}
          {uploading ? 'מעלה...' : 'העלאת מסמך (Max 10MB)'}
        </label>
      </div>
      
      <div className="bg-[#1C2435] rounded-[2rem] border border-white/5 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-[#0E1A35] border-b border-white/5">
            <tr>
              <th className="p-5 text-[#6B7C93] text-sm font-bold">שם הקובץ</th>
              <th className="p-5 text-[#6B7C93] text-sm font-bold">סיווג (Category)</th>
              <th className="p-5 text-[#6B7C93] text-sm font-bold">הועלה ע"י</th>
              <th className="p-5 text-[#6B7C93] text-sm font-bold">תאריך</th>
              <th className="p-5 text-[#6B7C93] text-sm font-bold">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {docs.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-[#6B7C93] text-sm">אין מסמכים בתיק זה.</td></tr>
            ) : docs.map((doc) => (
              <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                <td className="p-5"><div className="flex items-center gap-3"><div className="p-2 bg-[#0E1A35] rounded-lg text-[#00D8FF] border border-white/5"><FileText size={18} /></div><span className="text-sm font-bold text-white max-w-[200px] truncate">{doc.name}</span></div></td>
                <td className="p-5"><span className="bg-[#0E1A35] px-4 py-1.5 rounded-full text-xs font-bold text-[#A9B3C1] border border-white/10">{getCategoryLabel(doc.category)}</span></td>
                <td className="p-5 text-sm text-[#A9B3C1]">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[#00D8FF]" />
                    {doc.uploaderName || 'Unknown'}
                  </div>
                </td>
                <td className="p-5 text-sm text-[#6B7C93] font-mono">{new Date(doc.createdAt?.seconds * 1000).toLocaleDateString()}</td>
                <td className="p-5 flex gap-2">
                  <button onClick={() => setPreviewDoc(doc)} className="text-[#6B7C93] hover:text-[#00D8FF] p-2 hover:bg-white/5 rounded-lg transition-colors" title="הצג"><Eye size={18}/></button>
                  <button onClick={() => handleDelete(doc.id, doc.url)} className="text-[#6B7C93] hover:text-red-500 p-2 hover:bg-white/5 rounded-lg transition-colors" title="מחק"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} file={selectedFile} onUpload={handleUploadConfirm} />
      <DocumentPreviewModal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} doc={previewDoc} />
    </div>
  );
};

const AuditLogTab = ({ activities }: { activities: Activity[] }) => {
  const exportToCSV = () => {
    const headers = ['Date,Time,Type,Subject,Description,User'];
    const rows = activities.map(act => {
      const date = act.createdAt?.seconds ? new Date(act.createdAt.seconds * 1000) : new Date();
      const user = (act as any).performedBy || 'System';
      return `${date.toLocaleDateString()},${date.toLocaleTimeString()},${act.type},"${act.subject}","${act.description || ''}","${user}"`;
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.concat(rows).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `audit_log_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#1C2435] p-4 rounded-2xl border border-white/5">
        <h3 className="text-white font-bold flex items-center gap-2"><History size={20} className="text-[#00D8FF]" /> היסטוריית פעילות מלאה (Audit Log)</h3>
        <button onClick={exportToCSV} className="bg-[#1C2435] text-[#A9B3C1] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:text-white hover:bg-white/5 transition-all border border-white/10">
          <Download size={16} /> ייצוא ל-Excel/CSV
        </button>
      </div>
      <div className="bg-[#1C2435] rounded-[2rem] border border-white/5 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-[#0E1A35] border-b border-white/5">
            <tr>
              <th className="p-5 text-[#6B7C93] text-sm font-bold">סוג</th>
              <th className="p-5 text-[#6B7C93] text-sm font-bold">נושא ופרטים</th>
              <th className="p-5 text-[#6B7C93] text-sm font-bold">בוצע ע"י</th>
              <th className="p-5 text-[#6B7C93] text-sm font-bold">תאריך ושעה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {activities.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-[#6B7C93]">אין נתונים להצגה</td></tr>
            ) : activities.map((act) => (
              <tr key={act.id} className="hover:bg-white/5 transition-colors">
                <td className="p-5"><div className="flex items-center gap-2"><div className="p-2 bg-[#0E1A35] rounded-lg text-[#00D8FF] border border-white/5">{act.type === 'call' ? <PhoneCall size={16}/> : act.type === 'email' ? <Mail size={16}/> : <ActivityIcon size={16}/>}</div><span className="text-sm font-bold text-white uppercase">{act.type}</span></div></td>
                <td className="p-5"><div className="font-bold text-white text-sm">{act.subject}</div><div className="text-xs text-[#A9B3C1]">{act.description}</div></td>
                <td className="p-5"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00D8FF] to-[#0EA5E9] flex items-center justify-center text-[8px] font-black text-[#0E1A35]">{((act as any).performedBy || 'S')[0]}</div><span className="text-sm text-[#A9B3C1]">{(act as any).performedBy || 'System'}</span></div></td>
                <td className="p-5 text-sm text-[#6B7C93] font-mono">{new Date(act.createdAt?.seconds * 1000).toLocaleString('he-IL')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ConvertSlideOver = ({ isOpen, onClose, lead, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [tenantData, setTenantData] = useState({ name: lead.company || `${lead.firstName} ${lead.lastName}`, domain: '', plan: 'basic' });
  const handleConvert = async () => {
    setLoading(true);
    try {
      const tenantRef = await addDoc(collection(firestore, 'tenants'), { ...tenantData, status: 'active', healthScore: 100, createdAt: Timestamp.now(), convertedFromLeadId: lead.id });
      await addDoc(collection(firestore, 'contacts'), { firstName: lead.firstName, lastName: lead.lastName, email: lead.email, tenantId: tenantRef.id, tenantName: tenantData.name, isPrimary: true, status: 'active', createdAt: Timestamp.now() });
      await updateDoc(doc(firestore, 'leads', lead.id), { status: 'converted', convertedAt: Timestamp.now(), updatedAt: Timestamp.now() });
      onSuccess();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed left-0 top-0 bottom-0 w-full max-w-xl bg-[#1C2435] border-r border-[#00D8FF] z-50 p-8 shadow-2xl overflow-y-auto" dir="rtl">
            <h2 className="text-2xl font-black text-white mb-2">Sales Handoff Protocol</h2>
            <div className="space-y-6 mt-6">
              <div><label className="block text-[#A9B3C1] text-sm font-bold mb-2">שם הארגון</label><input value={tenantData.name} onChange={e => setTenantData({...tenantData, name: e.target.value})} className="w-full bg-[#0E1A35] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#00D8FF]" /></div>
              <div><label className="block text-[#A9B3C1] text-sm font-bold mb-2">דומיין</label><div className="flex items-center gap-2"><input value={tenantData.domain} onChange={e => setTenantData({...tenantData, domain: e.target.value.toLowerCase()})} className="flex-1 bg-[#0E1A35] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#00D8FF]" placeholder="company-id" /><span className="text-[#6B7C93]">.aegis.io</span></div></div>
              <div className="flex gap-3 pt-6"><button onClick={onClose} className="flex-1 py-3 text-[#A9B3C1] font-bold">ביטול</button><button onClick={handleConvert} disabled={loading} className="flex-1 py-3 bg-[#00D8FF] text-[#0E1A35] font-black rounded-xl">{loading ? 'מבצע...' : 'אשר המרה'}</button></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConvertSlideOverOpen, setIsConvertSlideOverOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'note' as ActivityType, subject: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'history'>('overview');
  const [bant, setBant] = useState({ authority: false, budget: false, need: false, timeline: false });
  const [scoringModel, setScoringModel] = useState<ScoringModel>(DEFAULT_MODEL);
  const [aiScore, setAiScore] = useState(0);
  
  const { user } = useAuth(); // Use Real Auth Hook

  const fetchData = async () => {
    if (!id) return;
    try {
      const docSnap = await getDoc(doc(firestore, 'leads', id));
      if (docSnap.exists()) setLead({ id: docSnap.id, ...docSnap.data() } as Lead);
      const q = query(collection(firestore, 'activities'), where('relatedToId', '==', id), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      setActivities(sn.docs.map(d => ({ id: d.id, ...d.data() })) as Activity[]);
      const modelSnap = await getDoc(doc(firestore, 'settings', 'leadScoring'));
      if (modelSnap.exists()) setScoringModel(modelSnap.data() as ScoringModel);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, [id]);
  useEffect(() => { if (lead) setAiScore(calculateLeadScore(lead, bant, scoringModel)); }, [bant, lead, scoringModel]);

  const saveScoringModel = async (newModel: ScoringModel) => {
    try { await setDoc(doc(firestore, 'settings', 'leadScoring'), newModel); setScoringModel(newModel); } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    try {
      const statusLabel = STATUS_LABELS_MAP[newStatus] || newStatus;
      await updateDoc(doc(firestore, 'leads', lead.id), { status: newStatus, updatedAt: Timestamp.now() });
      setLead({ ...lead, status: newStatus }); 
      
      // Use real user name or fallback
      const performer = user?.displayName || user?.email || 'System';

      await addDoc(collection(firestore, 'activities'), { 
        type: 'note', 
        subject: 'שינוי סטטוס מערכת', 
        description: `הסטטוס שונה ל-${statusLabel}`, 
        relatedToType: 'lead', 
        relatedToId: id, 
        createdAt: Timestamp.now(), 
        status: 'completed', 
        performedBy: performer
      });
      fetchData();
    } catch (err) { console.error("Error updating status:", err); }
  };

  const postActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.subject || !id) return;
    setIsSubmitting(true);
    try {
      const performer = user?.displayName || user?.email || 'System';
      await addDoc(collection(firestore, 'activities'), { ...newActivity, relatedToType: 'lead', relatedToId: id, createdAt: Timestamp.now(), status: 'completed', performedBy: performer });
      setNewActivity({ type: 'note', subject: '', description: '' });
      fetchData();
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#0E1A35] flex items-center justify-center text-[#00D8FF] animate-pulse font-bold">טוען פרופיל מודיעין...</div>;
  if (!lead) return <div className="p-10 text-white">לא נמצא.</div>;

  return (
    <div className="min-h-screen bg-[#0E1A35] p-6 lg:p-10 text-right font-sans" dir="rtl">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-center bg-[#1C2435] p-8 rounded-[2rem] border border-white/5 shadow-2xl gap-6">
          <div className="flex items-center gap-6">
            <Link to="/admin/crm/leads" className="text-[#6B7C93] hover:text-[#00D8FF] transition-all"><ArrowRight size={24} /></Link>
            <div className="flex items-center gap-5">
               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00D8FF] to-[#0EA5E9] flex items-center justify-center text-[#0E1A35] text-3xl font-black">{lead.firstName?.[0]}{lead.lastName?.[0]}</div>
               <div>
                  <h1 className="text-4xl font-black text-white mb-2">{lead.firstName} {lead.lastName}</h1>
                  <div className="flex items-center gap-3"><Building2 size={18} className="text-[#00D8FF]" /><p className="text-white text-lg font-bold">{lead.company || 'חברה לא צוינה'}</p></div>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-4">{lead.status !== 'converted' && <button onClick={() => setIsConvertSlideOverOpen(true)} className="bg-[#00D8FF] text-[#0E1A35] px-10 py-4 rounded-xl font-black text-sm uppercase hover:scale-105 transition-all">Sales Handoff (המרה)</button>}</div>
        </div>

        <div className="flex gap-4 border-b border-white/10 pb-1">
          {[{ id: 'overview', label: 'מבט על', icon: Layout }, { id: 'documents', label: 'מסמכים', icon: FileText }, { id: 'history', label: 'לוג היסטוריה', icon: History }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-6 py-3 rounded-t-xl flex items-center gap-2 transition-all font-bold text-sm ${activeTab === tab.id ? 'bg-[#1C2435] text-white border-b-2 border-[#00D8FF]' : 'text-[#6B7C93] hover:text-white'}`}><tab.icon size={16} /> {tab.label}</button>
          ))}
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-[#1C2435] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group"><div className="absolute top-0 right-0 w-32 h-32 bg-[#00D8FF]/5 blur-3xl" /><AIScoreMeter score={aiScore} model={scoringModel} onCalibrate={() => setIsCalibrationOpen(true)} /></div>
                 <div className="bg-[#1C2435] rounded-[2rem] p-6 border border-emerald-500/10">
                    <div className="flex items-center gap-3 mb-5 text-emerald-400 font-black text-sm uppercase tracking-widest"><ShieldCheck size={18}/> BANT Qualification</div>
                    <div className="grid grid-cols-2 gap-3">
                       {[{ key: 'budget', label: 'תקציב' }, { key: 'authority', label: 'סמכות' }, { key: 'need', label: 'צורך' }, { key: 'timeline', label: 'לו"ז' }].map(item => (
                         <div key={item.key} onClick={() => setBant({...bant, [item.key]: !bant[item.key as keyof typeof bant]})} className={`p-4 rounded-xl border cursor-pointer text-center ${bant[item.key as keyof typeof bant] ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#0E1A35] border-white/5'}`}>
                            <p className={`text-xs font-black mb-1 ${bant[item.key as keyof typeof bant] ? 'text-emerald-400' : 'text-[#6B7C93]'}`}>{item.label}</p>
                            <p className={`text-xs font-bold ${bant[item.key as keyof typeof bant] ? 'text-white' : 'text-[#6B7C93]'}`}>{bant[item.key as keyof typeof bant] ? '✓ אומת' : 'לא אומת'}</p>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-[#1C2435] rounded-[2rem] p-6 border border-white/5">
                    <div className="grid grid-cols-3 gap-3">
                       <QuickActionButton icon={PhoneCall} label="התקשר" color="#10B981" onClick={() => window.open(`tel:${lead.phone}`)}/>
                       <QuickActionButton icon={Mail} label="אימייל" color="#00D8FF" onClick={() => window.open(`mailto:${lead.email}`)}/>
                       <QuickActionButton icon={MessageSquare} label="WhatsApp" color="#10B981" onClick={() => window.open(`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`)}/>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-8 space-y-8">
                 <div className="bg-[#1C2435] rounded-[2rem] p-8 border border-white/5 shadow-xl"><h3 className="text-white font-bold mb-6 text-sm">סטטוס נוכחי (לחץ לעדכון)</h3><StatusProgressTimeline currentStatus={lead.status} onStatusChange={handleStatusChange} /></div>
                 <motion.div className="bg-[#1C2435] rounded-[2rem] border border-[#00D8FF]/20 p-8 shadow-2xl relative">
                   <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-[#00D8FF]/10 rounded-lg text-[#00D8FF]"><MessageSquare size={20}/></div><h3 className="text-sm font-black text-white uppercase tracking-widest">Cortex Interaction Hub</h3></div>
                   <form onSubmit={postActivity} className="space-y-4">
                      <div className="flex gap-2">{ACTIVITY_TYPES.map(type => (<button key={type.value} type="button" onClick={() => setNewActivity({...newActivity, type: type.value as ActivityType})} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${newActivity.type === type.value ? 'bg-[#00D8FF] text-[#0E1A35]' : 'bg-[#0E1A35] border border-white/10 text-[#6B7C93]'}`}>{type.label}</button>))}</div>
                      <input placeholder="נושא הפעילות..." value={newActivity.subject} onChange={e => setNewActivity({...newActivity, subject: e.target.value})} className="w-full bg-[#0E1A35] border border-white/5 rounded-2xl py-4 px-6 text-white font-bold placeholder-[#6B7C93] outline-none focus:border-[#00D8FF]/40 transition-all text-sm" />
                      <textarea placeholder="תיעוד מלא של השיחה..." value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="w-full bg-[#0E1A35] border border-white/5 rounded-2xl py-6 px-6 text-[#A9B3C1] text-sm placeholder-[#6B7C93] outline-none min-h-[100px] resize-none focus:border-[#00D8FF]/20 transition-all" />
                      <div className="flex justify-end pt-2"><button disabled={!newActivity.subject || isSubmitting} className="bg-[#00D8FF] text-[#0E1A35] px-12 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 disabled:opacity-30">{isSubmitting ? 'מעדכן...' : <><Send size={16}/> פרסם עדכון</>}</button></div>
                   </form>
                 </motion.div>
              </div>
            </div>
          )}
          {activeTab === 'documents' && <DocumentsTab leadId={id!} />}
          {activeTab === 'history' && <AuditLogTab activities={activities} />}
        </div>
      </div>
      <ConvertSlideOver isOpen={isConvertSlideOverOpen} onClose={() => setIsConvertSlideOverOpen(false)} lead={lead} onSuccess={() => { setIsConvertSlideOverOpen(false); navigate('/admin/clients'); }} />
      <CalibrationModal isOpen={isCalibrationOpen} onClose={() => setIsCalibrationOpen(false)} model={scoringModel} onSave={saveScoringModel} />
    </div>
  );
}
