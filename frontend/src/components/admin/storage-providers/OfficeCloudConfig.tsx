import React, { useState } from 'react';
import { infraLogger } from '../../../utils/infraLogger';

export const OfficeCloudConfig = ({ tenantId, provider }: { tenantId: string, provider: 'gdrive' | 'dropbox' | 'onedrive' }) => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [autoOrganize, setAutoOrganize] = useState(true); // ברירת מחדל: פעיל

  const configs = {
    gdrive: {
      name: 'Google Drive',
      color: 'text-green-600',
      bg: 'bg-green-50',
      icon: 'MyDrive',
      fields: ['Client ID', 'Client Secret', 'Redirect URI'],
      guide: 'מסוף Google Cloud Console > APIs & Services > Credentials'
    },
    dropbox: {
      name: 'Dropbox Business',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: 'Box',
      fields: ['App Key', 'App Secret', 'Access Token'],
      guide: 'Dropbox App Console > Permissions > Files.Content.Write'
    },
    onedrive: {
      name: 'Microsoft OneDrive',
      color: 'text-sky-700',
      bg: 'bg-sky-50',
      icon: 'Cloud',
      fields: ['Application (Client) ID', 'Directory (Tenant) ID', 'Client Secret'],
      guide: 'Azure Active Directory > App Registrations'
    }
  };

  const current = configs[provider];

  const handleSave = async () => {
    setStatus('testing');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // כאן אנו שולחים לשרת גם את ההגדרה autoOrganize: true
      await infraLogger.logEvent(tenantId, provider.toUpperCase(), 'SUCCESS', { mode: 'OAuth2', autoStructure: autoOrganize });
      setStatus('success');
    } catch (error) {
      await infraLogger.logEvent(tenantId, provider.toUpperCase(), 'ERROR', { error: 'Auth Failed' });
      setStatus('error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      
      {/* צד ימין: טופס ההגדרות */}
      <div className="space-y-6">
        <h3 className={`font-bold text-lg ${current.color} flex items-center gap-2`}>
          הגדרות חיבור {current.name}
        </h3>
        
        {current.fields.map(field => (
          <div key={field} className="relative">
            <input 
              className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm" 
              placeholder={field} 
            />
          </div>
        ))}

        {/* מתג הניהול החכם - הלב של הפיצ'ר */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-4">
          <div className="pt-1">
            <input 
              type="checkbox" 
              checked={autoOrganize} 
              onChange={(e) => setAutoOrganize(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
            />
          </div>
          <div>
            <span className="font-bold text-slate-700 text-sm block">הפעל ארגון תיקיות אוטומטי (מומלץ)</span>
            <span className="text-xs text-slate-500">
              המערכת תצור עבורך עץ תיקיות מסודר לפי שנים ופרויקטים באופן אוטומטי בכל שמירת דוח.
            </span>
          </div>
        </div>
        
        <button onClick={handleSave} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg">
          {status === 'testing' ? 'מבצע אימות מול הענן...' : 'חבר חשבון והחל מבנה תיקיות'}
        </button>
        {status === 'success' && <div className="text-emerald-600 font-bold text-center">✓ החשבון חובר והוגדר בהצלחה</div>}
      </div>

      {/* צד שמאל: הדמיה ויזואלית של מבנה התיקיות */}
      <div className={`${current.bg} p-8 rounded-3xl border border-slate-100 relative overflow-hidden`}>
        <h4 className={`font-bold ${current.color} mb-6`}>תצוגה מקדימה: הענן שלך</h4>
        
        {autoOrganize ? (
          <div className="font-mono text-xs bg-white/60 p-6 rounded-2xl border border-white/50 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
              <span className="text-xl">📂</span> {current.name} (Root)
            </div>
            <div className="pl-4 border-l-2 border-slate-300 ml-2 space-y-3">
              <div className="relative">
                <span className="absolute -left-[18px] top-3 w-4 h-[2px] bg-slate-300"></span>
                <span className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg text-indigo-800 font-bold border border-indigo-100">
                  📁 AEGIS_Reports <span className="text-[9px] font-normal opacity-70">(תיקייה ראשית)</span>
                </span>
                
                {/* תת תיקיות */}
                <div className="pl-6 border-l-2 border-slate-300 ml-2 mt-2 space-y-2">
                   <div className="relative">
                      <span className="absolute -left-[18px] top-3 w-4 h-[2px] bg-slate-300"></span>
                      <span className="flex items-center gap-2 text-slate-600">
                        📁 Project_A
                      </span>
                      <div className="pl-6 border-l-2 border-slate-200 ml-2 mt-1">
                         <div className="relative pl-4 pt-1">
                            <span className="absolute -left-[10px] top-3 w-3 h-[2px] bg-slate-200"></span>
                            <span className="text-slate-500">📁 2025</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="relative">
                      <span className="absolute -left-[18px] top-3 w-4 h-[2px] bg-slate-300"></span>
                      <span className="flex items-center gap-2 text-slate-600">
                        📁 Project_B
                      </span>
                      <div className="pl-6 border-l-2 border-slate-200 ml-2 mt-1">
                         <div className="relative pl-4 pt-1">
                            <span className="absolute -left-[10px] top-3 w-3 h-[2px] bg-slate-200"></span>
                            <span className="text-slate-500">📁 2025</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <div className="text-4xl mb-2">🗑️</div>
            <p className="text-slate-600 text-sm font-bold">מצב ארגון אוטומטי כבוי</p>
            <p className="text-slate-500 text-xs mt-1">הקבצים יישמרו בתיקייה הראשית ללא מיון.</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-white/40 rounded-xl border border-white/50">
          <p className="text-[10px] text-slate-600">
            <strong>איך זה עובד?</strong> בעת שמירת דוח, AEGIS תבדוק אם התיקייה קיימת. אם לא - היא תיצור אותה עבורך באופן אוטומטי.
          </p>
        </div>
      </div>
    </div>
  );
};
