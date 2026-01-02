// ===========================================
// AEGIS - AI PDF Import Page
// ממשק ייבוא PDF עם AI
// ===========================================

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus,
  Eye,
  Save,
  Loader2,
  Zap,
  Shield,
  Bell,
} from 'lucide-react';
import {
  importPDFAsTemplate,
  PDFAnalysisResult,
  ImportProgress,
  AlertRule,
} from '../../../hooks/aiPdfImport';
import { SAFETY_CATEGORIES, TEMPLATE_TYPES } from '../../../types/template-types';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore as db } from '../../../firebase';

// ===========================================
// SEVERITY CONFIG
// ===========================================

const SEVERITY_CONFIG = {
  low: { label: 'נמוך', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '💡' },
  medium: { label: 'בינוני', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: '⚠️' },
  high: { label: 'גבוה', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: '🔶' },
  critical: { label: 'קריטי', color: 'text-rose-400', bg: 'bg-rose-500/20', icon: '🔴' },
};

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function AIPdfImportPage() {
  const navigate = useNavigate();
  
  // State
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('anthropic_api_key') || '');
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [result, setResult] = useState<PDFAnalysisResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showAlerts, setShowAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
      setResult(null);
    }
  }, []);

  // Handle file select
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  }, []);

  // Save API key
  const saveApiKey = useCallback(() => {
    localStorage.setItem('anthropic_api_key', apiKey);
  }, [apiKey]);

  // Start import
  const handleImport = useCallback(async () => {
    if (!file || !apiKey) return;

    saveApiKey();
    setResult(null);

    const analysisResult = await importPDFAsTemplate(file, apiKey, setProgress);
    setResult(analysisResult);
    
    if (analysisResult.success) {
      setTemplateName(analysisResult.templateNameHe || analysisResult.templateName);
      // Expand all sections by default
      setExpandedSections(new Set(analysisResult.sections.map(s => s.id)));
    }
  }, [file, apiKey, saveApiKey]);

  // Toggle section
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Save template
  const handleSave = useCallback(async () => {
    if (!result?.success) return;

    setSaving(true);
    try {
      const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const template = {
        id: templateId,
        name: result.templateName || 'Imported Template',
        nameHe: templateName || result.templateNameHe,
        description: result.description,
        descriptionHe: result.description,
        type: 'inspection' as const,
        category: result.category || 'general',
        status: 'draft' as const,
        version: 1,
        tenantId: 'system',
        sections: result.sections,
        settings: {
          showProgressBar: true,
          showSectionNumbers: true,
          allowSaveDraft: true,
          requireSignature: false,
          alertRules: result.alerts,
        },
        tags: ['AI Import'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: 'current-user',
      };

      await setDoc(doc(db, 'templates', templateId), template);
      
      // Navigate to edit the template
      navigate(`/admin/templates/${templateId}/edit`);
    } catch (err) {
      console.error('Error saving template:', err);
      alert('שגיאה בשמירת התבנית');
    } finally {
      setSaving(false);
    }
  }, [result, templateName, navigate]);

  // Remove alert
  const removeAlert = (alertId: string) => {
    if (!result) return;
    setResult({
      ...result,
      alerts: result.alerts.filter(a => a.id !== alertId)
    });
  };

  // Update alert severity
  const updateAlertSeverity = (alertId: string, severity: AlertRule['severity']) => {
    if (!result) return;
    setResult({
      ...result,
      alerts: result.alerts.map(a => 
        a.id === alertId ? { ...a, severity } : a
      )
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/templates')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-indigo-400" />
              ייבוא חכם מ-PDF
            </h1>
            <p className="text-slate-500 text-sm">
              העלה טופס בדיקה קיים ו-AI יזהה את המבנה אוטומטית
            </p>
          </div>
        </div>

        {/* API Key Input */}
        {!result?.success && (
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-6 mb-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Shield size={18} className="text-indigo-400" />
              מפתח API של Anthropic
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              נדרש מפתח API לשימוש ב-Claude. המפתח נשמר מקומית בדפדפן שלך.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
            />
            <p className="text-xs text-slate-500 mt-2">
              קבל מפתח מ-{' '}
              <a 
                href="https://console.anthropic.com/settings/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                console.anthropic.com
              </a>
            </p>
          </div>
        )}

        {/* Upload Area */}
        {!result?.success && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`
              bg-slate-900 rounded-2xl border-2 border-dashed p-12 text-center transition-all
              ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20'}
            `}
          >
            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto">
                  <FileText size={32} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">{file.name}</p>
                  <p className="text-sm text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setFile(null)}
                    className="px-4 py-2 bg-slate-800 rounded-xl text-sm hover:bg-slate-700"
                  >
                    בחר קובץ אחר
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!apiKey || progress?.stage === 'analyzing'}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {progress?.stage === 'analyzing' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        מנתח...
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        נתח עם AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Upload size={48} className="mx-auto mb-4 text-slate-600" />
                <p className="text-lg font-bold mb-2">גרור קובץ PDF לכאן</p>
                <p className="text-sm text-slate-500 mb-4">או לחץ לבחירת קובץ</p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-slate-800 rounded-xl text-sm hover:bg-slate-700 cursor-pointer">
                    בחר קובץ
                  </span>
                </label>
              </>
            )}
          </div>
        )}

        {/* Progress */}
        {progress && progress.stage !== 'complete' && progress.stage !== 'error' && (
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 size={20} className="animate-spin text-indigo-400" />
              <span className="font-bold">{progress.message}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {result && !result.success && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 mt-6">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle size={24} />
              <div>
                <p className="font-bold">שגיאה בניתוח</p>
                <p className="text-sm">{result.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result?.success && (
          <div className="space-y-6 mt-6">
            {/* Success Header */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-emerald-400">הניתוח הושלם!</p>
                    <p className="text-sm text-slate-400">
                      רמת ביטחון: {Math.round(result.confidence * 100)}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setProgress(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className="bg-slate-900 rounded-2xl border border-white/10 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FileText size={18} />
                פרטי התבנית
              </h3>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">שם התבנית</label>
                  {editingName ? (
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      onBlur={() => setEditingName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
                      className="w-full bg-slate-800 border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => setEditingName(true)}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <span className="text-lg font-bold">{templateName}</span>
                      <Edit size={14} className="text-slate-500 group-hover:text-white" />
                    </div>
                  )}
                </div>

                {/* Category & Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">קטגוריה</label>
                    <span className="text-sm">
                      {SAFETY_CATEGORIES.find(c => c.value === result.category)?.labelHe || result.category}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">סקשנים</label>
                    <span className="text-sm font-bold">{result.sections.length}</span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">שדות</label>
                    <span className="text-sm font-bold">
                      {result.sections.reduce((acc, s) => acc + s.fields.length, 0)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {result.description && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">תיאור</label>
                    <p className="text-sm text-slate-300">{result.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sections Preview */}
            <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Eye size={18} />
                  תצוגה מקדימה של השדות
                </h3>
                <span className="text-sm text-slate-400">
                  {result.sections.length} סקשנים
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {result.sections.map((section) => (
                  <div key={section.id}>
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{section.icon || '📋'}</span>
                        <div className="text-right">
                          <p className="font-bold">{section.titleHe || section.title}</p>
                          <p className="text-xs text-slate-500">{section.fields.length} שדות</p>
                        </div>
                      </div>
                      {expandedSections.has(section.id) ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>

                    {/* Section Fields */}
                    {expandedSections.has(section.id) && (
                      <div className="px-6 pb-4 space-y-2">
                        {section.fields.map((field) => (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-xs font-mono">
                                {field.type}
                              </span>
                              <span className="text-sm">
                                {field.labelHe || field.label}
                              </span>
                              {field.validation?.required && (
                                <span className="text-rose-400 text-xs">*חובה</span>
                              )}
                            </div>
                            {field.helpText && (
                              <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                {field.helpText}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            {result.alerts.length > 0 && (
              <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setShowAlerts(!showAlerts)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50"
                >
                  <h3 className="font-bold flex items-center gap-2">
                    <Bell size={18} className="text-amber-400" />
                    התראות אוטומטיות
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                      {result.alerts.length}
                    </span>
                  </h3>
                  {showAlerts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {showAlerts && (
                  <div className="px-6 pb-4 space-y-3">
                    {result.alerts.map((alert) => {
                      const severity = SEVERITY_CONFIG[alert.severity];
                      return (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-xl border ${severity.bg} border-white/10`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <span className="text-xl">{severity.icon}</span>
                              <div>
                                <p className={`font-bold ${severity.color}`}>
                                  {alert.fieldLabel}
                                </p>
                                <p className="text-sm text-slate-300 mt-1">
                                  {alert.messageHe || alert.message}
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                  תנאי: {alert.condition.type}
                                  {alert.condition.value !== undefined && ` = ${alert.condition.value}`}
                                  {alert.condition.min !== undefined && ` (min: ${alert.condition.min})`}
                                  {alert.condition.max !== undefined && ` (max: ${alert.condition.max})`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={alert.severity}
                                onChange={(e) => updateAlertSeverity(alert.id, e.target.value as any)}
                                className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-xs"
                              >
                                <option value="low">נמוך</option>
                                <option value="medium">בינוני</option>
                                <option value="high">גבוה</option>
                                <option value="critical">קריטי</option>
                              </select>
                              <button
                                onClick={() => removeAlert(alert.id)}
                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-rose-400"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                  setProgress(null);
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold"
              >
                התחל מחדש
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    שמור תבנית ועבור לעריכה
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}