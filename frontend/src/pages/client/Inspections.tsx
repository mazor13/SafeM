import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Plus, ListIcon, Table2 } from 'lucide-react';
import { DynamicTable } from '../../components/dynamic-columns';

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
}

function getStatusDisplay(status: string | undefined): { label: string; colorClass: string } {
  const statusMap: Record<string, { label: string; colorClass: string }> = {
    pass: { label: "עבר", colorClass: "bg-green-100 text-green-800" },
    pass_with_remarks: { label: "עבר עם הערות", colorClass: "bg-yellow-100 text-yellow-800" },
    fail: { label: "נכשל", colorClass: "bg-red-100 text-red-800" },
    incomplete: { label: "לא הושלם", colorClass: "bg-gray-100 text-gray-800" },
    draft: { label: "טיוטה", colorClass: "bg-gray-100 text-gray-600" },
    scheduled: { label: "מתוכנן", colorClass: "bg-blue-100 text-blue-800" },
    in_progress: { label: "בביצוע", colorClass: "bg-yellow-100 text-yellow-800" },
    completed: { label: "הושלם", colorClass: "bg-green-100 text-green-800" },
  };
  return statusMap[status || ""] || { label: status || "טיוטה", colorClass: "bg-gray-100 text-gray-600" };
}

export default function Inspections() {
  const { user } = useAuth();
  const [list, setList] = useState<InspectionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "table">("list");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;
    setLoading(true);
    const q = query(collection(firestore, "inspections"), where("inspectorId", "==", user.id));
    getDocs(q).then(snap => {
      setList(snap.docs.map(d => ({ id: d.id, ...d.data() } as InspectionListItem)));
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching inspections:", err);
      setLoading(false);
    });
  }, [user]);

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

  const handleRowClick = (id: string) => navigate("/client/inspections/" + id);
  const clearSelection = () => setSelectedRows([]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">כל הבדיקות שלי</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              title="תצוגת רשימה"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${viewMode === "table" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              title="תצוגת טבלה דינמית"
            >
              <Table2 size={18} />
            </button>
          </div>
          <button onClick={() => navigate("/client/new-inspection")} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm transition-colors">
            <Plus size={18} />
            בדיקה חדשה
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          לא נמצאו בדיקות. התחל בדיקה חדשה!
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
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
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">כותרת</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">קטגוריה</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תוצאה</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.map(item => {
                const resultStatus = getStatusDisplay(item.overallStatus);
                const itemStatus = getStatusDisplay(item.status);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate(`/client/inspections/${item.id}`)}>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.category || "-"}</td>
                    <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resultStatus.colorClass}`}>{resultStatus.label}</span></td>
                    <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${itemStatus.colorClass}`}>{itemStatus.label}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.inspectionDate?.toDate?.() ? item.inspectionDate.toDate().toLocaleDateString("he-IL") : item.createdAt?.toDate?.() ? item.createdAt.toDate().toLocaleDateString("he-IL") : "-"}</td>
                    <td className="px-6 py-4 text-left text-sm font-medium text-indigo-600">פתח &larr;</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <span>{selectedRows.length} נבחרו</span>
          <button onClick={clearSelection} className="text-slate-300 hover:text-white transition-colors">נקה בחירה</button>
          <div className="h-4 w-px bg-slate-600" />
          <button className="text-cyan-400 hover:text-cyan-300 transition-colors">פעולות נוספות...</button>
        </div>
      )}
    </div>
  );
}
