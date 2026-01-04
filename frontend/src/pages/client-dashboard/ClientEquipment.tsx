import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore as db, auth } from '../../firebase';
import { useSystem } from '../../providers/SystemProvider';
import { useRole } from '../../providers/RoleProvider';
import { isCriticalType, EQUIPMENT_TYPES, APPROVAL_STATUS } from '../../config/equipmentTypes';
import {
  PlusIcon,
  PencilSquareIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  FireIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Equipment {
  id: string;
  name: string;
  type: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
  status: 'active' | 'maintenance' | 'retired';
  nextInspectionDate?: Date;
  lastInspectionDate?: Date;
  tco?: number;
  isCritical?: boolean;
  approvalStatus?: "approved" | "pending" | "rejected";
  historyLog?: any[];
}

const typeIcons: Record<string, any> = {
  laser: BoltIcon,
  fire: FireIcon,
  general: WrenchScrewdriverIcon,
  chemical: BeakerIcon,
  radiation: ExclamationTriangleIcon,
  lifting: WrenchScrewdriverIcon,
  lifting_accessories: WrenchScrewdriverIcon,
  forklift: WrenchScrewdriverIcon,
  electrical: BoltIcon,
};

export default function ClientEquipment() {
  const { clientId } = useParams<{ clientId: string }>();
  const { modules } = useSystem();
  const { can, isConsultant, isClient } = useRole();
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'general',
    manufacturer: '',
    model: '',
    serialNumber: '',
    location: '',
    status: 'active' as 'active' | 'maintenance' | 'retired',
    nextInspectionDate: '',
    tco: 0,
    isCritical: false,
  });

  // Check if selected type is critical
  const isSelectedTypeCritical = isCriticalType(formData.type);
  const showCriticalWarning = isClient && isSelectedTypeCritical && !editingItem;

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!clientId) return;
      try {
        const ref = collection(db, 'clients', clientId, 'equipment');
        const snapshot = await getDocs(ref);
        const items = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            nextInspectionDate: data.nextInspectionDate?.seconds 
              ? new Date(data.nextInspectionDate.seconds * 1000)
              : data.nextInspectionDate ? new Date(data.nextInspectionDate) : undefined,
            lastInspectionDate: data.lastInspectionDate?.seconds
              ? new Date(data.lastInspectionDate.seconds * 1000)
              : data.lastInspectionDate ? new Date(data.lastInspectionDate) : undefined,
          } as Equipment;
        });
        setEquipment(items);
      } catch (err) {
        console.error('Error fetching equipment:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [clientId]);

  const activeModules = modules.filter(m => m.isActive);
  
  // Build filter options from EQUIPMENT_TYPES
  const filterOptions = [
    { id: 'all', label: 'הכל', icon: WrenchScrewdriverIcon },
    ...Object.values(EQUIPMENT_TYPES).map(t => ({
      id: t.id,
      label: t.label,
      icon: typeIcons[t.id] || WrenchScrewdriverIcon
    }))
  ];

  const filteredEquipment = activeFilter === 'all' 
    ? equipment 
    : equipment.filter(e => e.type === activeFilter);

  const toDateStr = (ts: any) => {
    if (!ts) return '';
    if (ts.seconds) return new Date(ts.seconds * 1000).toISOString().split('T')[0];
    if (ts.toDate) return ts.toDate().toISOString().split('T')[0];
    if (ts instanceof Date) return ts.toISOString().split('T')[0];
    return String(ts);
  };

  const openModal = (item?: Equipment) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        type: item.type,
        manufacturer: item.manufacturer || '',
        model: item.model || '',
        serialNumber: item.serialNumber || '',
        location: item.location || '',
        status: item.status,
        nextInspectionDate: toDateStr(item.nextInspectionDate),
        tco: item.tco || 0,
        isCritical: item.isCritical || false,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        type: 'general',
        manufacturer: '',
        model: '',
        serialNumber: '',
        location: '',
        status: 'active',
        nextInspectionDate: '',
        tco: 0,
        isCritical: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!clientId) return;
    
    try {
      const currentUser = auth.currentUser;
      const isCritical = isCriticalType(formData.type) || formData.isCritical;
      
      // Determine approval status
      let approvalStatus: 'approved' | 'pending' | 'rejected' = 'approved';
      if (isClient && isCritical && !editingItem) {
        // Client adding critical equipment - needs approval
        approvalStatus = 'pending';
      }

      const dataToSave = {
        ...formData,
        isCritical,
        approvalStatus,
        nextInspectionDate: formData.nextInspectionDate 
          ? Timestamp.fromDate(new Date(formData.nextInspectionDate))
          : null,
        updatedAt: Timestamp.now(),
        ...(editingItem ? {} : {
          addedBy: currentUser?.uid,
          addedByRole: isClient ? 'client' : 'consultant',
          createdAt: Timestamp.now(),
        }),
      };

      if (editingItem) {
        await updateDoc(doc(db, 'clients', clientId, 'equipment', editingItem.id), dataToSave);
        setEquipment(prev => prev.map(e => e.id === editingItem.id ? { 
          ...e, 
          ...formData,
          isCritical,
          approvalStatus,
          nextInspectionDate: formData.nextInspectionDate ? new Date(formData.nextInspectionDate) : undefined
        } : e));
      } else {
        const docRef = await addDoc(collection(db, 'clients', clientId, 'equipment'), dataToSave);
        setEquipment(prev => [...prev, { 
          id: docRef.id, 
          ...formData,
          isCritical,
          approvalStatus,
          nextInspectionDate: formData.nextInspectionDate ? new Date(formData.nextInspectionDate) : undefined
        } as Equipment]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving equipment:', err);
    }
  };

  const canAddEquipment = can('canAddEquipment');
  const canEditEquipment = can('canEditEquipment');

  const getApprovalBadge = (status?: string) => {
    switch (status) {
      case APPROVAL_STATUS.PENDING:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3 w-3" />
            ממתין לאישור
          </span>
        );
      case APPROVAL_STATUS.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-3 w-3" />
            נדחה
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">טוען ציוד...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול תיק מכשור</h1>
          <p className="text-gray-500 text-sm">(TCO) ניהול מלאי, היסטוריית טיפולים ועלויות.</p>
        </div>
        {canAddEquipment && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            הקמת מכשיר
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200 pb-4 overflow-x-auto">
        {filterOptions.slice(0, 6).map(opt => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === opt.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מכשיר</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מיקום וסטטוס</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">TCO</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות אחרונות</th>
              {canEditEquipment && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEquipment.map((item) => {
              const Icon = typeIcons[item.type] || WrenchScrewdriverIcon;
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 ml-3" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          {item.isCritical && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              <ExclamationTriangleIcon className="h-3 w-3" />
                              קריטי
                            </span>
                          )}
                          {getApprovalBadge(item.approvalStatus)}
                        </div>
                        <span className="text-sm text-gray-500">{item.serialNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{item.location || '-'}</div>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'active' ? 'פעיל' : item.status === 'maintenance' ? 'בתחזוקה' : 'לא פעיל'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₪{item.tco?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.historyLog?.[0] 
                      ? `${item.historyLog[0].date} - ${item.historyLog[0].type}`
                      : '-'}
                  </td>
                  {canEditEquipment && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openModal(item)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredEquipment.length === 0 && (
          <div className="text-center py-8 text-gray-500">אין ציוד להצגה</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editingItem ? 'עריכת מכשיר' : 'הקמת מכשיר חדש'}
            </h2>
            
            {/* Critical Equipment Warning */}
            {showCriticalWarning && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-800">ציוד קריטי - דורש אישור</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      ציוד מסוג "{EQUIPMENT_TYPES[formData.type as keyof typeof EQUIPMENT_TYPES]?.label || formData.type}" 
                      מוגדר כציוד קריטי ודורש אישור היועץ לפני הפעלה.
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      לאחר השליחה, הציוד יופיע בסטטוס "ממתין לאישור" והיועץ יקבל התראה.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם המכשיר *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג ציוד *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`mt-1 block w-full border p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSelectedTypeCritical && isClient ? 'border-amber-400' : 'border-gray-300'
                  }`}
                >
                  {Object.values(EQUIPMENT_TYPES).map(t => (
                    <option key={t.id} value={t.id}>
                      {t.label} {t.isCriticalByDefault && isClient ? '⚠️' : ''}
                    </option>
                  ))}
                </select>
                {isClient && (
                  <p className="text-xs text-gray-500 mt-1">⚠️ = ציוד קריטי הדורש אישור יועץ</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">יצרן</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">דגם</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מספר סריאלי</label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מיקום</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך בדיקה הבא</label>
                <input
                  type="date"
                  value={formData.nextInspectionDate}
                  onChange={(e) => setFormData({ ...formData, nextInspectionDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TCO (₪)</label>
                <input
                  type="number"
                  value={formData.tco}
                  onChange={(e) => setFormData({ ...formData, tco: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Checkbox ציוד קריטי - רק ליועץ */}
              {isConsultant && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isCritical"
                    checked={formData.isCritical || isSelectedTypeCritical}
                    onChange={(e) => setFormData({ ...formData, isCritical: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                  <label htmlFor="isCritical" className="text-sm font-medium text-gray-700">
                    סמן כציוד קריטי (דורש אישור יועץ להוספה ע"י לקוח)
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-lg text-white ${
                  showCriticalWarning 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {editingItem 
                  ? 'עדכון' 
                  : showCriticalWarning 
                    ? 'שלח לאישור יועץ' 
                    : 'הקמה'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
