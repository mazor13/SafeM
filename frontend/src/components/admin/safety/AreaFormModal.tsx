import React, { useState } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import { Building } from '../../../types/site.types';

interface AreaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  buildings: Building[];
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

  const labelClass = "block text-sm font-medium text-slate-300 mb-2";
  const inputClass = "w-full rounded-lg border border-slate-600 bg-slate-700/50 text-white px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-500";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-700 text-white animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-500" />
            הוספת אזור / חדר
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>שיוך למבנה</label>
              <select
                required
                value={formData.buildingId}
                onChange={e => setFormData({ ...formData, buildingId: e.target.value })}
                className={inputClass}
              >
                <option value="" className="text-slate-500">בחר מבנה...</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>שם האזור</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  placeholder="חדר שרתים"
                />
              </div>
              <div>
                <label className={labelClass}>קומה</label>
                <input
                  value={formData.floor}
                  onChange={e => setFormData({ ...formData, floor: e.target.value })}
                  className={inputClass}
                  placeholder="0, 1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>סוג</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className={inputClass}>
                  <option value="room">חדר</option>
                  <option value="corridor">מסדרון</option>
                  <option value="roof">גג</option>
                  <option value="parking">חניון</option>
                  <option value="outdoor">שטח חוץ</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>סיכון</label>
                <select value={formData.riskLevel} onChange={e => setFormData({ ...formData, riskLevel: e.target.value })} className={inputClass}>
                  <option value="low">נמוך</option>
                  <option value="medium">בינוני</option>
                  <option value="high">גבוה</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 font-bold hover:bg-slate-700 transition-colors">ביטול</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/30 flex items-center gap-2">
              <Save className="w-4 h-4" /> שמור אזור
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
