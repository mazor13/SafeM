import React, { useState, useEffect } from 'react';
import { 
  CloudIcon, PaintBrushIcon, CpuChipIcon, 
  DocumentMagnifyingGlassIcon, CheckCircleIcon, ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useGlobalConfig } from '../../hooks/useGlobalConfig';

export default function GlobalInfra() {
  const { config, updateConfig, loading } = useGlobalConfig();
  const [activeTab, setActiveTab] = useState('branding');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [localConfig, setLocalConfig] = useState<any>(null);

  // סנכרון נתונים מה-Hook לטופס המקומי
  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  const handleSave = async () => {
    if (!localConfig) return;
    setIsSaving(true);
    setSaveStatus('idle');
    const result = await updateConfig(localConfig);
    setIsSaving(false);
    if (result.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('error');
    }
  };

  // אם אנחנו בטעינה מעל 5 שניות, נציג כפתור "טען מחדש" או הודעה
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-slate-400">
        <ArrowPathIcon className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
        <p className="animate-pulse">מתחבר ל-Firestore...</p>
        <p className="text-[10px] mt-2 text-slate-600">אם זה נמשך זמן רב, ייתכן שיש בעיית הרשאות.</p>
      </div>
    );
  }

  // אם הטעינה הסתיימה ועדיין אין קונפיג (מקרה קיצון)
  if (!localConfig) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-red-400">
        <ExclamationTriangleIcon className="h-12 w-12 mb-4" />
        <p>שגיאה בטעינת נתונים.</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-xs underline">נסה לרענן שוב</button>
      </div>
    );
  }

  const tabs = [
    { id: 'cloud', name: 'ספקי ענן', icon: CloudIcon },
    { id: 'branding', name: 'מיתוג', icon: PaintBrushIcon },
    { id: 'automation', name: 'אוטומציה', icon: CpuChipIcon },
    { id: 'logs', name: 'לוגים', icon: DocumentMagnifyingGlassIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans" dir="rtl">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Global Infrastructure</h1>
          <p className="text-slate-500 text-sm mt-1">ניהול משאבים ומיתוג גלובלי</p>
        </div>
        
        <div className="flex items-center gap-4">
          {saveStatus === 'success' && (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircleIcon className="h-4 w-4" /> נשמר!
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-400 text-xs font-bold flex items-center gap-1">
              <ExclamationTriangleIcon className="h-4 w-4" /> שגיאת שמירה
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              isSaving ? 'bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
            } text-white`}
          >
            {isSaving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>
      </header>

      <nav className="flex gap-2 mb-8 bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.name}
          </button>
        ))}
      </nav>

      <main className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-md">
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white mb-4">מיתוג מאסטר</h3>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">שם החברה</label>
                <input 
                  type="text" 
                  value={localConfig.branding?.companyName || ''}
                  onChange={(e) => setLocalConfig({...localConfig, branding: {...localConfig.branding, companyName: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">צבע ראשי</label>
                  <input 
                    type="color" 
                    value={localConfig.branding?.primaryColor || '#4f46e5'}
                    onChange={(e) => setLocalConfig({...localConfig, branding: {...localConfig.branding, primaryColor: e.target.value}})}
                    className="h-11 w-full bg-transparent border-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-black/20 rounded-3xl p-10 border border-white/5">
               <div 
                 className="w-24 h-24 rounded-2xl mb-4 flex items-center justify-center text-3xl font-black text-white shadow-2xl"
                 style={{ backgroundColor: localConfig.branding?.primaryColor }}
               >
                 {localConfig.branding?.companyName?.charAt(0) || 'A'}
               </div>
               <p className="text-slate-500 text-[10px] italic">תצוגה מקדימה של מיתוג המערכת</p>
            </div>
          </div>
        )}
        {activeTab !== 'branding' && <div className="text-center py-20 text-slate-600 italic text-sm">הממשק יחובר בצעדים הבאים...</div>}
      </main>
    </div>
  );
}
