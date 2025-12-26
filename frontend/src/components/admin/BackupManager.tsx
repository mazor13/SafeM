import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';

export default function BackupManager({ tenantId }: { tenantId: string }) {
  const [backups, setBackups] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchBackups = async () => {
    const q = query(collection(firestore, 'backups'), where('tenantId', '==', tenantId), orderBy('snapshotDate', 'desc'));
    const snap = await getDocs(q);
    setBackups(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { if (tenantId) fetchBackups(); }, [tenantId]);

  const handleRestore = async (backupId: string) => {
    if (!window.confirm("האם אתה בטוח שברצונך לשחזר את נתוני הלקוח לתאריך זה? הפעולה תדרוס נתונים קיימים.")) return;
    setIsProcessing(true);
    // סימולציה של קריאה ל-Cloud Function שמבצעת את השחזור הפיזי
    setTimeout(() => {
      alert("תהליך השחזור החל בשרת. הודעה תישלח בסיום.");
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-200 text-right" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">גיבויים ושחזור נתונים</h3>
        <button disabled={isProcessing} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">גבה עכשיו</button>
      </div>
      
      <div className="space-y-2">
        {backups.length === 0 ? (
          <p className="text-xs text-slate-400">לא נמצאו גיבויים זמינים ללקוח זה.</p>
        ) : (
          backups.map(b => (
            <div key={b.id} className="bg-white p-3 rounded-xl border flex justify-between items-center shadow-sm">
              <div className="text-xs">
                <span className="font-bold text-slate-700">{b.snapshotDate?.toDate().toLocaleDateString()}</span>
                <span className="text-slate-400 mr-2">({(b.sizeBytes / 1024).toFixed(2)} KB)</span>
              </div>
              <button 
                onClick={() => handleRestore(b.id)}
                className="text-[10px] font-bold text-indigo-600 hover:underline"
              >
                שחזר לנקודה זו &crarr;
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
