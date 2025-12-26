import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { 
  ArrowRightIcon, PlusIcon, TrashIcon, 
  Cog6ToothIcon, PencilSquareIcon
} from '@heroicons/react/24/outline';

export default function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{secId: string, itemId: string} | null>(null);

  const basePath = location.pathname.includes('/admin') ? '/admin/templates' : '/client/templates';

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const docRef = doc(firestore, 'inspection_templates', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setTemplate({ id: snap.id, ...snap.data() });
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [id]);

  const save = async () => {
    if (!id || !template) return;
    try {
      await updateDoc(doc(firestore, 'inspection_templates', id), {
        sections: template.sections,
        updatedAt: new Date()
      });
      alert('נשמר!');
    } catch (e) { alert('שגיאה'); }
  };

  const addItem = (secId: string) => {
    const newItem = { id: crypto.randomUUID(), text: 'שאלה חדשה', type: 'pass_fail', required: true };
    const newSections = template.sections.map((s: any) => 
      s.id === secId ? { ...s, items: [...s.items, newItem] } : s
    );
    setTemplate({ ...template, sections: newSections });
    setSelectedItem({ secId, itemId: newItem.id });
  };

  if (loading) return <div className="p-10 text-center">טוען עורך...</div>;
  if (!template) return <div className="p-10 text-center">לא נמצא</div>;

  const activeItem = template.sections
    .find((s: any) => s.id === selectedItem?.secId)
    ?.items.find((i: any) => i.id === selectedItem?.itemId);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden text-right" dir="rtl">
      <div className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(basePath)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowRightIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="font-bold text-xl">{template.title}</h1>
        </div>
        <button onClick={save} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">שמור שינויים</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <div className="max-w-2xl mx-auto space-y-6">
            {template.sections?.map((sec: any) => (
              <div key={sec.id} className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">{sec.title}</h2>
                <div className="space-y-3">
                  {sec.items.map((item: any) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedItem({ secId: sec.id, itemId: item.id })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedItem?.itemId === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{item.text}</span>
                        <span className="text-[10px] bg-gray-200 px-2 py-1 rounded-full uppercase font-bold">{item.type}</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addItem(sec.id)} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600 hover:border-indigo-300 text-sm font-bold">+ הוסף שאלה</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-r shadow-xl p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8 border-b pb-4">
            <Cog6ToothIcon className="h-5 w-5 text-indigo-600" />
            <h2 className="font-bold text-gray-900">מאפייני שדה</h2>
          </div>

          {activeItem ? (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">תוכן השאלה</label>
                <textarea 
                  className="w-full border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={activeItem.text}
                  onChange={(e) => {
                    const newSecs = template.sections.map((s: any) => {
                      if (s.id !== selectedItem?.secId) return s;
                      return { ...s, items: s.items.map((i: any) => i.id === selectedItem?.itemId ? { ...i, text: e.target.value } : i) };
                    });
                    setTemplate({ ...template, sections: newSecs });
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">סוג קלט</label>
                <select 
                  className="w-full border rounded-xl p-2 text-sm outline-none"
                  value={activeItem.type}
                  onChange={(e) => {
                    const newSecs = template.sections.map((s: any) => {
                      if (s.id !== selectedItem?.secId) return s;
                      return { ...s, items: s.items.map((i: any) => i.id === selectedItem?.itemId ? { ...i, type: e.target.value } : i) };
                    });
                    setTemplate({ ...template, sections: newSecs });
                  }}
                >
                  <option value="pass_fail">תקין/לקוי</option>
                  <option value="text">טקסט</option>
                  <option value="number">מספר</option>
                  <option value="photo">צילום חובה</option>
                  <option value="signature_manual">חתימה ידנית</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                 <span className="text-sm font-bold text-gray-600">שדה חובה</span>
                 <input 
                  type="checkbox" 
                  checked={activeItem.required}
                  onChange={(e) => {
                    const newSecs = template.sections.map((s: any) => {
                      if (s.id !== selectedItem?.secId) return s;
                      return { ...s, items: s.items.map((i: any) => i.id === selectedItem?.itemId ? { ...i, required: e.target.checked } : i) };
                    });
                    setTemplate({ ...template, sections: newSecs });
                  }}
                 />
              </div>

              <button 
                onClick={() => {
                  const newSecs = template.sections.map((s: any) => {
                    if (s.id !== selectedItem?.secId) return s;
                    return { ...s, items: s.items.filter((i: any) => i.id !== selectedItem?.itemId) };
                  });
                  setTemplate({ ...template, sections: newSecs });
                  setSelectedItem(null);
                }}
                className="w-full py-2 text-red-500 font-bold text-xs border border-red-50 rounded-xl hover:bg-red-50"
              >
                מחק שדה
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-20">
              <PencilSquareIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">בחר שדה לעריכה</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
