import React from 'react';
import { useClients } from '../../hooks/useClients';
import ClientsTable from '../../components/admin/ClientsTable';
import { Users, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Clients() {
  const { data, loading } = useClients();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 font-sans" dir="rtl">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 animate-fadeIn">
        <div>
           <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <Users className="text-indigo-500" /> ניהול לקוחות
           </h1>
           <p className="text-slate-400 mt-1 text-sm">ניהול דיירים (Tenants), רישיונות וגישה למערכת</p>
        </div>
        
        <Link to="/admin/create-client" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all hover:scale-105">
           <Plus size={18} /> לקוח חדש
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="animate-slideUp">
        {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-slate-500">
                <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
                <p>טוען נתונים מהשרת...</p>
            </div>
        ) : data.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-slate-700 rounded-3xl p-16 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users size={32} className="text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">אין לקוחות במערכת</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                    המערכת מוכנה לפעולה, אבל מסד הנתונים ריק. צור את הלקוח הראשון כדי להתחיל לראות נתונים.
                </p>
                <Link to="/admin/create-client" className="text-indigo-400 hover:text-indigo-300 font-bold underline">
                    + צור לקוח ראשון עכשיו
                </Link>
            </div>
        ) : (
            <ClientsTable data={data} />
        )}
      </div>

    </div>
  );
}
