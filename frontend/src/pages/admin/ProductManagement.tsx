import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore as db } from '../../firebase';
import { 
  CubeIcon, 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  CheckBadgeIcon,
  NoSymbolIcon,
  BoltIcon,
  FireIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BeakerIcon,
  TruckIcon,
  LifebuoyIcon
} from '@heroicons/react/24/outline';

// רשימת אייקונים זמינה לבחירה עבור מודולים חדשים
const AVAILABLE_ICONS = [
  { key: 'shield', label: 'מגן (בטיחות)', component: ShieldCheckIcon },
  { key: 'bolt', label: 'ברק (חשמל/לייזר)', component: BoltIcon },
  { key: 'fire', label: 'אש', component: FireIcon },
  { key: 'beaker', label: 'מבחנה (כימיקלים)', component: BeakerIcon },
  { key: 'training', label: 'כובע בוגר (הדרכות)', component: AcademicCapIcon },
  { key: 'truck', label: 'משאית (שינוע)', component: TruckIcon },
  { key: 'lifebuoy', label: 'גלגל הצלה (חירום)', component: LifebuoyIcon },
  { key: 'cube', label: 'קוביה (כללי)', component: CubeIcon },
];

interface ModuleData {
  id: string;
  label: string;
  description: string;
  iconKey: string;
  monthlyPrice: number;
  isActive: boolean;
}

export default function ProductManagement() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleData | null>(null);
  
  // Form State
  const initialForm = { id: '', label: '', description: '', iconKey: 'cube', monthlyPrice: 0, isActive: true };
  const [formData, setFormData] = useState(initialForm);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'system_modules'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ModuleData[];
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchModules(); }, []);

  const openModal = (module?: ModuleData) => {
    if (module) {
      setEditingModule(module);
      setFormData(module);
    } else {
      setEditingModule(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ID חייב להיות באנגלית וללא רווחים (למשל 'hazmat')
      const docId = editingModule ? editingModule.id : formData.id.toLowerCase().replace(/\s/g, '_');
      
      await setDoc(doc(db, 'system_modules', docId), {
        ...formData,
        id: docId
      });
      
      setIsModalOpen(false);
      fetchModules(); // רענון הרשימה
      alert(editingModule ? "המודול עודכן בהצלחה" : "המודול נוצר בהצלחה! כעת ניתן להקצות אותו ללקוחות.");
    } catch (error) {
      console.error("Error saving module:", error);
      alert("שגיאה בשמירה");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("האם אתה בטוח? מחיקת מודול עלולה להשפיע על לקוחות שמשתמשים בו.")) {
      try {
        await deleteDoc(doc(db, 'system_modules', id));
        fetchModules();
      } catch (error) {
        alert("שגיאה במחיקה");
      }
    }
  };

  // Helper to render icon dynamically
  const renderIcon = (iconKey: string) => {
    const iconDef = AVAILABLE_ICONS.find(i => i.key === iconKey);
    const Icon = iconDef ? iconDef.component : CubeIcon;
    return <Icon className="h-6 w-6" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">קטלוג מוצרים (Service Catalog)</h1>
          <p className="text-sm text-gray-500">הגדרת המודולים הזמינים במערכת, תמחור ואייקונים.</p>
        </div>
        <button onClick={() => openModal()} className="mt-4 md:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm text-sm font-medium flex items-center">
          <PlusIcon className="h-5 w-5 ml-2" /> מודול חדש
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${!mod.isActive ? 'opacity-60 grayscale' : ''}`}>
            {/* Active Status Badge */}
            <div className="absolute top-2 left-2">
               {mod.isActive ? (
                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                   פעיל <CheckBadgeIcon className="h-3 w-3 mr-1" />
                 </span>
               ) : (
                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                   לא פעיל <NoSymbolIcon className="h-3 w-3 mr-1" />
                 </span>
               )}
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                {renderIcon(mod.iconKey)}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{mod.label}</h3>
              <p className="text-xs text-gray-400 font-mono mb-3">ID: {mod.id}</p>
              <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{mod.description || 'אין תיאור זמין'}</p>
              
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold text-gray-900">₪{mod.monthlyPrice}</span>
                <span className="text-gray-500 text-sm mr-1">/חודש</span>
              </div>

              <div className="flex space-x-2 border-t pt-4">
                <button onClick={() => openModal(mod)} className="flex-1 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded text-sm font-medium">
                  ערוך
                </button>
                <button onClick={() => handleDelete(mod.id)} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded text-sm font-medium">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSave}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {editingModule ? 'עריכת מודול' : 'יצירת מודול חדש'}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* ID Field - Editable only on create */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">מזהה מערכת (ID)</label>
                      <input 
                        type="text" 
                        required 
                        disabled={!!editingModule}
                        placeholder="למשל: hazmat" 
                        value={formData.id} 
                        onChange={e => setFormData({...formData, id: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm disabled:bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">באנגלית בלבד, ללא רווחים. לא ניתן לשינוי לאחר היצירה.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">שם המודול (לתצוגה)</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.label} 
                        onChange={e => setFormData({...formData, label: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">תיאור קצר</label>
                      <textarea 
                        rows={2}
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">מחיר חודשי (₪)</label>
                        <input 
                          type="number" 
                          required 
                          value={formData.monthlyPrice} 
                          onChange={e => setFormData({...formData, monthlyPrice: Number(e.target.value)})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">סטטוס</label>
                        <select 
                          value={formData.isActive ? 'true' : 'false'} 
                          onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                        >
                          <option value="true">פעיל (זמין למכירה)</option>
                          <option value="false">לא פעיל (מוסתר)</option>
                        </select>
                      </div>
                    </div>

                    {/* Icon Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">בחר אייקון</label>
                      <div className="grid grid-cols-4 gap-2">
                        {AVAILABLE_ICONS.map(icon => {
                          const Icon = icon.component;
                          return (
                            <button
                              type="button"
                              key={icon.key}
                              onClick={() => setFormData({...formData, iconKey: icon.key})}
                              className={`flex flex-col items-center justify-center p-2 rounded border ${
                                formData.iconKey === icon.key ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <Icon className="h-6 w-6 text-gray-600 mb-1" />
                              <span className="text-[10px] text-gray-500">{icon.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
                    שמור
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 sm:mt-0 sm:w-auto sm:text-sm">
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
