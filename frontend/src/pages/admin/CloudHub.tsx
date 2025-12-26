import React, { useState } from 'react';
import { AWSConfig } from '../../components/admin/storage-providers/AWSConfig';
import { AzureConfig } from '../../components/admin/storage-providers/AzureConfig';
import { GoogleConfig } from '../../components/admin/storage-providers/GoogleConfig';
import { LocalConfig } from '../../components/admin/storage-providers/LocalConfig';
import { OfficeCloudConfig } from '../../components/admin/storage-providers/OfficeCloudConfig';
import { InfraLogViewer } from '../../components/admin/InfraLogViewer';

export default function CloudHub() {
  const [activeTab, setActiveTab] = useState('aws');
  const tenantId = "test-tenant-123"; 

  // ניהול מצב שגיאה גלובלי להצגה למשתמש
  const [lastError, setLastError] = useState<string | null>(null);

  return (
    <div className="p-8 text-right bg-slate-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* אזור התראה חכם ללקוח/IT */}
        {lastError && (
          <div className="fixed bottom-8 left-8 z-50 bg-rose-900 text-white p-6 rounded-2xl shadow-2xl max-w-md animate-bounce-in border border-rose-700">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg">⚠️ שגיאת התחברות</h4>
              <button onClick={() => setLastError(null)} className="text-rose-300 hover:text-white">✕</button>
            </div>
            <p className="text-sm text-rose-100 mb-4">המערכת לא הצליחה ליצור קשר עם ספק האחסון.</p>
            <div className="bg-black/20 p-3 rounded-lg flex justify-between items-center">
              <span className="text-xs">מזהה אירוע לתמיכה:</span>
              <span className="font-mono font-bold text-xl text-yellow-400 select-all">{lastError}</span>
            </div>
            <p className="text-[10px] mt-2 text-rose-300 text-center">מסור קוד זה לנציג התמיכה לטיפול מהיר</p>
          </div>
        )}

        <header className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">
            Universal <span className="text-indigo-600">Hub</span>
          </h2>
          <p className="text-slate-500 mt-2">ניהול מרכזי לכל נכסי האחסון של הארגון</p>
        </header>
        
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 px-2">תשתיות Enterprise</h3>
            <div className="flex flex-wrap gap-3 bg-white p-3 rounded-2xl w-fit border shadow-sm">
              <button onClick={() => setActiveTab('aws')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'aws' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>AWS S3</button>
              <button onClick={() => setActiveTab('azure')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'azure' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Azure Blob</button>
              <button onClick={() => setActiveTab('gcp')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'gcp' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Google Cloud</button>
              <button onClick={() => setActiveTab('local')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'local' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Local Server</button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 px-2">אינטגרציות משרדיות</h3>
            <div className="flex flex-wrap gap-3 bg-white p-3 rounded-2xl w-fit border shadow-sm">
              <button onClick={() => setActiveTab('onedrive')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'onedrive' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:bg-sky-50'}`}>OneDrive / SharePoint</button>
              <button onClick={() => setActiveTab('gdrive')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'gdrive' ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-green-50'}`}>Google Drive</button>
              <button onClick={() => setActiveTab('dropbox')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'dropbox' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-blue-50'}`}>Dropbox</button>
            </div>
          </div>
        </div>

        {/* אזור התוכן הראשי */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 min-h-[500px] mb-8">
          {/* אנו מעבירים פונקציה שמקפיצה את ה-Pop-up במידה ויש שגיאה */}
          {activeTab === 'aws' && <AWSConfig tenantId={tenantId} onError={(id: string) => setLastError(id)} />}
          {activeTab === 'azure' && <AzureConfig tenantId={tenantId} />}
          {activeTab === 'gcp' && <GoogleConfig tenantId={tenantId} />}
          {activeTab === 'local' && <LocalConfig tenantId={tenantId} />}
          
          {(activeTab === 'gdrive' || activeTab === 'dropbox' || activeTab === 'onedrive') && (
            <OfficeCloudConfig tenantId={tenantId} provider={activeTab as any} />
          )}
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
            <span>📟</span> יומן אירועי מערכת (System Logs)
          </h3>
          <p className="text-slate-500 text-sm mb-4">השתמש במזהה האירוע (Event ID) כדי לאתר תקלות שדווחו על ידי לקוחות.</p>
          <InfraLogViewer />
        </div>

      </div>
    </div>
  );
}
