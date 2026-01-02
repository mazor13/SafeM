// ===========================================
// AEGIS - Filled Form Page
// Phase 2: דף מילוי טופס
// ===========================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Save,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  History,
  X,
  Download,
} from 'lucide-react';
import { useFilledForm, FilledForm } from '../../../hooks/useFilledForm';
import { FieldRenderer } from '../../../components/FieldRenderers';
import { TEMPLATE_TYPES, SAFETY_CATEGORIES } from '../../../types/template-types';
import { exportFormToPDF } from '../../../hooks/pdfExport';

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function FilledFormPage() {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const templateId = searchParams.get('templateId');
  const clientId = searchParams.get('clientId');

  // TODO: Get from auth context
  const tenantId = 'system';
  const userId = 'current-user';

  const {
    form,
    template,
    loading,
    error,
    saving,
    data,
    errors,
    progress,
    setValue,
    validate,
    saveDraft,
    submit,
    loadPrefillData,
    getPreviousForm,
    hasUnsavedChanges,
  } = useFilledForm({
    formId,
    templateId: templateId || undefined,
    clientId: clientId || undefined,
    tenantId,
    userId,
    autoSave: true,
    autoSaveInterval: 30000,
  });

  // Local state
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showPrefillModal, setShowPrefillModal] = useState(false);
  const [previousForm, setPreviousForm] = useState<FilledForm | null>(null);
  const [loadingPrefill, setLoadingPrefill] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load previous form for prefill option
  useEffect(() => {
    if (template && clientId && form?.status === 'draft') {
      getPreviousForm().then(prev => {
        if (prev) {
          setPreviousForm(prev);
          // Show prefill modal if this is a new form
          if (!formId && template.settings?.prefillSettings?.enabled) {
            setShowPrefillModal(true);
          }
        }
      });
    }
  }, [template, clientId, form?.status]);

  // Toggle section collapse
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Handle prefill
  const handlePrefill = async () => {
    if (!previousForm) return;
    
    setLoadingPrefill(true);
    try {
      await loadPrefillData(previousForm.id);
      setShowPrefillModal(false);
    } catch (err) {
      console.error('Error loading prefill:', err);
      alert('שגיאה בטעינת נתונים קודמים');
    } finally {
      setLoadingPrefill(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      await saveDraft();
    } catch (err) {
      alert('שגיאה בשמירה');
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validate()) {
      // Scroll to first error
      const firstError = errors[0];
      if (firstError) {
        const element = document.getElementById(`field-${firstError.fieldId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!confirm('האם אתה בטוח שברצונך להגיש את הטופס?')) {
      return;
    }

    try {
      await submit();
      setSubmitSuccess(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'שגיאה בהגשה');
    }
  };

  // Handle PDF export
  const handleExport = async () => {
    if (!form || !template) return;
    
    try {
      await exportFormToPDF({
        form: { ...form, data },
        template,
        includeEmptyFields: false,
        includeLogo: true,
        includeFooter: true,
      });
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('שגיאה בייצוא PDF');
    }
  };

  // Get field error
  const getFieldError = (fieldId: string) => {
    return errors.find(e => e.fieldId === fieldId)?.message;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">טוען טופס...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-rose-400" size={48} />
          <h2 className="text-xl font-bold text-rose-400 mb-2">שגיאה</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700"
          >
            חזרה
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">הטופס הוגש בהצלחה!</h2>
          <p className="text-slate-400 mb-8">
            הטופס נשמר במערכת ונשלח לאישור.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/admin/forms')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold"
            >
              לרשימת הטפסים
            </button>
            <button
              onClick={() => {
                setSubmitSuccess(false);
                navigate(`/admin/forms/new?templateId=${template?.id}&clientId=${clientId}`);
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold"
            >
              טופס חדש
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!template || !form) {
    return null;
  }

  const typeInfo = TEMPLATE_TYPES.find(t => t.value === template.type);
  const categoryInfo = SAFETY_CATEGORIES.find(c => c.value === template.category);
  const isReadOnly = form.status === 'submitted' || form.status === 'approved';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-white/5 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Left - Back & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (hasUnsavedChanges && !confirm('יש שינויים שלא נשמרו. לצאת בכל זאת?')) {
                  return;
                }
                navigate(-1);
              }}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <ArrowRight size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">{typeInfo?.icon}</span>
              <div>
                <h1 className="font-bold text-sm sm:text-base">{template.nameHe || template.name}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{categoryInfo?.labelHe}</span>
                  {clientId && <span>• לקוח: {clientId}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Status & Actions */}
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <StatusBadge status={form.status} />

            {/* Auto-save indicator */}
            {saving && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <RefreshCw size={12} className="animate-spin" />
                שומר...
              </div>
            )}

            {/* Unsaved indicator */}
            {hasUnsavedChanges && !saving && (
              <div className="w-2 h-2 bg-amber-500 rounded-full" title="יש שינויים שלא נשמרו" />
            )}

            {!isReadOnly && (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 border border-white/10 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span className="hidden sm:inline">שמור</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                >
                  <Send size={16} />
                  הגש
                </button>
              </>
            )}

            {/* PDF Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
              title="ייצוא ל-PDF"
            >
              <Download size={16} />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {template.settings?.showProgressBar && !isReadOnly && (
        <div className="bg-slate-900/50 border-b border-white/5">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>התקדמות</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Errors Summary */}
      {errors.length > 0 && (
        <div className="bg-rose-500/10 border-b border-rose-500/20">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-rose-400 text-sm">
              <AlertCircle size={16} />
              <span>יש {errors.length} שגיאות שיש לתקן לפני הגשה</span>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Prefill Banner */}
        {previousForm && template.settings?.prefillSettings?.showPreviousValues && !isReadOnly && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History size={20} className="text-indigo-400" />
              <div>
                <p className="text-sm font-bold text-indigo-400">יש נתונים מביקורת קודמת</p>
                <p className="text-xs text-slate-400">
                  מתאריך {previousForm.submittedAt?.toDate?.()?.toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPrefillModal(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold"
            >
              טען נתונים
            </button>
          </div>
        )}

        {/* Sections */}
        {template.sections.map((section, sectionIndex) => {
          const isCollapsed = collapsedSections.has(section.id);
          const sectionErrors = errors.filter(e => 
            section.fields.some(f => f.id === e.fieldId)
          );

          return (
            <div
              key={section.id}
              className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden"
            >
              {/* Section Header */}
              <div
                onClick={() => section.settings?.collapsible && toggleSection(section.id)}
                className={`px-6 py-4 bg-slate-800/30 border-b border-white/5 flex items-center justify-between ${
                  section.settings?.collapsible ? 'cursor-pointer hover:bg-slate-800/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {template.settings?.showSectionNumbers && (
                    <span className="w-7 h-7 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-sm font-bold">
                      {sectionIndex + 1}
                    </span>
                  )}
                  {section.icon && <span className="text-xl">{section.icon}</span>}
                  <div>
                    <h3 className="font-bold">{section.titleHe || section.title}</h3>
                    {section.description && (
                      <p className="text-sm text-slate-500">{section.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {sectionErrors.length > 0 && (
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs rounded-full">
                      {sectionErrors.length} שגיאות
                    </span>
                  )}
                  {section.settings?.collapsible && (
                    isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />
                  )}
                </div>
              </div>

              {/* Section Fields */}
              {!isCollapsed && (
                <div className="p-6">
                  {section.fields.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      אין שדות בסקשן זה
                    </div>
                  ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                      {section.fields.map((field) => {
                        // Determine field width
                        const widthClass = 
                          field.type === 'header' || field.type === 'divider' || field.type === 'paragraph' 
                            || field.type === 'textarea' || field.type === 'signature' || field.type === 'table'
                            ? 'col-span-full' 
                            : field.display?.width === 'full' ? 'col-span-full'
                            : field.display?.width === 'half' ? 'col-span-1'
                            : 'col-span-full';

                        return (
                          <div 
                            key={field.id} 
                            id={`field-${field.id}`}
                            className={widthClass}
                          >
                            <FieldRenderer
                              field={field}
                              value={data[field.id]}
                              onChange={(value) => setValue(field.id, value)}
                              mode={isReadOnly ? 'readonly' : 'edit'}
                              error={getFieldError(field.id)}
                              disabled={isReadOnly}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {template.sections.length === 0 && (
          <div className="bg-slate-900 rounded-2xl border border-white/5 p-12 text-center">
            <FileText size={48} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-400 mb-2">תבנית ריקה</h3>
            <p className="text-slate-500 text-sm">
              התבנית לא מכילה שדות למילוי
            </p>
          </div>
        )}

        {/* Notes Field */}
        {!isReadOnly && template.sections.length > 0 && (
          <div className="bg-slate-900 rounded-2xl border border-white/5 p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileText size={18} />
              הערות נוספות
            </h3>
            <textarea
              value={data['formNotes'] || ''}
              onChange={(e) => setValue('formNotes', e.target.value)}
              placeholder="הוסף הערות או הסברים..."
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        )}

        {/* Bottom Actions */}
        {!isReadOnly && template.sections.length > 0 && (
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold border border-white/10 disabled:opacity-50"
            >
              <Save size={18} />
              שמור כטיוטה
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || progress < 100}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              <Send size={18} />
              הגש טופס
            </button>
          </div>
        )}

        {/* Form Info */}
        <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-white/5 text-xs text-slate-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="block text-slate-600">מזהה טופס</span>
              <span className="font-mono">{form.id.slice(-8)}</span>
            </div>
            <div>
              <span className="block text-slate-600">גרסת תבנית</span>
              <span>v{form.templateVersion}</span>
            </div>
            <div>
              <span className="block text-slate-600">נוצר</span>
              <span>{form.createdAt?.toDate?.()?.toLocaleDateString('he-IL')}</span>
            </div>
            <div>
              <span className="block text-slate-600">עודכן</span>
              <span>{form.updatedAt?.toDate?.()?.toLocaleDateString('he-IL')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prefill Modal */}
      {showPrefillModal && previousForm && (
        <PrefillModal
          previousForm={previousForm}
          onConfirm={handlePrefill}
          onSkip={() => setShowPrefillModal(false)}
          onClose={() => setShowPrefillModal(false)}
          loading={loadingPrefill}
        />
      )}
    </div>
  );
}

// ===========================================
// STATUS BADGE
// ===========================================

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'טיוטה' },
    submitted: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'הוגש' },
    approved: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'אושר' },
    rejected: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'נדחה' },
  };

  const style = styles[status] || styles.draft;

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

// ===========================================
// PREFILL MODAL
// ===========================================

interface PrefillModalProps {
  previousForm: FilledForm;
  onConfirm: () => void;
  onSkip: () => void;
  onClose: () => void;
  loading: boolean;
}

function PrefillModal({ previousForm, onConfirm, onSkip, onClose, loading }: PrefillModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <History size={20} className="text-indigo-400" />
            טעינת נתונים קודמים
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          נמצא טופס קודם מתאריך{' '}
          <strong className="text-white">
            {previousForm.submittedAt?.toDate?.()?.toLocaleDateString('he-IL')}
          </strong>
          . האם לטעון את הנתונים מהטופס הקודם?
        </p>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <p className="text-xs text-slate-500 mb-2">מה ייטען:</p>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• שדות שהוגדרו כ"העתק תמיד"</li>
            <li>• שדות שהוגדרו כ"אופציונלי"</li>
          </ul>
          <p className="text-xs text-slate-500 mt-3">מה לא ייטען:</p>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• שדות שהוגדרו כ"לא להעתיק"</li>
            <li>• חתימות ותאריכים</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onSkip}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800"
          >
            התחל מאפס
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                טוען...
              </>
            ) : (
              <>
                <History size={16} />
                טען נתונים
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}