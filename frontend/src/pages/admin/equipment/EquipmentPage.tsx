import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Box } from 'lucide-react';
import { EquipmentList, EquipmentListStyles, useEquipment, Equipment } from '../../../phase4-equipment';

export default function EquipmentPage() {
  const navigate = useNavigate();
  const { equipment, loading, error, stats, deleteEquipment } = useEquipment({ realtime: true });

  const handleSelect = (eq: Equipment) => navigate(`/admin/equipment/${eq.id}`);
  const handleEdit = (eq: Equipment) => navigate(`/admin/equipment/${eq.id}/edit`);
  const handleDelete = async (eq: Equipment) => {
    if (window.confirm(`האם למחוק את "${eq.name}"?`)) {
      await deleteEquipment(eq.id);
    }
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
        <button
          onClick={() => navigate('/admin/equipment/new')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
        >
          <Plus size={18} />
          הוסף ציוד
        </button>
      </div>
      {error && <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 text-rose-400">{error.message}</div>}
      <EquipmentList
        equipment={equipment}
        loading={loading}
        onSelect={handleSelect}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={() => navigate('/admin/equipment/new')}
      />
    </div>
  );
}
