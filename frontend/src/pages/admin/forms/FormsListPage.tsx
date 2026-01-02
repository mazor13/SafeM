// ===========================================
// AEGIS - Forms List Page
// Phase 2: רשימת טפסים שמולאו
// ===========================================

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  Calendar,
  User,
  Building,
  ChevronDown,
  X,
  RefreshCw,
  Download,
  FolderOpen,
} from 'lucide-react';
import { useFilledForms, FilledForm, FilledFormStatus } from '../../../hooks/useFilledForm';

// ===========================================
// STATUS CONFIG
// ===========================================

const STATUS_CONFIG: Record<FilledFormStatus, { 
  label: string; 
  bg: string; 
  text: string; 
  icon: React.ReactNode 
}> = {
  draft: { 
    label: 'טיוטה', 
    bg: 'bg-amber-500/20', 
    text: 'text-amber-400',
    icon: <Clock size={14} />
  },
  submitted: { 
    label: 'הוגש', 
    bg: 'bg-blue-500/20', 
    text: 'text-blue-400',
    icon: <Send size={14} />
  },
  approved: { 
    label: 'אושר', 
    bg: 'bg-emerald-500/20', 
    text: 'text-emerald-400',
    icon: <CheckCircle size={14} />
  },
  rejected: { 
    label: 'נדחה', 
    bg: 'bg-rose-500/20', 
    text: 'text-rose-400',
    icon: <XCircle size={14} />
  },
};

// ===========================================
// MAIN COMPONENT
// ===========================================

interface FormsListPageProps {
  tenantId?: string;
}

