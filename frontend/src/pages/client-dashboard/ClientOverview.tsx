import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firestore as db } from '../../firebase';
import { useClient } from '../../providers/ClientProvider';
import {
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalEquipment: number;
  activeEquipment: number;
  maintenanceEquipment: number;
  upcomingInspections: number;
  overdueInspections: number;
  openFindings: number;
  criticalFindings: number;
  complianceRate: number;
}

interface UpcomingInspection {
  id: string;
  equipmentName: string;
  dueDate: Date;
  type: string;
}

export default function ClientOverview() {
  const { clientId } = useParams<{ clientId: string }>();
  const { client } = useClient();
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    activeEquipment: 0,
    maintenanceEquipment: 0,
    upcomingInspections: 0,
    overdueInspections: 0,
    openFindings: 0,
    criticalFindings: 0,
    complianceRate: 100
  });
  const [upcomingInspections, setUpcomingInspections] = useState<UpcomingInspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!clientId) return;
      
      try {
        // Fetch equipment
        const equipmentRef = collection(db, 'clients', clientId, 'equipment');
        const equipmentSnap = await getDocs(equipmentRef);
        
        let active = 0;
        let maintenance = 0;
        let upcoming: UpcomingInspection[] = [];
        let overdue = 0;
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        equipmentSnap.docs.forEach(doc => {
          const data = doc.data();
          
          // Count by status
          if (data.status === 'active') active++;
          if (data.status === 'maintenance') maintenance++;
          
          // Check inspection dates
          if (data.nextInspectionDate) {
            const inspDate = data.nextInspectionDate.seconds 
              ? new Date(data.nextInspectionDate.seconds * 1000)
              : new Date(data.nextInspectionDate);
            
            if (inspDate < now) {
              overdue++;
            } else if (inspDate <= nextWeek) {
              upcoming.push({
                id: doc.id,
                equipmentName: data.name,
                dueDate: inspDate,
                type: data.type || 'general'
              });
            }
          }
        });

        // Sort upcoming by date
        upcoming.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

        // Calculate compliance rate
        const total = equipmentSnap.size;
        const compliant = total - overdue;
        const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 100;

        setStats({
          totalEquipment: total,
          activeEquipment: active,
          maintenanceEquipment: maintenance,
          upcomingInspections: upcoming.length,
          overdueInspections: overdue,
          openFindings: 0, // TODO: fetch from findings collection
          criticalFindings: 0,
          complianceRate
        });

        setUpcomingInspections(upcoming.slice(0, 5)); // Show top 5

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [clientId]);

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600 bg-green-100';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">טוען נתונים...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">סקירה כללית: {client?.name}</h1>
        <p className="mt-1 text-sm text-gray-500">מצב הציוד, הבדיקות והממצאים</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Equipment */}
        <div className="bg-white rounded-lg shadow p-5 border-r-4 border-indigo-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WrenchScrewdriverIcon className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">סה"כ ציוד</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEquipment}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.activeEquipment} פעיל | {stats.maintenanceEquipment} בתחזוקה
          </div>
        </div>

        {/* Compliance Rate */}
        <div className="bg-white rounded-lg shadow p-5 border-r-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">ציון ציות</p>
              <p className={`text-2xl font-bold ${stats.complianceRate >= 90 ? 'text-green-600' : stats.complianceRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {stats.complianceRate}%
              </p>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${stats.complianceRate >= 90 ? 'bg-green-500' : stats.complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${stats.complianceRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upcoming Inspections */}
        <div className="bg-white rounded-lg shadow p-5 border-r-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">בדיקות קרובות</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingInspections}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            ב-7 הימים הקרובים
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-lg shadow p-5 border-r-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">באיחור</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdueInspections}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            דורש טיפול מיידי
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Inspections List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <ClockIcon className="h-5 w-5 ml-2 text-blue-500" />
              בדיקות קרובות
            </h3>
          </div>
          <div className="p-5">
            {upcomingInspections.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingInspections.map((inspection) => (
                  <li key={inspection.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inspection.equipmentName}</p>
                      <p className="text-xs text-gray-500">{inspection.type}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formatDate(inspection.dueDate)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">אין בדיקות קרובות</p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 ml-2 text-indigo-500" />
              פרטי הלקוח
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {client?.contactPerson && (
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">איש קשר:</span>
                <span className="text-gray-900 font-medium">{client.contactPerson}</span>
              </div>
            )}
            {client?.phone && (
              <div className="flex items-center text-sm">
                <PhoneIcon className="h-4 w-4 ml-2 text-gray-400" />
                <a href={`tel:${client.phone}`} className="text-indigo-600 hover:underline">{client.phone}</a>
              </div>
            )}
            {client?.email && (
              <div className="flex items-center text-sm">
                <EnvelopeIcon className="h-4 w-4 ml-2 text-gray-400" />
                <a href={`mailto:${client.email}`} className="text-indigo-600 hover:underline">{client.email}</a>
              </div>
            )}
            {client?.address && (
              <div className="flex items-start text-sm">
                <MapPinIcon className="h-4 w-4 ml-2 text-gray-400 mt-0.5" />
                <span className="text-gray-900">
                  {typeof client.address === 'string' 
                    ? client.address 
                    : `${(client.address as any).street || ''} ${(client.address as any).city || ''}`
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
