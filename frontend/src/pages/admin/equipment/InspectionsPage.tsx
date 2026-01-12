import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, Timestamp, orderBy, query } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ListIcon, Table2, Download, Loader2 } from 'lucide-react';
import { DynamicTable } from '../../../components/dynamic-columns';

interface InspectionListItem {
  id: string;
  title: string;
  type?: string;
  category?: string;
  status?: string;
  overallStatus?: "pass" | "pass_with_remarks" | "fail" | "incomplete";
  scheduledDate?: Timestamp;
  inspectionDate?: Timestamp;
  completedDate?: Timestamp;
  createdAt?: Timestamp;
  clientId?: string;
  facilityId?: string;
  inspectorId?: string;
  inspectorName?: string;
}

function getStatusDisplay(status: string | undefined): { label: string; colorClass: string } {
  const statusMap: Record<string, { label: string; colorClass: string }> = {
    pass: { label: "עבר", colorClass: "bg-emerald-500/20 text-emerald-400" },
    pass_with_remarks: { label: "עבר עם הערות", colorClass: "bg-amber-500/20 text-amber-400" },
    fail: { label: "נכשל", colorClass: "bg-rose-500/20 text-rose-400" },
    incomplete: { label: "לא הושלם", colorClass: "bg-slate-500/20 text-slate-400" },
    draft: { label: "טיוטה", colorClass: "bg-slate-500/20 text-slate-400" },
    scheduled: { label: "מתוכנן", colorClass: "bg-cyan-500/20 text-cyan-400" },
    in_progress: { label: "בביצוע", colorClass: "bg-amber-500/20 text-amber-400" },
    completed: { label: "הושלם", colorClass: "bg-emerald-500/20 text-emerald-400" },
  };
  return statusMap[status || ""] || { label: status || "טיוטה", colorClass: "bg-slate-500/20 text-slate-400" };
}

export default function InspectionsPage() {
  const [list, setList] = useState<InspectionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "table">("list");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, "inspections"), orderBy("createdAt", "desc"));
    getDocs(q).then(snap => {
      setList(snap.docs.map(d => ({ id: d.id, ...d.data() } as InspectionListItem)));
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching inspections:", err);
      setLoading(false);
    });
  }, []);

  const tableData = useMemo(() => {
    return list.map(item => ({
      id: item.id,
      title: { type: "text" as const, value: item.title || "" },
      category: { type: "text" as const, value: item.category || "" },
      overallStatus: { type: "status" as const, optionId: item.overallStatus || "incomplete" },
      status: { type: "status" as const, optionId: item.status || "draft" },
      inspectionDate: { type: "date" as const, value: item.inspectionDate?.toDate?.()?.toISOString() || null },
      createdAt: { type: "date" as const, value: item.createdAt?.toDate?.()?.toISOString() || null },
    }));
  }, [list]);

  const handleRowClick = (id: string) => navigate(`/admin/inspections/${id}`);
  const clearSelection = () => setSelectedRows([]);

  const handleExport = async () => {
    if (list.length === 0) return;
    setExporting(true);
    try {
      const headers = ["כותרת", "קטגוריה", "תוצאה", "סטטוס", "תאריך"];
      const rows = list.map(item => [
        item.title || "",
        item.category || "",
        getStatusDisplay(item.overallStatus).label,
        getStatusDisplay(item.status).label,
        item.inspectionDate?.toDate?.()?.toLocaleDateString("he-IL") || item.createdAt?.toDate?.()?.toLocaleDateString("he-IL") || ""
      ]);
      const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inspections-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ClipboardCheck className="text-cyan-400" />
            כל הבדיקות
          </h1>
          <p className="text-slate-400 mt-1">{list.length} בדיקות במערכת</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-slate-700 text-cyan-400" : "text-slate-400 hover:text-white"}`}
              title="תצוגת רשימה"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${viewMode === "table" ? "bg-slate-700 text-cyan-400" : "text-slate-400 hover:text-white"}`}
              title="תצוגת טבלה דינמית"
            >
              <Table2 size={18} />
            </button>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || list.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {exporting ? "מייצא..." : "ייצא"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl p-12 text-center border border-slate-700">
          <ClipboardCheck size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">לא נמצאו בדיקות במערכת</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
          <DynamicTable
            entityType="inspection"
            data={tableData}
            loading={loading}
            onRowClick={handleRowClick}
            selectable={true}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            emptyMessage="לא נמצאו בדיקות"
          />
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-right text-sm text-slate-400">כותרת</th>
                <th className="px-4 py-3 text-right text-sm text-slate-400">קטגוריה</th>
                <th className="px-4 py-3 text-right text-sm text-slate-400">תוצאה</th>
                <th className="px-4 py-3 text-right text-sm text-slate-400">סטטוס</th>
                <th className="px-4 py-3 text-right text-sm text-slate-400">תאריך</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => {
                const resultStatus = getStatusDisplay(item.overallStatus);
                const itemStatus = getStatusDisplay(item.status);
                return (
                  <tr
                    key={item.id}
                    className="border-t border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(item.id)}
                  >
                    <td className="px-4 py-3 text-white font-medium">{item.title || "-"}</td>
                    <td className="px-4 py-3 text-slate-300">{item.category || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${resultStatus.colorClass}`}>
                        {resultStatus.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${itemStatus.colorClass}`}>
                        {itemStatus.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.inspectionDate?.toDate?.()
                        ? item.inspectionDate.toDate().toLocaleDateString("he-IL")
                        : item.createdAt?.toDate?.()
                        ? item.createdAt.toDate().toLocaleDateString("he-IL")
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50 border border-slate-700">
          <span>{selectedRows.length} נבחרו</span>
          <button onClick={clearSelection} className="text-slate-300 hover:text-white transition-colors">
            נקה בחירה
          </button>
          <div className="h-4 w-px bg-slate-600" />
          <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
            פעולות נוספות...
          </button>
        </div>
      )}
    </div>
  );
}
