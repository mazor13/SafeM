import React, { useState } from 'react';
import { X, Save, Building } from 'lucide-react';

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
      setFormData({ name: '', floors: 1, description: '' }); // Reset
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-600" />
              הוספת מבנה חדש
            </h2>
            <button type="button" onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם המבנה / מספר *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                placeholder="למשל: בניין 4 (מנהלה)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מספר קומות</label>
              <input
                type="number"
                min="1"
                value={formData.floors}
                onChange={e => setFormData({ ...formData, floors: parseInt(e.target.value) })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור (אופציונלי)</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">ביטול</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium">
              <Save className="w-4 h-4" /> שמור מבנה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
