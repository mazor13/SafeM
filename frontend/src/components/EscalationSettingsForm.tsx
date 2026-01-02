// ===========================================
// AEGIS - Escalation Settings Form Component
// ===========================================

import React, { useState, useEffect } from 'react';
import {
  EscalationSettings,
  EscalationTiming,
  DEFAULT_ESCALATION_SETTINGS,
  FINDING_SEVERITIES,
  FindingSeverity,
} from '../types/safety';

// ===========================================
// TYPES
// ===========================================

interface EscalationSettingsFormProps {
  settings: EscalationSettings;
  onSave: (settings: EscalationSettings) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface TimingInputProps {
  severity: FindingSeverity;
  timing: EscalationTiming;
  onChange: (timing: EscalationTiming) => void;
  disabled?: boolean;
}

// ===========================================
// HELPER: Convert hours to display format
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

// ===========================================
// SUB-COMPONENT: Timing Input
// ===========================================

function TimingInput({ severity, timing, onChange, disabled }: TimingInputProps) {
  const severityInfo = FINDING_SEVERITIES.find(s => s.value === severity);
  
  const [totalTime, setTotalTime] = useState(hoursToDisplay(timing.totalTimeHours));
  const [firstReminder, setFirstReminder] = useState(hoursToDisplay(timing.firstReminderHours));
  const [level2, setLevel2] = useState(hoursToDisplay(timing.escalateLevel2Hours));
  const [level3, setLevel3] = useState(hoursToDisplay(timing.escalateLevel3Hours));

  // Update parent when values change
  useEffect(() => {
    const newTiming: EscalationTiming = {
      totalTimeHours: displayToHours(totalTime.value, totalTime.unit),
      firstReminderHours: displayToHours(firstReminder.value, firstReminder.unit),
      escalateLevel2Hours: displayToHours(level2.value, level2.unit),
      escalateLevel3Hours: displayToHours(level3.value, level3.unit),
    };
    onChange(newTiming);
  }, [totalTime, firstReminder, level2, level3]);

  return (
    <div className="border rounded-lg p-4 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{severityInfo?.emoji}</span>
        <h4 className="font-bold text-lg">{severityInfo?.labelHe}</h4>
        <span className={`px-2 py-1 rounded text-sm bg-${severityInfo?.color}-100 text-${severityInfo?.color}-800`}>
          {severityInfo?.label}
        </span>
      </div>

      {/* Timing inputs */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Time */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">זמן כולל לטיפול</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={totalTime.value}
              onChange={(e) => setTotalTime({ ...totalTime, value: parseInt(e.target.value) || 1 })}
              disabled={disabled}
              className="w-20 px-3 py-2 border rounded-md"
            />
            <select
              value={totalTime.unit}
              onChange={(e) => setTotalTime({ ...totalTime, unit: e.target.value as 'hours' | 'days' })}
              disabled={disabled}
              className="px-3 py-2 border rounded-md"
            >
              <option value="hours">שעות</option>
              <option value="days">ימים</option>
            </select>
          </div>
        </div>

        {/* First Reminder */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">תזכורת ראשונה אחרי</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={firstReminder.value}
              onChange={(e) => setFirstReminder({ ...firstReminder, value: parseInt(e.target.value) || 1 })}
              disabled={disabled}
              className="w-20 px-3 py-2 border rounded-md"
            />
            <select
              value={firstReminder.unit}
              onChange={(e) => setFirstReminder({ ...firstReminder, unit: e.target.value as 'hours' | 'days' })}
              disabled={disabled}
              className="px-3 py-2 border rounded-md"
            >
              <option value="hours">שעות</option>
              <option value="days">ימים</option>
            </select>
          </div>
        </div>

        {/* Level 2 */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">אסקלציה לרמה 2 אחרי</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={level2.value}
              onChange={(e) => setLevel2({ ...level2, value: parseInt(e.target.value) || 1 })}
              disabled={disabled}
              className="w-20 px-3 py-2 border rounded-md"
            />
            <select
              value={level2.unit}
              onChange={(e) => setLevel2({ ...level2, unit: e.target.value as 'hours' | 'days' })}
              disabled={disabled}
              className="px-3 py-2 border rounded-md"
            >
              <option value="hours">שעות</option>
              <option value="days">ימים</option>
            </select>
          </div>
        </div>

        {/* Level 3 */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">אסקלציה לרמה 3 אחרי</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={level3.value}
              onChange={(e) => setLevel3({ ...level3, value: parseInt(e.target.value) || 1 })}
              disabled={disabled}
              className="w-20 px-3 py-2 border rounded-md"
            />
            <select
              value={level3.unit}
              onChange={(e) => setLevel3({ ...level3, unit: e.target.value as 'hours' | 'days' })}
              disabled={disabled}
              className="px-3 py-2 border rounded-md"
            >
              <option value="hours">שעות</option>
              <option value="days">ימים</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual timeline */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-gray-500 mb-2">ציר זמן:</div>
        <div className="flex items-center text-xs">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            📧 התראה: {firstReminder.value} {firstReminder.unit === 'hours' ? 'שעות' : 'ימים'}
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            🔺 רמה 2: {level2.value} {level2.unit === 'hours' ? 'שעות' : 'ימים'}
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
            🔺🔺 רמה 3: {level3.value} {level3.unit === 'hours' ? 'שעות' : 'ימים'}
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="bg-red-100 text-red-800 px-2 py-1 rounded">
            🚨 OVERDUE: {totalTime.value} {totalTime.unit === 'hours' ? 'שעות' : 'ימים'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export function EscalationSettingsForm({
  settings,
  onSave,
  onCancel,
  isLoading = false,
}: EscalationSettingsFormProps) {
  const [localSettings, setLocalSettings] = useState<EscalationSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  // Handle timing change
  const handleTimingChange = (severity: FindingSeverity, timing: EscalationTiming) => {
    setLocalSettings(prev => ({
      ...prev,
      [severity]: timing,
    }));
    setHasChanges(true);
  };

  // Handle toggle change
  const handleToggle = (key: keyof EscalationSettings, value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  // Handle channel toggle
  const handleChannelToggle = (channel: 'email' | 'whatsapp' | 'sms', value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: value,
      },
    }));
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localSettings);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving escalation settings:', error);
    } finally {
      setSaving(false);
    }
  };

  // Handle reset to defaults
  const handleResetDefaults = () => {
    setLocalSettings(DEFAULT_ESCALATION_SETTINGS);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">הגדרות אסקלציה</h3>
          <p className="text-gray-600 text-sm">הגדר את זמני התגובה והאסקלציה לכל רמת חומרה</p>
        </div>
        <button
          onClick={handleResetDefaults}
          className="text-sm text-blue-600 hover:text-blue-800"
          disabled={saving || isLoading}
        >
          🔄 איפוס לברירת מחדל
        </button>
      </div>

      {/* Severity Timings */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700">זמנים לפי חומרה</h4>
        
        <TimingInput
          severity="critical"
          timing={localSettings.critical}
          onChange={(timing) => handleTimingChange('critical', timing)}
          disabled={saving || isLoading}
        />
        
        <TimingInput
          severity="high"
          timing={localSettings.high}
          onChange={(timing) => handleTimingChange('high', timing)}
          disabled={saving || isLoading}
        />
        
        <TimingInput
          severity="medium"
          timing={localSettings.medium}
          onChange={(timing) => handleTimingChange('medium', timing)}
          disabled={saving || isLoading}
        />
        
        <TimingInput
          severity="low"
          timing={localSettings.low}
          onChange={(timing) => handleTimingChange('low', timing)}
          disabled={saving || isLoading}
        />
      </div>

      {/* General Settings */}
      <div className="border rounded-lg p-4 bg-white">
        <h4 className="font-semibold text-gray-700 mb-4">הגדרות כלליות</h4>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.notifyOnNewFinding}
              onChange={(e) => handleToggle('notifyOnNewFinding', e.target.checked)}
              disabled={saving || isLoading}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span>שלח התראה כשנוצר ליקוי חדש</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.notifyOnOverdue}
              onChange={(e) => handleToggle('notifyOnOverdue', e.target.checked)}
              disabled={saving || isLoading}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span>שלח התראה כשליקוי עובר את הזמן</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.dailyOverdueReminder}
              onChange={(e) => handleToggle('dailyOverdueReminder', e.target.checked)}
              disabled={saving || isLoading}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span>שלח תזכורת יומית על ליקויים באיחור</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.notifyExternalOfficer}
              onChange={(e) => handleToggle('notifyExternalOfficer', e.target.checked)}
              disabled={saving || isLoading}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span>שלח העתק לממונה החיצוני (בעל המערכת)</span>
          </label>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="border rounded-lg p-4 bg-white">
        <h4 className="font-semibold text-gray-700 mb-4">ערוצי התראה</h4>
        
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.channels.email}
              onChange={(e) => handleChannelToggle('email', e.target.checked)}
              disabled={saving || isLoading}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span>📧 Email</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.channels.whatsapp}
              onChange={(e) => handleChannelToggle('whatsapp', e.target.checked)}
              disabled={saving || isLoading}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span>💬 WhatsApp</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.channels.sms}
              onChange={(e) => handleChannelToggle('sms', e.target.checked)}
              disabled={saving || isLoading}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span>📱 SMS (קריטי בלבד)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {hasChanges && (
            <span className="text-amber-600 text-sm">⚠️ יש שינויים שלא נשמרו</span>
          )}
        </div>
        
        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={saving || isLoading}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              ביטול
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={saving || isLoading || !hasChanges}
            className={`px-6 py-2 rounded-lg text-white ${
              hasChanges 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? '⏳ שומר...' : '💾 שמור הגדרות'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// QUICK VIEW COMPONENT (Read-only)
// ===========================================

interface EscalationSettingsViewProps {
  settings: EscalationSettings;
}

export function EscalationSettingsView({ settings }: EscalationSettingsViewProps) {
  return (
    <div className="space-y-4">
      {/* Severity Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FINDING_SEVERITIES.map(severity => {
          const timing = settings[severity.value];
          const totalDays = Math.round(timing.totalTimeHours / 24);
          
          return (
            <div 
              key={severity.value}
              className={`p-3 rounded-lg border bg-${severity.color}-50 border-${severity.color}-200`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span>{severity.emoji}</span>
                <span className="font-medium">{severity.labelHe}</span>
              </div>
              <div className="text-2xl font-bold">
                {totalDays < 1 ? `${timing.totalTimeHours} שעות` : `${totalDays} ימים`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Channels */}
      <div className="flex gap-4 text-sm">
        <span className={settings.channels.email ? 'text-green-600' : 'text-gray-400'}>
          {settings.channels.email ? '✓' : '✗'} Email
        </span>
        <span className={settings.channels.whatsapp ? 'text-green-600' : 'text-gray-400'}>
          {settings.channels.whatsapp ? '✓' : '✗'} WhatsApp
        </span>
        <span className={settings.channels.sms ? 'text-green-600' : 'text-gray-400'}>
          {settings.channels.sms ? '✓' : '✗'} SMS
        </span>
      </div>
    </div>
  );
}

export default EscalationSettingsForm;
