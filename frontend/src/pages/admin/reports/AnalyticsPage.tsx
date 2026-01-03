import React from 'react';
import { PieChart } from 'lucide-react';
import { useEquipment, useFindings } from '../../../phase4-equipment';

export default function AnalyticsPage() {
  const { stats: equipmentStats, loading: eqLoading } = useEquipment();
  const { stats: findingsStats, loading: fLoading } = useFindings();

  const loading = eqLoading || fLoading;

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <PieChart className="text-cyan-400" />
            אנליטיקות
          </h1>
          <p className="text-slate-400 mt-1">מבט כולל על מצב הבטיחות</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Equipment Stats */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">סטטיסטיקות ציוד</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">{equipmentStats.total}</p>
                <p className="text-sm text-slate-400">סה"כ ציוד</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-rose-400">{equipmentStats.inspectionOverdue}</p>
                <p className="text-sm text-slate-400">בדיקות באיחור</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-amber-400">{equipmentStats.inspectionDueSoon}</p>
                <p className="text-sm text-slate-400">בדיקות בקרוב</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{equipmentStats.requireingCertification}</p>
                <p className="text-sm text-slate-400">דורש הסמכה</p>
              </div>
            </div>
          </div>

          {/* Findings Stats */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">סטטיסטיקות ממצאים</h2>
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">{findingsStats.total}</p>
                <p className="text-sm text-slate-400">סה"כ</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-rose-400">{findingsStats.open}</p>
                <p className="text-sm text-slate-400">פתוח</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-amber-400">{findingsStats.inProgress}</p>
                <p className="text-sm text-slate-400">בטיפול</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">{findingsStats.closed}</p>
                <p className="text-sm text-slate-400">סגור</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-400">{findingsStats.overdue}</p>
                <p className="text-sm text-slate-400">באיחור</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
