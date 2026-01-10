// ===========================================
// AEGIS - Finance Dashboard (Firebase Connected)
// Combined: Beautiful Design + Real Data
// ===========================================

import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { 
  ArrowTrendingUpIcon, BoltIcon, ExclamationTriangleIcon,
  SparklesIcon, CheckBadgeIcon, ClockIcon
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

// ===========================================
// TYPES
// ===========================================

interface ClientAccount {
  id: string;
  name: string;
  plan?: string;
  status?: string;
  enterpriseConfig?: {
    poNumber?: string;
    poTotalBudget?: number;
    poUsedBudget?: number;
    billingCycle?: string;
  };
  createdAt?: any;
}

interface FinanceStats {
  totalMRR: number;
  totalClients: number;
  enterpriseClients: number;
  overdueAmount: number;
  collectionRate: number;
}

// ===========================================
// COMPONENT
// ===========================================

export default function Finance() {
  const [accounts, setAccounts] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FinanceStats>({
    totalMRR: 0,
    totalClients: 0,
    enterpriseClients: 0,
    overdueAmount: 0,
    collectionRate: 0
  });

  // ===========================================
  // DATA FETCHING
  // ===========================================

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // שליפת כל הלקוחות
      const clientsRef = collection(firestore, 'clients');
      const snap = await getDocs(clientsRef);
      
      const allClients = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClientAccount[];
      
      setAccounts(allClients);
      
      // חישוב סטטיסטיקות
      const enterpriseClients = allClients.filter(c => c.plan === 'enterprise');
      const totalBudget = enterpriseClients.reduce((sum, c) => 
        sum + (c.enterpriseConfig?.poTotalBudget || 0), 0);
      const usedBudget = enterpriseClients.reduce((sum, c) => 
        sum + (c.enterpriseConfig?.poUsedBudget || 0), 0);
      
      setStats({
        totalMRR: totalBudget,
        totalClients: allClients.length,
        enterpriseClients: enterpriseClients.length,
        overdueAmount: usedBudget * 0.1, // Example calculation
        collectionRate: totalBudget > 0 ? Math.round((usedBudget / totalBudget) * 100) : 0
      });
      
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // HELPERS
  // ===========================================

  const calculateRiskScore = (client: ClientAccount): number => {
    const budget = client.enterpriseConfig?.poTotalBudget || 0;
    const used = client.enterpriseConfig?.poUsedBudget || 0;
    if (budget === 0) return 50;
    const usagePercent = (used / budget) * 100;
    if (usagePercent > 90) return 85;
    if (usagePercent > 70) return 50;
    return 15;
  };

  const getStatusLabel = (client: ClientAccount): { text: string; color: string } => {
    const budget = client.enterpriseConfig?.poTotalBudget || 0;
    const used = client.enterpriseConfig?.poUsedBudget || 0;
    const remaining = budget - used;
    
    if (remaining < 0) return { text: 'חריגה', color: 'text-rose-400' };
    if (remaining < budget * 0.1) return { text: 'כמעט נגמר', color: 'text-amber-400' };
    return { text: 'תקין', color: 'text-emerald-400' };
  };

  // ===========================================
  // RENDER
  // ===========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans" dir="rtl">
      
      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-white tracking-tighter">REVENUE INTEL</h1>
            <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest flex items-center gap-1">
              <SparklesIcon className="h-3 w-3" /> Live Data
            </span>
          </div>
          <p className="text-slate-500 text-sm">ניטור הכנסות גלובלי וחיזוי סיכוני גבייה • {stats.totalClients} לקוחות</p>
        </div>
        <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Budget</p>
          <p className="text-3xl font-black text-white font-mono">₪{stats.totalMRR.toLocaleString()}</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Revenue Overview */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-white flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-500"/> סקירת תקציב לפי לקוח
            </h3>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              {stats.enterpriseClients} Enterprise
            </span>
          </div>
          
          {/* Budget Bars */}
          <div className="h-48 flex items-end justify-between gap-4">
            {accounts.slice(0, 6).map((client, i) => {
              const budget = client.enterpriseConfig?.poTotalBudget || 0;
              const used = client.enterpriseConfig?.poUsedBudget || 0;
              const maxBudget = Math.max(...accounts.map(c => c.enterpriseConfig?.poTotalBudget || 0), 1);
              const height = (budget / maxBudget) * 100;
              const usedHeight = budget > 0 ? (used / budget) * 100 : 0;
              
              return (
                <div key={client.id} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-indigo-500/20 rounded-xl relative group transition-all hover:bg-indigo-500/40" 
                    style={{ height: `${Math.max(height, 10)}%` }}
                  >
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-xl transition-all"
                      style={{ height: `${usedHeight}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-indigo-300 whitespace-nowrap">
                      ₪{budget.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 truncate max-w-full">
                    {client.name?.slice(0, 8)}
                  </span>
                </div>
              );
            })}
            {accounts.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                אין נתונים להצגה
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <BoltIcon className="absolute -right-10 -bottom-10 text-white/5 w-48 h-48" />
          
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
            <SparklesIcon className="h-5 w-5 text-amber-300"/> סיכום מהיר
          </h3>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/70">ניצול תקציב כולל</span>
                <span className="text-lg font-black">{stats.collectionRate}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${stats.collectionRate}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <p className="text-xs font-bold leading-relaxed">
                {stats.enterpriseClients} לקוחות Enterprise פעילים
              </p>
              <p className="text-[10px] text-white/50 mt-1">
                סה"כ {stats.totalClients} לקוחות במערכת
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">לקוח</th>
              <th className="px-8 py-4">מספר PO</th>
              <th className="px-8 py-4">תקציב</th>
              <th className="px-8 py-4">ניצול</th>
              <th className="px-8 py-4 text-center">Risk Score</th>
              <th className="px-8 py-4">סטטוס</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-slate-500">
                  אין לקוחות להצגה
                </td>
              </tr>
            ) : (
              accounts.map(client => {
                const riskScore = calculateRiskScore(client);
                const status = getStatusLabel(client);
                const budget = client.enterpriseConfig?.poTotalBudget || 0;
                const used = client.enterpriseConfig?.poUsedBudget || 0;
                
                return (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-white text-sm">{client.name}</div>
                      <div className="text-[10px] text-slate-600">{client.plan || 'standard'}</div>
                    </td>
                    <td className="px-8 py-6 font-mono text-indigo-400">
                      {client.enterpriseConfig?.poNumber || '—'}
                    </td>
                    <td className="px-8 py-6 font-mono font-bold text-white">
                      ₪{budget.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 font-mono text-amber-400">
                      ₪{used.toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${riskScore > 50 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500'}`} 
                            style={{ width: `${riskScore}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-500">{riskScore}%</span>
                      </div>
                    </td>
                    <td className={`px-8 py-6 text-xs font-bold uppercase tracking-widest ${status.color}`}>
                      {status.text}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
