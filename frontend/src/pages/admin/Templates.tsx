import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DocumentTextIcon, PlusIcon, MagnifyingGlassIcon,
  ArchiveBoxIcon, GlobeAltIcon, LockClosedIcon
} from '@heroicons/react/24/outline';
import { collection, onSnapshot, query, orderBy, where, or } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useAuth } from '../../providers/AuthProvider';
import CreateTemplateModal from '../../components/admin/CreateTemplateModal';

export default function Templates() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!user) return;
    const templatesRef = collection(firestore, 'inspection_templates');
    let q = query(templatesRef, orderBy('createdAt', 'desc'));

    if (!isAdminPath) {
      q = query(templatesRef, or(where('isGlobal', '==', true), where('clientId', '==', user.id)));
    }
    
    return onSnapshot(q, (snapshot) => {
      setTemplates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, [user, isAdminPath]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ניהול פרוטוקולים</h1>
          <p className="text-slate-500 text-sm">ניהול דרישות רגולטוריות וטפסי בדיקה</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200">
          <PlusIcon className="h-5 w-5" /> פרוטוקול חדש
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((t: any) => (
          <div 
            key={t.id} 
            onClick={() => navigate(location.pathname + '/' + t.id)}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100"><DocumentTextIcon className="h-6 w-6 text-indigo-600"/></div>
              {t.isGlobal ? <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">Global</span> : <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">Private</span>}
            </div>
            <h3 className="font-bold text-slate-800">{t.title}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-indigo-600 uppercase">
              <span>עריכת פרוטוקול</span>
              <span>&larr;</span>
            </div>
          </div>
        ))}
      </div>

      <CreateTemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => setIsModalOpen(false)} />
    </div>
  );
}
