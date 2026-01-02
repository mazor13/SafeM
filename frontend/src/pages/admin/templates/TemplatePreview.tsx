// ===========================================
// AEGIS - Template Preview Page
// Phase 2: תצוגה מקדימה של תבנית
// ===========================================

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Edit,
  Printer,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useTemplate } from '../../../hooks/useTemplates';
import { FieldRenderer } from '../../../components/FieldRenderers';
import { TEMPLATE_TYPES, SAFETY_CATEGORIES } from '../../../types/template-types';

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function TemplatePreview() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  
  const { template, loading, error } = useTemplate(templateId);
  
  // Preview settings
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showEmpty, setShowEmpty] = useState(true);
  const [mockData, setMockData] = useState<Record<string, any>>({});

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">טוען תבנית...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !template) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-rose-400" size={48} />
          <h2 className="text-xl font-bold text-rose-400 mb-2">שגיאה בטעינת התבנית</h2>
          <p className="text-slate-500 mb-4">{error || 'התבנית לא נמצאה'}</p>
          <button
            onClick={() => navigate('/admin/templates')}
            className="px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700"
          >
            חזרה לרשימה
          </button>
        </div>
      </div>
    );
  }

  const typeInfo = TEMPLATE_TYPES.find(t => t.value === template.type);
  const categoryInfo = SAFETY_CATEGORIES.find(c => c.value === template.category);

  // Get mock value for a field
  const getMockValue = (fieldId: string) => mockData[fieldId];

  // Set mock value for a field (for interactive preview)
  const setMockValue = (fieldId: string, value: any) => {
    setMockData(prev => ({ ...prev, [fieldId]: value }));
  };

  // Count fields
  const totalFields = template.sections.reduce((acc, s) => acc + s.fields.length, 0);
  const requiredFields = template.sections.reduce(
    (acc, s) => acc + s.fields.filter(f => f.validation?.required).length, 
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-white/5 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left - Back & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/templates')}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <ArrowRight size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">{typeInfo?.icon}</span>
              <div>
                <h1 className="font-bold">{template.nameHe || template.name}</h1>
                <p className="text-xs text-slate-500">תצוגה מקדימה</p>
              </div>
            </div>
          </div>

          {/* Center - View Controls */}
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="תצוגת מחשב"
            >
              <Monitor size={18} />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="תצוגת מובייל"
            >
              <Smartphone size={18} />
            </button>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmpty(!showEmpty)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showEmpty ? 'bg-slate-800 text-slate-300' : 'bg-indigo-600/20 text-indigo-400'
              }`}
            >
              {showEmpty ? <Eye size={16} /> : <EyeOff size={16} />}
              {showEmpty ? 'הצג ריקים' : 'הסתר ריקים'}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <Printer size={16} />
              הדפס
            </button>
            <button
              onClick={() => navigate(`/admin/templates/${templateId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500"
            >
              <Edit size={16} />
              עריכה
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-6">
        <div className={`mx-auto transition-all ${
          viewMode === 'mobile' ? 'max-w-md' : 'max-w-3xl'
        }`}>
          {/* Template Header */}
          <div className="bg-slate-900 rounded-2xl border border-white/5 mb-6 overflow-hidden print:border print:border-slate-300">
            {/* Logo */}
            {template.settings?.pdfSettings?.logoUrl && (
              <div className={`p-4 border-b border-white/5 flex ${
                template.settings.pdfSettings.logoPosition === 'center' ? 'justify-center' :
                template.settings.pdfSettings.logoPosition === 'left' ? 'justify-start' : 'justify-end'
              }`}>
                <img 
                  src={template.settings.pdfSettings.logoUrl} 
                  alt="Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
            
            {/* Title */}
            <div className="p-6 text-center border-b border-white/5">
              <h2 className="text-2xl font-bold mb-2">{template.nameHe || template.name}</h2>
              {template.descriptionHe && (
                <p className="text-slate-400">{template.descriptionHe}</p>
              )}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  {categoryInfo?.icon} {categoryInfo?.labelHe}
                </span>
                <span>|</span>
                <span>{template.sections.length} סקשנים</span>
                <span>|</span>
                <span>{totalFields} שדות ({requiredFields} חובה)</span>
              </div>
            </div>

            {/* Progress Bar (if enabled) */}
            {template.settings?.showProgressBar && (
              <div className="px-6 py-3 bg-slate-800/30">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>התקדמות</span>
                  <span>0%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-0 transition-all" />
                </div>
              </div>
            )}
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {template.sections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden print:border print:border-slate-300"
              >
                {/* Section Header */}
                <div className="px-6 py-4 bg-slate-800/30 border-b border-white/5">
                  <h3 className="font-bold flex items-center gap-2">
                    {template.settings?.showSectionNumbers && (
                      <span className="w-7 h-7 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-sm">
                        {sectionIndex + 1}
                      </span>
                    )}
                    {section.icon && <span>{section.icon}</span>}
                    {section.titleHe || section.title}
                  </h3>
                  {section.description && (
                    <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                  )}
                </div>

                {/* Section Fields */}
                <div className="p-6">
                  {section.fields.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-white/10 rounded-xl">
                      אין שדות בסקשן זה
                    </div>
                  ) : (
                    <div className={`grid gap-4 ${
                      viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
                    }`}>
                      {section.fields.map((field) => {
                        // Skip empty fields if showEmpty is false
                        const hasValue = getMockValue(field.id) !== undefined && getMockValue(field.id) !== '';
                        if (!showEmpty && !hasValue && field.type !== 'header' && field.type !== 'divider' && field.type !== 'paragraph') {
                          return null;
                        }

                        // Determine field width
                        const widthClass = 
                          field.type === 'header' || field.type === 'divider' || field.type === 'paragraph' ? 'col-span-full' :
                          field.display?.width === 'full' ? 'col-span-full' :
                          field.display?.width === 'half' ? 'col-span-1' :
                          'col-span-full';

                        return (
                          <div key={field.id} className={widthClass}>
                            <FieldRenderer
                              field={field}
                              value={getMockValue(field.id)}
                              onChange={(value) => setMockValue(field.id, value)}
                              mode="preview"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {template.sections.length === 0 && (
            <div className="bg-slate-900 rounded-2xl border border-white/5 p-12 text-center">
              <FileText size={48} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-bold text-slate-400 mb-2">תבנית ריקה</h3>
              <p className="text-slate-500 text-sm mb-4">
                התבנית לא מכילה סקשנים או שדות
              </p>
              <button
                onClick={() => navigate(`/admin/templates/${templateId}/edit`)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold"
              >
                ערוך תבנית
              </button>
            </div>
          )}

          {/* Footer - Save Draft (if enabled) */}
          {template.settings?.allowSaveAsDraft && template.sections.length > 0 && (
            <div className="mt-6 flex justify-center gap-3 print:hidden">
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold border border-white/10">
                שמור כטיוטה
              </button>
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20">
                שלח טופס
              </button>
            </div>
          )}

          {/* Template Info */}
          <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-white/5 print:hidden">
            <h4 className="font-bold text-sm text-slate-400 mb-2">מידע על התבנית</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">גרסה</span>
                <span className="text-slate-300">v{template.version}</span>
              </div>
              <div>
                <span className="text-slate-500 block">סטטוס</span>
                <span className={template.status === 'published' ? 'text-emerald-400' : 'text-amber-400'}>
                  {template.status === 'published' ? 'פעיל' : template.status === 'draft' ? 'טיוטה' : 'בארכיון'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">נוצר</span>
                <span className="text-slate-300">
                  {template.createdAt?.toDate?.()?.toLocaleDateString('he-IL') || '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">עודכן</span>
                <span className="text-slate-300">
                  {template.updatedAt?.toDate?.()?.toLocaleDateString('he-IL') || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:border { border: 1px solid #e2e8f0 !important; }
        }
      `}</style>
    </div>
  );
}