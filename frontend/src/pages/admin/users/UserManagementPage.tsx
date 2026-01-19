import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore as db } from '../../../firebase';
import { Users, ShieldCheck, UserCog, FileSpreadsheet, Search, Filter, History, X, Clock, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    const isApproved = u.legalConsent?.accepted;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && isApproved) || 
                         (statusFilter === 'pending' && !isApproved);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-8 bg-[#0E1A35] min-h-screen text-white font-sans" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">בקרה וניהול הצהרות משתמש</h1>
          <div className="flex items-center gap-2 text-[#00D8FF]">
            <History size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Digital Signature Audit Trail</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1C2435] border border-[#00D8FF]/30 rounded-xl text-[#00D8FF] font-bold hover:bg-[#00D8FF]/20 transition-all shadow-lg shadow-[#00D8FF]/5">
          <FileSpreadsheet size={20} /> ייצוא דוח ביקורת
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-[#1C2435] p-4 rounded-2xl border border-white/5">
        <div className="md:col-span-2 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7C93]" size={20} />
          <input 
            type="text"
            placeholder="חיפוש לפי שם או אימייל..."
            className="w-full bg-[#0E1A35] border border-white/10 rounded-xl py-3 pr-12 pl-4 text-sm focus:border-[#00D8FF] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            className="w-full bg-[#0E1A35] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-[#00D8FF] outline-none appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">כל הסטטוסים</option>
            <option value="approved">מאושרים</option>
            <option value="pending">ממתינים</option>
          </select>
        </div>
        <div className="text-left text-xs font-bold text-[#6B7C93] px-2 uppercase tracking-widest">
          {filteredUsers.length} רשומות במערכת
        </div>
      </div>

      {/* Stats Table Section */}
      <div className="bg-[#1C2435] rounded-[2.5rem] border border-[#00D8FF]/20 overflow-hidden shadow-2xl relative">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#0E1A35]/50 border-b border-[#00D8FF]/10 text-[#A9B3C1] text-xs font-black uppercase tracking-widest">
              <th className="p-6">פרטי משתמש</th>
              <th className="p-6">תפקיד</th>
              <th className="p-6 text-center">סטטוס ציות</th>
              <th className="p-6 text-center">גרסה מאושרת</th>
              <th className="p-6">תאריך חתימה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((u) => (
              <tr 
                key={u.id} 
                onClick={() => setSelectedUser(u)}
                className="hover:bg-[#00D8FF]/5 transition-colors group cursor-pointer"
              >
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-lg group-hover:text-[#00D8FF] transition-colors">{u.firstName} {u.lastName}</span>
                    <span className="text-[#6B7C93] text-sm font-mono">{u.email}</span>
                  </div>
                </td>
                <td className="p-6 uppercase text-xs font-black text-[#A9B3C1]">{u.role}</td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${u.legalConsent?.accepted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {u.legalConsent?.accepted ? 'APPROVED' : 'PENDING'}
                  </span>
                </td>
                <td className="p-6 text-center">
                  <span className="bg-[#0E1A35] border border-white/5 px-3 py-1 rounded text-xs font-mono text-[#00D8FF]">
                    {u.legalConsent?.version || 'N/A'}
                  </span>
                </td>
                <td className="p-6 text-[#A9B3C1] text-sm font-mono italic">
                  {u.legalConsent?.acceptedAt ? new Date(u.legalConsent.acceptedAt.seconds * 1000).toLocaleString('he-IL') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Audit History */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-[#0E1A35]/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#1C2435] border-l border-[#00D8FF]/30 shadow-2xl z-[101] p-10 flex flex-col"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-black text-white leading-tight">היסטוריית הצהרות</h2>
                  <p className="text-[#00D8FF] font-mono text-xs uppercase mt-2 tracking-widest">{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all"><X className="text-[#6B7C93]" /></button>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto pr-2">
                {selectedUser.legalConsent ? (
                  <div className="relative pr-8 border-r-2 border-[#00D8FF]/20 space-y-10">
                    {/* ציר זמן - חתימה נוכחית */}
                    <div className="relative">
                      <div className="absolute -right-[37px] top-1 w-4 h-4 rounded-full bg-[#00D8FF] shadow-[0_0_10px_rgba(0,216,255,0.8)]" />
                      <div className="bg-[#0E1A35] p-6 rounded-2xl border border-[#00D8FF]/20">
                        <div className="flex justify-between items-start mb-4">
                          <span className="bg-[#00D8FF]/10 text-[#00D8FF] px-3 py-1 rounded text-xs font-black uppercase">v{selectedUser.legalConsent.version}</span>
                          <div className="flex items-center gap-1 text-[#6B7C93] text-[10px] font-mono"><Clock size={12}/> {new Date(selectedUser.legalConsent.acceptedAt.seconds * 1000).toLocaleString('he-IL')}</div>
                        </div>
                        <h4 className="text-white font-bold mb-2">אישור תנאים, פרטיות וקוקיז</h4>
                        <p className="text-[#A9B3C1] text-xs leading-relaxed italic">"המשתמש הצהיר כי קרא והבין את כלל התנאים המפורטים במסמכי המערכת AEGIS Intelligence."</p>
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-[#6B7C93] font-mono">
                           <Fingerprint size={12} className="text-[#00D8FF]"/> ID: {selectedUser.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-[#6B7C93]">לא נמצאה היסטוריית חתימות למשתמש זה</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-[#1C2435] p-6 rounded-[2rem] border border-[#00D8FF]/10 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className={`p-3 rounded-xl bg-[#0E1A35] ${color}`}><Icon size={24} /></div>
        <span className="text-[10px] font-black text-[#6B7C93] uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-4xl font-black">{value}</div>
    </div>
  );
}
