// ===========================================
// AEGIS - EscalationTab Component
// הגדרות אסקלציה ללקוח
// ===========================================

import React, { useState, useEffect } from 'react';
import { 
  Clock, Bell, Mail, MessageCircle, Smartphone,
  AlertTriangle, Save, RotateCcw, ChevronDown, ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { useClient } from '../../hooks/useClients';
import { 
  EscalationSettings, 
  EscalationTiming,
  DEFAULT_ESCALATION_SETTINGS,
  FindingSeverity,
  FINDING_SEVERITIES
} from '../../types/safety';

// ===========================================
// TYPES
// ===========================================

interface EscalationTabProps {
  clientId: string;
  clientName: string;
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function hoursToDisplay(hours: number): { value: number; unit: 'hours' | 'days' } {
  if (hours < 24) {
    return { value: hours, unit: 'hours' };
  }
  return { value: Math.round(hours / 24), unit: 'days' };
}

function displayToHours(value: number, unit: 'hours' | 'days'): number {
  return unit === 'days' ? value * 24 : value;
}

function formatTime(hours: number): string {
  if (hours < 24) return `${hours} שעות`;
  const days = Math.round(hours / 24);
  return `${days} ${days === 1 ? 'יום' : 'ימים'}`;
}

// ===========================================
// SEVERITY STYLES
// ===========================================

const SEVERITY_STYLES: Record<FindingSeverity, { bg: string; border: string; text: string; glow: string }> = {
  critical: { 
    bg: 'bg-rose-500/10', 
    border: 'border-rose-500/30', 
    text: 'text-rose-400',
    glow: 'shadow-rose-500/20'
  },
  high: { 
    bg: 'bg-orange-500/10', 
    border: 'border-orange-500/30', 
    text: 'text-orange-400',
    glow: 'shadow-orange-500/20'
  },
  medium: { 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-500/30', 
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20'
  },
  low: { 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/30', 
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20'
  }
};

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function EscalationTab({ clientId, clientName }: EscalationTabProps) {
  const { client, loading, updateEscalationSettings } = useClient(clientId);
  
  const [settings, setSettings] = useState<EscalationSettings>(DEFAULT_ESCALATION_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedSeverity, setExpandedSeverity] = useState<FindingSeverity | null>('critical');

  // Load settings from client
  useEffect(() => {
    if (client?.escalationSettings) {
      setSettings(client.escalationSettings);
    }
  }, [client]);

  // Track changes
  useEffect(() => {
    if (client?.escalationSettings) {
      const changed = JSON.stringify(settings) !== JSON.stringify(client.escalationSettings);
      setHasChanges(changed);
    }
  }, [settings, client]);

  // Update timing for a severity
  const updateTiming = (severity: FindingSeverity, timing: Partial<EscalationTiming>) => {
    setSettings(prev => ({
      ...prev,
      [severity]: { ...prev[severity], ...timing }
    }));
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateEscalationSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving escalation settings:', err);
      alert('שגיאה בשמירת הגדרות');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (window.confirm('לאפס להגדרות ברירת מחדל?')) {
      setSettings(DEFAULT_ESCALATION_SETTINGS);
    }
  };

  // Reset to saved
  const handleRevert = () => {
    if (client?.escalationSettings) {
      setSettings(client.escalationSettings);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-500 italic">טוען הגדרות...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="text-indigo-400" size={20} />
            הגדרות אסקלציה
          </h3>
          <p className="text-xs text-slate-500">הגדר זמני תגובה והתראות לכל רמת חומרה</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleRevert}
              className="px-3 py-2 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 transition-colors"
            >
              בטל שינויים
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors"
            title="אפס לברירת מחדל"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              hasChanges 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-400" />
                נשמר!
              </>
            ) : isSaving ? (
              'שומר...'
            ) : (
              <>
                <Save size={16} />
                שמור
              </>
            )}
          </button>
        </div>
      </div>

      {/* Severity Settings */}
      <div className="space-y-3">
        {FINDING_SEVERITIES.map(severity => {
          const style = SEVERITY_STYLES[severity.value];
          const timing = settings[severity.value];
          const isExpanded = expandedSeverity === severity.value;

          return (
            <div 
              key={severity.value}
              className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden transition-all`}
            >
              {/* Severity Header */}
              <button
                onClick={() => setExpandedSeverity(isExpanded ? null : severity.value)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{severity.emoji}</span>
                  <div className="text-right">
                    <h4 className={`font-bold ${style.text}`}>{severity.labelHe}</h4>
                    <p className="text-xs text-slate-500">
                      זמן כולל: {formatTime(timing.totalTimeHours)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Quick preview */}
                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                    <span>התראה: {formatTime(timing.firstReminderHours)}</span>
                    <span>→</span>
                    <span>רמה 2: {formatTime(timing.escalateLevel2Hours)}</span>
                    <span>→</span>
                    <span>רמה 3: {formatTime(timing.escalateLevel3Hours)}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 pt-0 space-y-4">
                  {/* Timing Inputs */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <TimingInput
                      label="זמן כולל לטיפול"
                      hours={timing.totalTimeHours}
                      onChange={(hours) => updateTiming(severity.value, { totalTimeHours: hours })}
                    />
                    <TimingInput
                      label="תזכורת ראשונה"
                      hours={timing.firstReminderHours}
                      onChange={(hours) => updateTiming(severity.value, { firstReminderHours: hours })}
                    />
                    <TimingInput
                      label="אסקלציה לרמה 2"
                      hours={timing.escalateLevel2Hours}
                      onChange={(hours) => updateTiming(severity.value, { escalateLevel2Hours: hours })}
                    />
                    <TimingInput
                      label="אסקלציה לרמה 3"
                      hours={timing.escalateLevel3Hours}
                      onChange={(hours) => updateTiming(severity.value, { escalateLevel3Hours: hours })}
                    />
                  </div>

                  {/* Visual Timeline */}
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-3">ציר זמן:</div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      <div className="flex-shrink-0 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                        📧 התראה
                        <div className="text-[10px] text-blue-400/70">{formatTime(timing.firstReminderHours)}</div>
                      </div>
                      <div className="flex-1 min-w-[20px] h-0.5 bg-slate-700"></div>
                      <div className="flex-shrink-0 bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                        🔺 רמה 2
                        <div className="text-[10px] text-amber-400/70">{formatTime(timing.escalateLevel2Hours)}</div>
                      </div>
                      <div className="flex-1 min-w-[20px] h-0.5 bg-slate-700"></div>
                      <div className="flex-shrink-0 bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                        🔺🔺 רמה 3
                        <div className="text-[10px] text-orange-400/70">{formatTime(timing.escalateLevel3Hours)}</div>
                      </div>
                      <div className="flex-1 min-w-[20px] h-0.5 bg-slate-700"></div>
                      <div className="flex-shrink-0 bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                        🚨 באיחור
                        <div className="text-[10px] text-rose-400/70">{formatTime(timing.totalTimeHours)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* General Settings */}
      <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-6 space-y-6">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Bell size={18} className="text-indigo-400" />
          הגדרות התראות כלליות
        </h4>

        {/* Notification Toggles */}
        <div className="grid sm:grid-cols-2 gap-4">
          <ToggleSetting
            label="התראה על ליקוי חדש"
            description="שלח התראה כשמזוהה ליקוי חדש"
            enabled={settings.notifyOnNewFinding}
            onChange={(v) => setSettings(prev => ({ ...prev, notifyOnNewFinding: v }))}
          />
          <ToggleSetting
            label="התראה על איחור"
            description="שלח התראה כשליקוי עובר את הדדליין"
            enabled={settings.notifyOnOverdue}
            onChange={(v) => setSettings(prev => ({ ...prev, notifyOnOverdue: v }))}
          />
          <ToggleSetting
            label="תזכורת יומית"
            description="שלח סיכום יומי של ליקויים באיחור"
            enabled={settings.dailyOverdueReminder}
            onChange={(v) => setSettings(prev => ({ ...prev, dailyOverdueReminder: v }))}
          />
          <ToggleSetting
            label="העתק לממונה חיצוני"
            description="שלח העתק לממונה הבטיחות החיצוני (אתה)"
            enabled={settings.notifyExternalOfficer}
            onChange={(v) => setSettings(prev => ({ ...prev, notifyExternalOfficer: v }))}
          />
        </div>

        {/* Channels */}
        <div>
          <div className="text-sm text-slate-400 mb-3">ערוצי התראה:</div>
          <div className="flex gap-3">
            <ChannelButton
              icon={<Mail size={18} />}
              label="אימייל"
              enabled={settings.channels.email}
              onChange={(v) => setSettings(prev => ({ 
                ...prev, 
                channels: { ...prev.channels, email: v } 
              }))}
            />
            <ChannelButton
              icon={<MessageCircle size={18} />}
              label="וואטסאפ"
              enabled={settings.channels.whatsapp}
              onChange={(v) => setSettings(prev => ({ 
                ...prev, 
                channels: { ...prev.channels, whatsapp: v } 
              }))}
            />
            <ChannelButton
              icon={<Smartphone size={18} />}
              label="SMS"
              enabled={settings.channels.sms}
              onChange={(v) => setSettings(prev => ({ 
                ...prev, 
                channels: { ...prev.channels, sms: v } 
              }))}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            SMS מומלץ רק לליקויים קריטיים בשל עלות
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex gap-3">
        <AlertTriangle size={20} className="text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <strong className="text-indigo-400">איך זה עובד?</strong>
          <p className="text-slate-400 mt-1">
            כשמזוהה ליקוי, המערכת שולחת התראה לאנשי קשר ברמה 1.
            אם לא טופל בזמן - עולה לרמה 2, ואז לרמה 3.
            ההגדרות כאן קובעות את הזמנים לכל רמת חומרה.
          </p>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

interface TimingInputProps {
  label: string;
  hours: number;
  onChange: (hours: number) => void;
}

function TimingInput({ label, hours, onChange }: TimingInputProps) {
  const display = hoursToDisplay(hours);
  const [value, setValue] = useState(display.value);
  const [unit, setUnit] = useState(display.unit);

  useEffect(() => {
    onChange(displayToHours(value, unit));
  }, [value, unit]);

  return (
    <div>
      <label className="text-xs text-slate-400 block mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value) || 1)}
          className="w-20 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as 'hours' | 'days')}
          className="bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="hours">שעות</option>
          <option value="days">ימים</option>
        </select>
      </div>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSetting({ label, description, enabled, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-white/5">
      <div>
        <div className="font-bold text-slate-200 text-sm">{label}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-7 rounded-full transition-colors relative ${
          enabled ? 'bg-indigo-600' : 'bg-slate-700'
        }`}
      >
        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
          enabled ? 'right-1' : 'right-6'
        }`} />
      </button>
    </div>
  );
}

interface ChannelButtonProps {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ChannelButton({ icon, label, enabled, onChange }: ChannelButtonProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
        enabled
          ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400'
          : 'bg-slate-800 border-white/5 text-slate-500 hover:bg-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}