export default function FormsListPage({ tenantId = 'system' }: FormsListPageProps) {
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilledFormStatus | ''>('');
  const [filterTemplate, setFilterTemplate] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Record<string, string>>({});

  // Load forms
  const { forms, loading, error, reload } = useFilledForms({
    tenantId,
    status: filterStatus || undefined,
  });

  // Close menu on outside click
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Extract unique template IDs for filter
  const templateIds = useMemo(() => {
    const ids = new Set<string>();
    forms.forEach(f => ids.add(f.templateId));
    return Array.from(ids);
  }, [forms]);

  // Extract unique client IDs for filter
  const clientIds = useMemo(() => {
    const ids = new Set<string>();
    forms.forEach(f => {
      if (f.clientId) ids.add(f.clientId);
    });
    return Array.from(ids);
  }, [forms]);

  // Filter forms
  const filteredForms = useMemo(() => {
    return forms.filter(form => {
      // Search
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesId = form.id.toLowerCase().includes(search);
        const matchesTemplate = form.templateId.toLowerCase().includes(search);
        const matchesClient = form.clientId?.toLowerCase().includes(search);
        if (!matchesId && !matchesTemplate && !matchesClient) {
          return false;
        }
      }

      // Template filter
      if (filterTemplate && form.templateId !== filterTemplate) {
        return false;
      }

      // Client filter
      if (filterClient && form.clientId !== filterClient) {
        return false;
      }

      return true;
    });
  }, [forms, searchTerm, filterTemplate, filterClient]);

  // Group by status for stats
  const stats = useMemo(() => {
    const result = { draft: 0, submitted: 0, approved: 0, rejected: 0, total: 0 };
    forms.forEach(f => {
      result[f.status]++;
      result.total++;
    });
    return result;
  }, [forms]);

  // Handle delete
  const handleDelete = async (formId: string) => {
    // TODO: Implement delete in useFilledForms hook
    console.log('Delete form:', formId);
    setDeleteConfirm(null);
    reload();
  };

  const clearFilters = () => {
    setFilterStatus('');
    setFilterTemplate('');
    setFilterClient('');
    setSearchTerm('');
  };

  const hasActiveFilters = filterStatus || filterTemplate || filterClient || searchTerm;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">טפסים שמולאו</h1>
            <p className="text-slate-500 text-sm">צפה ונהל את כל הטפסים במערכת</p>
          </div>
          <button
            onClick={() => navigate('/admin/templates')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            טופס חדש
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard
            label="סה״כ"
            value={stats.total}
            icon={<FileText size={20} />}
            color="indigo"
            onClick={() => setFilterStatus('')}
            active={!filterStatus}
          />
          <StatCard
            label="טיוטות"
            value={stats.draft}
            icon={<Clock size={20} />}
            color="amber"
            onClick={() => setFilterStatus('draft')}
            active={filterStatus === 'draft'}
          />
          <StatCard
            label="הוגשו"
            value={stats.submitted}
            icon={<Send size={20} />}
            color="blue"
            onClick={() => setFilterStatus('submitted')}
            active={filterStatus === 'submitted'}
          />
          <StatCard
            label="אושרו"
            value={stats.approved}
            icon={<CheckCircle size={20} />}
            color="emerald"
            onClick={() => setFilterStatus('approved')}
            active={filterStatus === 'approved'}
          />
          <StatCard
            label="נדחו"
            value={stats.rejected}
            icon={<XCircle size={20} />}
            color="rose"
            onClick={() => setFilterStatus('rejected')}
            active={filterStatus === 'rejected'}
          />
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
                placeholder="חפש טפסים..."
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
            </button>

            {/* Refresh Button */}
            <button
              onClick={reload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-slate-900 border border-white/10 hover:border-white/20"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-slate-900 rounded-xl border border-white/10 p-4">
              <div className="flex flex-wrap gap-4">
                {/* Template Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-400 block mb-1">תבנית</label>
                  <select
                    value={filterTemplate}
                    onChange={(e) => setFilterTemplate(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">הכל</option>
                    {templateIds.map(id => (
                      <option key={id} value={id}>{id.slice(-8)}</option>
                    ))}
                  </select>
                </div>

                {/* Client Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-400 block mb-1">לקוח</label>
                  <select
                    value={filterClient}
                    onChange={(e) => setFilterClient(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">הכל</option>
                    {clientIds.map(id => (
                      <option key={id} value={id}>{id}</option>
                    ))}
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
            <p className="text-slate-500">טוען טפסים...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <p className="text-rose-400">{error}</p>
            <button
              onClick={reload}
              className="mt-4 px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700"
            >
              נסה שוב
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredForms.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border-2 border-dashed border-white/10">
            <FolderOpen size={48} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-400 mb-2">
              {hasActiveFilters ? 'לא נמצאו טפסים' : 'אין טפסים עדיין'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {hasActiveFilters
                ? 'נסה לשנות את הסינון'
                : 'צור טופס חדש מתבנית קיימת'
              }
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => navigate('/admin/templates')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold"
              >
                בחר תבנית
              </button>
            )}
          </div>
        )}

        {/* Forms Table */}
        {!loading && !error && filteredForms.length > 0 && (
          <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase">טופס</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase">תבנית</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase">לקוח</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase">סטטוס</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase">עודכן</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase">נוצר ע״י</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForms.map((form) => (
                    <FormRow
                      key={form.id}
                      form={form}
                      isMenuOpen={activeMenu === form.id}
                      onMenuToggle={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === form.id ? null : form.id);
                      }}
                      onView={() => {
                        setActiveMenu(null);
                        navigate(`/admin/forms/${form.id}`);
                      }}
                      onEdit={() => {
                        setActiveMenu(null);
                        navigate(`/admin/forms/${form.id}`);
                      }}
                      onDelete={() => {
                        setActiveMenu(null);
                        setDeleteConfirm(form.id);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination placeholder */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                מציג {filteredForms.length} מתוך {forms.length} טפסים
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4 text-rose-400">מחיקת טופס</h3>
            <p className="text-slate-400 text-sm mb-6">
              האם אתה בטוח שברצונך למחוק טופס זה? פעולה זו לא ניתנת לביטול.
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
// STAT CARD
// ===========================================

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'indigo' | 'amber' | 'blue' | 'emerald' | 'rose';
  onClick: () => void;
  active: boolean;
}

function StatCard({ label, value, icon, color, onClick, active }: StatCardProps) {
  const colors = {
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500',
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all text-right ${
        active
          ? `${colors[color]} border-opacity-100`
          : 'bg-slate-900/50 border-transparent hover:border-white/10'
      }`}
    >
      <div className={`flex items-center gap-2 mb-2 ${active ? colors[color].split(' ')[1] : 'text-slate-500'}`}>
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </button>
  );
}

// ===========================================
// FORM ROW
// ===========================================

interface FormRowProps {
  form: FilledForm;
  isMenuOpen: boolean;
  onMenuToggle: (e: React.MouseEvent) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function FormRow({ form, isMenuOpen, onMenuToggle, onView, onEdit, onDelete }: FormRowProps) {
  const status = STATUS_CONFIG[form.status];
  const isEditable = form.status === 'draft';

  return (
    <tr 
      className="border-b border-white/5 hover:bg-slate-800/30 cursor-pointer transition-colors"
      onClick={onView}
    >
      {/* Form ID */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <FileText size={18} className="text-slate-400" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-200">
              #{form.id.slice(-8)}
            </p>
            <p className="text-xs text-slate-500">
              v{form.templateVersion}
            </p>
          </div>
        </div>
      </td>

      {/* Template */}
      <td className="px-6 py-4">
        <span className="text-sm text-slate-400 font-mono">
          {form.templateId.slice(-8)}
        </span>
      </td>

      {/* Client */}
      <td className="px-6 py-4">
        {form.clientId ? (
          <div className="flex items-center gap-2">
            <Building size={14} className="text-slate-500" />
            <span className="text-sm text-slate-400">{form.clientId}</span>
          </div>
        ) : (
          <span className="text-sm text-slate-600">-</span>
        )}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.text}`}>
          {status.icon}
          {status.label}
        </span>
      </td>

      {/* Updated */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar size={14} className="text-slate-500" />
          {form.updatedAt?.toDate?.()?.toLocaleDateString('he-IL') || '-'}
        </div>
      </td>

      {/* Created By */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <User size={14} className="text-slate-500" />
          {form.createdBy || '-'}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {isMenuOpen && (
            <div 
              className="absolute left-0 top-full mt-1 bg-slate-800 rounded-xl border border-white/10 shadow-xl z-20 min-w-[140px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-right"
              >
                <Eye size={16} />
                צפייה
              </button>
              {isEditable && (
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
      </td>
    </tr>
  );
}