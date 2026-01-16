/**
 * Equipment Form Page
 * טופס הוספת/עריכת ציוד - גרסה מלאה ומתוקנת
 * כולל: היררכיה, השלמה אוטומטית למיקום, כל שדות הבדיקות והזיהוי
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  ArrowRight, 
  Save, 
  Box, 
  Building2,
  Calendar,
  FileText,
  Settings,
  ListFilter,
  MapPin,
  ShieldCheck,
  Tag
} from 'lucide-react';

import { 
  useEquipment, 
  Equipment,
  EQUIPMENT_TYPES,
  SafetyDomain,
  SAFETY_DOMAINS,
} from '../../../phase4-equipment';

import { useAuth } from '../../../providers/AuthProvider';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { firestore } from '../../../firebase'; 

// Equipment Status options
const STATUS_OPTIONS = [
  { value: 'active', label: 'פעיל', color: 'emerald' },
  { value: 'inactive', label: 'לא פעיל', color: 'slate' },
  { value: 'maintenance', label: 'בתחזוקה', color: 'amber' },
  { value: 'retired', label: 'הוצא משימוש', color: 'rose' },
];

interface EquipmentFormData {
  name: string;
  description: string;
  domain: SafetyDomain | '';
  equipmentTypeId: string;
  clientId: string;
  status: string;
  serialNumber: string;
  internalId: string;
  registrationNumber: string;
  manufacturer: string;
  model: string;
  manufactureYear: string;
  installationDate: string;
  locationDescription: string;
  inspectionFrequencyMonths: number;
  useCustomFrequency: boolean;
  frequencyNotes: string;
  lastInspectionDate: string;
  certificateNumber: string;
  certificateExpiry: string;
  notes: string;
}

const initialFormData: EquipmentFormData = {
  name: '',
  description: '',
  domain: '',
  equipmentTypeId: '',
  clientId: '',
  status: 'active',
  serialNumber: '',
  internalId: '',
  registrationNumber: '',
  manufacturer: '',
  model: '',
  manufactureYear: '',
  installationDate: '',
  locationDescription: '',
  inspectionFrequencyMonths: 12,
  useCustomFrequency: false,
  frequencyNotes: '',
  lastInspectionDate: '',
  certificateNumber: '',
  certificateExpiry: '',
  notes: '',
};

export default function EquipmentFormPage() {
  const navigate = useNavigate();
  const { equipmentId } = useParams(); 
  const [searchParams] = useSearchParams(); 
  const preselectedClientId = searchParams.get('clientId');

  const id = equipmentId; 
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const { addEquipment, updateEquipment, equipment } = useEquipment({ realtime: true });

  const [formData, setFormData] = useState<EquipmentFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [suggestedLocations, setSuggestedLocations] = useState<string[]>([]);

  // Load clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const q = query(collection(firestore, 'clients'), orderBy('name'));
        const sn = await getDocs(q);
        const clientData = sn.docs.map(d => ({ id: d.id, name: d.data().name }));
        setClients(clientData);
      } catch (err) {
        console.error("Error loading clients", err);
      }
    };
    fetchClients();
  }, []);

  // Handle Preselected Client
  useEffect(() => {
    if (!isEditMode && preselectedClientId && !formData.clientId) {
      setFormData(prev => ({ ...prev, clientId: preselectedClientId }));
    }
  }, [preselectedClientId, isEditMode, formData.clientId]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      if (!formData.clientId) {
        setSuggestedLocations([]);
        return;
      }
      try {
        const q = query(collection(firestore, 'equipment'), where('clientId', '==', formData.clientId));
        const sn = await getDocs(q);
        const locations = new Set<string>();
        sn.docs.forEach(doc => {
          const loc = doc.data().locationDescription;
          if (loc && typeof loc === 'string' && loc.trim() !== '') {
            locations.add(loc.trim());
          }
        });
        setSuggestedLocations(Array.from(locations).sort());
      } catch (err) { console.error(err); }
    };
    fetchLocations();
  }, [formData.clientId]);

  const filteredEquipmentTypes = useMemo(() => {
    if (!formData.domain) return [];
    return EQUIPMENT_TYPES.filter(t => t.domain === formData.domain);
  }, [formData.domain]);

  useEffect(() => {
    if (!formData.useCustomFrequency && formData.equipmentTypeId) {
      const selectedType = EQUIPMENT_TYPES.find(t => t.id === formData.equipmentTypeId);
      if (selectedType) {
        setFormData(prev => ({ ...prev, inspectionFrequencyMonths: selectedType.inspectionFrequency }));
      }
    }
  }, [formData.equipmentTypeId, formData.useCustomFrequency]);

  useEffect(() => {
    if (isEditMode && id && equipment.length > 0) {
      const existingEquipment = equipment.find(eq => eq.id === id);
      if (existingEquipment) {
        setFormData({
          name: existingEquipment.name || '',
          description: existingEquipment.description || '',
          domain: existingEquipment.domain || '',
          equipmentTypeId: existingEquipment.equipmentTypeId || '',
          clientId: existingEquipment.clientId || '',
          status: existingEquipment.status || 'active',
          serialNumber: existingEquipment.serialNumber || '',
          internalId: existingEquipment.internalId || '',
          registrationNumber: existingEquipment.registrationNumber || '',
          manufacturer: existingEquipment.manufacturer || '',
          model: existingEquipment.model || '',
          manufactureYear: existingEquipment.manufactureYear?.toString() || '',
          installationDate: existingEquipment.installationDate ? new Date(existingEquipment.installationDate).toISOString().split('T')[0] : '',
          locationDescription: existingEquipment.locationDescription || '',
          inspectionFrequencyMonths: existingEquipment.inspectionFrequencyMonths || 12,
          useCustomFrequency: false,
          frequencyNotes: '',
          lastInspectionDate: existingEquipment.lastInspectionDate ? new Date(existingEquipment.lastInspectionDate).toISOString().split('T')[0] : '',
          certificateNumber: existingEquipment.certificateNumber || '',
          certificateExpiry: existingEquipment.certificateExpiry ? new Date(existingEquipment.certificateExpiry).toISOString().split('T')[0] : '',
          notes: existingEquipment.notes || '',
        });
      }
    }
  }, [isEditMode, id, equipment]);

  const handleChange = (field: keyof EquipmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (field === 'domain') setFormData(prev => ({ ...prev, equipmentTypeId: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EquipmentFormData, string>> = {};
    if (!formData.clientId) newErrors.clientId = 'יש לבחור לקוח תחילה';
    else if (!formData.domain) newErrors.domain = 'יש לבחור תחום בטיחות';
    else if (!formData.equipmentTypeId) newErrors.equipmentTypeId = 'יש לבחור סוג ציוד';
    else if (!formData.name.trim()) newErrors.name = 'שם הציוד הוא שדה חובה';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const cleanValue = (val: string | undefined | null) => (!val || val.trim() === '') ? null : val.trim();

      const equipmentData: Partial<Equipment> = {
        clientId: formData.clientId,
        domain: formData.domain as SafetyDomain,
        equipmentTypeId: formData.equipmentTypeId,
        name: formData.name.trim(),
        status: formData.status as any,
        description: cleanValue(formData.description) || undefined,
        
        ...(formData.serialNumber.trim() && { serialNumber: formData.serialNumber.trim() }),
        ...(formData.internalId.trim() && { internalId: formData.internalId.trim() }),
        ...(formData.registrationNumber.trim() && { registrationNumber: formData.registrationNumber.trim() }),
        ...(formData.manufacturer.trim() && { manufacturer: formData.manufacturer.trim() }),
        ...(formData.model.trim() && { model: formData.model.trim() }),
        ...(formData.manufactureYear && { manufactureYear: parseInt(formData.manufactureYear) }),
        ...(formData.installationDate && { installationDate: new Date(formData.installationDate) }),
        ...(formData.locationDescription.trim() && { locationDescription: formData.locationDescription.trim() }),
        inspectionFrequencyMonths: formData.inspectionFrequencyMonths,
        ...(formData.lastInspectionDate && { lastInspectionDate: new Date(formData.lastInspectionDate) }),
        ...(formData.certificateNumber.trim() && { certificateNumber: formData.certificateNumber.trim() }),
        ...(formData.certificateExpiry && { certificateExpiry: new Date(formData.certificateExpiry) }),
        ...(formData.notes.trim() && { notes: formData.notes.trim() }),
      };

      const safeData: any = JSON.parse(JSON.stringify(equipmentData));

      if (isEditMode && id) {
        await updateEquipment(id, safeData);
      } else {
        await addEquipment(safeData);
      }
      navigate(-1);
    } catch (error) {
      console.error('Error:', error);
      alert('שגיאה: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const getDefaultFrequency = () => {
    if (formData.equipmentTypeId) {
      const type = EQUIPMENT_TYPES.find(t => t.id === formData.equipmentTypeId);
      return type?.inspectionFrequency || 12;
    }
    return 12;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowRight className="text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Box className="text-emerald-400" />
            {isEditMode ? 'עריכת ציוד' : 'הוספת ציוד חדש'}
          </h1>
          <p className="text-slate-400 mt-1">ניהול מלא של תיק הציוד</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- 1. סיווג (Classification) --- */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ListFilter size={20} className="text-blue-400" />
            1. סיווג ושיוך
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">שיוך ללקוח <span className="text-rose-400">*</span></label>
              <select
                value={formData.clientId}
                onChange={(e) => handleChange('clientId', e.target.value)}
                disabled={Boolean(preselectedClientId && !isEditMode)}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.clientId ? 'border-rose-500' : 'border-slate-700'}`}
              >
                <option value="">בחר לקוח...</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
              {errors.clientId && <p className="mt-1 text-sm text-rose-400">{errors.clientId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">תחום בטיחות <span className="text-rose-400">*</span></label>
              <select
                value={formData.domain}
                onChange={(e) => handleChange('domain', e.target.value)}
                disabled={!formData.clientId}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.domain ? 'border-rose-500' : 'border-slate-700'}`}
              >
                <option value="">בחר תחום...</option>
                {Object.entries(SAFETY_DOMAINS).map(([key, domain]) => <option key={key} value={key}>{domain.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">סוג ציוד <span className="text-rose-400">*</span></label>
              <select
                value={formData.equipmentTypeId}
                onChange={(e) => handleChange('equipmentTypeId', e.target.value)}
                disabled={!formData.domain}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.equipmentTypeId ? 'border-rose-500' : 'border-slate-700'}`}
              >
                <option value="">בחר סוג ציוד...</option>
                {filteredEquipmentTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- 2. הנכס הפיזי (Physical Asset) --- */}
        <div className={`bg-slate-800/50 rounded-xl p-6 border border-slate-700 transition-opacity duration-500 ${!formData.equipmentTypeId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-purple-400" />
            2. נתוני יצרן ומוצר
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">יצרן</label>
              <input type="text" value={formData.manufacturer} onChange={(e) => handleChange('manufacturer', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">דגם</label>
              <input type="text" value={formData.model} onChange={(e) => handleChange('model', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">שנת ייצור</label>
              <input type="number" value={formData.manufactureYear} onChange={(e) => handleChange('manufactureYear', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">מספר סידורי (S/N)</label>
              <input type="text" value={formData.serialNumber} onChange={(e) => handleChange('serialNumber', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="S/N" />
            </div>
          </div>
        </div>

        {/* --- 3. זיהוי ארגוני (Identity & Location) --- */}
        <div className={`bg-slate-800/50 rounded-xl p-6 border border-slate-700 transition-opacity duration-500 ${!formData.equipmentTypeId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Tag size={20} className="text-amber-400" />
            3. זיהוי ארגוני ומיקום
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">שם הציוד (כינוי) <span className="text-rose-400">*</span></label>
              <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white ${errors.name ? 'border-rose-500' : 'border-slate-700'}`} placeholder="לדוגמה: מטף אבקה - קומה 1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">מזהה פנימי (Asset Tag)</label>
              <input type="text" value={formData.internalId} onChange={(e) => handleChange('internalId', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="מס' נכס בארגון" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">סטטוס</label>
              <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
                {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">מיקום (אתר/מבנה/חדר)</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-2.5 text-slate-500" size={16} />
                <input list="locations-list" type="text" value={formData.locationDescription} onChange={(e) => handleChange('locationDescription', e.target.value)} className="w-full pr-10 pl-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="בחר או הקלד מיקום..." />
                <datalist id="locations-list">{suggestedLocations.map((loc, idx) => <option key={idx} value={loc} />)}</datalist>
              </div>
            </div>
          </div>
        </div>

        {/* --- 4. בטיחות ותקינה (Safety & Compliance) --- */}
        <div className={`bg-slate-800/50 rounded-xl p-6 border border-slate-700 transition-opacity duration-500 ${!formData.equipmentTypeId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-cyan-400" />
            4. בטיחות ותקינה
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 bg-slate-900/50 p-4 rounded-lg flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-1">תדירות בדיקה (חודשים)</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={formData.inspectionFrequencyMonths} onChange={(e) => handleChange('inspectionFrequencyMonths', parseInt(e.target.value) || 12)} className="w-20 px-3 py-1 bg-slate-900 border border-slate-700 rounded text-white text-center" />
                  <span className="text-slate-400 text-sm">חודשים</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.useCustomFrequency} onChange={(e) => handleChange('useCustomFrequency', e.target.checked)} className="rounded bg-slate-700 border-slate-600 text-emerald-500" />
                <span className="text-sm text-slate-300">תדירות מותאמת אישית</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">מספר רישום מש"ע (רגולציה)</label>
              <input type="text" value={formData.registrationNumber} onChange={(e) => handleChange('registrationNumber', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="מס' רישום משרד העבודה" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">תאריך התקנה</label>
              <input type="date" value={formData.installationDate} onChange={(e) => handleChange('installationDate', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">בדיקה אחרונה</label>
              <input type="date" value={formData.lastInspectionDate} onChange={(e) => handleChange('lastInspectionDate', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">תוקף תעודה (חיצונית)</label>
              <input type="date" value={formData.certificateExpiry} onChange={(e) => handleChange('certificateExpiry', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
          </div>
        </div>

        {/* --- 5. הערות (Notes) --- */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings size={20} className="text-slate-400" />
            5. מידע נוסף
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">תיאור כללי</label>
              <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="תיאור קצר..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">הערות תפעוליות</label>
              <textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="הערות..." />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">ביטול</button>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2">
            {saving ? 'שומר...' : <><Save size={18} /> {isEditMode ? 'עדכן ציוד' : 'שמור ציוד'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
