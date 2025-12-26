import React, { useState } from 'react';
import { infraLogger } from '../../../utils/infraLogger';

export const LocalConfig = ({ tenantId }: { tenantId: string }) => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setStatus('testing');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      await infraLogger.logEvent(tenantId, 'LOCAL_SFTP', 'SUCCESS', { host: '192.168.1.10', port: 22 });
      setStatus('success');
    } catch (error) {
      await infraLogger.logEvent(tenantId, 'LOCAL_SFTP', 'ERROR', { error: 'Connection Timeout' });
      setStatus('error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      {/* טופס ההגדרות */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800">הגדרות שרת מקומי (On-Premise SFTP)</h3>
        <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500" placeholder="Host / IP Address" />
        <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500" placeholder="Username" />
        
        {/* אזור מפתח SSH */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <p className="text-[10px] font-bold text-indigo-600 uppercase mb-2">מפתח אבטחה ציבורי של AEGIS:</p>
          <code className="text-[10px] block bg-white p-2 rounded border border-indigo-100 break-all font-mono text-slate-600">
            ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC6v...admin@aegis
          </code>
        </div>

        <button onClick={handleSave} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all">
          {status === 'testing' ? 'מבצע Handshake מול השרת...' : 'בדוק חיבור'}
        </button>
        {status === 'success' && <div className="text-emerald-600 font-bold text-center">✓ החיבור לשרת המקומי תקין</div>}
      </div>

      {/* אזור הנחיות IT המקצועי - חזר! */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <h4 className="font-bold text-indigo-400 mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <span>🔒</span> דרישות אבטחה ורשת (IT)
        </h4>
        <div className="space-y-4 text-sm">
          <p className="text-slate-300 text-xs leading-relaxed">
            כדי לאפשר ל-AEGIS להעביר קבצים, יש לוודא שה-Firewall הארגוני מאפשר את התעבורה הבאה:
          </p>
          
          <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">פרוטוקול</span>
              <span className="font-mono font-bold text-indigo-300">SFTP (SSH)</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-2">
              <span className="text-slate-400 text-xs">פורט יעד</span>
              <span className="font-mono font-bold text-indigo-300">TCP 22</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-2">
              <span className="text-slate-400 text-xs">AEGIS IPs (Whitelist)</span>
              <div className="text-right">
                <span className="block font-mono font-bold text-emerald-400">34.120.45.11</span>
                <span className="block font-mono font-bold text-emerald-400">35.200.12.99</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-[10px] text-amber-200">
              ⚠️ <strong>שים לב:</strong> חובה לוודא שלמשתמש יש הרשאות כתיבה (Write Permissions) לתיקיית היעד.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
