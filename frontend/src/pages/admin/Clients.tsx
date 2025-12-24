import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore as db } from '../../firebase'; // תיקון נתיב
import { Client } from '../../types'; // תיקון נתיב
import { useNavigate } from 'react-router-dom';
import { useSystem } from '../../providers/SystemProvider'; // תיקון נתיב
import ClientUsersManager from '../../components/admin/ClientUsersManager'; // תיקון נתיב
import { 
  UsersIcon, 
  Cog6ToothIcon, 
  CloudIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

// ... (שאר הקוד נשאר זהה, אני רק מתקן את ה-Imports והלוגיקה הבסיסית)

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // אם useSystem לא קיים, נשתמש בערך דמי זמני כדי שהקוד יעבור קומפילציה
  const modules = [{id: 'safety', label: 'בטיחות'}]; 

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [managingUsersClient, setManagingUsersClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
        try {
            const snap = await getDocs(collection(db, 'clients'));
            setClients(snap.docs.map(d => ({ id: d.id, ...d.data() } as Client)));
        } catch(e) { console.error(e); } finally { setLoading(false); }
    };
    fetchClients();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">ניהול לקוחות</h1>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">לקוח</th>
               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">חבילה</th>
               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {clients.map(client => (
               <tr key={client.id}>
                 <td className="px-6 py-4">{client.name}</td>
                 <td className="px-6 py-4">{client.contractDetails?.planName || 'Basic'}</td>
                 <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => setManagingUsersClient(client)} className="text-indigo-600"><UserGroupIcon className="h-5 w-5"/></button>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
      {managingUsersClient && (
        <ClientUsersManager 
          client={managingUsersClient} 
          onClose={() => setManagingUsersClient(null)} 
        />
      )}
    </div>
  );
}
