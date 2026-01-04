import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore as db, auth } from '../../firebase';
import { useRole } from '../../providers/RoleProvider';
import { Finding, FindingSeverity, FindingStatus } from '../../types/finding';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FunnelIcon,
  DocumentMagnifyingGlassIcon,
  CameraIcon,
  XMarkIcon
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
  const { can } = useRole();
  
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Treatment form state
  const [treatmentDescription, setTreatmentDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

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
    setTreatmentDescription(finding.treatment?.description || '');
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsModalOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('נא לבחור קובץ תמונה בלבד');
        return false;
      }
      // Check file size (5MB max before compression)
      if (file.size > 10 * 1024 * 1024) {
        alert('גודל הקובץ חייב להיות עד 10MB');
        return false;
      }
      return true;
    });
    
    setSelectedImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitTreatment = async () => {
    if (!clientId || !selectedFinding) return;
    if (!treatmentDescription.trim()) {
      alert('נא למלא תיאור טיפול');
      return;
    }
    
    setSaving(true);
    
    try {
      const currentUser = auth.currentUser;
      
      // TODO: Upload images to Firebase Storage in TASK-020
      // For now, we'll save without images
      
      const updateData = {
        status: 'pending_approval' as FindingStatus,
        treatment: {
          description: treatmentDescription,
          treatedBy: currentUser?.uid || 'unknown',
          treatedByName: currentUser?.email || 'לקוח',
          treatedDate: Timestamp.now(),
          images: [], // Will be populated in TASK-020
        },
        updatedAt: Timestamp.now(),
        history: [
          ...(selectedFinding.history || []),
          {
            action: 'treated' as const,
            by: currentUser?.uid || 'unknown',
            byName: currentUser?.email || 'לקוח',
            date: Timestamp.now(),
            details: treatmentDescription,
          }
        ]
      };
      
      await updateDoc(doc(db, 'clients', clientId, 'findings', selectedFinding.id), updateData);
      
      // Update local state
      setFindings(prev => prev.map(f => 
        f.id === selectedFinding.id 
          ? { ...f, ...updateData } 
          : f
      ));
      
      setIsModalOpen(false);
      setTreatmentDescription('');
      setSelectedImages([]);
      setImagePreviewUrls([]);
      
      alert('הטיפול נשלח לאישור היועץ');
      
    } catch (err) {
      console.error('Error updating finding:', err);
      alert('שגיאה בשמירת הטיפול');
    } finally {
      setSaving(false);
    }
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

      {/* Treatment Modal */}
      {isModalOpen && selectedFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">עדכון טיפול</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Finding Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900">{selectedFinding.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedFinding.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${severityConfig[selectedFinding.severity].bgColor} ${severityConfig[selectedFinding.severity].color}`}>
                    {severityConfig[selectedFinding.severity].label}
                  </span>
                  {selectedFinding.location && (
                    <span className="text-xs text-gray-500">📍 {selectedFinding.location}</span>
                  )}
                </div>
              </div>
              
              {/* Treatment Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תיאור הטיפול שבוצע *
                </label>
                <textarea
                  value={treatmentDescription}
                  onChange={(e) => setTreatmentDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="תאר את הפעולות שבוצעו לתיקון הממצא..."
                  required
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תמונות הוכחה (אופציונלי)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <CameraIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">לחץ להעלאת תמונות</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG עד 10MB</p>
                  </label>
                </div>
                
                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 לאחר השליחה, הממצא יעבור לסטטוס "ממתין לאישור" והיועץ יקבל התראה לבדיקה.
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                ביטול
              </button>
              <button
                onClick={handleSubmitTreatment}
                disabled={saving || !treatmentDescription.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'שומר...' : 'שלח לאישור יועץ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
