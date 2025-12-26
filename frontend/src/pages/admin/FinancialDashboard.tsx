import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { firestore } from '../../firebase';

export default function FinancialDashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);

  const fetchFinancials = async () => {
    // שליפת כל הלקוחות שיש להם הגדרות Enterprise
    const q = query(collection(firestore, 'tenants'), where('plan', '==', 'enterprise'));
    const snap = await getDocs(q);
    setAccounts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchFinancials(); }, []);

  return (
    <div className="p-8 text-right" dir="rtl">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">💰 מעקב תקציב וגביית Enterprise</h1>
        <p className="text-slate-500 text-sm">ניהול הזמנות רכש (PO) ואישור דרישות תשלום</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4">לקוח</th>
                <th className="p-4">מספר PO</th>
                <th className="p-4">תקציב כולל</th>
                <th className="p-4">ניצול (Usage)</th>
                <th className="p-4">יתרה</th>
                <th className="p-4">סטטוס גבייה</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold">{acc.name}</td>
                  <td className="p-4 text-indigo-600 font-mono">{acc.enterpriseConfig?.poNumber || 'לא הוזן'}</td>
                  <td className="p-4">₪{acc.enterpriseConfig?.poTotalBudget?.toLocaleString() || '0'}</td>
                  <td className="p-4 text-amber-600">₪{acc.enterpriseConfig?.poUsedBudget?.toLocaleString() || '0'}</td>
                  <td className="p-4 font-bold text-emerald-600">
                    ₪{(acc.enterpriseConfig?.poTotalBudget - acc.enterpriseConfig?.poUsedBudget).toLocaleString() || '0'}
                  </td>
                  <td className="p-4">
                    <button className="bg-slate-800 text-white px-3 py-1 rounded-lg text-xs hover:bg-slate-700">
                      אישור דרישת תשלום
                    </button>
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
