import React, { useState, useMemo } from 'react';
import { AlertTriangle, Mail, Loader2, Download, LayoutGrid, Table2 } from 'lucide-react';
import { useFindings, FindingStatus } from '../../../phase4-equipment';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { exportFindingsList } from '../../../phase5-reports/services/ExcelExport';
import { DynamicTable } from '../../../components/dynamic-columns';
import type { CellValue } from '../../../types/columns';

type ViewMode = 'cards' | 'table';

export default function FindingsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const { findings, loading, error, stats, updateStatus } = useFindings({ realtime: true });
  
  const filteredFindings = filterStatus === 'all' 
    ? findings 
    : findings.filter(f => f.status === filterStatus);

  // Transform findings to table row format
  const tableData = useMemo(() => {
    return filteredFindings.map(finding => ({
      id: finding.id,
      // Map finding fields to column IDs
      title: { type: 'text', value: finding.title } as CellValue,
      description: { type: 'text', value: finding.description || '' } as CellValue,
      severity: { type: 'status', optionId: finding.severity } as CellValue,
      status: { type: 'status', optionId: finding.status } as CellValue,
      category: { type: 'text', value: finding.category || '' } as CellValue,
      locationDescription: { type: 'text', value: finding.locationDescription || '' } as CellValue,
      foundDate: { type: 'date', value: finding.foundDate?.toISOString?.() || (finding.foundDate instanceof Date ? finding.foundDate.toISOString() : null) } as CellValue,
      dueDate: { type: 'date', value: finding.dueDate?.toISOString?.() || (finding.dueDate instanceof Date ? finding.dueDate.toISOString() : null) } as CellValue,
      assignedToName: { type: 'text', value: finding.assignedToName || '' } as CellValue,
    }));
  }, [filteredFindings]);

  const getSeverityColor = (s: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      major: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      minor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      observation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return colors[s] || 'bg-slate-500/20 text-slate-400';
  };

  const getSeverityText = (s: string) => {
    const texts: Record<string, string> = {
      critical: 'קריטי',
      major: 'משמעותי',
      high: 'גבוה',
      minor: 'קל',
      medium: 'בינוני',
      low: 'נמוך',
      observation: 'הערה',
    };
    return texts[s] || s;
  };

  const handleSendEmail = async (finding: any) => {
    const email = prompt('הכנס כתובת מייל לשליחה:');
    if (!email) return;
    setSendingEmail(finding.id);
    try {
      const functions = getFunctions();
      const sendEmailNotification = httpsCallable(functions, 'sendEmailNotification');
      await sendEmailNotification({
        to: email,
        subject: `ממצא חדש: ${finding.title}`,
        type: 'finding_created',
        data: {
          title: finding.title,
          description: finding.description,
          severity: finding.severity,
          severityText: getSeverityText(finding.severity),
          clientName: finding.clientName || 'לא צוין',
          siteName: finding.siteName || 'לא צוין',
        }
      });
      alert('המייל נשלח בהצלחה!');
    } catch (err) {
      console.error('Error sending email:', err);
      alert('שגיאה בשליחת המייל');
    } finally {
      setSendingEmail(null);
    }
  };

  const handleExport = async () => {
    if (filteredFindings.length === 0) {
      alert('אין ממצאים לייצוא');
      return;
    }
    setExporting(true);
    try {
      exportFindingsList(filteredFindings);
    } catch (err) {
      console.error('Export error:', err);
      alert('שגיאה בייצוא');
    } finally {
      setExporting(false);
    }
  };

  const handleRowClick = (rowId: string) => {
    console.log('Finding clicked:', rowId);
  };

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="text-amber-400" />
            ניהול ממצאים
          </h1>
          <p className="text-slate-400 mt-1">מעקב וטיפול בממצאי בדיקות</p>
        </div>
      </div>

      {/* Stats */}
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

      {/* Toolbar */}
      <div className="bg-slate-800/50 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
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

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-amber-500/20 text-amber-400' 
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
                  ? 'bg-amber-500/20 text-amber-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="תצוגת טבלה"
            >
              <Table2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting || filteredFindings.length === 0}
          className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {exporting ? 'מייצא...' : 'ייצא לאקסל'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 text-rose-400">
          {error.message}
        </div>
      )}
      
      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
        </div>
      ) : viewMode === 'table' ? (
        /* Dynamic Table View */
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <DynamicTable
            entityType="finding"
            data={tableData}
            loading={loading}
            onRowClick={handleRowClick}
            selectable={true}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            emptyMessage="לא נמצאו ממצאים"
            className="!shadow-none !rounded-none"
          />
        </div>
      ) : (
        /* Cards View */
        <div className="space-y-4">
          {filteredFindings.length === 0 ? (
            <div className="bg-slate-800/30 rounded-xl p-12 text-center text-slate-500">
              לא נמצאו ממצאים
            </div>
          ) : (
            filteredFindings.map(finding => (
              <div 
                key={finding.id} 
                className={`bg-slate-800/50 rounded-xl p-4 border ${getSeverityColor(finding.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                      {getSeverityText(finding.severity)}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-2">{finding.title}</h3>
                    <p className="text-slate-400 text-sm">{finding.description}</p>
                    {finding.category && (
                      <p className="text-slate-500 text-xs mt-1">קטגוריה: {finding.category}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendEmail(finding)}
                      disabled={sendingEmail === finding.id}
                      className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded text-sm hover:bg-indigo-500/30 flex items-center gap-1 disabled:opacity-50"
                    >
                      {sendingEmail === finding.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                      שלח מייל
                    </button>
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
              </div>
            ))
          )}
        </div>
      )}

      {/* Selection info */}
      {viewMode === 'table' && selectedRows.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl px-6 py-3 shadow-xl flex items-center gap-4">
          <span className="text-white">{selectedRows.length} ממצאים נבחרו</span>
          <button
            onClick={() => setSelectedRows([])}
            className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
          >
            בטל בחירה
          </button>
          <button
            onClick={() => {/* Bulk action */}}
            className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded hover:bg-amber-500/30"
          >
            פעולה מרוכזת
          </button>
        </div>
      )}
    </div>
  );
}
