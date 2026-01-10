import React, { useState } from 'react';
import { History, Download, Loader2 } from 'lucide-react';
import { useEquipment } from '../../../phase4-equipment';
import { exportInspectionsList } from '../../../phase5-reports/services/ExcelExport';

export default function InspectionHistoryPage() {
  const { equipment, loading } = useEquipment();
  const [exporting, setExporting] = useState(false);

  // Get equipment with last inspection info
  const inspectionHistory = equipment
    .filter(eq => eq.lastInspectionDate)
    .map(eq => ({
      id: eq.id,
      equipmentName: eq.name,
      lastInspection: eq.lastInspectionDate,
      result: eq.lastInspectionResult,
      nextInspection: eq.nextInspectionDate,
    }))
    .sort((a, b) => new Date(b.lastInspection!).getTime() - new Date(a.lastInspection!).getTime());

  const handleExport = async () => {
    if (inspectionHistory.length === 0) {
      alert('אין נתונים לייצוא');
      return;
    }
    setExporting(true);
    try {
      const exportData = inspectionHistory.map(item => ({
        templateName: item.equipmentName,
        clientName: '',
        siteName: '',
        status: item.result === 'pass' ? 'עבר' : item.result === 'fail' ? 'נכשל' : 'מותנה',
        score: item.result === 'pass' ? 1 : item.result === 'fail' ? 0 : 0.5,
        createdAt: item.lastInspection,
      }));
      exportInspectionsList(exportData);
    } catch (err) {
      console.error('Export error:', err);
      alert('שגיאה בייצוא');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <History className="text-cyan-400" />
            היסטוריית בדיקות
          </h1>
          <p className="text-slate-400 mt-1">{inspectionHistory.length} רשומות</p>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting || inspectionHistory.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          {exporting ? 'מייצא...' : 'ייצא לאקסל'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-right text-sm text-slate-400">ציוד</th>
                <th className="px-4 py-3 text-right text-sm text-slate-400">תאריך בדיקה</th>
                <th className="px-4 py-3 text-right text-sm text-slate-400">תוצאה</th>
                <th className="px-4 py-3 text-right text-sm text-slate-400">בדיקה הבאה</th>
              </tr>
            </thead>
            <tbody>
              {inspectionHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                    אין היסטוריית בדיקות
                  </td>
                </tr>
              ) : (
                inspectionHistory.map(item => (
                  <tr key={item.id} className="border-t border-slate-700">
                    <td className="px-4 py-3 text-white">{item.equipmentName}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.lastInspection ? new Date(item.lastInspection).toLocaleDateString('he-IL') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.result === 'pass' ? 'bg-emerald-500/20 text-emerald-400' :
                        item.result === 'fail' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.result === 'pass' ? 'עבר' : item.result === 'fail' ? 'נכשל' : 'מותנה'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.nextInspection ? new Date(item.nextInspection).toLocaleDateString('he-IL') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
