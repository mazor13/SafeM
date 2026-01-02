// ===========================================
// AEGIS - Templates List Page (Fixed)
// Phase 2: רשימת תבניות - תיקון תפריט ומחיקה
// ===========================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Eye,
  Archive,
  FileText,
  CheckCircle,
  Clock,
  Library,
  FolderOpen,
  ChevronDown,
  X,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { useTemplates, useSystemTemplates } from '../../../hooks/useTemplates';
import {
  Template,
  TemplateType,
  TemplateStatus,
  SafetyCategory,
  TEMPLATE_TYPES,
  SAFETY_CATEGORIES,
} from '../../../types/template-types';

// ===========================================
// STATUS STYLES
// ===========================================

const STATUS_STYLES: Record<TemplateStatus, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'טיוטה' },
  published: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'פעיל' },
  archived: { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'בארכיון' },
};

// ===========================================
// MAIN COMPONENT
// ===========================================

interface TemplatesListPageProps {
  tenantId: string;
}

export default function TemplatesListPage({ tenantId }: TemplatesListPageProps) {
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TemplateType | ''>('');
  const [filterCategory, setFilterCategory] = useState<SafetyCategory | ''>('');
  const [filterStatus, setFilterStatus] = useState<TemplateStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [duplicateModal, setDuplicateModal] = useState<Template | null>(null);
  const [duplicateName, setDuplicateName] = useState('');

  // Hooks
  const {
    templates,
    loading,
    error,
    createTemplate,
    deleteTemplate,
    duplicateTemplate,
    publishTemplate,
    archiveTemplate,
  } = useTemplates({
    tenantId,
    status: filterStatus || undefined,
    type: filterType || undefined,
    category: filterCategory || undefined,
    includeSystem: false,
  });

  const {
    templates: systemTemplates,
    loading: loadingLibrary,
    copyToTenant,
  } = useSystemTemplates();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenu) {
        setActiveMenu(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  // Filter templates by search
  const filteredTemplates = useMemo(() => {
    if (!searchTerm) return templates;
    const search = searchTerm.toLowerCase();
    return templates.filter(t =>
      t.name.toLowerCase().includes(search) ||
      t.nameHe?.toLowerCase().includes(search) ||
      t.tags?.some(tag => tag.toLowerCase().includes(search))
    );
  }, [templates, searchTerm]);

  // Group by category
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, Template[]> = {};
    filteredTemplates.forEach(t => {
      const cat = t.category || 'general';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });
    return groups;
  }, [filteredTemplates]);

  // Handlers
  const handleCreateNew = async () => {
    try {
      const id = await createTemplate({
        name: 'תבנית חדשה',
        nameHe: 'תבנית חדשה',
        type: 'inspection',
        category: 'general',
        createdBy: 'current-user',
      });
      navigate(`/admin/templates/${id}/edit`);
    } catch (err) {
      console.error('Error creating template:', err);
      alert('שגיאה ביצירת תבנית');
    }
  };

  const handleDuplicate = async () => {
    if (!duplicateModal || !duplicateName.trim()) return;
    try {
      const id = await duplicateTemplate(duplicateModal.id, duplicateName.trim());
      setDuplicateModal(null);
      setDuplicateName('');
      navigate(`/admin/templates/${id}/edit`);
    } catch (err) {
      console.error('Error duplicating template:', err);
      alert('שגיאה בשכפול תבנית');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id);
      setDeleteConfirm(null);
      setActiveMenu(null);
    } catch (err) {
      console.error('Error deleting template:', err);
      alert('שגיאה במחיקת תבנית');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishTemplate(id);
      setActiveMenu(null);
    } catch (err) {
      console.error('Error publishing template:', err);
      alert('שגיאה בפרסום תבנית');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveTemplate(id);
      setActiveMenu(null);
    } catch (err) {
      console.error('Error archiving template:', err);
      alert('שגיאה בהעברה לארכיון');
    }
  };

  const handleCopyFromLibrary = async (templateId: string) => {
    try {
      const id = await copyToTenant(templateId, tenantId);
      setShowLibrary(false);
      navigate(`/admin/templates/${id}/edit`);
    } catch (err) {
      console.error('Error copying template:', err);
      alert('שגיאה בהעתקת תבנית');
    }
  };

  const clearFilters = () => {
    setFilterType('');
    setFilterCategory('');
    setFilterStatus('');
    setSearchTerm('');
  };

  const hasActiveFilters = filterType || filterCategory || filterStatus || searchTerm;

  // Render
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">ניהול תבניות</h1>
            <p className="text-slate-500 text-sm">צור וערוך תבניות לביקורות, דוחות וטפסים</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLibrary(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors"
            >
              🔦</button>
            <button
              onClick={() => navigate("/admin/templates/import-pdf")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 border border-white/10 transition-colors"
            >
              <Sparkles size={18} />
              ייבוא מ-PDF
            </button>
            <button
              onClick={() => setShowLibrary(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors"
            >
              <Library size={18} />
              ספריית תבניות
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Plus size={18} />
              תבנית חדשה
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חפש תבניות..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                hasActiveFilters
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                  : 'bg-slate-900 border-white/10 hover:border-white/20'
              }`}
            >
              <Filter size={18} />
              סינון
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-indigo-500 rounded-full text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-slate-900 rounded-xl border border-white/10 p-4">
              <div className="flex flex-wrap gap-4">
                {/* Type Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-400 block mb-1">סוג</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as TemplateType | '')}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">הכל</option>
                    {TEMPLATE_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.icon} {t.labelHe}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-400 block mb-1">קטגוריה</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as SafetyCategory | '')}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">הכל</option>
                    {SAFETY_CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.icon} {c.labelHe}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-400 block mb-1">סטטוס</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as TemplateStatus | '')}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">הכל</option>
                    <option value="draft">טיוטה</option>
                    <option value="published">פעיל</option>
                    <option value="archived">בארכיון</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="self-end px-3 py-2 text-sm text-slate-400 hover:text-white"
                  >
                    נקה סינון
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">טוען תבניות...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <p className="text-rose-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTemplates.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border-2 border-dashed border-white/10">
            <FolderOpen size={48} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-400 mb-2">
              {hasActiveFilters ? 'לא נמצאו תבניות' : 'אין תבניות עדיין'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {hasActiveFilters 
                ? 'נסה לשנות את הסינון או לחפש משהו אחר'
                : 'צור תבנית חדשה או בחר מהספרייה'
              }
            </p>
            {!hasActiveFilters && (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowLibrary(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold"
                >
                  בחר מהספרייה
                </button>
                <button
                  onClick={handleCreateNew}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold"
                >
                  צור תבנית חדשה
                </button>
              </div>
            )}
          </div>
        )}

        {/* Templates Grid */}
        {!loading && filteredTemplates.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => {
              const categoryInfo = SAFETY_CATEGORIES.find(c => c.value === category);
              return (
                <div key={category}>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-300 mb-4">
                    <span>{categoryInfo?.icon || '📁'}</span>
                    {categoryInfo?.labelHe || category}
                    <span className="text-sm font-normal text-slate-500">
                      ({categoryTemplates.length})
                    </span>
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryTemplates.map(template => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isMenuOpen={activeMenu === template.id}
                        onMenuToggle={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === template.id ? null : template.id);
                        }}
                        onCardClick={() => navigate(`/admin/templates/${template.id}/edit`)}
                        onEdit={() => {
                          setActiveMenu(null);
                          navigate(`/admin/templates/${template.id}/edit`);
                        }}
                        onPreview={() => {
                          setActiveMenu(null);
                          navigate(`/admin/templates/${template.id}/preview`);
                        }}
                        onDuplicate={() => {
                          setActiveMenu(null);
                          setDuplicateModal(template);
                          setDuplicateName(`${template.nameHe || template.name} (העתק)`);
                        }}
                        onDelete={() => {
                          setActiveMenu(null);
                          setDeleteConfirm(template.id);
                        }}
                        onPublish={() => handlePublish(template.id)}
                        onArchive={() => handleArchive(template.id)}
                        onFillForm={() => {
                          setActiveMenu(null);
                          navigate(`/admin/forms/new?templateId=${template.id}`);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Library Modal */}
      {showLibrary && (
        <LibraryModal
          templates={systemTemplates}
          loading={loadingLibrary}
          onClose={() => setShowLibrary(false)}
          onSelect={handleCopyFromLibrary}
        />
      )}

      {/* Duplicate Modal */}
      {duplicateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">שכפול תבנית</h3>
            <p className="text-slate-400 text-sm mb-4">
              הזן שם לתבנית החדשה:
            </p>
            <input
              type="text"
              value={duplicateName}
              onChange={(e) => setDuplicateName(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDuplicateModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800"
              >
                ביטול
              </button>
              <button
                onClick={handleDuplicate}
                disabled={!duplicateName.trim()}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
              >
                שכפל
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4 text-rose-400">מחיקת תבנית</h3>
            <p className="text-slate-400 text-sm mb-6">
              האם אתה בטוח שברצונך למחוק תבנית זו? פעולה זו לא ניתנת לביטול.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800"
              >
                ביטול
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================
// TEMPLATE CARD COMPONENT
// ===========================================

interface TemplateCardProps {
  template: Template;
  isMenuOpen: boolean;
  onMenuToggle: (e: React.MouseEvent) => void;
  onCardClick: () => void;
  onEdit: () => void;
  onPreview: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onPublish: () => void;
  onArchive: () => void;
  onFillForm: () => void;
}

function TemplateCard({
  template,
  isMenuOpen,
  onMenuToggle,
  onCardClick,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
  onPublish,
  onArchive,
  onFillForm,
}: TemplateCardProps) {
  const statusStyle = STATUS_STYLES[template.status];
  const typeInfo = TEMPLATE_TYPES.find(t => t.value === template.type);
  const menuRef = useRef<HTMLDivElement>(null);

  const fieldsCount = template.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0;

  return (
    <div 
      className="bg-slate-900/60 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group relative cursor-pointer"
      onClick={onCardClick}
    >
      {/* Card Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeInfo?.icon || '📄'}</span>
            <div>
              <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">
                {template.nameHe || template.name}
              </h3>
              <p className="text-xs text-slate-500">{typeInfo?.labelHe}</p>
            </div>
          </div>
          
          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={onMenuToggle}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <MoreVertical size={18} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div 
                className="absolute left-0 top-full mt-1 bg-slate-800 rounded-xl border border-white/10 shadow-xl z-20 min-w-[160px] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-right"
                >
                  <Edit size={16} />
                  עריכה
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-right"
                >
                  <Eye size={16} />
                  תצוגה מקדימה
                </button>
                {template.status === 'published' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFillForm();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-emerald-400 text-right"
                  >
                    <PlayCircle size={16} />
                    מלא טופס
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-right"
                >
                  <Copy size={16} />
                  שכפול
                </button>
                <div className="border-t border-white/5" />
                {template.status === 'draft' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPublish();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-emerald-400 text-right"
                  >
                    <CheckCircle size={16} />
                    פרסום
                  </button>
                )}
                {template.status === 'published' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-right"
                  >
                    <Archive size={16} />
                    העבר לארכיון
                  </button>
                )}
                <div className="border-t border-white/5" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-rose-500/10 text-rose-400 text-right"
                >
                  <Trash2 size={16} />
                  מחיקה
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {template.descriptionHe && (
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
            {template.descriptionHe}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{template.sections?.length || 0} סקשנים</span>
          <span>{fieldsCount} שדות</span>
          <span>v{template.version}</span>
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {template.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400">
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-slate-500">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {template.status === 'published' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFillForm();
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold transition-colors"
            >
              <PlayCircle size={14} />
              מלא טופס
            </button>
          )}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={12} />
            {template.updatedAt?.toDate?.()?.toLocaleDateString('he-IL') || 'לא ידוע'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// LIBRARY MODAL
// ===========================================

interface LibraryModalProps {
  templates: Template[];
  loading: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

function LibraryModal({ templates, loading, onClose, onSelect }: LibraryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = !searchTerm || 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nameHe?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  const groupedTemplates = useMemo(() => {
    const groups: Record<string, Template[]> = {};
    filteredTemplates.forEach(t => {
      const cat = t.category || 'general';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });
    return groups;
  }, [filteredTemplates]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Library size={24} />
              ספריית תבניות
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חפש תבנית..."
                className="w-full bg-slate-800 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm"
            >
              <option value="">כל הקטגוריות</option>
              {SAFETY_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.icon} {c.labelHe}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">טוען תבניות...</p>
            </div>
          )}

          {!loading && filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">לא נמצאו תבניות בספרייה</p>
            </div>
          )}

          {!loading && filteredTemplates.length > 0 && (
            <div className="space-y-6">
              {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => {
                const categoryInfo = SAFETY_CATEGORIES.find(c => c.value === category);
                return (
                  <div key={category}>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-3">
                      <span>{categoryInfo?.icon || '📁'}</span>
                      {categoryInfo?.labelHe || category}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {categoryTemplates.map(template => {
                        const typeInfo = TEMPLATE_TYPES.find(t => t.value === template.type);
                        return (
                          <button
                            key={template.id}
                            onClick={() => onSelect(template.id)}
                            className="text-right p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{typeInfo?.icon}</span>
                              <div>
                                <h4 className="font-bold text-slate-200 group-hover:text-white">
                                  {template.nameHe || template.name}
                                </h4>
                                <p className="text-xs text-slate-500">{typeInfo?.labelHe}</p>
                              </div>
                            </div>
                            {template.descriptionHe && (
                              <p className="text-sm text-slate-500 line-clamp-2">
                                {template.descriptionHe}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span>{template.sections?.length || 0} סקשנים</span>
                              <span>
                                {template.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0} שדות
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}