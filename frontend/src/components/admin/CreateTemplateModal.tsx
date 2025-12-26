import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useAuth } from '../../providers/AuthProvider';
import { useLocation } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTemplateModal({ isOpen, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'safety' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isAdminPath = location.pathname.startsWith('/admin');

    try {
      await addDoc(collection(firestore, 'inspection_templates'), {
        ...formData,
        isGlobal: isAdminPath, // אם אדמין יוצר - זה גלובלי. אם לקוח - זה פרטי.
        clientId: isAdminPath ? null : user?.id, // שיוך ללקוח
        sections: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("שגיאה");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">תבנית חדשה</h3>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
           </div>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">שם התבנית</label>
                <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">קטגוריה</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="safety">בטיחות</option>
                  <option value="maintenance">תחזוקה</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">תיאור</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
           </div>
           <button type="submit" disabled={loading} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
             {loading ? 'יוצר...' : 'צור תבנית'}
           </button>
        </form>
      </div>
    </div>
  );
}
