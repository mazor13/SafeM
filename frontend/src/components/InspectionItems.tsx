import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../firebase';
import { 
  TrashIcon, CheckCircleIcon, XCircleIcon, MinusCircleIcon, 
  CameraIcon, PhotoIcon, ChatBubbleBottomCenterTextIcon, PencilSquareIcon, CheckIcon
} from '@heroicons/react/24/outline';

type Item = {
  id: string;
  title: string;
  status: 'Pass' | 'Fail' | 'NA';
  imageUrl?: string;
  imagePath?: string;
  notes?: string;
  createdAt?: any;
};

export default function InspectionItems({ inspectionId }: { inspectionId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemStatus, setNewItemStatus] = useState<'Pass' | 'Fail' | 'NA'>('Pass');
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  // ניהול מצבי עריכה
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null); // מזהה הפריט שנערך כרגע
  const [editTitleText, setEditTitleText] = useState(''); // הטקסט הזמני בזמן עריכה

  useEffect(() => {
    const itemsRef = collection(firestore, 'inspections', inspectionId, 'items');
    const q = query(itemsRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [inspectionId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    try {
      await addDoc(collection(firestore, 'inspections', inspectionId, 'items'), {
        title: newItemTitle,
        status: newItemStatus,
        createdAt: serverTimestamp(),
      });
      setNewItemTitle('');
    } catch (error) { console.error("Error adding item:", error); }
  };

  // התחלת עריכה
  const startEditing = (item: Item) => {
    setEditingItemId(item.id);
    setEditTitleText(item.title);
  };

  // שמירת עריכה
  const saveEdit = async (itemId: string) => {
    if (!editTitleText.trim()) return;
    try {
      await updateDoc(doc(firestore, 'inspections', inspectionId, 'items', itemId), {
        title: editTitleText
      });
      setEditingItemId(null);
    } catch (error) {
      alert('שגיאה בעדכון הפריט');
    }
  };

  const handleDeleteItem = async (item: Item) => {
    if(!window.confirm('למחוק שורה זו?')) return;
    try {
      if (item.imagePath) {
        await deleteObject(ref(storage, item.imagePath)).catch(console.error);
      }
      await deleteDoc(doc(firestore, 'inspections', inspectionId, 'items', item.id));
    } catch (error) { console.error(error); }
  };

  const handleImageUpload = async (itemId: string, file: File) => {
    if (!file) return;
    setUploadingId(itemId);
    try {
      const path = `inspection_images/${inspectionId}/${itemId}_${Date.now()}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      await updateDoc(doc(firestore, 'inspections', inspectionId, 'items', itemId), {
        imageUrl: downloadUrl, imagePath: path
      });
    } catch (error) { alert("שגיאה בהעלאה"); } 
    finally { setUploadingId(null); }
  };

  const handleSaveNote = async (itemId: string, text: string) => {
    try {
      await updateDoc(doc(firestore, 'inspections', inspectionId, 'items', itemId), { notes: text });
    } catch (err) { console.error("Error saving note", err); }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pass': return { bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircleIcon className="w-5 h-5"/> };
      case 'Fail': return { bg: 'bg-red-50', text: 'text-red-700', icon: <XCircleIcon className="w-5 h-5"/> };
      default: return { bg: 'bg-gray-50', text: 'text-gray-500', icon: <MinusCircleIcon className="w-5 h-5"/> };
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">רשימת ליקויים ({items.length})</h3>

      <form onSubmit={handleAddItem} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">תיאור הפריט / מיקום</label>
          <input type="text" className="w-full border-slate-300 rounded-md shadow-sm"
            placeholder="לדוגמה: מטף כיבוי אש - קומה 1"
            value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} />
        </div>
        <div className="w-full sm:w-32">
          <label className="block text-xs font-medium text-slate-500 mb-1">סטטוס</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm"
            value={newItemStatus} onChange={(e) => setNewItemStatus(e.target.value as any)}>
            <option value="Pass">תקין</option>
            <option value="Fail">לא תקין</option>
            <option value="NA">לא רלוונטי</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">הוסף +</button>
      </form>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {items.length === 0 && !loading && <div className="p-8 text-center text-slate-400">אין פריטים עדיין.</div>}
        
        <ul className="divide-y divide-slate-100">
          {items.map((item) => {
            const style = getStatusStyle(item.status);
            return (
              <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-full ${style.bg} ${style.text}`}>{style.icon}</div>
                    <div className="flex-1">
                      
                      {/* אזור עריכת הכותרת */}
                      {editingItemId === item.id ? (
                        <div className="flex items-center gap-2 mb-2">
                          <input 
                            type="text" 
                            className="flex-1 p-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            value={editTitleText}
                            onChange={(e) => setEditTitleText(e.target.value)}
                            autoFocus
                          />
                          <button onClick={() => saveEdit(item.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <CheckIcon className="w-5 h-5" />
                          </button>
                          <button onClick={() => setEditingItemId(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded text-xs">
                            ביטול
                          </button>
                        </div>
                      ) : (
                        <div className="font-medium text-slate-800 text-lg flex items-center gap-2 group">
                          {item.title}
                          <button 
                            onClick={() => startEditing(item)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity"
                            title="ערוך טקסט"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      {/* תמונה והערות - ללא שינוי */}
                      {item.imageUrl && (
                        <div className="mt-2">
                          <a href={item.imageUrl} target="_blank" rel="noreferrer" className="inline-block relative group">
                            <img src={item.imageUrl} alt="Evidence" className="h-16 w-16 object-cover rounded-md border shadow-sm" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 rounded-md transition-opacity">
                              <PhotoIcon className="w-6 h-6 text-white" />
                            </div>
                          </a>
                        </div>
                      )}
                      {item.notes && activeNoteId !== item.id && (
                        <div className="mt-2 text-sm text-slate-600 bg-slate-100 p-2 rounded-md inline-block border border-slate-200">
                          <span className="font-bold text-slate-400 text-xs ml-1">הערה:</span>
                          {item.notes}
                        </div>
                      )}
                      {activeNoteId === item.id && (
                        <div className="mt-2">
                          <textarea
                            className="w-full text-sm p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                            rows={2} placeholder="כתוב הערה כאן..." defaultValue={item.notes || ''} autoFocus
                            onBlur={(e) => { handleSaveNote(item.id, e.target.value); setActiveNoteId(null); }}
                          />
                          <div className="text-xs text-slate-400 mt-1">לחץ מחוץ לתיבה כדי לשמור</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                      {item.status === 'Pass' ? 'תקין' : item.status === 'Fail' ? 'ליקוי' : 'ל"ר'}
                    </span>
                    <button onClick={() => setActiveNoteId(activeNoteId === item.id ? null : item.id)} className={`p-2 rounded-full transition-colors ${item.notes ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'}`}>
                      <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                    </button>
                    <label className="cursor-pointer p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative">
                      <input type="file" accept="image/*" className="hidden" 
                        onChange={(e) => e.target.files && handleImageUpload(item.id, e.target.files[0])} disabled={!!uploadingId} />
                      {uploadingId === item.id ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <CameraIcon className="w-5 h-5" />}
                    </label>
                    <button onClick={() => handleDeleteItem(item)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
