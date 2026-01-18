import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronLeft, ChevronRight, MapPin, Shield, FileText, Save } from 'lucide-react';
import { useEquipment } from '../../../hooks/useEquipment';
import { useClients } from '../../../hooks/useClients';
import { useSites } from '../../../hooks/useSites';
import { useSiteHierarchy } from '../../../hooks/useSiteHierarchy';
import { SAFETY_DOMAINS, EQUIPMENT_TYPES_BY_DOMAIN, SafetyDomain } from '../../../types/equipment.types';

export default function EquipmentFormWizard() {
  const navigate = useNavigate();
  const { addEquipment, loading: submitting } = useEquipment();
  const { clients } = useClients(); 
  const { sites, fetchSites } = useSites();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: '',
    siteId: '',
    buildingId: '',
    locationId: '',
    domain: 'fire_safety' as SafetyDomain,
    type: 'fire_extinguisher',
    name: '',
    serialNumber: '',
    manufacturer: '',
    status: 'active' as const,
    tenantId: 'default'
  });

  const { buildings, areas, fetchBuildings, fetchAreas } = useSiteHierarchy(formData.siteId);

  useEffect(() => {
    if (formData.clientId) {
      fetchSites(formData.clientId);
    }
  }, [formData.clientId, fetchSites]);

  useEffect(() => {
    if (formData.siteId) {
      fetchBuildings();
      fetchAreas();
    }
  }, [formData.siteId, fetchBuildings, fetchAreas]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      await addEquipment(formData);
      navigate('/admin/equipment');
    } catch (error) {
      console.error('Failed to create equipment:', error);
      alert('שגיאה ביצירת הציוד');
    }
  };

  const filteredSites = sites.filter(s => s.clientId === formData.clientId);
  const filteredAreas = areas.filter(a => !formData.buildingId || a.buildingId === formData.buildingId);

  // Custom Input Class for Visibility
  const inputClass = "w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" dir="rtl">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/equipment')} className="text-gray-400 hover:text-gray-600">
            <ArrowRight className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">הוספת ציוד חדש</h1>
            <p className="text-sm text-gray-500">שלב {step} מתוך 3</p>
          </div>
        </div>
        {/* Progress steps visual hidden on mobile */}
      </div>

      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[400px]">
          
          {step === 1 && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><MapPin className="w-6 h-6" /></div>
                <h2 className="text-xl font-bold text-gray-900">בחירת מיקום הציוד</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">לקוח *</label>
                  <select
                    className={inputClass}
                    value={formData.clientId}
                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                  >
                    <option value="">בחר לקוח...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אתר *</label>
                  <select
                    className={inputClass}
                    value={formData.siteId}
                    onChange={e => setFormData({ ...formData, siteId: e.target.value })}
                    disabled={!formData.clientId}
                  >
                    <option value="">בחר אתר...</option>
                    {filteredSites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מבנה</label>
                  <select
                    className={inputClass}
                    value={formData.buildingId}
                    onChange={e => setFormData({ ...formData, buildingId: e.target.value })}
                    disabled={!formData.siteId}
                  >
                    <option value="">כללי</option>
                    {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אזור</label>
                  <select
                    className={inputClass}
                    value={formData.locationId}
                    onChange={e => setFormData({ ...formData, locationId: e.target.value })}
                    disabled={!formData.siteId}
                  >
                    <option value="">בחר אזור...</option>
                    {filteredAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Shield className="w-6 h-6" /></div>
                <h2 className="text-xl font-bold text-gray-900">סיווג הציוד</h2>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">תחום בטיחות</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(SAFETY_DOMAINS).map(([key, domain]) => (
                    <button
                      key={key}
                      onClick={() => setFormData({ ...formData, domain: key as SafetyDomain })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.domain === key 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="text-sm font-medium">{domain.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1">סוג ציוד</label>
                 <select 
                    className={inputClass}
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                 >
                    {EQUIPMENT_TYPES_BY_DOMAIN[formData.domain]?.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                 </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg"><FileText className="w-6 h-6" /></div>
                <h2 className="text-xl font-bold text-gray-900">פרטים טכניים</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם הציוד *</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מספר סידורי</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formData.serialNumber}
                    onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">יצרן</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formData.manufacturer}
                    onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
         <div className="mt-6 flex justify-between items-center">
          <button onClick={handleBack} disabled={step === 1} className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 border border-gray-300">חזור</button>
          {step < 3 ? (
            <button onClick={handleNext} disabled={step === 1 && !formData.siteId} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">המשך</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || !formData.name} className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">שמור</button>
          )}
        </div>
      </div>
    </div>
  );
}
