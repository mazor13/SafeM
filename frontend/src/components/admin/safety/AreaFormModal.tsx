import React, { useState } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import { Building } from '../../../types/site.types';

interface AreaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  buildings: Building[]; // כדי לבחור לאיזה בניין לשייך
}

export default function AreaFormModal({ isOpen, onClose, onSubmit, buildings }: AreaFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    buildingId: '',
    floor: '0',
    type: 'room',
    riskLevel: 'low'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', buildingId: '', floor: '0', type: 'room', riskLevel: 'low' });
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
              <MapPin className="w-6 h-6 text-blue-600" />
              הוספת אזור / חדר
            </h2>
            <button type="button" onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שיוך למבנה *</label>
              <select
                required
                value={formData.buildingId}
                onChange={e => setFormData({ ...formData, buildingId: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
              >
                <option value="">בחר מבנה...</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם האזור *</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                  placeholder="חדר שרתים / לובי"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">קומה</label>
                <input
                  value={formData.floor}
                  onChange={e => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                  placeholder="0, 1, -1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                >
                  <option value="room">חדר</option>
                  <option value="corridor">מסדרון</option>
                  <option value="roof">גג</option>
                  <option value="parking">חניון</option>
                  <option value="outdoor">שטח חוץ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סיכון</label>
                <select
                  value={formData.riskLevel}
                  onChange={e => setFormData({ ...formData, riskLevel: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                >
                  <option value="low">נמוך</option>
                  <option value="medium">בינוני</option>
                  <option value="high">גבוה</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">ביטול</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium">
              <Save className="w-4 h-4" /> שמור אזור
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
