import React, { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Client } from '../../types';

export default function NewInspection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
        // בגרסה האמיתית, נסנן רק לקוחות שהמשתמש משויך אליהם
        const q = query(collection(firestore, 'clients'));
        const snap = await getDocs(q);
        setClients(snap.docs.map(d => ({id: d.id, ...d.data()} as Client)));
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
        alert('שגיאה: משתמש לא מזוהה');
        return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'inspections'), {
        title,
        clientId: selectedClient,
        inspectorId: user.id, // התיקון כאן: user.id במקום user.uid
        status: 'draft',
        createdAt: new Date(),
        items: []
      });
      navigate('/client/inspections');
    } catch (error) {
      console.error(error);
      alert('שגיאה ביצירת בדיקה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200 mt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">יצירת בדיקה חדשה</h1>
      <p className="text-gray-500 mb-8">מלא את פרטי הבדיקה כדי להתחיל.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">כותרת הבדיקה / שם האתר</label>
            <input 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="למשל: בדיקת בטיחות חודשית - מפעל צפון"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">בחר לקוח / ארגון</label>
            <select 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white" 
              value={selectedClient} 
              onChange={e => setSelectedClient(e.target.value)} 
              required
            >
                <option value="">בחר מרשימה...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>

        <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-gray-400"
            >
                {loading ? 'יוצר בדיקה...' : 'התחל בדיקה'}
            </button>
        </div>
      </form>
    </div>
  );
}
