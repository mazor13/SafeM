import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore as db } from '../../firebase';
import { Client, User } from '../../types';
import { 
  KeyIcon, 
  NoSymbolIcon, 
  CheckCircleIcon,
  EyeIcon,
  PlusIcon,
  EnvelopeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Props {
  client: Client;
  onClose: () => void;
}

export default function ClientUsersManager({ client, onClose }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // מצב טופס הזמנה
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({ firstName: '', lastName: '', email: '', role: 'employee' });
  const [isInviting, setIsInviting] = useState(false);

  const maxUsers = client.contractDetails?.maxUsers || 0;
  const usedUsers = users.length;
  const utilizationPercent = maxUsers > 0 ? (usedUsers / maxUsers) * 100 : 0;

  useEffect(() => {
    fetchUsers();
  }, [client.id]);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), where('organizationId', '==', client.id));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);

    try {
      // 1. בדיקה שלא חורגים מהמכסה
      if (usedUsers >= maxUsers) {
        alert("לא ניתן להזמין משתמשים נוספים. הלקוח הגיע למכסת הרישיונות.");
        setIsInviting(false);
        return;
      }

      // 2. יצירת המשתמש בדאטה-בייס (במצב 'Pending' באופן תיאורטי, כאן ניצור אותו ישירות לצורך המערכת)
      // הערה: בפרודקשן אמיתי זה ישלח מייל דרך Cloud Function.
      await addDoc(collection(db, 'users'), {
        firstName: inviteData.firstName,
        lastName: inviteData.lastName,
        email: inviteData.email,
        role: inviteData.role,
        organizationId: client.id,
        createdAt: serverTimestamp(),
        // שדה עזר לדעת שהמשתמש הוזמן אך טרם נרשם בפועל ב-Auth
        status: 'invited' 
      });

      alert(`ההזמנה נשלחה בהצלחה ל-${inviteData.email}!\n(בגרסת הדמו המשתמש נוצר בבסיס הנתונים)`);
      
      setInviteData({ firstName: '', lastName: '', email: '', role: 'employee' });
      setShowInviteForm(false);
      fetchUsers(); // רענון הטבלה

    } catch (error) {
      console.error("Error inviting user:", error);
      alert("שגיאה בשליחת ההזמנה");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          
          {/* Header */}
          <div className="bg-indigo-600 px-4 py-4 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-white">
                ניהול משתמשים: {client.name}
              </h3>
              <p className="text-indigo-100 text-sm">צפייה וניהול הרשאות עובדי הלקוח</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          <div className="bg-gray-50 px-4 py-5 sm:p-6 min-h-[400px]">
            
            {/* Utilization Bar */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">ניצול רישיונות (Seats)</span>
                <span className={`text-sm font-bold ${usedUsers > maxUsers ? 'text-red-600' : 'text-gray-900'}`}>
                  {usedUsers} / {maxUsers} משתמשים
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${usedUsers > maxUsers ? 'bg-red-600' : 'bg-indigo-600'}`} 
                  style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Invite Form (Collapsible) */}
            {showInviteForm ? (
              <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-bold text-indigo-900 flex items-center">
                    <EnvelopeIcon className="h-5 w-5 ml-2"/> שליחת הזמנה לעובד חדש
                  </h4>
                  <button onClick={() => setShowInviteForm(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-5 w-5"/></button>
                </div>
                <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="שם פרטי" value={inviteData.firstName} onChange={e => setInviteData({...inviteData, firstName: e.target.value})} className="border p-2 rounded" />
                  <input required placeholder="שם משפחה" value={inviteData.lastName} onChange={e => setInviteData({...inviteData, lastName: e.target.value})} className="border p-2 rounded" />
                  <input required type="email" placeholder="כתובת אימייל" value={inviteData.email} onChange={e => setInviteData({...inviteData, email: e.target.value})} className="border p-2 rounded" />
                  <select value={inviteData.role} onChange={e => setInviteData({...inviteData, role: e.target.value})} className="border p-2 rounded bg-white">
                    <option value="employee">עובד רגיל (Employee)</option>
                    <option value="safety_manager">ממונה בטיחות (Safety Manager)</option>
                    <option value="org_admin">מנהל ארגון (Org Admin)</option>
                  </select>
                  <div className="md:col-span-2 flex justify-end mt-2">
                     <button type="submit" disabled={isInviting} className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 font-medium">
                       {isInviting ? 'שולח...' : 'שלח הזמנה'}
                     </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Action Bar */
              <div className="flex justify-between mb-4">
                <div className="relative rounded-md shadow-sm w-64">
                  <input type="text" placeholder="חפש עובד..." className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>
                <button 
                  onClick={() => setShowInviteForm(true)}
                  disabled={usedUsers >= maxUsers}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                    ${usedUsers >= maxUsers ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" /> הזמן עובד חדש
                </button>
              </div>
            )}

            {/* Users Table */}
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">משתמש</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תפקיד</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                          <th className="px-6 py-3"><span className="sr-only">פעולות</span></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                          <tr><td colSpan={4} className="p-4 text-center">טוען נתונים...</td></tr>
                        ) : users.length === 0 ? (
                          <tr><td colSpan={4} className="p-4 text-center text-gray-500">עדיין אין משתמשים. לחץ על "הזמן עובד חדש" כדי להתחיל.</td></tr>
                        ) : (
                          users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <span className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200 shadow-sm">
                                      {u.firstName?.[0] || 'U'}
                                    </span>
                                  </div>
                                  <div className="mr-4">
                                    <div className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</div>
                                    <div className="text-sm text-gray-500">{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${u.role === 'org_admin' ? 'bg-purple-100 text-purple-800' : 
                                    u.role === 'safety_manager' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {u.role === 'org_admin' ? 'Admin' : 
                                   u.role === 'safety_manager' ? 'Safety Mgr' : 'Employee'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {(u as any).status === 'invited' ? (
                                   <span className="flex items-center text-orange-500 font-medium"><EnvelopeIcon className="h-4 w-4 ml-1"/> הוזמן</span>
                                ) : (
                                   <span className="flex items-center text-green-600 font-medium"><CheckCircleIcon className="h-4 w-4 ml-1"/> פעיל</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                <div className="flex justify-end space-x-2 space-x-reverse opacity-50 hover:opacity-100 transition-opacity">
                                  <button className="text-indigo-600 bg-indigo-50 p-1.5 rounded hover:bg-indigo-100" title="התחזות"><EyeIcon className="h-5 w-5" /></button>
                                  <button className="text-red-400 p-1.5 rounded hover:bg-red-50 hover:text-red-600" title="חסום"><NoSymbolIcon className="h-5 w-5" /></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
            <button type="button" onClick={onClose} className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:ml-3 sm:w-auto sm:text-sm">
              סגור
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
