// ===========================================
// AEGIS - Documents List Page
// רשימת מסמכים
// ===========================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  FileText,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  Archive,
  FolderOpen,
  Filter,
} from 'lucide-react';
import { useDocuments, DOCUMENT_CATEGORIES, Document } from '../../../hooks/useDocuments';

// ===========================================
// STATUS CONFIG
// ===========================================

const STATUS_CONFIG = {
  draft: { label: 'טיוטה', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  published: { label: 'פורסם', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  archived: { label: 'בארכיון', bg: 'bg-slate-500/20', text: 'text-slate-400' },
};

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function DocumentsListPage() {
  const navigate = useNavigate();
  
  // TODO: Get from auth context
  const tenantId = 'system';
  const userId = 'current-user';

  const { documents, loading, error, deleteDocument, duplicateDocument, reload } = useDocuments({ tenantId });

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [duplicateModal, setDuplicateModal] = useState<Document | null>(null);
  const [duplicateName, setDuplicateName] = useState('');

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Search
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!doc.title.toLowerCase().includes(search)) {
          return false;
        }
      }

      // Category filter
      if (filterCategory && doc.category !== filterCategory) {
        return false;
      }

      // Status filter
      if (filterStatus && doc.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [documents, searchTerm, filterCategory, filterStatus]);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deleteDocument(deleteConfirm);
      setDeleteConfirm(null);
    } catch (err) {
      alert('שגיאה במחיקת המסמך');
    }
  };

  // Handle duplicate
  const handleDuplicate = async () => {
    if (!duplicateModal || !duplicateName.trim()) return;

    try {
      const newId = await duplicateDocument(duplicateModal.id, duplicateName, userId);
      setDuplicateModal(null);
      navigate(`/admin/documents/${newId}`);
    } catch (err) {
      alert('שגיאה בשכפול המסמך');
    }
  };

  // Close menus on outside click
  React.useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">מסמכים</h1>
            <p className="text-slate-500 text-sm">נהלים, דוחות ומסמכי בטיחות</p>
          </div>
          <button
            onClick={() => navigate('/admin/documents/new')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            מסמך חדש
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="חפש מסמכים..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm min-w-[150px]"
          >
            <option value="">כל הקטגוריות</option>
            {DOCUMENT_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm min-w-[120px]"
          >
            <option value="">כל הסטטוסים</option>
            <option value="draft">טיוטה</option>
            <option value="published">פורסם</option>
            <option value="archived">בארכיון</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">טוען מסמכים...</p>
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
        {!loading && !error && filteredDocuments.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border-2 border-dashed border-white/10">
            <FolderOpen size={48} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-400 mb-2">
              {documents.length === 0 ? 'אין מסמכים עדיין' : 'לא נמצאו מסמכים'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {documents.length === 0
                ? 'צור את המסמך הראשון שלך'
                : 'נסה לשנות את הסינון'
              }
            </p>
            {documents.length === 0 && (
              <button
                onClick={() => navigate('/admin/documents/new')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold"
              >
                צור מסמך
              </button>
            )}
          </div>
        )}

        {/* Documents Grid */}
        {!loading && !error && filteredDocuments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map(doc => {
              const category = DOCUMENT_CATEGORIES.find(c => c.value === doc.category);
              const status = STATUS_CONFIG[doc.status];

              return (
                <div
                  key={doc.id}
                  className="bg-slate-900 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group"
                  onClick={() => navigate(`/admin/documents/${doc.id}`)}
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-xl">
                          {category?.icon || '📄'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-200 group-hover:text-white line-clamp-1">
                            {doc.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {category?.label || 'אחר'}
                          </p>
                        </div>
                      </div>

                      {/* Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === doc.id ? null : doc.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenu === doc.id && (
                          <div
                            className="absolute left-0 top-full mt-1 bg-slate-800 rounded-xl border border-white/10 shadow-xl z-20 min-w-[140px] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setActiveMenu(null);
                                navigate(`/admin/documents/${doc.id}`);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-right"
                            >
                              <Edit size={16} />
                              עריכה
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenu(null);
                                setDuplicateModal(doc);
                                setDuplicateName(`${doc.title} (העתק)`);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-right"
                            >
                              <Copy size={16} />
                              שכפול
                            </button>
                            <div className="border-t border-white/5" />
                            <button
                              onClick={() => {
                                setActiveMenu(null);
                                setDeleteConfirm(doc.id);
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

                    {/* Preview */}
                    <div className="text-sm text-slate-400 line-clamp-2 mb-4 min-h-[40px]">
                      {doc.content ? stripHtml(doc.content).slice(0, 100) : 'מסמך ריק...'}
                    </div>

                    {/* Tags */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {doc.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={12} />
                      {doc.updatedAt?.toDate?.()?.toLocaleDateString('he-IL') || 'לא ידוע'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4 text-rose-400">מחיקת מסמך</h3>
            <p className="text-slate-400 text-sm mb-6">
              האם אתה בטוח שברצונך למחוק מסמך זה? פעולה זו לא ניתנת לביטול.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800"
              >
                ביטול
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Modal */}
      {duplicateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">שכפול מסמך</h3>
            <p className="text-slate-400 text-sm mb-4">הזן שם למסמך החדש:</p>
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
    </div>
  );
}

// ===========================================
// HELPERS
// ===========================================

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}