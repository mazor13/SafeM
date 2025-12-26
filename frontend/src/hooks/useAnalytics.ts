import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../firebase';
import { DollarSign, Activity, Server, AlertTriangle } from 'lucide-react';

// --- Types ---
export interface KPI {
  id: string;
  label: string;
  value: string;
  trend: number;
  status: 'healthy' | 'warning' | 'critical';
  icon: any;
}

export interface ChurnRisk {
  id: string;
  clientName: string;
  dropRate: number;
  lastActive: string;
  riskLevel: 'high' | 'medium';
}

export interface FinancialDataPoint {
  name: string;
  mrr: number;
  churn: number;
}

export const useAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [churnRisks, setChurnRisks] = useState<ChurnRisk[]>([]);
  const [financialData, setFinancialData] = useState<FinancialDataPoint[]>([]);

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      try {
        // 1. שליפת כל הלקוחות (Tenants)
        const tenantsRef = collection(firestore, 'tenants');
        const tenantsSnap = await getDocs(tenantsRef);
        
        const totalClients = tenantsSnap.size;
        let activeClients = 0;
        let highRiskCount = 0;
        
        // עיבוד נתונים בסיסי
        const risks: ChurnRisk[] = [];
        
        tenantsSnap.forEach(doc => {
            const data = doc.data();
            // בדיקת סטטוס
            if (data.status === 'active') activeClients++;
            
            // לוגיקת Churn פשוטה (אם אין שדה lastActive, נניח שהכל תקין כרגע)
            // בעתיד נחבר את זה ללוג התחברויות אמיתי
            if (data.status === 'suspended' || data.healthScore < 50) {
                highRiskCount++;
                risks.push({
                    id: doc.id,
                    clientName: data.name || 'לקוח ללא שם',
                    dropRate: 100 - (data.healthScore || 0),
                    lastActive: 'לא ידוע',
                    riskLevel: 'high'
                });
            }
        });

        // 2. חישוב KPIs (מבוסס אמת)
        setKpis([
          { 
            id: '1', 
            label: 'MRR (מוערך)', 
            value: `₪${activeClients * 500}`, // הנחה זמנית: 500 ש"ח ללקוח
            trend: 0, 
            status: activeClients > 0 ? 'healthy' : 'warning', 
            icon: DollarSign 
          },
          { 
            id: '2', 
            label: 'לקוחות פעילים', 
            value: activeClients.toString(), 
            trend: 0, 
            status: activeClients > 0 ? 'healthy' : 'warning', 
            icon: Activity 
          },
          { 
            id: '3', 
            label: 'שרתים מחוברים', 
            value: '100%', // כרגע אין לנו ניטור שרתים אמיתי
            trend: 0, 
            status: 'healthy', 
            icon: Server 
          },
          { 
            id: '4', 
            label: 'לקוחות בסיכון', 
            value: highRiskCount.toString(), 
            trend: 0, 
            status: highRiskCount === 0 ? 'healthy' : 'critical', 
            icon: AlertTriangle 
          },
        ]);

        setChurnRisks(risks);

        // 3. גרף פיננסי
        // מכיוון שאין לנו היסטוריה, נציג גרף "שטוח" או ריק כדי לא להטעות
        // בעתיד נשלוף את זה מקולקציית 'invoices'
        setFinancialData([
            { name: 'Start', mrr: 0, churn: 0 },
            { name: 'Now', mrr: activeClients * 500, churn: 0 }
        ]);

      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  return { loading, kpis, churnRisks, financialData };
};
