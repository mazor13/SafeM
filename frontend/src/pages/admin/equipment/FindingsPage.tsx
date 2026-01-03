import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useFindings, FindingStatus } from '../../../phase4-equipment';

export default function FindingsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { findings, loading, error, stats, updateStatus } = useFindings({ realtime: true });

  const filteredFindings = filterStatus === 'all' 
    ? findings 
    : findings.filter(f => f.status === filterStatus);

  const getSeverityColor = (s: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      major: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      minor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      observation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return colors[s] || 'bg-slate-500/20 text-slate-400';
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="text-amber-400" />
            ניהול ממצאים
          </h1>
          <p className="text-slate-400 mt-1">מעקב וטיפול בממצאי בדיקות</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-slate-400">סה"כ</p>
        </div>
        <div className="bg-rose-500/10 rounded-xl p-4 border border-rose-500/30">
          <p className="text-2xl font-bold text-rose-400">{stats.open}</p>
          <p className="text-sm text-rose-300">פתוח</p>
        </div>
        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
          <p className="text-2xl font-bold text-amber-400">{stats.inProgress}</p>
          <p className="text-sm text-amber-300">בטיפול</p>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
          <p className="text-2xl font-bold text-emerald-400">{stats.closed}</p>
          <p className="text-sm text-emerald-300">סגור</p>
        </div>
        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
          <p className="text-2xl font-bold text-purple-400">{stats.overdue}</p>
          <p className="text-sm text-purple-300">באיחור</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="open">פתוח</option>
          <option value="in_progress">בטיפול</option>
          <option value="resolved">טופל</option>
          <option value="closed">סגור</option>
        </select>
      </div>

      {error && <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 text-rose-400">{error.message}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFindings.length === 0 ? (
            <div className="bg-slate-800/30 rounded-xl p-12 text-center text-slate-500">לא נמצאו ממצאים</div>
          ) : (
            filteredFindings.map(finding => (
              <div key={finding.id} className={`bg-slate-800/50 rounded-xl p-4 border ${getSeverityColor(finding.severity)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                      {finding.severity}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-2">{finding.title}</h3>
                    <p className="text-slate-400 text-sm">{finding.description}</p>
                  </div>
                  {finding.status === 'open' && (
                    <button
                      onClick={() => updateStatus(finding.id, 'in_progress' as FindingStatus)}
                      className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded text-sm hover:bg-amber-500/30"
                    >
                      התחל טיפול
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
