// ===========================================
// AEGIS - Document Editor Page
// דף עריכת מסמך
// ===========================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  Settings,
  Download,
  Share2,
  CheckCircle,
  Archive,
  MoreVertical,
  Tag,
  Folder,
  X,
} from 'lucide-react';
import DocumentEditor from '../../../components/DocumentEditor';
import { useDocument, DOCUMENT_CATEGORIES } from '../../../hooks/useDocuments';

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function DocumentEditorPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  // TODO: Get from auth context
  const tenantId = 'system';
  const userId = 'current-user';

  const {
    document,
    loading,
    error,
    saving,
    updateTitle,
    updateContent,
    updateMetadata,
    publish,
    archive,
  } = useDocument({
    documentId,
    tenantId,
    userId,
  });

  // Local state
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // Update title input when document loads
  useEffect(() => {
    if (document) {
      setTitleInput(document.title);
    }
  }, [document?.title]);

  // Handle title save
  const handleTitleSave = async () => {
    if (!titleInput.trim() || titleInput === document?.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await updateTitle(titleInput);
      setIsEditingTitle(false);
    } catch (err) {
      alert('שגיאה בעדכון הכותרת');
    }
  };

  // Handle content save
  const handleContentSave = async (content: string) => {
    try {
      await updateContent(content);
    } catch (err) {
      console.error('Error saving content:', err);
    }
  };

  // Handle publish
  const handlePublish = async () => {
    try {
      await publish();
      alert('המסמך פורסם בהצלחה!');
    } catch (err) {
      alert('שגיאה בפרסום המסמך');
    }
  };

  // Handle archive
  const handleArchive = async () => {
    if (!confirm('להעביר את המסמך לארכיון?')) return;

    try {
      await archive();
    } catch (err) {
      alert('שגיאה בהעברה לארכיון');
    }
  };

  // Handle print/export
  const handleExport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !document) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <title>${document.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          }
          h1 { font-size: 24px; margin-bottom: 20px; }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>${document.title}</h1>
        ${document.content}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">טוען מסמך...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/documents')}
            className="px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700"
          >
            חזרה לרשימה
          </button>
        </div>
      </div>
    );
  }

  if (!document) return null;

  const category = DOCUMENT_CATEGORIES.find(c => c.value === document.category);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-white/5 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Left - Back & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/documents')}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              <ArrowRight size={20} />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl">{category?.icon || '📄'}</span>
              
              {isEditingTitle ? (
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                  className="bg-slate-800 border border-white/20 rounded-lg px-3 py-1 text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="font-bold text-lg cursor-pointer hover:text-indigo-400"
                >
                  {document.title}
                </h1>
              )}
            </div>
          </div>

          {/* Right - Status & Actions */}
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${
                document.status === 'draft'
                  ? 'bg-amber-500/20 text-amber-400'
                  : document.status === 'published'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-500/20 text-slate-400'
              }`}
            >
              {document.status === 'draft' ? 'טיוטה' : document.status === 'published' ? 'פורסם' : 'ארכיון'}
            </span>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              title="הגדרות"
            >
              <Settings size={18} />
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              title="ייצוא / הדפסה"
            >
              <Download size={18} />
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <MoreVertical size={18} />
              </button>

              {showMenu && (
                <div className="absolute left-0 top-full mt-1 bg-slate-800 rounded-xl border border-white/10 shadow-xl z-20 min-w-[150px] overflow-hidden">
                  {document.status === 'draft' && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handlePublish();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-emerald-400 text-right"
                    >
                      <CheckCircle size={16} />
                      פרסום
                    </button>
                  )}
                  {document.status !== 'archived' && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleArchive();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-700 text-right"
                    >
                      <Archive size={16} />
                      העבר לארכיון
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Publish Button (if draft) */}
            {document.status === 'draft' && (
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500"
              >
                <CheckCircle size={16} />
                פרסום
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <DocumentEditor
          content={document.content}
          onChange={() => {}} // Real-time changes handled internally
          onSave={handleContentSave}
          placeholder="התחל לכתוב את המסמך שלך..."
          autoSave={true}
          autoSaveInterval={30000}
        />
      </div>

      {/* Settings Sidebar */}
      {showSettings && (
        <SettingsSidebar
          document={document}
          onClose={() => setShowSettings(false)}
          onUpdate={updateMetadata}
        />
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}

// ===========================================
// SETTINGS SIDEBAR
// ===========================================

interface SettingsSidebarProps {
  document: any;
  onClose: () => void;
  onUpdate: (data: any) => Promise<void>;
}

function SettingsSidebar({ document, onClose, onUpdate }: SettingsSidebarProps) {
  const [category, setCategory] = useState(document.category || 'other');
  const [tags, setTags] = useState<string[]>(document.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({ category, tags });
      onClose();
    } catch (err) {
      alert('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 w-80 bg-slate-900 border-r border-white/10 z-50 overflow-y-auto">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold">הגדרות מסמך</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2">
              <Folder size={14} />
              קטגוריה
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm"
            >
              {DOCUMENT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2">
              <Tag size={14} />
              תגיות
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="הוסף תגית..."
                className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-indigo-600 rounded-lg text-sm"
              >
                הוסף
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-rose-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-slate-400 mb-3">פרטי מסמך</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">מזהה:</span>
                <span className="font-mono text-xs">{document.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">נוצר:</span>
                <span>{document.createdAt?.toDate?.()?.toLocaleDateString('he-IL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">עודכן:</span>
                <span>{document.updatedAt?.toDate?.()?.toLocaleDateString('he-IL')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold disabled:opacity-50"
          >
            {saving ? 'שומר...' : 'שמור הגדרות'}
          </button>
        </div>
      </div>
    </>
  );
}