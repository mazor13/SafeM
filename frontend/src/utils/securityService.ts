import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

export const securityService = {
  /**
   * בודק האם ה-IP מורשה לגישת Admin (סימולציה)
   */
  validateAdminIP: async (adminId: string) => {
    console.log(`[Security] Validating IP for admin: ${adminId}`);
    // במציאות הקריאה תתבצע ל-Cloud Function שמזהה את ה-IP האמיתי
    return true; 
  },

  /**
   * יצירת Session להתחזות (Impersonation)
   */
  startImpersonation: (tenantId: string) => {
    localStorage.setItem('impersonated_tenant_id', tenantId);
    localStorage.setItem('is_impersonating', 'true');
    window.location.href = `/client/${tenantId}/dashboard`;
  },

  stopImpersonation: () => {
    localStorage.removeItem('impersonated_tenant_id');
    localStorage.removeItem('is_impersonating');
    window.location.href = '/admin/clients';
  }
};
