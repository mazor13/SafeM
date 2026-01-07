import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, updateDoc, Timestamp, arrayUnion, onSnapshot } from 'firebase/firestore';
import { firestore as db, auth } from '../../firebase';
import { useRole } from '../../providers/RoleProvider';
import { Finding, FindingSeverity, FindingStatus, FindingComment } from '../../types/finding';
import { uploadMultipleFindingImages } from '../../services/storageService';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FunnelIcon,
  DocumentMagnifyingGlassIcon,
  CameraIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon
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
  const { can, isClient, isConsultant, allowedFacilities } = useRole();
  
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  
  // Treatment Modal
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [treatmentDescription, setTreatmentDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  
  // Details Modal (view history + comments)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

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

  // סינון לפי מתחמים מורשים
  const facilityFilteredFindings = allowedFacilities.length === 0 || allowedFacilities.includes("*")
    ? findings
    : findings.filter(f => !f.facilityId || allowedFacilities.includes(f.facilityId));

  const filteredFindings = facilityFilteredFindings.filter(f => {
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (severityFilter !== "all" && f.severity !== severityFilter) return false;
    return true;
  });

  const stats = {
    total: facilityFilteredFindings.length,
    open: facilityFilteredFindings.filter(f => f.status === 'open').length,
    inProgress: facilityFilteredFindings.filter(f => f.status === 'in_progress').length,
    pendingApproval: facilityFilteredFindings.filter(f => f.status === 'pending_approval').length,
    closed: facilityFilteredFindings.filter(f => f.status === 'closed').length,
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('he-IL');
  };

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString('he-IL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: any) => {
    if (!dueDate) return false;
    const due = dueDate.seconds ? new Date(dueDate.seconds * 1000) : new Date(dueDate);
    return due < new Date();
  };

  // Treatment Modal Functions
  const openTreatmentModal = (finding: Finding) => {
    setSelectedFinding(finding);
    setTreatmentDescription(finding.treatment?.description || '');
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setUploadProgress('');
    setIsModalOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert('נא לבחור קובץ תמונה בלבד');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('גודל הקובץ חייב להיות עד 10MB');
        return false;
      }
      return true;
    });
    
    setSelectedImages(prev => [...prev, ...validFiles]);
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
    setUploadProgress('');
    
    try {
      const currentUser = auth.currentUser;
      let imageUrls: string[] = [];
      
      if (selectedImages.length > 0) {
        setUploadProgress(`מעלה תמונות... 0/${selectedImages.length}`);
        const uploadResults = await uploadMultipleFindingImages(
          clientId,
          selectedFinding.id,
          selectedImages,
          (current, total) => setUploadProgress(`מעלה תמונות... ${current}/${total}`)
        );
        imageUrls = uploadResults.map(r => r.url);
        setUploadProgress('התמונות הועלו בהצלחה!');
      }
      
      const updateData = {
        status: 'pending_approval' as FindingStatus,
        treatment: {
          description: treatmentDescription,
          treatedBy: currentUser?.uid || 'unknown',
          treatedByName: currentUser?.email || 'לקוח',
          treatedDate: Timestamp.now(),
          images: imageUrls,
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
      
      setFindings(prev => prev.map(f => 
        f.id === selectedFinding.id ? { ...f, ...updateData } : f
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
      setUploadProgress('');
    }
  };

  // Details Modal Functions
  const openDetailsModal = (finding: Finding) => {
    setSelectedFinding(finding);
    setNewComment('');
    setIsDetailsModalOpen(true);
  };

  const handleAddComment = async () => {
    if (!clientId || !selectedFinding || !newComment.trim()) return;
    
    setAddingComment(true);
    try {
      const currentUser = auth.currentUser;
      
      const comment: FindingComment = {
        id: `comment_${Date.now()}`,
        text: newComment.trim(),
        by: currentUser?.uid || 'unknown',
        byName: currentUser?.email || 'משתמש',
        byRole: isClient ? 'client' : 'consultant',
        source: 'web',
        createdAt: Timestamp.now(),
      };
      
      await updateDoc(doc(db, 'clients', clientId, 'findings', selectedFinding.id), {
        comments: arrayUnion(comment),
        updatedAt: Timestamp.now(),
      });
      
      // Update local state
      setFindings(prev => prev.map(f => 
        f.id === selectedFinding.id 
          ? { ...f, comments: [...(f.comments || []), comment] }
          : f
      ));
      setSelectedFinding(prev => prev ? { ...prev, comments: [...(prev.comments || []), comment] } : null);
      setNewComment('');
      
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('שגיאה בהוספת הערה');
    } finally {
      setAddingComment(false);
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
        {[
          { key: 'all', label: 'סה"כ', value: stats.total, color: 'gray' },
          { key: 'open', label: 'פתוחים', value: stats.open, color: 'red' },
          { key: 'in_progress', label: 'בטיפול', value: stats.inProgress, color: 'blue' },
          { key: 'pending_approval', label: 'ממתין לאישור', value: stats.pendingApproval, color: 'yellow' },
          { key: 'closed', label: 'סגורים', value: stats.closed, color: 'green' },
        ].map(stat => (
          <button
            key={stat.key}
            onClick={() => setStatusFilter(stat.key)}
            className={`p-4 rounded-lg border transition-all ${
              statusFilter === stat.key 
                ? `border-${stat.color}-500 bg-${stat.color}-50` 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`text-2xl font-bold ${stat.color === 'gray' ? 'text-gray-900' : `text-${stat.color}-600`}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </button>
        ))}
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
          <button onClick={() => setStatusFilter('all')} className="text-sm text-indigo-600 hover:text-indigo-800">
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFindings.map((finding) => {
              const severity = severityConfig[finding.severity];
              const status = statusConfig[finding.status];
              const StatusIcon = status.icon;
              const overdue = isOverdue(finding.dueDate) && finding.status !== 'closed';
              const hasComments = (finding.comments?.length || 0) > 0;
              
              return (
                <tr key={finding.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => openDetailsModal(finding)}
                      className="text-right hover:text-indigo-600"
                    >
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {finding.title}
                        {hasComments && (
                          <ChatBubbleLeftRightIcon className="h-4 w-4 text-indigo-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{finding.description}</div>
                      {finding.equipmentName && (
                        <div className="text-xs text-indigo-600 mt-1">🔧 {finding.equipmentName}</div>
                      )}
                    </button>
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
                  <td className="px-6 py-4 text-sm text-gray-500">{finding.location || '-'}</td>
                  <td className="px-6 py-4">
                    {can('canUpdateFindingStatus') && (finding.status === 'open' || finding.status === 'rejected') && (
                      <button
                        onClick={() => openTreatmentModal(finding)}
                        className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                      >
                        עדכן כטופל
                      </button>
                    )}
                    {can('canUpdateFindingStatus') && finding.status === 'in_progress' && (
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
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">עדכון טיפול</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600" disabled={saving}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900">{selectedFinding.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedFinding.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור הטיפול שבוצע *</label>
                <textarea
                  value={treatmentDescription}
                  onChange={(e) => setTreatmentDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                  placeholder="תאר את הפעולות שבוצעו..."
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תמונות הוכחה</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" id="image-upload" disabled={saving} />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <CameraIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">לחץ להעלאת תמונות</p>
                  </label>
                </div>
                {imagePreviewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt="" className="h-20 w-20 object-cover rounded-lg border" />
                        {!saving && (
                          <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {uploadProgress && <div className="mt-2 text-sm text-indigo-600">{uploadProgress}</div>}
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg" disabled={saving}>ביטול</button>
              <button onClick={handleSubmitTreatment} disabled={saving || !treatmentDescription.trim()} className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">
                {saving ? 'שומר...' : 'שלח לאישור יועץ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">פרטי ממצא</h2>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Finding Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{selectedFinding.title}</h3>
                    <p className="text-gray-600 mt-1">{selectedFinding.description}</p>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedFinding.status].bgColor} ${statusConfig[selectedFinding.status].color}`}>
                    {statusConfig[selectedFinding.status].label}
                  </span>
                </div>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>📍 {selectedFinding.location || '-'}</span>
                  <span>📅 יעד: {formatDate(selectedFinding.dueDate)}</span>
                </div>
              </div>
              
              {/* Rejection Reason */}
              {selectedFinding.status === 'rejected' && selectedFinding.approval?.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 flex items-center gap-2">
                    <XCircleIcon className="h-5 w-5" />
                    סיבת הדחייה:
                  </h4>
                  <p className="text-red-700 mt-1">{selectedFinding.approval.rejectionReason}</p>
                  <p className="text-sm text-red-600 mt-2">
                    👤 {selectedFinding.approval.byName} • {formatDateTime(selectedFinding.approval.date)}
                  </p>
                </div>
              )}
              
              {/* Treatment Info */}
              {selectedFinding.treatment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800">טיפול שבוצע:</h4>
                  <p className="text-blue-700 mt-1">{selectedFinding.treatment.description}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    👤 {selectedFinding.treatment.treatedByName} • {formatDateTime(selectedFinding.treatment.treatedDate)}
                  </p>
                  {selectedFinding.treatment.images && selectedFinding.treatment.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {selectedFinding.treatment.images.map((url, i) => (
                        <img key={i} src={url} alt="" className="h-20 w-20 object-cover rounded-lg border cursor-pointer" />
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Comments */}
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  הערות ושיח ({selectedFinding.comments?.length || 0})
                </h4>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {(!selectedFinding.comments || selectedFinding.comments.length === 0) ? (
                    <p className="text-gray-500 text-sm text-center py-4">אין הערות עדיין</p>
                  ) : (
                    selectedFinding.comments.map((comment) => (
                      <div key={comment.id} className={`p-3 rounded-lg ${comment.byRole === 'consultant' ? 'bg-purple-50 border-r-4 border-purple-400' : 'bg-gray-50 border-r-4 border-gray-400'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-gray-900">{comment.byName}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${comment.byRole === 'consultant' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-800'}`}>
                            {comment.byRole === 'consultant' ? 'יועץ' : 'לקוח'}
                          </span>
                          <span className="text-xs text-gray-400">{formatDateTime(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Add Comment */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="הוסף הערה..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    disabled={addingComment}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={addingComment || !newComment.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
              <button onClick={() => setIsDetailsModalOpen(false)} className="px-4 py-2 border rounded-lg">סגור</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
