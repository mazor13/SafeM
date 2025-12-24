import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Inspections() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // התיקון כאן: בדיקה שיש user ושימוש ב-user.id במקום user.uid
    if (!user || !user.id) return;
    
    const q = query(collection(firestore, 'inspections'), where('inspectorId', '==', user.id));
    getDocs(q).then(snap => {
        setList(snap.docs.map(d => ({id: d.id, ...d.data()})));
    });
  }, [user]);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-gray-900">כל הבדיקות שלי</h1>
         <button 
           onClick={() => navigate('/client/new-inspection')} 
           className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm transition-colors"
         >
           + בדיקה חדשה
         </button>
       </div>
       
       <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {list.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              לא נמצאו בדיקות. התחל בדיקה חדשה!
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">כותרת</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך</th>
                      <th className="px-6 py-3"></th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                  {list.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate(`/client/inspections/${item.id}`)}>
                          <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {item.status || 'טיוטה'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-left text-sm font-medium text-indigo-600">
                            פתח &larr;
                          </td>
                      </tr>
                  ))}
               </tbody>
            </table>
          )}
       </div>
    </div>
  );
}
