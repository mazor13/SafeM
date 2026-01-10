// ===========================================
// AEGIS - System Settings Page (Connected to Firebase)
// ===========================================

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Brain, 
  FileText, 
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGlobalConfig } from '../../hooks/useGlobalConfig';
import { useAuditLog, formatAuditTimestamp, formatAuditLogMessage } from '../../hooks/useAuditLog';
import { useSystemStats } from '../../hooks/useSystemStats';

// ===========================================
// TYPES
// ===========================================

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// ===========================================
// COMPONENT
// ===========================================

export default function SystemSettings() {
  const { currentUser } = useAuth();
  const { config, updateConfig, loading: configLoading, saving, error: configError } = useGlobalConfig();
  const { logs, loading: logsLoading } = useAuditLog({ pageSize: 50, realtime: true });
  const { stats, loading: statsLoading } = useSystemStats();
  
  const [activeTab, setActiveTab] = useState('general');
  const [localConfig, setLocalConfig] = useState(config);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync local state with config
  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  const tabs: TabProps[] = [
    { id: 'general', label: 'כללי', icon: <Settings className="w-4 h-4" /> },
    { id: 'stats', label: 'סטטיסטיקות', icon: <Users className="w-4 h-4" /> },
    { id: 'ai', label: 'הגדרות AI', icon: <Brain className="w-4 h-4" /> },
    { id: 'audit', label: 'יומן פעילות', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleSave = async () => {
    if (!localConfig) return;
    
    const result = await updateConfig(localConfig, currentUser?.uid);
    
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleConfigChange = (section: string, field: string, value: any) => {
    if (!localConfig) return;
    
    if (section === 'root') {
      setLocalConfig({ ...localConfig, [field]: value });
    } else {
      setLocalConfig({
        ...localConfig,
        [section]: {
          ...(localConfig as any)[section],
          [field]: value,
        },
      });
    }
  };

  // Loading state
  if (configLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="mr-2 text-gray-600">טוען הגדרות...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">הגדרות מערכת</h1>
          <p className="text-gray-500 text-sm mt-1">ניהול הגדרות גלובליות של הפלטפורמה</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saveSuccess ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'שומר...' : saveSuccess ? 'נשמר!' : 'שמור שינויים'}
        </button>
      </div>

      {/* Error Message */}
      {configError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          {configError}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        {/* General Tab */}
        {activeTab === 'general' && localConfig && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">הגדרות כלליות</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם המערכת
                </label>
                <input
                  type="text"
                  value={localConfig.systemName || ''}
                  onChange={(e) => handleConfigChange('root', 'systemName', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אימייל תמיכה
                </label>
                <input
                  type="email"
                  value={localConfig.supportEmail || ''}
                  onChange={(e) => handleConfigChange('root', 'supportEmail', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  צבע ראשי
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localConfig.branding?.primaryColor || '#4F46E5'}
                    onChange={(e) => handleConfigChange('branding', 'primaryColor', e.target.value)}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localConfig.branding?.primaryColor || '#4F46E5'}
                    onChange={(e) => handleConfigChange('branding', 'primaryColor', e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אזור ברירת מחדל
                </label>
                <select
                  value={localConfig.infrastructure?.defaultRegion || 'me-west1'}
                  onChange={(e) => handleConfigChange('infrastructure', 'defaultRegion', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="me-west1">ישראל (me-west1)</option>
                  <option value="europe-west1">אירופה (europe-west1)</option>
                  <option value="us-central1">ארה"ב (us-central1)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={localConfig.infrastructure?.maintenanceMode || false}
                onChange={(e) => handleConfigChange('infrastructure', 'maintenanceMode', e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded"
              />
              <label htmlFor="maintenanceMode" className="text-amber-800">
                <span className="font-medium">מצב תחזוקה</span>
                <span className="block text-sm text-amber-600">כשמופעל, המשתמשים יראו הודעת תחזוקה</span>
              </label>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">סטטיסטיקות מערכת</h3>
              {statsLoading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-blue-700">{stats.totalTenants}</div>
                <div className="text-blue-600 text-sm mt-1">לקוחות פעילים</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-green-700">{stats.totalUsers}</div>
                <div className="text-green-600 text-sm mt-1">משתמשים</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-purple-700">₪{stats.totalRevenue.toLocaleString()}</div>
                <div className="text-purple-600 text-sm mt-1">הכנסה חודשית</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-emerald-700">{stats.healthScore}%</div>
                <div className="text-emerald-600 text-sm mt-1">בריאות מערכת</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && localConfig && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">הגדרות AI</h3>
            
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <input
                type="checkbox"
                id="aiEnabled"
                checked={localConfig.ai?.enabled ?? true}
                onChange={(e) => handleConfigChange('ai', 'enabled', e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <label htmlFor="aiEnabled" className="text-indigo-800">
                <span className="font-medium">הפעל יכולות AI</span>
                <span className="block text-sm text-indigo-600">סיכומים אוטומטיים, המלצות, ועוד</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ספק AI
                </label>
                <select
                  value={localConfig.ai?.provider || 'anthropic'}
                  onChange={(e) => handleConfigChange('ai', 'provider', e.target.value)}
                  disabled={!localConfig.ai?.enabled}
                  className="w-full border rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="openai">OpenAI (GPT)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מודל
                </label>
                <select
                  value={localConfig.ai?.model || 'claude-3-sonnet'}
                  onChange={(e) => handleConfigChange('ai', 'model', e.target.value)}
                  disabled={!localConfig.ai?.enabled}
                  className="w-full border rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {localConfig.ai?.provider === 'anthropic' ? (
                    <>
                      <option value="claude-3-haiku">Claude 3 Haiku (מהיר)</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet (מאוזן)</option>
                      <option value="claude-3-opus">Claude 3 Opus (מתקדם)</option>
                    </>
                  ) : (
                    <>
                      <option value="gpt-4o-mini">GPT-4o Mini (מהיר)</option>
                      <option value="gpt-4o">GPT-4o (מתקדם)</option>
                    </>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מקסימום טוקנים
                </label>
                <input
                  type="number"
                  value={localConfig.ai?.maxTokens || 2000}
                  onChange={(e) => handleConfigChange('ai', 'maxTokens', parseInt(e.target.value))}
                  disabled={!localConfig.ai?.enabled}
                  min={100}
                  max={8000}
                  className="w-full border rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">יומן פעילות</h3>
              {logsLoading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
            </div>
            
            {logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>אין רשומות יומן</p>
              </div>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="py-3 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">{log.userName}</span>
                        {' - '}
                        {formatAuditLogMessage(log)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatAuditTimestamp(log.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
