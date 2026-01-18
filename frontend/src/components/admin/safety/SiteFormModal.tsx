import React, { useState, useEffect } from 'react';
import { X, Save, Building2, MapPin, Briefcase } from 'lucide-react';
import { useClients } from '../../../hooks/useClients';
import { Site, SiteType, RiskLevel } from '../../../types/site.types';

interface SiteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Partial<Site>;
}

export default function SiteFormModal({ isOpen, onClose, onSubmit, initialData }: SiteFormModalProps) {
  const { clients } = useClients();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    type: 'campus' as SiteType,
    riskLevel: 'low' as RiskLevel,
    address: { street: '', city: '', country: 'Israel' },
    primaryContact: { name: '', role: '', email: '', phone: '' }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...(initialData as any) }));
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Dark Mode Input Classes
  const labelClass = "block text-sm font-medium text-slate-300 mb-2";
  const inputClass = "w-full rounded-lg border border-slate-600 bg-slate-700/50 text-white px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-500";
  const sectionTitle = "text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all" dir="rtl">
      {/* Modal Container: Slate-800 */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col border border-slate-700 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
               {initialData ? 'עריכת פרטי אתר' : 'הקמת אתר חדש'}
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            
            <section>
              <h3 className={sectionTitle}><Briefcase className="w-4 h-4" /> פרטים כלליים</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className={labelClass}>שיוך ללקוח</label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                    className={inputClass}
                    disabled={!!initialData}
                  >
                    <option value="" className="text-slate-500">בחר לקוח מהרשימה...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>שם האתר / המתקן</label>
                  <input required type="text" placeholder="למשל: קמפוס צפון" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                </div>
                 <div>
                  <label className={labelClass}>סוג אתר</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as SiteType })} className={inputClass}>
                    <option value="campus">קמפוס / מתחם</option>
                    <option value="building">בניין משרדים</option>
                    <option value="factory">מפעל תעשייה</option>
                    <option value="warehouse">מחסן לוגיסטי</option>
                    <option value="retail">מרכז מסחרי</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="border-t border-slate-700 pt-6">
              <h3 className={sectionTitle}><MapPin className="w-4 h-4" /> כתובת ומיקום</h3>
              <div className="grid grid-cols-2 gap-5">
                 <div>
                    <label className={labelClass}>עיר</label>
                    <input required placeholder="הזן עיר..." value={formData.address.city} onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} className={inputClass} />
                 </div>
                 <div>
                    <label className={labelClass}>רחוב ומספר</label>
                    <input required placeholder="הזן רחוב..." value={formData.address.street} onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} className={inputClass} />
                 </div>
              </div>
            </section>
          </div>

          <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl sticky bottom-0 z-10">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 font-bold hover:bg-slate-700 transition-colors">ביטול</button>
            <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all">
              <Save className="w-5 h-5" />
              {loading ? 'שומר...' : 'שמור אתר'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
