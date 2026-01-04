import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore as db } from '../../firebase';
import { useRole } from '../../providers/RoleProvider';
import { Finding, FindingSeverity, FindingStatus } from '../../types/finding';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FunnelIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const severityConfig: Record<FindingSeverity, { label: string; color: string; bgColor: string }> = {
  critical: { label: 'קריטי', color: 'text-red-700', bgColor: 'bg-red-100' },
  high: { label: 'גבוה', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  medium: { label: 'בינוני', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  low: { label: 'נמוך', color: 'text-green-700', bgColor: 'bg-green-100' },
};

const statusConfig: Record<FindingStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  open: { label: 'פתוח', color: 'text-red-700', bgColor: 'bg-red-100', icon: ExclamationTriangleIcon },
  in_progress: { label: 'בטיפול', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: ClockIcon },
  pending_approval: { label: 'ממתין לאישור', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: ClockIcon },
  closed: { label: 'סגור', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircleIcon },
  rejected: { label: 'נדחה', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircleIcon },
};

export default function ClientFindings() {
  const { clientId } = useParams<{ clientId: string }>();
  const { can, isClient } = useRole();
  
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFindings = async () => {
      if (!clientId) return;
      try {
        const ref = collection(db, 'clients', clientId, 'findings');
        const q = query(ref, orderBy('foundDate', 'desc'));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })) as Finding[];
        setFindings(items);
      } catch (err) {
        console.error('Error fetching findings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFindings();
  }, [clientId]);

  // Filter findings
  const filteredFindings = findings.filter(f => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
    return true;
  });

  // Stats
  const stats = {
    total: findings.length,
    open: findings.filter(f => f.status === 'open').length,
    inProgress: findings.filter(f => f.status === 'in_progress').length,
    pendingApproval: findings.filter(f => f.status === 'pending_approval').length,
    closed: findings.filter(f => f.status === 'closed').length,
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('he-IL');
  };

  const isOverdue = (dueDate: any) => {
    if (!dueDate) return false;
    const due = dueDate.seconds ? new Date(dueDate.seconds * 1000) : new Date(dueDate);
    return due < new Date();
  };

  const openTreatmentModal = (finding: Finding) => {
    setSelectedFinding(finding);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">טוען ממצאים...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ממצאים</h1>
        <p className="text-gray-500 text-sm">צפייה וטיפול בממצאי בדיקות הבטיחות</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-lg border transition-all ${
            statusFilter === 'all' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">סה"כ</div>
        </button>
        
        <button
          onClick={() => setStatusFilter('open')}
          className={`p-4 rounded-lg border transition-all ${
            statusFilter === 'open' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-red-600">{stats.open}</div>
          <div className="text-sm text-gray-500">פתוחים</div>
        </button>
        
        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`p-4 rounded-lg border transition-all ${
            statusFilter === 'in_progress' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-500">בטיפול</div>
        </button>
        
        <button
          onClick={() => setStatusFilter('pending_approval')}
          className={`p-4 rounded-lg border transition-all ${
            statusFilter === 'pending_approval' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</div>
          <div className="text-sm text-gray-500">ממתין לאישור</div>
        </button>
        
        <button
          onClick={() => setStatusFilter('closed')}
          className={`p-4 rounded-lg border transition-all ${
            statusFilter === 'closed' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
          <div className="text-sm text-gray-500">סגורים</div>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border">
        <FunnelIcon className="h-5 w-5 text-gray-400" />
        
        <div>
          <label className="text-sm text-gray-500 ml-2">חומרה:</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
          >
            <option value="all">הכל</option>
            <option value="critical">קריטי</option>
            <option value="high">גבוה</option>
            <option value="medium">בינוני</option>
            <option value="low">נמוך</option>
          </select>
        </div>
        
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            נקה סינון סטטוס
          </button>
        )}
      </div>

      {/* Findings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ממצא</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">חומרה</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך יעד</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מיקום</th>
              {can('canUpdateFindingStatus') && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFindings.map((finding) => {
              const severity = severityConfig[finding.severity];
              const status = statusConfig[finding.status];
              const StatusIcon = status.icon;
              const overdue = isOverdue(finding.dueDate) && finding.status !== 'closed';
              
              return (
                <tr key={finding.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{finding.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{finding.description}</div>
                    {finding.equipmentName && (
                      <div className="text-xs text-indigo-600 mt-1">🔧 {finding.equipmentName}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${severity.bgColor} ${severity.color}`}>
                      {severity.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${status.bgColor} ${status.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${overdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                      {formatDate(finding.dueDate)}
                      {overdue && <span className="block text-xs">באיחור!</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {finding.location || '-'}
                  </td>
                  {can('canUpdateFindingStatus') && (
                    <td className="px-6 py-4">
                      {(finding.status === 'open' || finding.status === 'rejected') && (
                        <button
                          onClick={() => openTreatmentModal(finding)}
                          className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                        >
                          עדכן כטופל
                        </button>
                      )}
                      {finding.status === 'in_progress' && (
                        <button
                          onClick={() => openTreatmentModal(finding)}
                          className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
                        >
                          סיים טיפול
                        </button>
                      )}
                      {finding.status === 'pending_approval' && (
                        <span className="text-sm text-yellow-600">ממתין לאישור יועץ</span>
                      )}
                      {finding.status === 'closed' && (
                        <span className="text-sm text-green-600">✓ טופל</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredFindings.length === 0 && (
          <div className="text-center py-12">
            <DocumentMagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">לא נמצאו ממצאים</p>
          </div>
        )}
      </div>

      {/* Treatment Modal - Placeholder for TASK-019 */}
      {isModalOpen && selectedFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg" dir="rtl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">עדכון טיפול</h2>
            <p className="text-gray-600 mb-4">{selectedFinding.title}</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                🚧 פונקציונליות זו תושלם ב-TASK-019
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
