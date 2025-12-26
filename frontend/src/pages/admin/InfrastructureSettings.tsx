import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

export default function InfrastructureSettings() {
  const { tenantId } = useParams();
  const [config, setConfig] = useState({
    customDomain: '',
    primaryColor: '#4f46e5',
    logoUrl: ''
  });

  const handleSave = async () => {
    if (!tenantId) return;
    const ref = doc(firestore, 'tenant_branding', tenantId);
    await updateDoc(ref, { ...config, updatedAt: new Date() });
    alert("הגדרות התשתית עודכנו!");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-sm border rounded-2xl text-right" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 italic text-slate-800 underline decoration-indigo-500">הגדרות White Label & Infrastructure</h2>
      
      <div className="grid grid-cols-2 gap-8">
        {/* ניהול דומיין */}
        <div className="space-y-4 border-l pl-8">
          <h3 className="font-bold text-slate-600">ניהול דומיין פרטי</h3>
          <input 
            placeholder="safety.client.co.il"
            className="w-full border p-2 rounded-lg text-left dir-ltr"
            value={config.customDomain}
            onChange={e => setConfig({...config, customDomain: e.target.value})}
          />
          <p className="text-[10px] text-slate-400">יש להפנות רשומת CNAME לכתובת: lb.aegis-safety.com</p>
        </div>

        {/* ניהול Enterprise PO */}
        <div className="space-y-4 border-l pl-8">
          <h3 className="font-bold text-slate-600">הגדרות Enterprise & PO</h3>
          <input placeholder="מספר הזמנת רכש (PO)" className="w-full border p-2 rounded-lg text-xs" />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="approval" />
            <label htmlFor="approval" className="text-xs text-slate-500">דרוש אישור ידני לפני הפקת דרישת תשלום</label>
          </div>
        </div>
        {/* ניהול מיתוג */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-600">מיתוג ויזואלי</h3>
          <div>
            <label className="text-xs block mb-1">צבע ראשי (Primary HEX)</label>
            <div className="flex gap-2">
              <input type="color" value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})} className="h-10 w-10 rounded cursor-pointer" />
              <input type="text" value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})} className="flex-1 border p-2 rounded-lg text-xs" />
            </div>
          </div>
          <div>
            <label className="text-xs block mb-1">לוגו מערכת (URL)</label>
            <input 
              placeholder="https://..."
              className="w-full border p-2 rounded-lg text-xs"
              value={config.logoUrl}
              onChange={e => setConfig({...config, logoUrl: e.target.value})}
            />
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="mt-8 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
        עדכן הגדרות תשתית ומיתוג
      </button>
    </div>
  );
}
