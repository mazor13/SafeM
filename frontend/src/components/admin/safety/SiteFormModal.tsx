import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { useClients } from '../../../hooks/useClients';
import { Site, SiteType, RiskLevel } from '../../../types/site.types';

interface SiteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Partial<Site>;
}

export default function SiteFormModal({ isOpen, onClose, onSubmit, initialData }: SiteFormModalProps) {
  const { clients, fetchClients } = useClients();
  const [loading, setLoading] = useState(false);
  
  // State לטופס
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    type: 'campus' as SiteType,
    riskLevel: 'low' as RiskLevel,
    address: {
      street: '',
      city: '',
      country: 'Israel'
    },
    primaryContact: {
      name: '',
      role: '',
      email: '',
      phone: ''
    }
  });

  // טעינת לקוחות בעת פתיחת המודאל
  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen, fetchClients]);

  // איפוס/טעינת נתונים
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    } else {
      // Reset form
      setFormData({
        clientId: '',
        name: '',
        type: 'campus',
        riskLevel: 'low',
        address: { street: '', city: '', country: 'Israel' },
        primaryContact: { name: '', role: '', email: '', phone: '' }
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              {initialData ? 'עריכת אתר' : 'הקמת אתר חדש'}
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            
            {/* סקשן 1: שיוך ופרטים כלליים */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">לקוח משויך *</label>
                <select
                  required
                  value={formData.clientId}
                  onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!!initialData} // לא ניתן לשנות לקוח בעריכה
                >
                  <option value="">בחר לקוח...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם האתר *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="למשל: קמפוס ראשי"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג אתר</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as SiteType })}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="campus">קמפוס/מתחם</option>
                  <option value="building">בניין בודד</option>
                  <option value="factory">מפעל</option>
                  <option value="warehouse">מחסן</option>
                  <option value="office">משרדים</option>
                  <option value="retail">מסחרי</option>
                </select>
              </div>
            </div>

            {/* סקשן 2: כתובת */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">כתובת ומיקום</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">עיר *</label>
                  <input
                    type="text"
                    required
                    value={formData.address.city}
                    onChange={e => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, city: e.target.value } 
                    })}
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">רחוב ומספר *</label>
                  <input
                    type="text"
                    required
                    value={formData.address.street}
                    onChange={e => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, street: e.target.value } 
                    })}
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* סקשן 3: איש קשר */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">איש קשר ראשי באתר</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                  <input
                    type="text"
                    required
                    value={formData.primaryContact.name}
                    onChange={e => setFormData({ 
                      ...formData, 
                      primaryContact: { ...formData.primaryContact, name: e.target.value } 
                    })}
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                  <input
                    type="tel"
                    required
                    value={formData.primaryContact.phone}
                    onChange={e => setFormData({ 
                      ...formData, 
                      primaryContact: { ...formData.primaryContact, phone: e.target.value } 
                    })}
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* סקשן 4: הגדרות סיכון */}
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">רמת סיכון התחלתית</label>
              <div className="flex gap-4">
                {['low', 'medium', 'high'].map((level) => (
                  <label key={level} className={`
                    flex-1 cursor-pointer rounded-lg border p-3 flex items-center justify-center gap-2 transition-all
                    ${formData.riskLevel === level 
                      ? level === 'high' ? 'bg-red-50 border-red-500 text-red-700' 
                      : level === 'medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                      : 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'}
                  `}>
                    <input
                      type="radio"
                      name="riskLevel"
                      value={level}
                      checked={formData.riskLevel === level}
                      onChange={e => setFormData({ ...formData, riskLevel: e.target.value as RiskLevel })}
                      className="hidden"
                    />
                    <span className="capitalize font-bold">
                      {level === 'high' ? 'גבוהה' : level === 'medium' ? 'בינונית' : 'נמוכה'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm flex items-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              {loading ? 'שומר...' : 'שמור אתר'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
