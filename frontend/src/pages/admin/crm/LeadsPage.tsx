import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowUpRight, Search } from 'lucide-react';
import { Lead } from '../../../types/crm';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const q = query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'));
        const sn = await getDocs(q);
        setLeads(sn.docs.map(d => ({ id: d.id, ...d.data() })) as Lead[]);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchLeads();
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">ניהול לידים</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center">
          <UserPlus size={18} /> ליד חדש
        </button>
      </div>
      <div className="bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full text-right text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
            <tr><th className="p-4">שם</th><th className="p-4">חברה</th><th className="p-4">סטטוס</th><th className="p-4"></th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="p-8 text-center">טוען...</td></tr> : leads.map(lead => (
              <tr key={lead.id} onClick={() => navigate(`/admin/crm/leads/${lead.id}`)} className="border-t border-slate-800 hover:bg-slate-800/50 cursor-pointer">
                <td className="p-4 font-bold text-white">{lead.firstName} {lead.lastName}</td>
                <td className="p-4">{lead.company}</td>
                <td className="p-4"><span className="bg-slate-800 px-2 py-1 rounded text-xs">{lead.status}</span></td>
                <td className="p-4"><ArrowUpRight size={18} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
