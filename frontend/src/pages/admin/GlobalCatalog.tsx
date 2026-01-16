import React, { useState, useEffect } from 'react';
import { 
  collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, 
  doc, serverTimestamp, orderBy, where 
} from 'firebase/firestore';
import { firestore } from '../../firebase';
import { 
  Package, Search, Plus, Filter, Edit2, Trash2, 
  Tag, AlertCircle, Save, X 
} from 'lucide-react';
import { CatalogItem } from '../../types/catalog.types';
import { SAFETY_DOMAINS } from '../../phase4-equipment';

export default function GlobalCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');

  // Form State
  const [formData, setFormData] = useState<Partial<CatalogItem>>({
    manufacturer: '',
    model: '',
    domain: 'fire_safety', // default
    recommendedFrequency: 12,
    isGlobal: true
  });

  // Load Data
  useEffect(() => {
    // In real app, we might paginate this. For now, pull all global items.
    const q = query(
      collection(firestore, 'catalog_items'), 
      where('isGlobal', '==', true),
      orderBy('manufacturer')
    );
    
    const unsub = onSnapshot(q, (sn) => {
      const data = sn.docs.map(d => ({ id: d.id, ...d.data() } as CatalogItem));
      setItems(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Filter Logic
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = domainFilter === 'all' || item.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(firestore, 'catalog_items', editingId), payload);
      } else {
        await addDoc(collection(firestore, 'catalog_items'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Error saving item');
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('למחוק פריט זה מהקטלוג?')) return;
    await deleteDoc(doc(firestore, 'catalog_items', id));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      manufacturer: '',
      model: '',
      domain: 'fire_safety',
      recommendedFrequency: 12,
      isGlobal: true
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans" dir="rtl">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Package className="text-purple-400" /> קטלוג פריטים גלובלי
          </h1>
          <p className="text-slate-400 mt-1">ניהול מאגר הפריטים המאושרים (יצרנים ודגמים)</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20"
        >
          <Plus size={20} /> פריט חדש
        </button>
      </div>

      <div className="flex gap-6 items-start">
        
        {/* Main List Area */}
        <div className="flex-1 space-y-4">
          
          {/* Filters */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-2.5 text-slate-500" size={18} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="חפש יצרן או דגם..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pr-10 pl-4 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="w-48 relative">
              <Filter className="absolute right-3 top-2.5 text-slate-500" size={18} />
              <select 
                value={domainFilter}
                onChange={e => setDomainFilter(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pr-10 pl-4 py-2 text-white appearance-none focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="all">כל התחומים</option>
                {Object.entries(SAFETY_DOMAINS).map(([key, d]) => (
                  <option key={key} value={key}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">יצרן ודגם</th>
                  <th className="px-6 py-4">תחום</th>
                  <th className="px-6 py-4">תדירות (חודשים)</th>
                  <th className="px-6 py-4">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">טוען...</td></tr>
                ) : filteredItems.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">לא נמצאו פריטים</td></tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{item.manufacturer}</div>
                        <div className="text-sm text-slate-400">{item.model}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs text-slate-300">
                          {SAFETY_DOMAINS[item.domain]?.name || item.domain}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {item.recommendedFrequency || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setFormData(item);
                              setEditingId(item.id);
                              setShowForm(true);
                            }}
                            className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-rose-900/30 rounded text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Form Panel */}
        {showForm && (
          <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl animate-in slide-in-from-left-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                {editingId ? <Edit2 size={16}/> : <Plus size={16}/>}
                {editingId ? 'עריכת פריט' : 'הוספת פריט'}
              </h3>
              <button onClick={resetForm}><X size={20} className="text-slate-500 hover:text-white"/></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">יצרן *</label>
                <input 
                  required
                  value={formData.manufacturer}
                  onChange={e => setFormData({...formData, manufacturer: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">דגם *</label>
                <input 
                  required
                  value={formData.model}
                  onChange={e => setFormData({...formData, model: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">תחום *</label>
                <select 
                  value={formData.domain}
                  onChange={e => setFormData({...formData, domain: e.target.value as any})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-purple-500 outline-none"
                >
                  {Object.entries(SAFETY_DOMAINS).map(([key, d]) => (
                    <option key={key} value={key}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">תדירות מומלצת (חודשים)</label>
                <input 
                  type="number"
                  value={formData.recommendedFrequency}
                  onChange={e => setFormData({...formData, recommendedFrequency: parseInt(e.target.value)})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2">
                  <Save size={16} /> שמור
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
