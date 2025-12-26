import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';

export const infraLogger = {
  logEvent: async (tenantId: string, provider: string, status: 'SUCCESS' | 'ERROR', details: any) => {
    const docRef = await addDoc(collection(firestore, 'infrastructure_logs'), {
      tenantId,
      provider,
      status,
      details,
      timestamp: serverTimestamp()
    });
    return docRef; // החזרת המסמך שנוצר כדי שנוכל להשתמש ב-ID שלו
  }
};
