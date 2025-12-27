import React, { useState, useEffect } from 'react';
import { 
  collection, query, where, onSnapshot, getDocs,
  doc, writeBatch, serverTimestamp, increment 
} from 'firebase/firestore';
import { firestore } from '../../firebase';
import { 
  UserPlus, Mail, Shield, 
  CheckCircle2, XCircle, Search, Trash2, RotateCcw
} from 'lucide-react';

interface UsersTabProps {
  clientId: string;
  clientName: string;
  limit: number;
  currentCount: number;
}

export default function UsersTab({ clientId, clientName, limit, currentCount }: UsersTabProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [newUser, setNewUser] = useState({ 
    email: '', 
    fullName: '', 
    role: 'inspector' 
  });

  // Listener
  useEffect(() => {
    const q = query(collection(firestore, 'users'), where('tenantId', '==', clientId));
    const unsub = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [clientId]);

  // Search Filter
  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Invite Logic
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCount >= limit) {
      alert("הלקוח הגיע למכסת המשתמשים בחבילה!");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Check for duplicates in this tenant
      const duplicateQuery = query(
        collection(firestore, 'users'), 
        where('tenantId', '==', clientId),
        where('email', '==', newUser.email)
      );
      const duplicateSnapshot = await getDocs(duplicateQuery);
      
      if (!duplicateSnapshot.empty) {
        alert("שגיאה: משתמש עם כתובת אימייל זו כבר קיים אצל הלקוח.");
        setIsLoading(false);
        return;
      }

      // 2. Batch Write
      const batch = writeBatch(firestore);
      
      const userRef = doc(collection(firestore, 'users'));
      batch.set(userRef, {
        tenantId: clientId,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        status: 'pending', 
        createdAt: serverTimestamp()
      });

      const tenantRef = doc(firestore, 'tenants', clientId);
      batch.update(tenantRef, {
        usersCount: increment(1),
        lastUpdated: serverTimestamp()
      });

      const auditRef = doc(collection(firestore, 'audit_logs'));
      batch.set(auditRef, {
        action: 'INVITE_USER',
        targetId: userRef.id,
        targetName: newUser.fullName,
        performedBy: 'Admin Console',
        details: { role: newUser.role, email: newUser.email },
        timestamp: serverTimestamp()
      });

      await batch.commit();
      
      setShowInviteModal(false);
      setNewUser({ email: '', fullName: '', role: 'inspector' });
      alert("הזמנה נשלחה בהצלחה!"); 
    } catch (err) {
      console.error(err);
      alert("שגיאה ביצירת משתמש");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"/>
             <input 
               type="text" 
               placeholder="חיפוש עובד..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-slate-800 text-sm py-2 pr-10 pl-4 rounded-xl border border-white/10 w-64 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:w-72" 
             />
           </div>
        </div>
        
        <button 
          onClick={() => setShowInviteModal(true)}
          disabled={currentCount >= limit}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            currentCount >= limit 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
          }`}
        >
          <UserPlus size={16} />
          {currentCount >= limit ? 'מכסה מלאה' : 'הזמן משתמש'}
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-900/20 rounded-2xl border border-dashed border-white/5">
            <p>{searchTerm ? 'לא נמצאו תוצאות לחיפוש זה' : 'עדיין אין משתמשים ללקוח זה.'}</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-lg">
                  {user.fullName?.[0] || '?'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{user.fullName}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail size={12} /> {user.email}
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <Shield size={12} /> {user.role === 'org_admin' ? 'מנהל ראשי' : user.role === 'manager' ? 'מנהל עבודה' : 'מפקח'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                   user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                   user.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                   'bg-rose-500/10 text-rose-400 border-rose-500/20'
                 }`}>
                   {user.status === 'active' ? 'פעיל' : user.status === 'pending' ? 'הוזמן' : 'חסום'}
                 </span>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="איפוס סיסמה" className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><RotateCcw size={16}/></button>
                    <button title="מחיקה" className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400"><Trash2 size={16}/></button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><UserPlus className="text-indigo-500"/> הזמנת עובד</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-500 hover:text-white"><XCircle /></button>
            </div>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">שם מלא</label>
                <input 
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="לדוגמה: ישראל ישראלי"
                  value={newUser.fullName}
                  onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">כתובת אימייל</label>
                <input 
                  required
                  type="email"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="employee@company.com"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">תפקיד במערכת</label>
                <div className="grid grid-cols-3 gap-2">
                  {['org_admin', 'manager', 'inspector'].map(role => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => setNewUser({...newUser, role})}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        newUser.role === role 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {role === 'org_admin' ? 'מנהל ראשי' : role === 'manager' ? 'מנהל עבודה' : 'מפקח'}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl mt-4 shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2"
              >
                {isLoading ? 'שולח...' : 'שלח הזמנה וצור משתמש'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
