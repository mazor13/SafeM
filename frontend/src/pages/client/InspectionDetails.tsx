import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { firestore, storage, functions } from '../../firebase';
import { compressImage } from '../../utils/imageUtils';
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CameraIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  TrashIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

export default function InspectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
  // ניהול העלאת תמונות
  const [uploadingItem, setUploadingItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhotoItemId, setActivePhotoItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(firestore, 'inspections', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setInspection({ id: docSnap.id, ...docSnap.data() });
      } else {
        alert('הבדיקה לא נמצאה');
        navigate('/client');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id, navigate]);

  const handleAnswer = async (itemId: string, value: any) => {
    if (!id || !inspection) return;
    
    // Optimistic update
    const newAnswers = { ...inspection.answers, [itemId]: value };
    setInspection({ ...inspection, answers: newAnswers });

    // Progress calc
    const totalItems = inspection.templateSnapshot.reduce((acc: number, sec: any) => acc + sec.items.length, 0);
    const answeredItems = Object.keys(newAnswers).length;
    const progress = Math.round((answeredItems / totalItems) * 100);

    try {
      await updateDoc(doc(firestore, 'inspections', id), {
        [`answers.${itemId}`]: value,
        progress: progress,
        updatedAt: serverTimestamp(),
        status: progress === 100 ? 'completed' : 'in_progress'
      });
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  // === יצירת PDF באמצעות Cloud Function ===
  const handleGeneratePDF = async () => {
    if (!inspection) return;
    
    setGeneratingPdf(true);
    
    try {
      const generatePDF = httpsCallable(functions, 'generateInspectionPDF');
      const result = await generatePDF({ inspection });
      const data = result.data as { success: boolean; pdf: string; filename: string };
      
      if (data.success && data.pdf) {
        // המרת base64 ל-Blob
        const byteCharacters = atob(data.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // יצירת קישור להורדה
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.filename || 'inspection.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("שגיאה ביצירת ה-PDF. נסה שוב.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  // === מנגנון העלאת תמונות ===
  
  const triggerCamera = (itemId: string) => {
    setActivePhotoItemId(itemId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePhotoItemId || !id) return;

    setUploadingItem(activePhotoItemId);

    try {
      // 1. דחיסה
      const compressedBlob = await compressImage(file);
      
      // 2. יצירת שם קובץ
      const fileName = `inspection_${id}_${activePhotoItemId}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `inspection_images/${fileName}`);
      
      // 3. העלאה
      await uploadBytes(storageRef, compressedBlob);
      
      // 4. קבלת קישור
      const downloadURL = await getDownloadURL(storageRef);
      
      // 5. שמירה
      await handleAnswer(activePhotoItemId, downloadURL);
      
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("שגיאה בהעלאת התמונה");
    } finally {
      setUploadingItem(null);
      setActivePhotoItemId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getAnswer = (itemId: string) => inspection?.answers?.[itemId];

  if (loading) return <div className="p-10 text-center text-gray-900">טוען...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Hidden File Input for Camera */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <button onClick={() => navigate('/client')} className="text-gray-500 hover:text-gray-900 flex items-center text-sm">
              <ArrowRightIcon className="h-4 w-4 ml-1" /> יציאה
            </button>
            <div className="flex items-center gap-2">
              {/* PDF Download Button - Cloud Function */}
              <button
                onClick={handleGeneratePDF}
                disabled={generatingPdf}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors disabled:opacity-50"
              >
                {generatingPdf ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    <span>מכין...</span>
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    <span>PDF</span>
                  </>
                )}
              </button>
              
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                inspection.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {inspection.status === 'completed' ? 'הושלם' : 'בתהליך'}
              </span>
            </div>
          </div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">{inspection.templateName}</h1>
          <p className="text-sm text-gray-500">{inspection.clientName} • {inspection.siteName}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${inspection.progress || 0}%` }}></div>
            </div>
            <span className="text-xs font-medium text-gray-600 w-8">{inspection.progress || 0}%</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {inspection.templateSnapshot.map((section: any) => (
          <div key={section.id} className="space-y-4">
            <h2 className="text-md font-bold text-gray-800 border-r-4 border-indigo-500 pr-3">{section.title}</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {section.items.map((item: any, index: number) => {
                const answer = getAnswer(item.id);
                return (
                  <div key={item.id} className={`p-4 border-b last:border-0 border-gray-100 ${answer ? 'bg-indigo-50/30' : ''}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-400 mt-1">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-3">
                           {item.text} 
                           {item.required && <span className="text-red-500">*</span>}
                        </p>
                        
                        {/* PASS / FAIL */}
                        {item.type === 'pass_fail' && (
                          <div className="flex gap-3">
                            <button onClick={() => handleAnswer(item.id, 'pass')} className={`flex-1 py-3 rounded-lg border flex justify-center items-center gap-2 ${answer === 'pass' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-200 text-gray-600'}`}>
                              <CheckCircleIcon className="h-6 w-6" /> תקין
                            </button>
                            <button onClick={() => handleAnswer(item.id, 'fail')} className={`flex-1 py-3 rounded-lg border flex justify-center items-center gap-2 ${answer === 'fail' ? 'bg-red-100 border-red-500 text-red-700' : 'border-gray-200 text-gray-600'}`}>
                              <XCircleIcon className="h-6 w-6" /> לקוי
                            </button>
                          </div>
                        )}

                        {/* TEXT */}
                        {item.type === 'text' && (
                          <div className="relative">
                            <textarea rows={2} placeholder="כתוב הערה..." className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white" value={answer || ''} onBlur={(e) => handleAnswer(item.id, e.target.value)} onChange={(e) => setInspection({...inspection, answers: {...inspection.answers, [item.id]: e.target.value}})} />
                            <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400 absolute left-3 bottom-3" />
                          </div>
                        )}

                        {/* NUMBER */}
                        {item.type === 'number' && (
                          <div className="flex items-center gap-2">
                             <input type="number" placeholder="0.00" className="w-32 border border-gray-300 rounded-lg p-2 text-center font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white" value={answer || ''} onChange={(e) => handleAnswer(item.id, e.target.value)} />
                          </div>
                        )}

                        {/* PHOTO */}
                        {item.type === 'photo' && (
                           <div className="mt-2">
                              {answer ? (
                                <div className="relative group w-fit">
                                  <img src={answer} alt="Evidence" className="h-32 w-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                                  <button onClick={() => {if(window.confirm('למחוק תמונה?')) handleAnswer(item.id, null)}} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md">
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => triggerCamera(item.id)}
                                  disabled={uploadingItem === item.id}
                                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition-all flex flex-col items-center justify-center gap-2"
                                >
                                  {uploadingItem === item.id ? (
                                    <>
                                      <ArrowPathIcon className="h-8 w-8 animate-spin text-indigo-500" />
                                      <span className="text-sm font-medium">דוחס ומעלה...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CameraIcon className="h-8 w-8" />
                                      <span className="text-sm">צלם תמונה</span>
                                    </>
                                  )}
                                </button>
                              )}
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <button disabled={inspection.progress < 100} onClick={() => alert('מצוין! הדוח נשמר והושלם.')} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:shadow-none">
            <CheckBadgeIcon className="h-6 w-6" />
            {inspection.progress < 100 ? `השלם את כל השאלות (${inspection.progress}%)` : 'סיים בדיקה וחתום'}
          </button>
        </div>
      </div>
    </div>
  );
}
