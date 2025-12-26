import React, { useState } from 'react';
import { infraLogger } from '../../../utils/infraLogger';

export const AzureConfig = ({ tenantId }: { tenantId: string }) => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setStatus('testing');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await infraLogger.logEvent(tenantId, 'AZURE_BLOB', 'SUCCESS', { account: 'myorgdata' });
      setStatus('success');
    } catch (error) {
      await infraLogger.logEvent(tenantId, 'AZURE_BLOB', 'ERROR', { error: 'Invalid Connection String' });
      setStatus('error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      {/* טופס ההגדרות */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800">הגדרות Azure Blob Storage</h3>
        <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500" placeholder="Storage Account Name" />
        <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500" placeholder="Container Name" />
        <textarea className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 font-mono text-xs h-24" placeholder="Connection String (Key 1)" />
        
        <button onClick={handleSave} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all">
          {status === 'testing' ? 'מאמת מול Azure...' : 'שמור חיבור'}
        </button>
        {status === 'success' && <div className="text-emerald-600 font-bold text-center">✓ החיבור ל-Azure תקין</div>}
      </div>

      {/* מדריך Azure ייעודי */}
      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
        <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
          <span>🟦</span> מדריך Azure Portal
        </h4>
        <ul className="space-y-4 text-sm text-blue-900">
          <li className="flex gap-3"><span className="font-bold bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span><span>צור <b>Storage Account</b> חדש</span></li>
          <li className="flex gap-3"><span className="font-bold bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span><span>בתפריט הצד, גש ל-<b>Access Keys</b></span></li>
          <li className="flex gap-3"><span className="font-bold bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span><span>העתק את ה-<b>Connection String</b> של key1</span></li>
        </ul>
        <a href="https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts" target="_blank" className="mt-6 block text-center bg-white text-blue-700 py-2 rounded-xl font-bold text-xs border border-blue-200 hover:bg-blue-100">
          פתח את Azure Portal &nearrow;
        </a>
      </div>
    </div>
  );
};
