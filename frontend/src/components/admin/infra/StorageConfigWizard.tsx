import React, { useState } from 'react';
import { ChevronLeft, HelpCircle, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react';

interface WizardProps {
  service: any;
  clientId: string;
  onBack: () => void;
  onSave: (config: any) => Promise<void>;
}

export default function StorageConfigWizard({ service, clientId, onBack, onSave }: WizardProps) {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<any>({
    rootFolder: '',
    role: 'reports',
    accessKey: '',
    secretKey: '',
    bucket: '',
    host: '',
    username: '',
  });

  const handleChange = (field: string, value: string) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
    setVerified(false);
    setError(null);
  };

  const handleVerify = async () => {
    setVerifying(true);
    setError(null);
    try {
      // סימולציית בדיקה - בעתיד נחבר ל-Cloud Function
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (config.rootFolder || config.accessKey || config.host) {
          setVerified(true);
      } else {
          setError("נא למלא שדות חובה לפני הבדיקה");
      }
    } catch (err: any) {
      setError("נכשל בחיבור לשרת האימות");
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveWrapper = async () => {
      setLoading(true);
      try {
          await onSave({ ...config, type: service.id });
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 animate-fadeIn">
      <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm font-bold mb-8 transition-colors">
        <ChevronLeft size={16}/> חזרה לבחירה
      </button>

      <div className="flex items-center gap-4 mb-10">
         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">{service.icon}</div>
         <div>
           <h3 className="text-2xl font-bold text-white">חיבור {service.title}</h3>
           <p className="text-slate-400 text-sm">הגדרת גישה מאובטחת וניתוב מידע</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div>
               <label className="text-xs font-bold text-slate-500 uppercase block mb-3">שם תיקיית שורש (Root Folder)</label>
               <input type="text" value={config.rootFolder} onChange={(e) => handleChange('rootFolder', e.target.value)}
                 placeholder="לדוגמה: AEGIS_REPORTS" className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            
            <div>
               <label className="text-xs font-bold text-slate-500 uppercase block mb-3">ייעוד האחסון</label>
               <select value={config.role} onChange={(e) => handleChange('role', e.target.value)}
                 className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white outline-none">
                 <option value="reports">דוחות ומסמכי PDF בלבד</option>
                 <option value="all">כל המידע (כולל מדיה כבדה)</option>
                 <option value="backup">גיבוי בלבד</option>
               </select>
            </div>

            {service.id === 's3' && (
                <div className="grid grid-cols-1 gap-4 animate-slideUp">
                    <input type="text" placeholder="Access Key ID" value={config.accessKey} onChange={(e) => handleChange('accessKey', e.target.value)} className="bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white" />
                    <input type="password" placeholder="Secret Access Key" value={config.secretKey} onChange={(e) => handleChange('secretKey', e.target.value)} className="bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white" />
                </div>
            )}

            {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                    <AlertCircle size={18} /> {error}
                </div>
            )}
         </div>

         <div className="bg-indigo-500/5 rounded-2xl p-6 border border-indigo-500/10 h-fit">
            <h5 className="text-indigo-400 font-bold text-sm mb-4 flex items-center gap-2"><HelpCircle size={16}/> מדריך התקנה</h5>
            <ul className="space-y-4 text-xs text-slate-300">
               <li className="flex gap-3">
                 <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">1</span>
                 <span>צור תיקייה ייעודית בשירות ה-{service.title} שלך.</span>
               </li>
               <li className="flex gap-3">
                 <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">2</span>
                 <span>שתף את התיקייה עם המייל המערכתי של AEGIS או הזן מפתחות API.</span>
               </li>
            </ul>
         </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 flex justify-end gap-4">
         <button onClick={handleVerify} disabled={verifying || verified}
            className={`px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
             {verifying ? <Loader2 className="animate-spin" size={16}/> : verified ? <CheckCircle2 size={16}/> : null}
             {verified ? 'החיבור אומת' : verifying ? 'בודק...' : 'בדיקת חיבור'}
         </button>

         <button onClick={handleSaveWrapper} disabled={loading || !verified}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 text-sm flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16}/>}
            שמור והפעל סדר אוטומטי
         </button>
      </div>
    </div>
  );
}
