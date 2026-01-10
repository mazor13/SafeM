// ===========================================
// AEGIS - Analytics Page (Firebase Connected)
// Combined: Cortex AI Design + Real Data
// ===========================================

import React, { useState, useMemo } from 'react';
import { 
  ArrowDownTrayIcon, 
  AdjustmentsHorizontalIcon,
  PresentationChartLineIcon,
  MagnifyingGlassIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { useEquipment, useFindings } from '../../../phase4-equipment';

// ===========================================
// COMPONENT
// ===========================================

export default function AnalyticsPage() {
  const { stats: equipmentStats, loading: eqLoading } = useEquipment();
  const { stats: findingsStats, loading: fLoading } = useFindings();
  
  const [reportType, setReportType] = useState('safety');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  const loading = eqLoading || fLoading;

  // ===========================================
  // CALCULATED STATS
  // ===========================================

  const technicalStats = useMemo(() => {
    if (!findingsStats) return [];
    const total = findingsStats.total || 1;
    return [
      { 
        label: 'פתוח', 
        value: Math.round((findingsStats.open / total) * 100) || 0, 
        color: 'bg-rose-500',
        count: findingsStats.open 
      },
      { 
        label: 'בטיפול', 
        value: Math.round((findingsStats.inProgress / total) * 100) || 0, 
        color: 'bg-amber-500',
        count: findingsStats.inProgress 
      },
      { 
        label: 'סגור', 
        value: Math.round((findingsStats.closed / total) * 100) || 0, 
        color: 'bg-emerald-500',
        count: findingsStats.closed 
      },
      { 
        label: 'באיחור', 
        value: Math.round((findingsStats.overdue / total) * 100) || 0, 
        color: 'bg-purple-500',
        count: findingsStats.overdue 
      },
    ];
  }, [findingsStats]);

  // Generate heatmap data based on real stats
  const heatmapData = useMemo(() => {
    const intensity = findingsStats?.total ? Math.min(findingsStats.total / 100, 1) : 0.3;
    return Array.from({ length: 28 }).map((_, i) => {
      const rand = Math.random() * intensity;
      if (rand > 0.6) return 'bg-indigo-600';
      if (rand > 0.4) return 'bg-indigo-400';
      if (rand > 0.2) return 'bg-indigo-200';
      return 'bg-slate-700';
    });
  }, [findingsStats]);

  // ===========================================
  // HANDLERS
  // ===========================================

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('הדוח הוכן בהצלחה! פיצ\'ר זה יהיה זמין בקרוב.');
    }, 2000);
  };

  const handleAiQuery = () => {
    if (!aiQuery.trim()) return;
    alert(`שאילתת AI: "${aiQuery}"\n\nפיצ'ר זה יהיה זמין בקרוב עם אינטגרציית Claude AI.`);
  };

  // ===========================================
  // RENDER
  // ===========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">טוען נתוני אנליטיקס...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ===== AI CORTEX HEADER ===== */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold flex items-center mb-2">
              <CpuChipIcon className="h-8 w-8 ml-3 text-cyan-400" />
              Cortex Analytics Engine
            </h1>
            <p className="text-indigo-200 mb-6 max-w-2xl">
              מנוע BI וניתוח נתונים מתקדם • {equipmentStats.total} פריטי ציוד • {findingsStats.total} ממצאים
            </p>

            {/* AI Query Box */}
            <div className="relative max-w-3xl">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()}
                placeholder="נסה לשאול: 'מה הסטטוס של הממצאים הפתוחים?' או 'כמה ציוד דורש בדיקה?'..." 
                className="w-full bg-white/10 border border-indigo-400/30 rounded-lg py-4 px-12 text-white placeholder-indigo-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-md"
              />
              <MagnifyingGlassIcon className="absolute right-4 top-4 h-6 w-6 text-indigo-300" />
              <button 
                onClick={handleAiQuery}
                className="absolute left-2 top-2 bg-cyan-500 hover:bg-cyan-400 text-indigo-900 font-bold py-2 px-4 rounded-md transition-colors text-sm"
              >
                נתח
              </button>
            </div>
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<WrenchScrewdriverIcon className="h-6 w-6" />}
            label="סה״כ ציוד"
            value={equipmentStats.total}
            color="text-cyan-400"
            bgColor="bg-cyan-500/10"
          />
          <StatCard 
            icon={<ExclamationTriangleIcon className="h-6 w-6" />}
            label="בדיקות באיחור"
            value={equipmentStats.inspectionOverdue}
            color="text-rose-400"
            bgColor="bg-rose-500/10"
          />
          <StatCard 
            icon={<ClipboardDocumentCheckIcon className="h-6 w-6" />}
            label="ממצאים פתוחים"
            value={findingsStats.open}
            color="text-amber-400"
            bgColor="bg-amber-500/10"
          />
          <StatCard 
            icon={<PresentationChartLineIcon className="h-6 w-6" />}
            label="סה״כ ממצאים"
            value={findingsStats.total}
            color="text-indigo-400"
            bgColor="bg-indigo-500/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ===== REPORT CONTROLS ===== */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-6">
            <h3 className="font-bold text-white flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 ml-2 text-slate-400"/> הגדרות דוח
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">סוג הדוח</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'safety', label: 'בטיחות' },
                  { id: 'equipment', label: 'ציוד' },
                  { id: 'findings', label: 'ממצאים' }
                ].map(type => (
                  <button 
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`px-2 py-2 text-xs font-bold rounded border transition-all ${
                      reportType === type.id 
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                      : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-700/50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">ציוד דורש הסמכה</span>
                <span className="text-white font-bold">{equipmentStats.requireingCertification}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">בדיקות בקרוב</span>
                <span className="text-white font-bold">{equipmentStats.inspectionDueSoon}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">ממצאים בטיפול</span>
                <span className="text-white font-bold">{findingsStats.inProgress}</span>
              </div>
            </div>

            <button 
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full flex justify-center items-center bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="animate-pulse">מעבד...</span>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-5 w-5 ml-2" /> 
                  חולל דוח PDF
                </>
              )}
            </button>
          </div>

          {/* ===== VISUALIZATION ===== */}
          <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center">
                <PresentationChartLineIcon className="h-5 w-5 ml-2 text-indigo-500"/> 
                תצוגה מקדימה
              </h3>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Live Data
              </span>
            </div>

            {/* Findings Breakdown Bar */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-slate-400 mb-4">פילוח ממצאים לפי סטטוס</h4>
              {findingsStats.total > 0 ? (
                <>
                  <div className="h-4 bg-slate-900 rounded-full overflow-hidden flex">
                    {technicalStats.map((stat, idx) => (
                      <div 
                        key={idx} 
                        className={`h-full ${stat.color} transition-all`} 
                        style={{ width: `${stat.value}%` }} 
                        title={`${stat.label}: ${stat.count}`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-between mt-3 gap-2">
                    {technicalStats.map((stat, idx) => (
                      <div key={idx} className="flex items-center text-xs text-slate-400">
                        <div className={`w-2 h-2 rounded-full ${stat.color} ml-1`}></div>
                        {stat.label} ({stat.count})
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  אין ממצאים להצגה
                </div>
              )}
            </div>

            {/* Heatmap */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-4">מפת חום: עומס אירועים חודשי</h4>
              <div className="grid grid-cols-7 gap-1">
                {heatmapData.map((bg, i) => (
                  <div 
                    key={i} 
                    className={`h-8 rounded-sm ${bg} hover:ring-2 ring-offset-1 ring-offset-slate-800 ring-indigo-500 transition-all cursor-pointer`} 
                    title={`יום ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                <span>ראשון</span>
                <span>שבת</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

function StatCard({ icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-4 border border-slate-700/50`}>
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
