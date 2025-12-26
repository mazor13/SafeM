import { useState, useEffect } from 'react';
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

// --- The Hook ---
export const useAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [churnRisks, setChurnRisks] = useState<ChurnRisk[]>([]);
  const [financialData, setFinancialData] = useState<FinancialDataPoint[]>([]);

  useEffect(() => {
    // Simulating API Call to Backend
    const fetchAnalytics = async () => {
      setLoading(true);
      
      // Artificial Delay (to show loading skeletons)
      await new Promise(resolve => setTimeout(resolve, 1200));

      // 1. Mock KPIs
      setKpis([
        { id: '1', label: 'MRR (הכנסה חודשית)', value: '₪142,500', trend: 12.5, status: 'healthy', icon: DollarSign },
        { id: '2', label: 'דוחות שנוצרו (היום)', value: '843', trend: 5.2, status: 'healthy', icon: Activity },
        { id: '3', label: 'שרתים פעילים', value: '99.98%', trend: 0, status: 'healthy', icon: Server },
        { id: '4', label: 'חובות בסיכון', value: '₪12,200', trend: -2.4, status: 'warning', icon: AlertTriangle },
      ]);

      // 2. Mock Churn Risks (AI Prediction Logic)
      setChurnRisks([
        { id: 'c1', clientName: 'דניה סיבוס - מחוז צפון', dropRate: 42, lastActive: '12 ימים', riskLevel: 'high' },
        { id: 'c2', clientName: 'מפעלי ים המלח', dropRate: 28, lastActive: '5 ימים', riskLevel: 'medium' },
        { id: 'c3', clientName: 'אלקטרה תשתיות', dropRate: 31, lastActive: '8 ימים', riskLevel: 'high' },
      ]);

      // 3. Mock Financial Graph
      setFinancialData([
        { name: 'Jan', mrr: 4000, churn: 240 },
        { name: 'Feb', mrr: 3000, churn: 139 },
        { name: 'Mar', mrr: 2000, churn: 980 },
        { name: 'Apr', mrr: 2780, churn: 390 },
        { name: 'May', mrr: 1890, churn: 480 },
        { name: 'Jun', mrr: 2390, churn: 380 },
        { name: 'Jul', mrr: 3490, churn: 430 },
      ]);

      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  return { loading, kpis, churnRisks, financialData };
};
