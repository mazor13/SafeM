import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useEquipment, useFindings } from '../../../phase4-equipment';

export default function CompliancePage() {
  const { stats: eqStats, loading: eqLoading } = useEquipment();
  const { stats: fStats, loading: fLoading } = useFindings();

  const loading = eqLoading || fLoading;
  
  const complianceRate = eqStats.total > 0 
    ? Math.round(((eqStats.total - eqStats.inspectionOverdue) / eqStats.total) * 100) 
    : 100;

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <CheckCircle className="text-emerald-400" />
            ציות ותקינות
          </h1>
          <p className="text-slate-400 mt-1">מעקב אחר עמידה בדרישות</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Compliance Score */}
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
            <div className="text-6xl font-bold mb-2" style={{
              color: complianceRate >= 80 ? '#10b981' : complianceRate >= 60 ? '#f59e0b' : '#ef4444'
            }}>
              {complianceRate}%
            </div>
            <p className="text-slate-400">ציון ציות כללי</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">מצב בדיקות</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">סה"כ ציוד</span>
                  <span className="text-white font-semibold">{eqStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">באיחור</span>
                  <span className="text-rose-400 font-semibold">{eqStats.inspectionOverdue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">בקרוב (30 יום)</span>
                  <span className="text-amber-400 font-semibold">{eqStats.inspectionDueSoon}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">ממצאים פתוחים</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">סה"כ פתוחים</span>
                  <span className="text-white font-semibold">{fStats.open}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">באיחור</span>
                  <span className="text-rose-400 font-semibold">{fStats.overdue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">בטיפול</span>
                  <span className="text-amber-400 font-semibold">{fStats.inProgress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
