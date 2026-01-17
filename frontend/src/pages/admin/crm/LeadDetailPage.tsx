import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { ArrowRight, Mail, Phone, Building2 } from 'lucide-react';
import { Lead } from '../../../types/crm';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(firestore, 'leads', id)).then(sn => {
      if (sn.exists()) setLead({ id: sn.id, ...sn.data() } as Lead);
    });
  }, [id]);

  if (!lead) return <div className="p-10 text-white">טוען...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto text-white" dir="rtl">
      <button onClick={() => navigate('/admin/crm/leads')} className="flex items-center gap-2 text-slate-400 mb-6">
        <ArrowRight size={16} /> חזרה ללידים
      </button>
      <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">{lead.firstName} {lead.lastName}</h1>
        <p className="text-slate-400 mb-6">{lead.title} @ {lead.company}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-3 items-center bg-slate-800 p-4 rounded-xl"><Mail size={18} /> {lead.email}</div>
          <div className="flex gap-3 items-center bg-slate-800 p-4 rounded-xl"><Phone size={18} /> {lead.phone}</div>
        </div>
      </div>
    </div>
  );
}
