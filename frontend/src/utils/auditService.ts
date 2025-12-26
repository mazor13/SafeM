import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';

export const auditService = {
  /**
   * רישום פעולה ביומן הביקורת
   */
  logAction: async (params: {
    tenantId?: string;
    actorId: string;
    action: string;
    details: any;
    severity: 'info' | 'warning' | 'critical';
  }) => {
    try {
      await addDoc(collection(firestore, 'admin_audit_logs'), {
        ...params,
        timestamp: serverTimestamp(),
        // במציאות נוסיף כאן גם IP ו-UserAgent דרך ה-Cloud Functions
      });
      console.log(`[Audit] Action logged: ${params.action}`);
    } catch (error) {
      console.error("Failed to write audit log:", error);
    }
  }
};
