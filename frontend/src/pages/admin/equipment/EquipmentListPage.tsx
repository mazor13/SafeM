import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEquipment } from '../../../hooks/useEquipment';
import DynamicTable from '../../../components/dynamic-columns/DynamicTable';
import { SAFETY_DOMAINS, SafetyDomain } from '../../../types/equipment.types';

export default function EquipmentListPage() {
  const navigate = useNavigate();
  const { equipment, loading, fetchEquipment } = useEquipment();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // טעינה ראשונית
  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // עיבוד הנתונים לטבלה
  const tableData = equipment.map(item => {
    // שליפת הגדרות התצוגה של התחום (צבע, שם בעברית)
    const domainInfo = SAFETY_DOMAINS[item.domain as SafetyDomain] || { name: item.domain, color: 'gray' };
    
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      // עמודה מותאמת אישית לתחום (Domain)
      domain: (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${domainInfo.color}-100 text-${domainInfo.color}-800`}>
          {domainInfo.name}
        </span>
      ),
      serialNumber: item.serialNumber || '-',
      // עמודה מותאמת לסטטוס
      status: (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium
          ${item.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : 
            item.status === 'expired' ? 'bg-red-50 text-red-700 border border-red-200' : 
            'bg-gray-50 text-gray-600 border border-gray-200'}`}
        >
          {item.status === 'active' && <CheckCircle className="w-3 h-3" />}
          {item.status === 'expired' && <AlertTriangle className="w-3 h-3" />}
          {item.status === 'active' ? 'תקין' : item.status === 'expired' ? 'פג תוקף' : item.status}
        </span>
      ),
      lastInspection: item.lastInspectionDate ? new Date(item.lastInspectionDate.seconds * 1000).toLocaleDateString('he-IL') : '-',
      nextInspection: item.nextInspectionDate ? new Date(item.nextInspectionDate.seconds * 1000).toLocaleDateString('he-IL') : '-'
    };
  });

  const handleRowClick = (rowId: string) => {
    navigate(`/admin/equipment/${rowId}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* כותרת ופעולות */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            רשימת ציוד ונכסים
          </h1>
          <p className="text-gray-500 mt-1">ניהול מלאי הציוד, מעקב תוקף בדיקות וסטטוס תקינות.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">
            <Filter className="w-4 h-4" />
            סינון
          </button>
          <button 
            onClick={() => navigate('/admin/equipment/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            הוסף ציוד
          </button>
        </div>
      </div>

      {/* כרטיסי סיכום (Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">סה״כ פריטים</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{equipment.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">תקינים</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {equipment.filter(e => e.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">פגי תוקף / תקולים</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {equipment.filter(e => ['expired', 'damaged'].includes(e.status)).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">בדיקות החודש</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">-</div> 
        </div>
      </div>

      {/* טבלה */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <DynamicTable
          entityType="equipment" // שומר את העדפות העמודות למשתמש
          data={tableData}
          loading={loading}
          selectable={true}
          selectedRows={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={handleRowClick}
          emptyMessage="לא נמצא ציוד במערכת. לחץ על 'הוסף ציוד' כדי להתחיל."
        />
      </div>
    </div>
  );
}
