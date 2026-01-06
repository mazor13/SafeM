import React, { useState, useEffect } from 'react';
import { 
  collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, 
  doc, serverTimestamp 
} from 'firebase/firestore';
import { firestore } from '../../firebase';
import { 
  Building2, Plus, Pencil, Trash2, MapPin, X, Check
} from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: any;
}

interface FacilitiesTabProps {
  clientId: string;
  clientName: string;
}

export default function FacilitiesTab({ clientId, clientName }: FacilitiesTabProps) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactPerson: '',
    contactPhone: ''
  });

  useEffect(() => {
    const q = query(collection(firestore, `clients/${clientId}/facilities`));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data() 
      })) as Facility[];
      setFacilities(data.sort((a, b) => a.name.localeCompare(b.name)));
      setIsLoading(false);
    });
    return () => unsub();
  }, [clientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update
        await updateDoc(doc(firestore, `clients/${clientId}/facilities/${editingId}`), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create
        await addDoc(collection(firestore, `clients/${clientId}/facilities`), {
          ...formData,
          isActive: true,
          createdAt: serverTimestamp()
        });
      }
      
      setFormData({ name: '', address: '', contactPerson: '', contactPhone: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Error saving facility:', err);
      alert('שגיאה בשמירת המתחם');
    }
  };

  const handleEdit = (facility: Facility) => {
    setFormData({
      name: facility.name,
      address: facility.address || '',
      contactPerson: facility.contactPerson || '',
      contactPhone: facility.contactPhone || ''
    });
    setEditingId(facility.id);
    setShowForm(true);
  };

  const handleDelete = async (facilityId: string, facilityName: string) => {
    if (!window.confirm(`למחוק את המתחם "${facilityName}"?`)) return;
    
    try {
      await deleteDoc(doc(firestore, `clients/${clientId}/facilities/${facilityId}`));
    } catch (err) {
      console.error('Error deleting facility:', err);
      alert('שגיאה במחיקת המתחם');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">מתחמים ואתרים</h3>
          <p className="text-sm text-slate-400">ניהול מתחמים של {clientName}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', address: '', contactPerson: '', contactPhone: '' }); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all"
        >
          <Plus size={16} /> הוסף מתחם
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="text-indigo-500" />
                {editingId ? 'עריכת מתחם' : 'מתחם חדש'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">שם המתחם *</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="לדוגמה: בניין A, מעבדות, משרדים ראשיים"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">כתובת</label>
                <input
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="רחוב, עיר"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">איש קשר</label>
                  <input
                    value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">טלפון</label>
                  <input
                    value={formData.contactPhone}
                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl mt-4 shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2"
              >
                <Check size={18} />
                {editingId ? 'עדכן מתחם' : 'צור מתחם'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Facilities List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">טוען...</div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-900/20 rounded-2xl border border-dashed border-white/5">
          <Building2 size={48} className="mx-auto mb-4 opacity-50" />
          <p>עדיין אין מתחמים מוגדרים</p>
          <p className="text-sm mt-2">לחץ על "הוסף מתחם" כדי להתחיל</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {facilities.map(facility => (
            <div
              key={facility.id}
              className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Building2 size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{facility.name}</h4>
                  {facility.address && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={12} /> {facility.address}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(facility)}
                  className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="ערוך"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(facility.id, facility.name)}
                  className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400 hover:text-rose-500 transition-colors"
                  title="מחק"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
