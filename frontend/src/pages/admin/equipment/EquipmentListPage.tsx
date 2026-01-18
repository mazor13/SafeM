import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Filter } from 'lucide-react';
import { useEquipment } from '../../../hooks/useEquipment';
import DynamicTable from '../../../components/dynamic-columns/DynamicTable';
import { SAFETY_DOMAINS, SafetyDomain } from '../../../types/equipment.types';

export default function EquipmentListPage() {
  const navigate = useNavigate();
  const { equipment, loading, fetchEquipment } = useEquipment();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const tableData = equipment.map(item => {
    const domainInfo = SAFETY_DOMAINS[item.domain as SafetyDomain] || { name: item.domain, color: 'gray' };
    
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      // שימוש ב-any כדי לעקוף זמנית את בדיקת הטיפוסים המחמירה של הטבלה
      domain: (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${domainInfo.color}-100 text-${domainInfo.color}-800`}>
          {domainInfo.name}
        </span>
      ) as any,
      serialNumber: item.serialNumber || '-',
      status: (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
          {item.status}
        </span>
      ) as any,
      lastInspection: item.lastInspectionDate ? new Date(item.lastInspectionDate.seconds * 1000).toLocaleDateString('he-IL') : '-',
    };
  });

  const handleRowClick = (rowId: string) => {
    navigate(`/admin/equipment/${rowId}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            רשימת ציוד
          </h1>
        </div>
        <button 
          onClick={() => navigate('/admin/equipment/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          הוסף ציוד
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <DynamicTable
          entityType="equipment"
          data={tableData}
          loading={loading}
          selectable={true}
          selectedRows={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={handleRowClick}
          emptyMessage="לא נמצא ציוד."
        />
      </div>
    </div>
  );
}
