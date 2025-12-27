import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore, auth } from '../../firebase'; // הוספנו את auth
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, MoreHorizontal, 
  ArrowUpRight, Building2, AlertTriangle 
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended' | 'maintenance';
  logo?: string;
  plan: 'basic' | 'pro' | 'enterprise';
  usersCount: number;
  usersLimit: number;
  healthScore: number;
  lastActive: any;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUid, setCurrentUid] = useState<string>(''); // הבלש שלנו
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // שמירת ה-UID הנוכחי לבדיקה
      const user = auth.currentUser;
      setCurrentUid(user ? user.uid : 'לא מחובר');

      const clientsRef = collection(firestore, 'tenants');
      const q = query(clientsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      
      setClients(clientsData);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      // הצגת שגיאה מפורטת כולל ה-UID
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'suspended': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'maintenance': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  if (loading) return (
    <div className="p-10 text-center text-slate-500 flex flex-col items-center gap-4">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      <div>טוען נתונים...</div>
    </div>
  );

  if (error) return (
    <div className="p-10 flex justify-center">
      <div className="bg-rose-950/30 border border-rose-500/30 p-6 rounded-2xl max-w-2xl w-full text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">שגיאת הרשאות (Access Denied)</h2>
        <p className="text-rose-200 mb-6">המערכת חסמה את הגישה לנתונים.</p>
        
        <div className="bg-black/50 p-4 rounded-xl text-left font-mono text-sm space-y-2 mb-6">
           <p className="text-slate-400">Error: {error}</p>
           <div className="h-px bg-white/10 my-2"></div>
           <p className="text-indigo-300 font-bold">🕵️ פרטי זיהוי (Debug Info):</p>
           <p className="text-white">UID נוכחי: <span className="text-amber-400">{currentUid}</span></p>
           <p className="text-slate-400 text-xs mt-2">
             * וודא שזה ה-UID שמוגדר בחוקי האבטחה (Firestore Rules).<br/>
             * אם זה משתמש שונה, עשה Logout והתחבר עם המשתמש הראשי.
           </p>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded-xl font-bold transition-all"
        >
          נסה שוב
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">ניהול לקוחות</h1>
          <p className="text-slate-400 text-sm">צפייה וניהול של כל הלקוחות במערכת</p>
        </div>
        <button 
            onClick={() => navigate('/admin/create-client')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
            <Building2 size={18} />
            הקמת לקוח חדש
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
            <div className="text-slate-400 text-xs font-bold uppercase mb-2">סך הכל לקוחות</div>
            <div className="text-3xl font-black text-white">{clients.length}</div>
        </div>
        <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
            <div className="text-slate-400 text-xs font-bold uppercase mb-2">לקוחות פעילים</div>
            <div className="text-3xl font-black text-emerald-400">
                {clients.filter(c => c.status === 'active').length}
            </div>
        </div>
        <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
            <div className="text-slate-400 text-xs font-bold uppercase mb-2">סך משתמשים במערכת</div>
            <div className="text-3xl font-black text-indigo-400">
                {clients.reduce((acc, curr) => acc + (curr.usersCount || 0), 0)}
            </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex gap-3">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="חיפוש לפי שם, דומיין או מזהה..." 
                    className="w-full bg-slate-800 text-white pl-4 pr-10 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
            <button className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-colors">
                <Filter size={18} />
            </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold">
                    <tr>
                        <th className="px-6 py-4">שם הלקוח</th>
                        <th className="px-6 py-4">סטטוס</th>
                        <th className="px-6 py-4">חבילה</th>
                        <th className="px-6 py-4">משתמשים</th>
                        <th className="px-6 py-4">בריאות מערכת</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {clients.map((client) => (
                        <tr 
                            key={client.id} 
                            onClick={() => navigate(`/admin/clients/${client.id}`)}
                            className="hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-300">
                                        {client.logo ? <img src={client.logo} className="w-full h-full object-cover rounded-xl" /> : client.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{client.name}</div>
                                        <div className="text-xs text-slate-500">{client.domain}.safe-m.app</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(client.status)}`}>
                                    {client.status === 'active' ? 'פעיל' : client.status === 'suspended' ? 'מושהה' : 'תחזוקה'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-300 capitalize">{client.plan}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-indigo-500" 
                                            style={{ width: `${(client.usersCount / client.usersLimit) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">
                                        {client.usersCount}/{client.usersLimit}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${client.healthScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                    <span className="text-sm font-bold text-slate-300">{client.healthScore}%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" size={20} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
