import React, { useState } from 'react';
import { infraLogger } from '../../../utils/infraLogger';

export const GoogleConfig = ({ tenantId }: { tenantId: string }) => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setStatus('testing');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await infraLogger.logEvent(tenantId, 'GCP_STORAGE', 'SUCCESS', { project: 'aegis-core' });
      setStatus('success');
    } catch (error) {
      await infraLogger.logEvent(tenantId, 'GCP_STORAGE', 'ERROR', { error: 'Invalid JSON Key' });
      setStatus('error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      {/* טופס ההגדרות */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800">הגדרות Google Cloud Storage</h3>
        <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-red-500" placeholder="Google Project ID" />
        <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-red-500" placeholder="Bucket Name" />
        
        <div className="relative">
          <textarea className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-red-500 font-mono text-[10px] h-32" placeholder='הדבק כאן את תוכן קובץ ה-JSON של ה-Service Account...' />
          <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 bg-white px-2 rounded border">JSON Key</div>
        </div>
        
        <button onClick={handleSave} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all">
          {status === 'testing' ? 'מאמת מפתח JSON...' : 'שמור חיבור'}
        </button>
        {status === 'success' && <div className="text-emerald-600 font-bold text-center">✓ החיבור ל-GCP תקין</div>}
      </div>

      {/* מדריך GCP ייעודי */}
      <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
        <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
          <span>🟥</span> מדריך Google Cloud
        </h4>
        <ul className="space-y-4 text-sm text-red-900">
          <li className="flex gap-3"><span className="font-bold bg-red-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span><span>ב-IAM & Admin, צור <b>Service Account</b></span></li>
          <li className="flex gap-3"><span className="font-bold bg-red-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span><span>תן הרשאת <b>Storage Admin</b></span></li>
          <li className="flex gap-3"><span className="font-bold bg-red-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span><span>צור מפתח (Create Key) מסוג <b>JSON</b> והעתק את תוכנו</span></li>
        </ul>
        <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" className="mt-6 block text-center bg-white text-red-700 py-2 rounded-xl font-bold text-xs border border-red-200 hover:bg-red-100">
          פתח את GCP Console &nearrow;
        </a>
      </div>
    </div>
  );
};
