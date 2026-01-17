import React, { useState, useEffect } from 'react';
import { collectionGroup, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Plus, Search, Filter, ArrowRight, 
  MapPin, Shield, Calendar 
} from 'lucide-react';
import { SAFETY_DOMAINS, EQUIPMENT_TYPES } from '../../../phase4-equipment';

export default function EquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllEquipment = async () => {
      try {
        // שימוש ב-collectionGroup מאפשר לשלוף מכל הלקוחות ביחד
        const q = query(collectionGroup(firestore, 'equipment'));
        const sn = await getDocs(q);
        
        const items = sn.docs.map(d => ({
          id: d.id,
          ...d.data(),
          // ננסה לחלץ את ה-ID של הלקוח מתוך הנתיב (path)
          // הנתיב נראה ככה: clients/CLIENT_ID/equipment/EQUIPMENT_ID
          clientId: d.ref.parent.parent?.id 
        }));
        
        setEquipmentList(items);
      } catch (err) {
        console.error("Error fetching equipment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEquipment();
  }, []);

  const filteredList = equipmentList.filter(item => 
    item.manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
    item.model?.toLowerCase().includes(search.toLowerCase()) ||
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Box className="text-emerald-400" /> מאגר ציוד כולל
          </h1>
          <p className="text-slate-400 mt-1">צפייה בכל הנכסים בכל הלקוחות</p>
        </div>
        <button 
          onClick={() => navigate('/admin/equipment/new')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus size={20} /> ציוד חדש
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-3 text-slate-500" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חפש לפי יצרן, דגם או מספר סידורי..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pr-10 pl-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center text-slate-500 py-10">טוען נתונים...</div>
        ) : filteredList.length === 0 ? (
          <div className="text-center bg-slate-900/50 p-10 rounded-2xl border border-dashed border-slate-700">
            <Box size={48} className="mx-auto text-slate-600 mb-4"/>
            <p className="text-slate-400">לא נמצא ציוד במערכת</p>
          </div>
        ) : (
          filteredList.map(item => (
            <div 
              key={item.id}
              onClick={() => navigate(`/admin/equipment/${item.id}`)} // TODO: Fix edit link to include clientId
              className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-emerald-500 cursor-pointer transition-all group flex justify-between items-center"
            >
              <div className="flex items-center gap-6">
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-700`}>
                   <Shield size={24} className={SAFETY_DOMAINS[item.domain]?.color ? `text-${SAFETY_DOMAINS[item.domain].color}-400` : 'text-slate-400'} />
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {item.manufacturer} {item.model}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Box size={14}/> {item.name || 'ללא מזהה'}
                    </span>
                    {item.siteId && (
                      <span className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded text-xs">
                        <MapPin size={12}/> מיקום מוגדר
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status / Date */}
              <div className="text-left">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <span className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <span className="text-sm text-slate-300 capitalize">{item.status}</span>
                </div>
                {item.nextInspectionDate && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar size={12}/> בדיקה: {item.nextInspectionDate}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
