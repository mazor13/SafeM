import React, { useState } from 'react';
import { 
  GlobeAltIcon, 
  UserGroupIcon, 
  CpuChipIcon, 
  ShieldCheckIcon,
  CheckCircleIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  // נתוני דמו (בשלב הבא נחבר אותם לדאטה-בייס האמיתי של הגדרות המערכת)
  const [config, setConfig] = useState({
    systemName: 'AEGIS Safety Platform',
    supportEmail: 'support@aegis-app.com',
    maintenanceMode: false,
    aiModel: 'gpt-4-turbo',
    aiMaxTokens: 2000,
    aiEnabled: true,
  });

  const [admins] = useState([
    { id: 1, name: 'ישראל ישראלי', role: 'Super Admin', email: 'admin@aegis.com', status: 'Active' },
    { id: 2, name: 'דנה רון', role: 'Support Agent', email: 'dana@aegis.com', status: 'Active' },
  ]);

  const [logs] = useState([
    { id: 1, action: 'מחיקת לקוח', user: 'ישראל ישראלי', target: 'מפעל נשר', date: '24/10/2025 10:00' },
    { id: 2, action: 'שינוי מחירון', user: 'מערכת', target: 'מודול לייזר', date: '24/10/2025 09:30' },
    { id: 3, action: 'כניסה למערכת', user: 'דנה רון', target: '-', date: '24/10/2025 08:00' },
  ]);

  const handleSave = () => {
    setLoading(true);
    // כאן נבצע שמירה ל-Firebase בעתיד
    setTimeout(() => {
      setLoading(false);
      alert('ההגדרות נשמרו בהצלחה');
    }, 1000);
  };

  const tabs = [
    { id: 'general', name: 'כללי', icon: GlobeAltIcon },
    { id: 'team', name: 'צוות ניהול', icon: UserGroupIcon },
    { id: 'ai', name: 'הגדרות AI', icon: CpuChipIcon },
    { id: 'logs', name: 'לוגים ואבטחה', icon: ShieldCheckIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            הגדרות מערכת (System Config)
          </h2>
          <p className="mt-1 text-sm text-gray-500">שליטה גלובלית על התנהגות הפלטפורמה, צוותים ואינטגרציות.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden min-h-[600px] flex">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center w-full px-4 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-600 border-r-2 border-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <tab.icon className={`ml-3 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">פרטי פלטפורמה</h3>
                <p className="mt-1 text-sm text-gray-500">פרטים אלו יוצגו במיילים ובהודעות ללקוחות.</p>
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">שם המערכת</label>
                  <input type="text" value={config.systemName} onChange={e => setConfig({...config, systemName: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">אימייל לתמיכה טכנית</label>
                  <input type="email" value={config.supportEmail} onChange={e => setConfig({...config, supportEmail: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                
                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        checked={config.maintenanceMode}
                        onChange={e => setConfig({...config, maintenanceMode: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="mr-3 text-sm">
                      <label className="font-medium text-gray-700">מצב תחזוקה (Maintenance Mode)</label>
                      <p className="text-gray-500">כאשר מסומן, לקוחות לא יוכלו להתחבר למערכת (רק אדמינים).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEAM */}
          {activeTab === 'team' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">צוות ניהול (Internal)</h3>
                  <p className="mt-1 text-sm text-gray-500">עובדי החברה שיש להם גישה לממשק הניהול.</p>
                </div>
                <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700">+ הוסף איש צוות</button>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תפקיד</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name} <br/><span className="text-gray-500 font-normal">{admin.email}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {admin.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: AI CONFIG */}
          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-2xl">
               <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                   <CpuChipIcon className="h-5 w-5 ml-2 text-indigo-600"/> מוח הבינה המלאכותית
                </h3>
                <p className="mt-1 text-sm text-gray-500">הגדרות המנוע המפעיל את הצ'אט והתובנות.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input type="password" value="sk-xxxxxxxxxxxxxxxxxxxxxxxx" disabled className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-gray-100 text-gray-500" />
                  <span className="inline-flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    מפתח סודי
                  </span>
                </div>
                <p className="mt-1 text-xs text-red-500">* המפתח שמור בצורה מאובטחת בשרת (Cloud Functions).</p>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700">מודל ברירת מחדל</label>
                 <select value={config.aiModel} onChange={e => setConfig({...config, aiModel: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                   <option value="gpt-4-turbo">GPT-4 Turbo (מומלץ - חכם ויקר)</option>
                   <option value="gpt-3.5-turbo">GPT-3.5 Turbo (מהיר וזול)</option>
                 </select>
              </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">הגבלת טוקנים לתשובה (Max Tokens)</label>
                 <input type="number" value={config.aiMaxTokens} onChange={e => setConfig({...config, aiMaxTokens: Number(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"/>
              </div>
            </div>
          )}

          {/* TAB 4: LOGS */}
          {activeTab === 'logs' && (
             <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">יומן אירועים (Audit Logs)</h3>
                <p className="mt-1 text-sm text-gray-500">תיעוד פעולות קריטיות במערכת.</p>
              </div>
              <div className="flow-root">
                <ul role="list" className="-mb-8">
                  {logs.map((log, eventIdx) => (
                    <li key={log.id}>
                      <div className="relative pb-8">
                        {eventIdx !== logs.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                              <ServerIcon className="h-5 w-5 text-white" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5 mr-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{log.user}</span> ביצע <span className="font-medium text-gray-900">{log.action}</span> ב-{log.target}
                              </p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              <time>{log.date}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="flex justify-end pt-5">
         <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            בטל שינויים
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
          >
            {loading ? 'שומר...' : 'שמור הגדרות מערכת'}
          </button>
      </div>
    </div>
  );
}
