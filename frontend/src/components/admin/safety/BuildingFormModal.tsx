import React, { useState } from 'react';
import { X, Save, Building, Layers, Type } from 'lucide-react';

interface BuildingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function BuildingFormModal({ isOpen, onClose, onSubmit }: BuildingFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    floors: 1,
    description: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', floors: 1, description: '' });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-sm font-medium text-slate-300 mb-2";
  const inputClass = "w-full rounded-lg border border-slate-600 bg-slate-700/50 text-white px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-500";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-700 text-white animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-500" />
            הוספת מבנה חדש
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}><Type className="w-4 h-4 inline ml-1"/> שם המבנה / מספר</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
                placeholder="למשל: בניין 4 (מנהלה)"
              />
            </div>
            <div>
              <label className={labelClass}><Layers className="w-4 h-4 inline ml-1"/> מספר קומות</label>
              <input
                type="number"
                min="1"
                value={formData.floors}
                onChange={e => setFormData({ ...formData, floors: parseInt(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>תיאור (אופציונלי)</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className={inputClass}
                rows={3}
                placeholder="הערות נוספות..."
              />
            </div>
          </div>

          <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 font-bold hover:bg-slate-700 transition-colors">ביטול</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/30 flex items-center gap-2">
              <Save className="w-4 h-4" /> שמור מבנה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
