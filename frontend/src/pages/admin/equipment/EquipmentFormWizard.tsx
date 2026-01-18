import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Check, ChevronLeft, ChevronRight, 
  MapPin, Shield, FileText, Save 
} from 'lucide-react';
import { useEquipment } from '../../../hooks/useEquipment';
import { useClients } from '../../../hooks/useClients';
import { useSites } from '../../../hooks/useSites';
import { useSiteHierarchy } from '../../../hooks/useSiteHierarchy';
import { SAFETY_DOMAINS, EQUIPMENT_TYPES_BY_DOMAIN, SafetyDomain } from '../../../types/equipment.types';

export default function EquipmentFormWizard() {
  const navigate = useNavigate();
  const { addEquipment, loading: submitting } = useEquipment();
  
  // Hooks for data
  const { clients, fetchClients } = useClients();
  const { sites, fetchSites } = useSites();
  
  // State for Wizard
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: '',
    siteId: '',
    buildingId: '',
    locationId: '', // Area ID
    domain: 'fire_safety' as SafetyDomain,
    type: 'fire_extinguisher',
    name: '',
    serialNumber: '',
    manufacturer: '',
    status: 'active' as const
  });

  // Hierarchy Hook needs siteId to fetch buildings
  const { buildings, areas, fetchBuildings, fetchAreas } = useSiteHierarchy(formData.siteId);

  // Load initial data
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Load sites when client changes
  useEffect(() => {
    if (formData.clientId) {
      fetchSites(formData.clientId);
    }
  }, [formData.clientId, fetchSites]);

  // Load hierarchy when site changes
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

  // Filtered lists
  const filteredSites = sites.filter(s => s.clientId === formData.clientId);
  const filteredAreas = areas.filter(a => !formData.buildingId || a.buildingId === formData.buildingId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      {/* Header */}
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
        
        {/* Progress Bar */}
        <div className="hidden md:flex items-center gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex items-center gap-2 ${step >= i ? 'text-blue-600' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${step === i ? 'bg-blue-600 text-white' : 
                  step > i ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                {step > i ? <Check className="w-5 h-5" /> : i}
              </div>
              <span className="text-sm font-medium">
                {i === 1 ? 'מיקום' : i === 2 ? 'סיווג' : 'פרטים'}
              </span>
              {i < 3 && <div className="w-12 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[400px]">
          
          {/* STEP 1: Location */}
          {step === 1 && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">בחירת מיקום הציוד</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">לקוח *</label>
                  <select
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                    value={formData.clientId}
                    onChange={e => setFormData({ ...formData, clientId: e.target.value, siteId: '', buildingId: '', locationId: '' })}
                  >
                    <option value="">בחר לקוח...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אתר *</label>
                  <select
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                    value={formData.siteId}
                    onChange={e => setFormData({ ...formData, siteId: e.target.value, buildingId: '', locationId: '' })}
                    disabled={!formData.clientId}
                  >
                    <option value="">בחר אתר...</option>
                    {filteredSites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מבנה (אופציונלי)</label>
                  <select
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                    value={formData.buildingId}
                    onChange={e => setFormData({ ...formData, buildingId: e.target.value, locationId: '' })}
                    disabled={!formData.siteId}
                  >
                    <option value="">כללי / ללא מבנה</option>
                    {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אזור / חדר (אופציונלי)</label>
                  <select
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
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

          {/* STEP 2: Classification */}
          {step === 2 && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">סיווג הציוד</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">תחום בטיחות</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(SAFETY_DOMAINS).map(([key, domain]) => (
                    <button
                      key={key}
                      onClick={() => setFormData({ 
                        ...formData, 
                        domain: key as SafetyDomain,
                        type: EQUIPMENT_TYPES_BY_DOMAIN[key as SafetyDomain]?.[0] || ''
                      })}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2
                        ${formData.domain === key 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      <span className="text-2xl">
                        {/* כאן היינו שמים אייקון אמיתי, כרגע טקסט */}
                        {key === 'fire_safety' ? '🔥' : key === 'electricity' ? '⚡' : '🔧'}
                      </span>
                      <span className="text-sm font-medium">{domain.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">סוג ציוד ספציפי</label>
                <select
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 p-2.5"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  {EQUIPMENT_TYPES_BY_DOMAIN[formData.domain]?.map(type => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Details */}
          {step === 3 && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">פרטים טכניים</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם הציוד / תיאור *</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                    placeholder="למשל: מטף 6 ק״ג מסדרון ראשי"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מספר סידורי</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                    value={formData.serialNumber}
                    onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">יצרן / דגם</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                    value={formData.manufacturer}
                    onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            חזור
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && !formData.siteId}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              המשך לשלב הבא
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !formData.name}
              className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Save className="w-5 h-5" />
              {submitting ? 'שומר...' : 'סיים ושמור ציוד'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
