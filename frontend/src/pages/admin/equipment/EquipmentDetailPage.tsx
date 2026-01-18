import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { Equipment, SAFETY_DOMAINS, SafetyDomain } from '../../../types/equipment.types';
import { 
  ArrowRight, Calendar, MapPin, Shield, Tag, 
  Activity, PenTool, CheckCircle, AlertTriangle 
} from 'lucide-react';

export default function EquipmentDetailPage() {
  const { equipmentId } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!equipmentId) return;
      try {
        const docRef = doc(firestore, 'equipment', equipmentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEquipment({ id: docSnap.id, ...docSnap.data() } as Equipment);
        }
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [equipmentId]);

  if (loading) return <div className="p-8 text-center text-gray-500">טוען נתונים...</div>;
  if (!equipment) return <div className="p-8 text-center text-red-500">הציוד לא נמצא.</div>;

  const domainInfo = SAFETY_DOMAINS[equipment.domain as SafetyDomain] || { name: equipment.domain, color: 'gray', icon: 'help-circle' };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* Header */}
      <div className="max-w-4xl mx-auto space-y-6">
        <button 
          onClick={() => navigate('/admin/equipment')} 
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          חזרה לרשימת הציוד
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Top Banner */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start">
            <div className="flex gap-4">
              <div className={`p-4 rounded-xl bg-${domainInfo.color}-50 text-${domainInfo.color}-600`}>
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{equipment.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                  <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                    {equipment.type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span>•</span>
                  <span>SN: {equipment.serialNumber || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2
              ${equipment.status === 'active' ? 'bg-green-100 text-green-700' : 
                equipment.status === 'expired' ? 'bg-red-100 text-red-700' : 
                'bg-gray-100 text-gray-700'}`}
            >
              {equipment.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {equipment.status === 'active' ? 'תקין' : equipment.status === 'expired' ? 'פג תוקף' : equipment.status}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Location Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> מיקום
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">אתר:</span>
                  <span className="font-medium text-gray-900">טוען שם אתר...</span> {/* TODO: Fetch site name */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">מבנה:</span>
                  <span className="font-medium text-gray-900">ללא</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">אזור/חדר:</span>
                  <span className="font-medium text-gray-900">ללא</span>
                </div>
              </div>
            </div>

            {/* Technical Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" /> פרטים טכניים
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">יצרן:</span>
                  <span className="font-medium text-gray-900">{equipment.manufacturer || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">דגם:</span>
                  <span className="font-medium text-gray-900">{equipment.model || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">תאריך התקנה:</span>
                  <span className="font-medium text-gray-900">
                    {equipment.installationDate ? new Date(equipment.installationDate.seconds * 1000).toLocaleDateString('he-IL') : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates & Inspections */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> בדיקות ותוקף
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center">
                  <span className="text-gray-500 text-sm mb-1">בדיקה אחרונה</span>
                  <span className="text-lg font-bold text-gray-900">
                    {equipment.lastInspectionDate ? new Date(equipment.lastInspectionDate.seconds * 1000).toLocaleDateString('he-IL') : '-'}
                  </span>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center bg-blue-50 border-blue-100">
                  <span className="text-blue-600 text-sm mb-1 font-medium">בדיקה הבאה</span>
                  <span className="text-lg font-bold text-blue-700">
                    {equipment.nextInspectionDate ? new Date(equipment.nextInspectionDate.seconds * 1000).toLocaleDateString('he-IL') : '-'}
                  </span>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center">
                  <span className="text-gray-500 text-sm mb-1">תדירות נדרשת</span>
                  <span className="text-lg font-bold text-gray-900">שנתית</span>
                </div>
              </div>
            </div>

          </div>
          
          {/* Actions Footer */}
          <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
            <button className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">היסטוריית טיפולים</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              ערוך פרטים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
