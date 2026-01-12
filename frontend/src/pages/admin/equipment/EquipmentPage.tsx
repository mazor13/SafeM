import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Box, Download, Loader2, Bell, LayoutGrid, Table2 } from 'lucide-react';
import { EquipmentList, EquipmentListStyles, useEquipment, Equipment } from '../../../phase4-equipment';
import { ExcelImport } from '../../../components/import';
import { exportEquipmentList } from '../../../phase5-reports/services/ExcelExport';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore, functions } from '../../../firebase';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '../../../providers/AuthProvider';
import { DynamicTable } from '../../../components/dynamic-columns';
import type { CellValue } from '../../../types/columns';

type ViewMode = 'cards' | 'table';

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
  const [exporting, setExporting] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Transform equipment to table row format
  const tableData = useMemo(() => {
    return equipment.map(eq => {
      const formatDate = (date: Date | string | undefined | null): string | null => {
        if (!date) return null;
        if (date instanceof Date) return date.toISOString();
        if (typeof date === 'string') return date;
        return null;
      };

      return {
        id: eq.id,
        name: { type: 'text', value: eq.name } as CellValue,
        description: { type: 'text', value: eq.description || '' } as CellValue,
        serialNumber: { type: 'text', value: eq.serialNumber || '' } as CellValue,
        manufacturer: { type: 'text', value: eq.manufacturer || '' } as CellValue,
        model: { type: 'text', value: eq.model || '' } as CellValue,
        status: { type: 'status', optionId: eq.status } as CellValue,
        locationDescription: { type: 'text', value: eq.locationDescription || '' } as CellValue,
        installationDate: { type: 'date', value: formatDate(eq.installationDate) } as CellValue,
        nextInspectionDate: { type: 'date', value: formatDate(eq.nextInspectionDate) } as CellValue,
        domain: { type: 'text', value: eq.domain || '' } as CellValue,
      };
    });
  }, [equipment]);

  const handleSelect = (eq: Equipment) => navigate(`/admin/equipment/${eq.id}/edit`);
  const handleEdit = (eq: Equipment) => navigate(`/admin/equipment/${eq.id}/edit`);
  
  const handleDelete = async (eq: Equipment) => {
    if (window.confirm(`האם למחוק את "${eq.name}"?`)) {
      await deleteEquipment(eq.id);
    }
  };

  const handleRowClick = (rowId: string) => {
    navigate(`/admin/equipment/${rowId}/edit`);
  };

  const handleExport = async () => {
    if (equipment.length === 0) {
      alert('אין ציוד לייצוא');
      return;
    }
    setExporting(true);
    try {
      exportEquipmentList(equipment);
    } catch (err) {
      console.error('Export error:', err);
      alert('שגיאה בייצוא');
    } finally {
      setExporting(false);
    }
  };

  const handleTestReminders = async () => {
    if (!user?.tenantId) {
      alert('לא נמצא מזהה טננט');
      return;
    }

    setSendingReminders(true);
    try {
      const triggerReminders = httpsCallable(functions, 'triggerRemindersManually');
      const result = await triggerReminders({
        tenantId: user.tenantId,
        testEmail: user.email
      });
      
      const data = result.data as any;
      if (data.success) {
        const sentCount = data.results?.filter((r: any) => r.sent).length || 0;
        alert(`✅ נשלחו ${sentCount} תזכורות ל-${data.emailTo}\n\nציוד עם בדיקות ב-30 הימים הקרובים:\n${data.results?.map((r: any) => `• ${r.equipment} (${r.daysUntil} ימים)`).join('\n') || 'אין'}`);
      } else {
        alert('לא נשלחו תזכורות');
      }
    } catch (err: any) {
      console.error('Reminder error:', err);
      alert('שגיאה בשליחת תזכורות: ' + (err.message || err));
    } finally {
      setSendingReminders(false);
    }
  };

  const handleImport = async (data: Record<string, any>[]) => {
    let success = 0;
    let failed = 0;
    const errors: { row: number; message: string }[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
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
          clientId: user?.clientId || '',
          isDeleted: false,
        });
        success++;
      } catch (err: any) {
        failed++;
        errors.push({ row: i + 1, message: err.message });
      }
    }

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
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="תצוגת כרטיסים"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="תצוגת טבלה"
            >
              <Table2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleTestReminders}
            disabled={sendingReminders}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="שלח תזכורות לציוד עם בדיקות קרובות"
          >
            {sendingReminders ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Bell size={18} />
            )}
            {sendingReminders ? 'שולח...' : 'בדוק תזכורות'}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || equipment.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {exporting ? 'מייצא...' : 'ייצא לאקסל'}
          </button>
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

      {viewMode === 'table' ? (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <DynamicTable
            entityType="equipment"
            data={tableData}
            loading={loading}
            onRowClick={handleRowClick}
            selectable={true}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            emptyMessage="לא נמצא ציוד"
            className="!shadow-none !rounded-none"
          />
        </div>
      ) : (
        <EquipmentList
          equipment={equipment}
          loading={loading}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={() => navigate('/admin/equipment/new')}
        />
      )}

      {/* Selection info */}
      {viewMode === 'table' && selectedRows.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl px-6 py-3 shadow-xl flex items-center gap-4">
          <span className="text-white">{selectedRows.length} פריטים נבחרו</span>
          <button
            onClick={() => setSelectedRows([])}
            className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
          >
            בטל בחירה
          </button>
          <button
            onClick={() => {/* Bulk action */}}
            className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30"
          >
            פעולה מרוכזת
          </button>
        </div>
      )}

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
