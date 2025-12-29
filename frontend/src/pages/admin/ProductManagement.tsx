import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore as db } from '../../firebase';
import { 
  CubeIcon, PlusIcon, PencilSquareIcon, TrashIcon, CheckBadgeIcon,
  NoSymbolIcon, BoltIcon, FireIcon, ShieldCheckIcon, AcademicCapIcon,
  BeakerIcon, TruckIcon, LifebuoyIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const AVAILABLE_ICONS = [
  { key: 'shield', label: 'בטיחות', component: ShieldCheckIcon },
  { key: 'bolt', label: 'חשמל', component: BoltIcon },
  { key: 'fire', label: 'אש', component: FireIcon },
  { key: 'beaker', label: 'כימיקלים', component: BeakerIcon },
  { key: 'training', label: 'הדרכות', component: AcademicCapIcon },
  { key: 'cube', label: 'כללי', component: CubeIcon },
];

export default function ProductManagement() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [formData, setFormData] = useState({ id: '', label: '', description: '', iconKey: 'cube', monthlyPrice: 0, isActive: true });

  useEffect(() => {
    const fetchModules = async () => {
      const sn = await getDocs(collection(db, 'system_modules'));
      setModules(sn.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchModules();
  }, []);

  const renderIcon = (iconKey: string) => {
    const Icon = AVAILABLE_ICONS.find(i => i.key === iconKey)?.component || CubeIcon;
    return <Icon className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans" dir="rtl">
      
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Service Catalog</h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">ניהול מודולים ותמחור גלובלי</p>
        </div>
        <button onClick={() => { setEditingModule(null); setFormData({ id: '', label: '', description: '', iconKey: 'cube', monthlyPrice: 0, isActive: true }); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
          <PlusIcon className="h-5 w-5" /> מודול חדש
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <motion.div key={mod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`relative bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group overflow-hidden ${!mod.isActive ? 'opacity-50 grayscale' : ''}`}>
            
            <div className="absolute top-6 left-6">
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${mod.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                 {mod.isActive ? 'Active' : 'Disabled'}
               </span>
            </div>

            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              {renderIcon(mod.iconKey)}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{mod.label}</h3>
            <p className="text-[10px] text-slate-600 font-mono mb-4 uppercase tracking-widest">SKU: {mod.id}</p>
            <p className="text-sm text-slate-400 mb-6 h-10 line-clamp-2 leading-relaxed">{mod.description}</p>
            
            <div className="flex items-end gap-1 mb-8">
              <span className="text-3xl font-black text-white">₪{mod.monthlyPrice}</span>
              <span className="text-slate-500 text-xs mb-1">/ Month</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setEditingModule(mod); setFormData(mod); setIsModalOpen(true); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/5">ערוך מודול</button>
              <button className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl border border-rose-500/10 transition-all"><TrashIcon className="h-5 w-5"/></button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal - Simplified for brevity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b14]/80 backdrop-blur-sm">
           <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8">{editingModule ? 'עדכון מודול' : 'יצירת מודול מערכת'}</h2>
              {/* Form implementation... */}
              <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">שמור שינויים</button>
           </div>
        </div>
      )}
    </div>
  );
}
