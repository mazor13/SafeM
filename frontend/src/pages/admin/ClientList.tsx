import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Plus } from 'lucide-react';

export default function ClientList() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const sn = await getDocs(collection(firestore, 'clients'));
        setClients(sn.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Building2 className="text-indigo-400" /> תיקי לקוחות
        </h1>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all">
          <Plus size={18} /> לקוח חדש
        </button>
      </div>
      
      {loading ? (
        <div className="text-slate-500">טוען נתונים...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(client => (
            <div 
              key={client.id}
              onClick={() => navigate(`/admin/clients/${client.id}`)}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500 cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{client.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-700">
                      {client.domain || 'No Domain'}
                    </span>
                    <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-900/50">
                      Active
                    </span>
                  </div>
                </div>
                <ArrowRight className="text-slate-600 group-hover:text-indigo-400 transition-colors transform group-hover:-translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
