import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore as db } from '../../firebase';
import { useClient } from '../../providers/ClientProvider';
import {
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  FunnelIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Inspection {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: string;
  status: 'completed' | 'scheduled' | 'overdue' | 'in_progress';
  scheduledDate: Date;
  completedDate?: Date;
  inspector?: string;
  findings?: number;
  notes?: string;
}

export default function ClientInspections() {
  const { clientId } = useParams<{ clientId: string }>();
  const { client } = useClient();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'overdue'>('all');

  useEffect(() => {
    const fetchInspections = async () => {
      if (!clientId) return;
      
      try {
        // Fetch equipment and build inspection list from nextInspectionDate
        const equipmentRef = collection(db, 'clients', clientId, 'equipment');
        const equipmentSnap = await getDocs(equipmentRef);
        
        const now = new Date();
        const inspectionsList: Inspection[] = [];

        equipmentSnap.docs.forEach(doc => {
          const data = doc.data();
          
          if (data.nextInspectionDate) {
            const inspDate = data.nextInspectionDate.seconds 
              ? new Date(data.nextInspectionDate.seconds * 1000)
              : new Date(data.nextInspectionDate);
            
            let status: Inspection['status'] = 'scheduled';
            if (inspDate < now) {
              status = 'overdue';
            }

            inspectionsList.push({
              id: doc.id,
              equipmentId: doc.id,
              equipmentName: data.name,
              type: data.type || 'general',
              status,
              scheduledDate: inspDate,
              findings: 0
            });
          }

          // Add from history log if exists
          if (data.historyLog && Array.isArray(data.historyLog)) {
            data.historyLog
              .filter((log: any) => log.type === 'inspection' || log.type === 'calibration')
              .forEach((log: any) => {
                inspectionsList.push({
                  id: `${doc.id}-${log.id}`,
                  equipmentId: doc.id,
                  equipmentName: data.name,
                  type: log.type,
                  status: 'completed',
                  scheduledDate: new Date(log.date),
                  completedDate: new Date(log.date),
                  inspector: log.providerName,
                  notes: log.description
                });
              });
          }
        });

        // Sort by date (newest first for completed, soonest first for scheduled)
        inspectionsList.sort((a, b) => {
          if (a.status === 'completed' && b.status === 'completed') {
            return b.scheduledDate.getTime() - a.scheduledDate.getTime();
          }
          return a.scheduledDate.getTime() - b.scheduledDate.getTime();
        });

        setInspections(inspectionsList);
      } catch (error) {
        console.error('Error fetching inspections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, [clientId]);

  const filteredInspections = inspections.filter(insp => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return insp.status === 'scheduled';
    if (filter === 'completed') return insp.status === 'completed';
    if (filter === 'overdue') return insp.status === 'overdue';
    return true;
  });

  const getStatusBadge = (status: Inspection['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      completed: 'הושלם',
      scheduled: 'מתוכנן',
      overdue: 'באיחור',
      in_progress: 'בביצוע'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const stats = {
    total: inspections.length,
    upcoming: inspections.filter(i => i.status === 'scheduled').length,
    completed: inspections.filter(i => i.status === 'completed').length,
    overdue: inspections.filter(i => i.status === 'overdue').length
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">טוען בדיקות...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">בדיקות ותחזוקה</h1>
        <p className="mt-1 text-sm text-gray-500">היסטוריית בדיקות, בדיקות מתוכננות ובדיקות באיחור</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => setFilter('all')}
        >
          <div className="flex items-center">
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-indigo-500" />
            <div className="mr-3">
              <p className="text-sm text-gray-500">סה"כ</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${filter === 'upcoming' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          <div className="flex items-center">
            <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
            <div className="mr-3">
              <p className="text-sm text-gray-500">מתוכננות</p>
              <p className="text-xl font-bold text-blue-600">{stats.upcoming}</p>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${filter === 'completed' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setFilter('completed')}
        >
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="mr-3">
              <p className="text-sm text-gray-500">הושלמו</p>
              <p className="text-xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${filter === 'overdue' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setFilter('overdue')}
        >
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            <div className="mr-3">
              <p className="text-sm text-gray-500">באיחור</p>
              <p className="text-xl font-bold text-red-600">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inspections Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {filter === 'all' ? 'כל הבדיקות' : 
             filter === 'upcoming' ? 'בדיקות מתוכננות' :
             filter === 'completed' ? 'בדיקות שהושלמו' : 'בדיקות באיחור'}
          </h3>
          <span className="text-sm text-gray-500">{filteredInspections.length} בדיקות</span>
        </div>

        {filteredInspections.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ציוד</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סוג בדיקה</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">בודק</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInspections.map((inspection) => (
                <tr key={inspection.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{inspection.equipmentName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {inspection.type === 'inspection' ? 'בדיקה' :
                       inspection.type === 'calibration' ? 'כיול' :
                       inspection.type === 'laser' ? 'בדיקת לייזר' :
                       inspection.type === 'fire' ? 'בדיקת כיבוי אש' : 'בדיקה תקופתית'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{formatDate(inspection.scheduledDate)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(inspection.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{inspection.inspector || '-'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <ClipboardDocumentCheckIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>אין בדיקות להצגה</p>
          </div>
        )}
      </div>
    </div>
  );
}
