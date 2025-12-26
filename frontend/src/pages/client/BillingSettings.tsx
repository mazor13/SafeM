import React, { useState } from 'react';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

export default function BillingSettings({ tenantId }: { tenantId: string }) {
  const [loading, setLoading] = useState(false);
  const [cardAdded, setCardAdded] = useState(false);

  // סימולציה של Tokenization (במציאות כאן תהיה קריאה ל-Iframe של Cardcom/Grow)
  const handleAddPaymentMethod = async () => {
    setLoading(true);
    try {
      // 1. קבלת Token דמיוני מספק הסליקה
      const mockToken = "tok_visa_4242_example_" + Math.random().toString(36).substring(7);
      
      // 2. שמירת ה-Token ב-Billing Profile של הלקוח ב-Firestore
      const billingRef = doc(firestore, 'billing_profiles', tenantId);
      await updateDoc(billingRef, {
        paymentMethodToken: mockToken,
        updatedAt: new Date(),
        status: 'active'
      });

      setCardAdded(true);
      alert("אמצעי תשלום עודכן בהצלחה!");
    } catch (error) {
      console.error("Billing Error:", error);
      alert("שגיאה בעדכון אמצעי התשלום");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-right" dir="rtl">
      <h2 className="text-xl font-bold mb-4">הגדרות תשלום וגבייה</h2>
      <p className="text-sm text-gray-500 mb-6">ניהול אמצעי תשלום וצפייה בחשבוניות עבר</p>
      
      {!cardAdded ? (
        <button 
          onClick={handleAddPaymentMethod}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          {loading ? 'מתחבר לספק סליקה...' : 'הוסף כרטיס אשראי לחיוב אוטומטי'}
        </button>
      ) : (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex justify-between items-center">
          <span className="font-bold font-sans">**** **** **** 4242</span>
          <span className="text-xs font-bold uppercase">כרטיס פעיל</span>
        </div>
      )}
    </div>
  );
}
