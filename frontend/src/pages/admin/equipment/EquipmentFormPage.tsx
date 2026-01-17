import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  doc, getDoc, collection, addDoc, updateDoc, serverTimestamp, getDocs, query, where 
} from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { 
  ArrowRight, Save, Shield, Info, MapPin, Calendar, 
  Search, Package, Check, AlertTriangle 
} from 'lucide-react';
import { EQUIPMENT_TYPES, SAFETY_DOMAINS } from '../../../phase4-equipment';
import { CatalogItem } from '../../../types/catalog.types';

export default function EquipmentFormPage() {
  const { equipmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Catalog State
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [showCatalogSearch, setShowCatalogSearch] = useState(false);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');

  // Sites State
  const [sites, setSites] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '', // Internal ID / Serial Number
    domain: 'fire_safety',
    type: 'extinguisher',
    manufacturer: '',
    model: '',
    siteId: '',
    buildingId: '',
    specificLocation: '', // Floor/Room text
    installationDate: new Date().toISOString().split('T')[0],
    lastInspectionDate: '',
    nextInspectionDate: '',
    status: 'active',
    clientId: '' // Will be selected first
  });

  // Clients List for selection
  const [clients, setClients] = useState<any[]>([]);

  // Load Initial Data (Clients & Catalog)
  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Load Clients
        const clientsSn = await getDocs(collection(firestore, 'clients'));
        setClients(clientsSn.docs.map(d => ({ id: d.id, ...d.data() })));

        // 2. Load Catalog Items (Only global ones for now)
        const catalogSn = await getDocs(query(collection(firestore, 'catalog_items'), where('isGlobal', '==', true)));
        setCatalogItems(catalogSn.docs.map(d => ({ id: d.id, ...d.data() } as CatalogItem)));

      } catch (err) {
        console.error(err);
      }
    };
    initData();
  }, []);

  // Load Sites when Client is selected
  useEffect(() => {
    if (!formData.clientId) return;
    const fetchSites = async () => {
      const q = query(collection(firestore, `clients/${formData.clientId}/sites`));
      const sn = await getDocs(q);
      setSites(sn.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchSites();
  }, [formData.clientId]);

  // Load Buildings when Site is selected
  useEffect(() => {
    if (!formData.clientId || !formData.siteId) return;
    const fetchBuildings = async () => {
      const q = query(collection(firestore, `clients/${formData.clientId}/sites/${formData.siteId}/buildings`));
      const sn = await getDocs(q);
      setBuildings(sn.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchBuildings();
  }, [formData.siteId]);

  // Handle Catalog Selection
  const handleCatalogSelect = (item: CatalogItem) => {
    setFormData(prev => ({
      ...prev,
      manufacturer: item.manufacturer,
      model: item.model,
      domain: item.domain, // Auto-switch domain
    }));
    
    // Auto-calculate next inspection if frequency exists
    if (item.recommendedFrequency) {
      const today = new Date();
      today.setMonth(today.getMonth() + item.recommendedFrequency);
      setFormData(prev => ({
        ...prev,
        nextInspectionDate: today.toISOString().split('T')[0]
      }));
    }

    setShowCatalogSearch(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) {
      alert('יש לבחור לקוח');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        updatedAt: serverTimestamp()
      };

      if (equipmentId) {
        // Update logic would go here
      } else {
        await addDoc(collection(firestore, `clients/${formData.clientId}/equipment`), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      navigate('/admin/equipment');
    } catch (err) {
      console.error(err);
      alert('Error saving equipment');
    } finally {
      setLoading(false);
    }
  };

  // Filter Catalog Items for Search
  const filteredCatalog = catalogItems.filter(item => 
    item.manufacturer.toLowerCase().includes(catalogSearchTerm.toLowerCase()) ||
    item.model.toLowerCase().includes(catalogSearchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {equipmentId ? 'עריכת ציוד' : 'הוספת ציוד חדש'}
          </h1>
          <p className="text-slate-400">הזנת פרטי נכס למעקב ובקרה</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Classification */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield size={20} className="text-indigo-400"/> סיווג ושיוך
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">לקוח</label>
              <select 
                value={formData.clientId}
                onChange={e => setFormData({...formData, clientId: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              >
                <option value="">בחר לקוח...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">תחום בטיחות</label>
              <select 
                value={formData.domain}
                onChange={e => setFormData({...formData, domain: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.entries(SAFETY_DOMAINS).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Identification (The Catalog Part!) */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Package size={20} className="text-purple-400"/> זיהוי הציוד
          </h3>

          {/* Catalog Helper */}
          <div className="mb-6 bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Search className="text-purple-400" />
                <div>
                  <h4 className="font-bold text-purple-100">חיפוש מהיר בקטלוג</h4>
                  <p className="text-xs text-purple-300">משוך נתונים אוטומטית ממאגר הפריטים</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowCatalogSearch(!showCatalogSearch)}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                {showCatalogSearch ? 'סגור חיפוש' : 'פתח קטלוג'}
              </button>
            </div>

            {/* Catalog Dropdown */}
            {showCatalogSearch && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <input 
                  autoFocus
                  placeholder="הקלד שם יצרן או דגם..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white mb-2"
                  value={catalogSearchTerm}
                  onChange={e => setCatalogSearchTerm(e.target.value)}
                />
                <div className="max-h-40 overflow-y-auto space-y-2 custom-scrollbar">
                  {filteredCatalog.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => handleCatalogSelect(item)}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer flex justify-between items-center border border-slate-700 hover:border-purple-500 transition-all"
                    >
                      <div>
                        <span className="font-bold text-white block">{item.manufacturer}</span>
                        <span className="text-sm text-slate-400">{item.model}</span>
                      </div>
                      <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                        {SAFETY_DOMAINS[item.domain]?.name}
                      </span>
                    </div>
                  ))}
                  {filteredCatalog.length === 0 && (
                    <div className="text-slate-500 text-center py-2 text-sm">לא נמצאו פריטים תואמים</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">יצרן</label>
              <input 
                value={formData.manufacturer}
                onChange={e => setFormData({...formData, manufacturer: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="למשל: להבות"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">דגם</label>
              <input 
                value={formData.model}
                onChange={e => setFormData({...formData, model: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="למשל: אבקה 6 קג"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-400 text-sm font-bold mb-2">מספר סידורי / מזהה פנימי</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="מס' נכס בארגון"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location (Using Sites!) */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-emerald-400"/> מיקום והיררכיה
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">אתר ראשי</label>
              <select 
                value={formData.siteId}
                onChange={e => setFormData({...formData, siteId: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={!formData.clientId}
              >
                <option value="">בחר אתר...</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">מבנה / בניין</label>
              <select 
                value={formData.buildingId}
                onChange={e => setFormData({...formData, buildingId: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={!formData.siteId}
              >
                <option value="">בחר מבנה...</option>
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-slate-400 text-sm font-bold mb-2">מיקום ספציפי (קומה/חדר)</label>
              <input 
                value={formData.specificLocation}
                onChange={e => setFormData({...formData, specificLocation: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="למשל: קומה 2, חדר שרתים"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Maintenance */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-amber-400"/> תאריכים ותחזוקה
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">תאריך התקנה</label>
              <input 
                type="date"
                value={formData.installationDate}
                onChange={e => setFormData({...formData, installationDate: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">תאריך בדיקה הבאה</label>
              <div className="relative">
                <input 
                  type="date"
                  value={formData.nextInspectionDate}
                  onChange={e => setFormData({...formData, nextInspectionDate: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none pl-10"
                />
                {/* Visual indicator if auto-filled from catalog */}
                {formData.nextInspectionDate && (
                  <Check size={16} className="absolute left-3 top-4 text-emerald-500" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                * מחושב אוטומטית אם נבחר פריט מקטלוג
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-900/20 flex items-center gap-3 transition-all transform hover:scale-105"
          >
            {loading ? 'שומר...' : (
              <>
                <Save size={20} />
                שמור ציוד במערכת
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
