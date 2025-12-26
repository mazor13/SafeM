import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';

export default function RuleBuilder() {
  const [rule, setRule] = useState({
    triggerEvent: 'REPORT_FAILED',
    actionType: 'SEND_EMAIL',
    isActive: true
  });

  const saveRule = async () => {
    await addDoc(collection(firestore, 'business_rules'), {
      ...rule,
      createdAt: serverTimestamp()
    });
    alert("החוק נשמר ויופעל באירוע הבא!");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-sm border rounded-2xl text-right" dir="rtl">
      <h2 className="text-xl font-bold mb-6 text-slate-800">מנוע חוקים ואוטומציה (IFTTT)</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">כאשר קורה האירוע (Trigger):</label>
          <select 
            className="w-full border p-3 rounded-xl bg-slate-50 font-medium"
            onChange={(e) => setRule({...rule, triggerEvent: e.target.value})}
          >
            <option value="REPORT_FAILED">נכשל פריט בבדיקה (Fail)</option>
            <option value="INACTIVITY">לקוח לא פעיל 14 יום</option>
            <option value="QUOTA_REACHED">ניצול 90% מהמכסה</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">בצע את הפעולה (Action):</label>
          <select 
            className="w-full border p-3 rounded-xl bg-slate-50 font-medium"
            onChange={(e) => setRule({...rule, actionType: e.target.value})}
          >
            <option value="SEND_EMAIL">שלח מייל התראה</option>
            <option value="SEND_SMS">שלח הודעת SMS למנהל</option>
            <option value="WEBHOOK">שלח Webhook למערכת חיצונית</option>
          </select>
        </div>

        <button onClick={saveRule} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          הפעל חוק אוטומציה
        </button>
      </div>
    </div>
  );
}
