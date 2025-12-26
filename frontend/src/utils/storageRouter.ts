import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

/**
 * שירות ניתוב קבצים ליעדי אחסון שונים
 */
export const storageRouter = {
  
  /**
   * מקבל הגדרות אחסון עבור לקוח ספציפי
   */
  getTenantStorageConfig: async (tenantId: string) => {
    const docRef = doc(firestore, 'storage_configs', tenantId);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : { provider: 'internal' };
  },

  /**
   * לוגיקת ניתוב העלאה
   */
  uploadFile: async (tenantId: string, file: File, path: string) => {
    const config = await storageRouter.getTenantStorageConfig(tenantId);
    
    if (config.provider === 'internal') {
      console.log(`[Storage Router] Uploading ${file.name} to AEGIS Internal S3`);
      // כאן תבוא לוגיקת Firebase Storage רגילה
      return { url: "internal_url", provider: 'internal' };
    } else {
      console.log(`[Storage Router] Routing ${file.name} to Client's ${config.provider} (${config.bucketName})`);
      // כאן תבוצע קריאה ל-Cloud Function שמעלה לענן הלקוח בצורה מאובטחת
      return { url: "external_client_url", provider: config.provider };
    }
  }
};
