import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { Users, Search, Mail, Phone, Building2, Plus, X } from 'lucide-react';
import { Contact } from '../../../types/crm';

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${className}`}>{children}</div>
);

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', role: '', tenantName: '' });

  const fetchContacts = async () => {
    try {
      const q = query(collection(firestore, 'contacts'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      setContacts(sn.docs.map(d => ({ id: d.id, ...d.data() })) as Contact[]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'contacts'), {
        ...formData,
        tenantId: 'temp-id', // בעתיד יחובר ל-Tenant אמיתי
        isPrimary: false,
        createdAt: Timestamp.now()
      });
      setIsModalOpen(false);
      fetchContacts();
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: '', tenantName: '' });
    } catch (e) { console.error(e); }
  };

  const filtered = contacts.filter(c => 
    c.firstName.includes(search) || c.lastName.includes(search) || c.email.includes(search)
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">אנשי קשר</h1>
          <p className="text-slate-400 text-sm">ניהול אנשי קשר בכל הארגונים</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex gap-2 items-center">
          <Plus size={18} /> איש קשר חדש
        </button>
      </div>

      <GlassCard className="p-4 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-2.5 text-slate-500" size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חיפוש..." className="w-full bg-slate-800 text-white px-10 py-2 rounded-xl border border-white/10" />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="text-white p-4">טוען...</div> : filtered.map(c => (
          <GlassCard key={c.id} className="p-5 hover:border-indigo-500/30 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-white">
                  {c.firstName[0]}{c.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-white">{c.firstName} {c.lastName}</h3>
                  <p className="text-xs text-slate-400">{c.role} @ {c.tenantName}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300"><Mail size={14}/> {c.email}</div>
              <div className="flex items-center gap-2 text-slate-300"><Phone size={14}/> {c.phone}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-white">איש קשר חדש</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400"/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required placeholder="שם פרטי" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input required placeholder="שם משפחה" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input required placeholder="אימייל" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input placeholder="טלפון" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input placeholder="תפקיד" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input placeholder="חברה (שם הלקוח)" value={formData.tenantName} onChange={e => setFormData({...formData, tenantName: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">שמור</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
