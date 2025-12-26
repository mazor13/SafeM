import { doc, getDoc, collection, getCountFromServer, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';

export interface QuotaStatus {
  allowed: boolean;
  current: number;
  limit: number;
  usagePercent: number;
}

/**
 * בודק האם הלקוח יכול להוסיף משתמש חדש
 */
export const checkUserQuota = async (tenantId: string): Promise<QuotaStatus> => {
  // 1. שליפת המכסה מהמנוי
  const subRef = doc(firestore, 'subscriptions', tenantId);
  const subSnap = await getDoc(subRef);
  
  if (!subSnap.exists()) {
    throw new Error("Subscription not found");
  }
  
  const limit = subSnap.data().maxUsers || 0;

  // 2. ספירת המשתמשים הקיימים ב-DB עבור אותו Tenant
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('tenantId', '==', tenantId));
  const snapshot = await getCountFromServer(q);
  const current = snapshot.data().count;

  const usagePercent = (current / limit) * 100;

  // התראת Admin (בלוגים) אם עברנו את ה-90%
  if (usagePercent >= 90) {
    console.warn(`UPSELL ALERT: Tenant ${tenantId} reached ${usagePercent}% of user quota`);
  }

  return {
    allowed: current < limit,
    current,
    limit,
    usagePercent
  };
};
