import { doc, getDoc, collection, getCountFromServer, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import { morningService } from './morningService';

export const billingEngine = {
  
  /**
   * חישוב סכום לחיוב על בסיס חריגות
   */
  calculateMonthlyCharge: async (tenantId: string) => {
    // 1. שליפת הגדרות המנוי
    const subSnap = await getDoc(doc(firestore, 'subscriptions', tenantId));
    if (!subSnap.exists()) return 0;
    
    const subData = subSnap.data();
    const basePrice = subData.planId === 'pro' ? 299 : subData.planId === 'enterprise' ? 999 : 99;
    
    // 2. בדיקת חריגת משתמשים (למשל 50 ש"ח לכל משתמש נוסף)
    const usersCount = (await getCountFromServer(query(collection(firestore, 'users'), where('tenantId', '==', tenantId)))).data().count;
    const extraUsers = Math.max(0, usersCount - subData.maxUsers);
    const extraCharge = extraUsers * 50;

    return basePrice + extraCharge;
  },

  /**
   * הרצת תהליך הגבייה החודשי
   */
  runBillingCycle: async (tenantId: string) => {
    try {
      const totalToCharge = await billingEngine.calculateMonthlyCharge(tenantId);
      console.log(`[Billing Engine] Charging tenant ${tenantId}: ${totalToCharge} ILS`);

      // 1. ביצוע סליקה (במציאות מול ה-Token של הספק)
      // 2. הפקת חשבונית ב-Morning
      const invoice = await morningService.generateInvoice(tenantId, totalToCharge, "Monthly Subscription + Overage");
      
      return { success: true, amount: totalToCharge, invoiceUrl: invoice.url };
    } catch (error) {
      // Dunning Logic: סימון הלקוח כבעל חוב בפיגור
      console.error("Billing cycle failed. Transitioning to Dunning process.");
      return { success: false, error: "Payment Failed" };
    }
  }
};
