import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Box } from 'lucide-react';
import { EquipmentList, EquipmentListStyles, useEquipment, Equipment } from '../../../phase4-equipment';
import { ExcelImport } from '../../../components/import';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useAuth } from '../../../providers/AuthProvider';

const EQUIPMENT_COLUMNS = [
  { key: 'name', label: 'שם הציוד', required: true },
  { key: 'serialNumber', label: 'מספר סידורי', required: true },
  { key: 'manufacturer', label: 'יצרן', required: false },
  { key: 'model', label: 'דגם', required: false },
  { key: 'category', label: 'קטגוריה', required: false },
  { key: 'location', label: 'מיקום', required: false },
  { key: 'purchaseDate', label: 'תאריך רכישה', required: false },
  { key: 'nextInspectionDate', label: 'תאריך בדיקה הבא', required: false },
];

export default function EquipmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { equipment, loading, error, stats, deleteEquipment, refresh } = useEquipment({ realtime: true });
  const [showImport, setShowImport] = useState(false);

  const handleSelect = (eq: Equipment) => navigate(`/admin/equipment/${eq.id}`);
  const handleEdit = (eq: Equipment) => navigate(`/admin/equipment/${eq.id}/edit`);
  const handleDelete = async (eq: Equipment) => {
    if (window.confirm(`האם למחוק את "${eq.name}"?`)) {
      await deleteEquipment(eq.id);
    }
  };

  const handleImport = async (data: Record<string, any>[]) => {
    let success = 0;
    let failed = 0;
    const errors: { row: number; message: string }[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Parse dates if provided
        let purchaseDate = null;
        let nextInspectionDate = null;
        
        if (row.purchaseDate) {
          const pd = new Date(row.purchaseDate);
          if (!isNaN(pd.getTime())) purchaseDate = pd.toISOString().split('T')[0];
        }
        
        if (row.nextInspectionDate) {
          const nid = new Date(row.nextInspectionDate);
          if (!isNaN(nid.getTime())) nextInspectionDate = nid.toISOString().split('T')[0];
        }

        await addDoc(collection(firestore, 'equipment'), {
          name: row.name,
          serialNumber: row.serialNumber,
          manufacturer: row.manufacturer || '',
          model: row.model || '',
          category: row.category || 'אחר',
          location: row.location || '',
          purchaseDate,
          nextInspectionDate,
          status: 'active',
          createdAt: serverTimestamp(),
          createdBy: user?.uid || 'import',
          tenantId: user?.tenantId || 'default',
        });
        success++;
      } catch (err: any) {
        failed++;
        errors.push({ row: i + 1, message: err.message });
      }
    }

    // Refresh the list after import
    if (success > 0 && refresh) {
      refresh();
    }

    return { success, failed, errors };
  };

  return (
    <div className="p-6" dir="rtl">
      <style>{EquipmentListStyles}</style>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Box className="text-emerald-400" />
            ניהול ציוד
          </h1>
          <p className="text-slate-400 mt-1">
            {stats.total} פריטים | {stats.inspectionOverdue} באיחור | {stats.inspectionDueSoon} בקרוב
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Upload size={18} />
            ייבוא מאקסל
          </button>
          <button
            onClick={() => navigate('/admin/equipment/new')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            הוסף ציוד
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 text-rose-400">
          {error.message}
        </div>
      )}

      <EquipmentList
        equipment={equipment}
        loading={loading}
        onSelect={handleSelect}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={() => navigate('/admin/equipment/new')}
      />

      <ExcelImport
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
        columns={EQUIPMENT_COLUMNS}
        title="ייבוא ציוד"
        templateName="equipment_template"
      />
    </div>
  );
}
