import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { firestore as db, auth } from '../../firebase';
import { Finding, FindingSeverity, FindingComment } from '../../types/finding';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PhotoIcon,
  XMarkIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface PendingFinding extends Finding {
  clientId: string;
  clientName: string;
}

const severityConfig: Record<FindingSeverity, { label: string; color: string; bgColor: string; priority: number }> = {
  critical: { label: 'קריטי', color: 'text-red-700', bgColor: 'bg-red-100', priority: 1 },
  high: { label: 'גבוה', color: 'text-orange-700', bgColor: 'bg-orange-100', priority: 2 },
  medium: { label: 'בינוני', color: 'text-yellow-700', bgColor: 'bg-yellow-100', priority: 3 },
  low: { label: 'נמוך', color: 'text-green-700', bgColor: 'bg-green-100', priority: 4 },
};

export default function PendingApprovals() {
  const [findings, setFindings] = useState<PendingFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  
  // Modal state
  const [selectedFinding, setSelectedFinding] = useState<PendingFinding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Lightbox state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Comments state
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    fetchPendingFindings();
  }, []);

  const fetchPendingFindings = async () => {
    setLoading(true);
    try {
      const clientsSnapshot = await getDocs(collection(db, 'clients'));
      const clientsList: { id: string; name: string }[] = [];
      const allFindings: PendingFinding[] = [];
      
      for (const clientDoc of clientsSnapshot.docs) {
        const clientData = clientDoc.data();
        const clientId = clientDoc.id;
        const clientName = clientData.name || clientId;
        
        clientsList.push({ id: clientId, name: clientName });
        
        const findingsRef = collection(db, 'clients', clientId, 'findings');
        const q = query(findingsRef, where('status', '==', 'pending_approval'));
        const findingsSnapshot = await getDocs(q);
        
        findingsSnapshot.docs.forEach(findingDoc => {
          allFindings.push({
            id: findingDoc.id,
            clientId,
            clientName,
            ...findingDoc.data(),
          } as PendingFinding);
        });
      }
      
      allFindings.sort((a, b) => 
        severityConfig[a.severity].priority - severityConfig[b.severity].priority
      );
      
      setClients(clientsList);
      setFindings(allFindings);
    } catch (err) {
      console.error('Error fetching pending findings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFindings = clientFilter === 'all'
    ? findings
    : findings.filter(f => f.clientId === clientFilter);

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

  const openApprovalModal = (finding: PendingFinding, reject: boolean = false) => {
    setSelectedFinding(finding);
    setIsRejectMode(reject);
    setRejectionReason('');
    setNewComment('');
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedFinding) return;
    
    setSaving(true);
    try {
      const currentUser = auth.currentUser;
      
      const updateData = {
        status: 'closed',
        closedDate: Timestamp.now(),
        approval: {
          status: 'approved',
          by: currentUser?.uid || 'unknown',
          byName: currentUser?.email || 'יועץ',
          date: Timestamp.now(),
        },
        updatedAt: Timestamp.now(),
        history: [
          ...(selectedFinding.history || []),
          {
            action: 'approved' as const,
            by: currentUser?.uid || 'unknown',
            byName: currentUser?.email || 'יועץ',
            date: Timestamp.now(),
            details: 'הממצא אושר ונסגר',
          }
        ]
      };
      
      await updateDoc(
        doc(db, 'clients', selectedFinding.clientId, 'findings', selectedFinding.id),
        updateData
      );
      
      setFindings(prev => prev.filter(f => f.id !== selectedFinding.id));
      setIsModalOpen(false);
      
    } catch (err) {
      console.error('Error approving finding:', err);
      alert('שגיאה באישור הממצא');
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedFinding) return;
    if (!rejectionReason.trim()) {
      alert('נא למלא סיבת דחייה');
      return;
    }
    
    setSaving(true);
    try {
      const currentUser = auth.currentUser;
      
      const updateData = {
        status: 'rejected',
        approval: {
          status: 'rejected',
          by: currentUser?.uid || 'unknown',
          byName: currentUser?.email || 'יועץ',
          date: Timestamp.now(),
          rejectionReason: rejectionReason,
        },
        updatedAt: Timestamp.now(),
        history: [
          ...(selectedFinding.history || []),
          {
            action: 'rejected' as const,
            by: currentUser?.uid || 'unknown',
            byName: currentUser?.email || 'יועץ',
            date: Timestamp.now(),
            details: rejectionReason,
          }
        ]
      };
      
      await updateDoc(
        doc(db, 'clients', selectedFinding.clientId, 'findings', selectedFinding.id),
        updateData
      );
      
      setFindings(prev => prev.filter(f => f.id !== selectedFinding.id));
      setIsModalOpen(false);
      
    } catch (err) {
      console.error('Error rejecting finding:', err);
      alert('שגיאה בדחיית הממצא');
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedFinding || !newComment.trim()) return;
    
    setAddingComment(true);
    try {
      const currentUser = auth.currentUser;
      
      const comment: FindingComment = {
        id: `comment_${Date.now()}`,
        text: newComment.trim(),
        by: currentUser?.uid || 'unknown',
        byName: currentUser?.email || 'יועץ',
        byRole: 'consultant',
        source: 'web',
        createdAt: Timestamp.now(),
      };
      
      await updateDoc(doc(db, 'clients', selectedFinding.clientId, 'findings', selectedFinding.id), {
        comments: arrayUnion(comment),
        updatedAt: Timestamp.now(),
      });
      
      // Update local state
      const updatedFinding = { 
        ...selectedFinding, 
        comments: [...(selectedFinding.comments || []), comment] 
      };
      setSelectedFinding(updatedFinding);
      setFindings(prev => prev.map(f => f.id === selectedFinding.id ? updatedFinding : f));
      setNewComment('');
      
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('שגיאה בהוספת הערה');
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-500 mt-4">טוען ממצאים...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ממתין לאישור</h1>
          <p className="text-gray-500 text-sm">ממצאים שטופלו ע"י לקוחות וממתינים לאישורך</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-indigo-600">{findings.length}</span>
          <span className="text-gray-500">ממתינים</span>
        </div>
      </div>

      {/* Filter */}
      {clients.length > 1 && (
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <label className="text-sm text-gray-500">לקוח:</label>
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
          >
            <option value="all">כל הלקוחות ({findings.length})</option>
            {clients.map(client => {
              const count = findings.filter(f => f.clientId === client.id).length;
              if (count === 0) return null;
              return (
                <option key={client.id} value={client.id}>
                  {client.name} ({count})
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Findings List */}
      {filteredFindings.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">אין ממצאים ממתינים!</h3>
          <p className="text-gray-500 mt-1">כל הממצאים טופלו ואושרו</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFindings.map((finding) => {
            const severity = severityConfig[finding.severity];
            const hasComments = (finding.comments?.length || 0) > 0;
            
            return (
              <div key={finding.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                {/* Finding Header */}
                <div className="p-4 border-b bg-gray-50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{finding.clientName}</span>
                      {hasComments && (
                        <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          <ChatBubbleLeftRightIcon className="h-3 w-3" />
                          {finding.comments?.length} הערות
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{finding.title}</h3>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${severity.bgColor} ${severity.color}`}>
                    {severity.label}
                  </span>
                </div>
                
                {/* Finding Body */}
                <div className="p-4 space-y-4">
                  {/* Original Finding */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">תיאור הממצא המקורי:</h4>
                    <p className="text-gray-700">{finding.description}</p>
                    {finding.location && (
                      <p className="text-sm text-gray-500 mt-1">📍 {finding.location}</p>
                    )}
                  </div>
                  
                  {/* Treatment Details */}
                  {finding.treatment && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        טיפול שבוצע:
                      </h4>
                      <p className="text-blue-900">{finding.treatment.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-blue-700">
                        <span>👤 {finding.treatment.treatedByName}</span>
                        <span>📅 {formatDate(finding.treatment.treatedDate)}</span>
                      </div>
                      
                      {/* Images */}
                      {finding.treatment.images && finding.treatment.images.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                            <PhotoIcon className="h-4 w-4" />
                            תמונות הוכחה:
                          </h5>
                          <div className="flex gap-2 flex-wrap">
                            {finding.treatment.images.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`הוכחה ${index + 1}`}
                                className="h-20 w-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setLightboxImage(url)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Comments Preview */}
                  {hasComments && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        הערות אחרונות:
                      </h4>
                      <div className="space-y-2">
                        {finding.comments?.slice(-2).map((comment) => (
                          <div key={comment.id} className={`p-2 rounded text-sm ${comment.byRole === 'consultant' ? 'bg-purple-100' : 'bg-white border'}`}>
                            <span className="font-medium">{comment.byName}</span>
                            <span className={`text-xs mx-2 px-1.5 py-0.5 rounded ${comment.byRole === 'consultant' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-700'}`}>
                              {comment.byRole === 'consultant' ? 'יועץ' : 'לקוח'}
                            </span>
                            <p className="text-gray-700 mt-1">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                  <button
                    onClick={() => openApprovalModal(finding, false)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    צפה בכל ההערות והוסף
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openApprovalModal(finding, true)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <XCircleIcon className="h-5 w-5" />
                      דחה
                    </button>
                    <button
                      onClick={() => openApprovalModal(finding, false)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      אשר וסגור
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Approval/Rejection Modal with Comments */}
      {isModalOpen && selectedFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {isRejectMode ? 'דחיית ממצא' : 'פרטי ממצא'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Finding Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{selectedFinding.clientName}</p>
                    <h3 className="font-bold text-gray-900">{selectedFinding.title}</h3>
                    <p className="text-gray-600 mt-1">{selectedFinding.description}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded text-sm font-medium ${severityConfig[selectedFinding.severity].bgColor} ${severityConfig[selectedFinding.severity].color}`}>
                    {severityConfig[selectedFinding.severity].label}
                  </span>
                </div>
              </div>
              
              {/* Treatment */}
              {selectedFinding.treatment && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800">טיפול שבוצע:</h4>
                  <p className="text-blue-900 mt-1">{selectedFinding.treatment.description}</p>
                  {selectedFinding.treatment.images && selectedFinding.treatment.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {selectedFinding.treatment.images.map((url, i) => (
                        <img 
                          key={i} 
                          src={url} 
                          alt="" 
                          className="h-20 w-20 object-cover rounded-lg border cursor-pointer" 
                          onClick={() => setLightboxImage(url)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Comments Section */}
              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  הערות ושיח ({selectedFinding.comments?.length || 0})
                </h4>
                
                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="הוסף הערה או שאלה..."
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
              
              {/* Rejection Reason */}
              {isRejectMode && (
                <div className="border-2 border-red-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    סיבת הדחייה *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full border border-red-300 rounded-lg p-3 text-gray-900"
                    placeholder="הסבר ללקוח מה נדרש לתקן..."
                    required
                  />
                </div>
              )}
            </div>
            
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                סגור
              </button>
              {isRejectMode ? (
                <button
                  onClick={handleReject}
                  disabled={saving || !rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? 'שולח...' : 'דחה ממצא'}
                </button>
              ) : (
                <button
                  onClick={handleApprove}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'שומר...' : 'אשר וסגור'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxImage(null)}
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
          <img
            src={lightboxImage}
            alt="תמונה בגודל מלא"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
