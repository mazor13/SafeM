/**
 * Equipment Form Page
 * טופס הוספת/עריכת ציוד
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowRight, 
  Save, 
  Box, 
  Building2,
  Calendar,
  FileText,
  Settings,
  AlertCircle
} from 'lucide-react';

import { 
  useEquipment, 
  Equipment,
  EQUIPMENT_TYPES,
  SafetyDomain,
  SAFETY_DOMAINS,
} from '../../../phase4-equipment';

import { useAuth } from '../../../providers/AuthProvider';

// Equipment Status options
const STATUS_OPTIONS = [
  { value: 'active', label: 'פעיל', color: 'emerald' },
  { value: 'inactive', label: 'לא פעיל', color: 'slate' },
  { value: 'maintenance', label: 'בתחזוקה', color: 'amber' },
  { value: 'retired', label: 'הוצא משימוש', color: 'rose' },
];

// Form data interface
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
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const { addEquipment, updateEquipment, equipment } = useEquipment();

  const [formData, setFormData] = useState<EquipmentFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);

  // Load clients (simplified - from equipment data for now)
  useEffect(() => {
    const uniqueClients = new Map<string, string>();
    equipment.forEach(eq => {
      if (eq.clientId) {
        uniqueClients.set(eq.clientId, eq.clientId); // In real app, fetch client names
      }
    });
    // Add a demo client if none exist
    if (uniqueClients.size === 0) {
      uniqueClients.set('demo-client', 'לקוח לדוגמה');
    }
    setClients(Array.from(uniqueClients.entries()).map(([id, name]) => ({ id, name })));
  }, [equipment]);

  // Filter equipment types by selected domain
  const filteredEquipmentTypes = useMemo(() => {
    if (!formData.domain) return [];
    return EQUIPMENT_TYPES.filter(t => t.domain === formData.domain);
  }, [formData.domain]);

  // Update frequency when equipment type changes (if not custom)
  useEffect(() => {
    if (!formData.useCustomFrequency && formData.equipmentTypeId) {
      const selectedType = EQUIPMENT_TYPES.find(t => t.id === formData.equipmentTypeId);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          inspectionFrequencyMonths: selectedType.inspectionFrequency,
        }));
      }
    }
  }, [formData.equipmentTypeId, formData.useCustomFrequency]);

  // Load existing equipment for edit mode
  useEffect(() => {
    if (isEditMode && id) {
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
          installationDate: existingEquipment.installationDate 
            ? new Date(existingEquipment.installationDate).toISOString().split('T')[0] 
            : '',
          locationDescription: existingEquipment.locationDescription || '',
          inspectionFrequencyMonths: existingEquipment.inspectionFrequencyMonths || 12,
          useCustomFrequency: false,
          frequencyNotes: '',
          lastInspectionDate: existingEquipment.lastInspectionDate
            ? new Date(existingEquipment.lastInspectionDate).toISOString().split('T')[0]
            : '',
          certificateNumber: existingEquipment.certificateNumber || '',
          certificateExpiry: existingEquipment.certificateExpiry
            ? new Date(existingEquipment.certificateExpiry).toISOString().split('T')[0]
            : '',
          notes: existingEquipment.notes || '',
        });
      }
    }
  }, [isEditMode, id, equipment]);

  // Handle input change
  const handleChange = (field: keyof EquipmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Reset equipment type when domain changes
    if (field === 'domain') {
      setFormData(prev => ({ ...prev, equipmentTypeId: '' }));
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EquipmentFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שם הציוד הוא שדה חובה';
    } else if (formData.name.length < 2) {
      newErrors.name = 'שם הציוד חייב להכיל לפחות 2 תווים';
    }

    if (!formData.domain) {
      newErrors.domain = 'יש לבחור תחום בטיחות';
    }

    if (!formData.equipmentTypeId) {
      newErrors.equipmentTypeId = 'יש לבחור סוג ציוד';
    }

    if (!formData.clientId) {
      newErrors.clientId = 'יש לבחור לקוח';
    }

    if (!formData.status) {
      newErrors.status = 'יש לבחור סטטוס';
    }

    if (formData.manufactureYear) {
      const year = parseInt(formData.manufactureYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1950 || year > currentYear) {
        newErrors.manufactureYear = `שנת ייצור חייבת להיות בין 1950 ל-${currentYear}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);

      const equipmentData: Partial<Equipment> = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        domain: formData.domain as SafetyDomain,
        equipmentTypeId: formData.equipmentTypeId,
        clientId: formData.clientId,
        status: formData.status as any,
        serialNumber: formData.serialNumber.trim() || undefined,
        internalId: formData.internalId.trim() || undefined,
        registrationNumber: formData.registrationNumber.trim() || undefined,
        manufacturer: formData.manufacturer.trim() || undefined,
        model: formData.model.trim() || undefined,
        manufactureYear: formData.manufactureYear ? parseInt(formData.manufactureYear) : undefined,
        installationDate: formData.installationDate ? new Date(formData.installationDate) : undefined,
        locationDescription: formData.locationDescription.trim() || undefined,
        inspectionFrequencyMonths: formData.inspectionFrequencyMonths,
        lastInspectionDate: formData.lastInspectionDate ? new Date(formData.lastInspectionDate) : undefined,
        certificateNumber: formData.certificateNumber.trim() || undefined,
        certificateExpiry: formData.certificateExpiry ? new Date(formData.certificateExpiry) : undefined,
        notes: formData.notes.trim() || undefined,
      };

      if (isEditMode && id) {
        await updateEquipment(id, equipmentData);
      } else {
        await addEquipment(equipmentData);
      }

      navigate('/admin/equipment');
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert('שגיאה בשמירת הציוד');
    } finally {
      setSaving(false);
    }
  };

  // Get default frequency for display
  const getDefaultFrequency = () => {
    if (formData.equipmentTypeId) {
      const type = EQUIPMENT_TYPES.find(t => t.id === formData.equipmentTypeId);
      return type?.inspectionFrequency || 12;
    }
    return 12;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/equipment')}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowRight className="text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Box className="text-emerald-400" />
            {isEditMode ? 'עריכת ציוד' : 'הוספת ציוד חדש'}
          </h1>
          <p className="text-slate-400 mt-1">מלא את הפרטים הנדרשים</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section: Basic Info */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Box size={20} className="text-emerald-400" />
            פרטים בסיסיים
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                שם הציוד <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.name ? 'border-rose-500' : 'border-slate-700'
                }`}
                placeholder="לדוגמה: מטף אבקה - קומה 1"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-rose-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                תחום בטיחות <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.domain}
                onChange={(e) => handleChange('domain', e.target.value)}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.domain ? 'border-rose-500' : 'border-slate-700'
                }`}
              >
                <option value="">בחר תחום...</option>
                {Object.entries(SAFETY_DOMAINS).map(([key, domain]) => (
                  <option key={key} value={key}>
                    {domain.name}
                  </option>
                ))}
              </select>
              {errors.domain && (
                <p className="mt-1 text-sm text-rose-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.domain}
                </p>
              )}
            </div>

            {/* Equipment Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                סוג ציוד <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.equipmentTypeId}
                onChange={(e) => handleChange('equipmentTypeId', e.target.value)}
                disabled={!formData.domain}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 ${
                  errors.equipmentTypeId ? 'border-rose-500' : 'border-slate-700'
                }`}
              >
                <option value="">בחר סוג ציוד...</option>
                {filteredEquipmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.equipmentTypeId && (
                <p className="mt-1 text-sm text-rose-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.equipmentTypeId}
                </p>
              )}
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                לקוח <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => handleChange('clientId', e.target.value)}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.clientId ? 'border-rose-500' : 'border-slate-700'
                }`}
              >
                <option value="">בחר לקוח...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="mt-1 text-sm text-rose-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.clientId}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                סטטוס <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.status ? 'border-rose-500' : 'border-slate-700'
                }`}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section: Identification */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-400" />
            זיהוי
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">מספר סידורי</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => handleChange('serialNumber', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="S/N"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">מזהה פנימי</label>
              <input
                type="text"
                value={formData.internalId}
                onChange={(e) => handleChange('internalId', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="מזהה ארגוני"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">מספר רישום מש"ע</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="מספר רישום משרד העבודה"
              />
            </div>
          </div>
        </div>

        {/* Section: Manufacturer */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-purple-400" />
            יצרן ומפרט
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">יצרן</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => handleChange('manufacturer', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">דגם</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">שנת ייצור</label>
              <input
                type="number"
                value={formData.manufactureYear}
                onChange={(e) => handleChange('manufactureYear', e.target.value)}
                min="1950"
                max={new Date().getFullYear()}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.manufactureYear ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
              {errors.manufactureYear && (
                <p className="mt-1 text-sm text-rose-400">{errors.manufactureYear}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">תאריך התקנה</label>
              <input
                type="date"
                value={formData.installationDate}
                onChange={(e) => handleChange('installationDate', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section: Location */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-amber-400" />
            מיקום
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">תיאור מיקום</label>
            <input
              type="text"
              value={formData.locationDescription}
              onChange={(e) => handleChange('locationDescription', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="לדוגמה: קומה 2, חדר שרתים"
            />
          </div>
        </div>

        {/* Section: Inspections */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-cyan-400" />
            בדיקות
          </h2>
          
          <div className="space-y-4">
            {/* Frequency Selection */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.useCustomFrequency}
                    onChange={() => handleChange('useCustomFrequency', false)}
                    className="text-emerald-500"
                  />
                  <span className="text-slate-300">
                    לפי תקן ({getDefaultFrequency()} חודשים)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.useCustomFrequency}
                    onChange={() => handleChange('useCustomFrequency', true)}
                    className="text-emerald-500"
                  />
                  <span className="text-slate-300">תדירות מותאמת אישית</span>
                </label>
              </div>

              {formData.useCustomFrequency && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      תדירות בדיקה (חודשים)
                    </label>
                    <input
                      type="number"
                      value={formData.inspectionFrequencyMonths}
                      onChange={(e) => handleChange('inspectionFrequencyMonths', parseInt(e.target.value) || 12)}
                      min="1"
                      max="60"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      הערות לתדירות
                    </label>
                    <input
                      type="text"
                      value={formData.frequencyNotes}
                      onChange={(e) => handleChange('frequencyNotes', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="לדוגמה: הסכם מיוחד עם הלקוח"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">תאריך בדיקה אחרונה</label>
                <input
                  type="date"
                  value={formData.lastInspectionDate}
                  onChange={(e) => handleChange('lastInspectionDate', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">מספר תעודה</label>
                <input
                  type="text"
                  value={formData.certificateNumber}
                  onChange={(e) => handleChange('certificateNumber', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">תוקף תעודה</label>
                <input
                  type="date"
                  value={formData.certificateExpiry}
                  onChange={(e) => handleChange('certificateExpiry', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Notes */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings size={20} className="text-slate-400" />
            הערות נוספות
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">תיאור</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="תיאור קצר של הציוד"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">הערות</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="הערות נוספות..."
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/equipment')}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                שומר...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditMode ? 'עדכן ציוד' : 'שמור ציוד'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
