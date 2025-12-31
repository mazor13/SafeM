import React from 'react';
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  ArrowUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useSystemStats } from '../../hooks/useSystemStats';

export default function DashboardBI() {
  const { stats, loading } = useSystemStats();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <ArrowPathIcon className="h-10 w-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const metrics = [
    { 
      name: 'סה"כ הכנסה חודשית (MRR)', 
      value: formatCurrency(stats.totalRevenue), 
      icon: CurrencyDollarIcon, 
      change: '+12.5%', 
      trend: 'up',
      description: 'סיכום מכל ה-Tenants' 
    },
    { 
      name: 'לקוחות פעילים', 
      value: stats.totalTenants.toString(), 
      icon: ChartBarIcon, 
      change: '+3', 
      trend: 'up',
      description: 'חברות באקו-סיסטם' 
    },
    { 
      name: 'משתמשים בקצה', 
      value: stats.totalUsers.toLocaleString(), 
      icon: UsersIcon, 
      change: '+18%', 
      trend: 'up',
      description: 'סה"כ מושבים פעילים' 
    },
    { 
      name: 'בריאות מערכת גלובלית', 
      value: `${stats.healthScore}%`, 
      icon: ShieldCheckIcon, 
      change: 'יציב', 
      trend: 'up',
      description: 'זמינות שרתים ותשתיות' 
    },
  ];

  return (
    <div className="p-8 bg-[#0f172a] min-h-screen font-sans" dir="rtl">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Cortex BI Explorer</h1>
        <p className="text-slate-500 text-sm mt-1">ניתוח ביצועים ונתוני אמת חוצי-ארגון</p>
      </header>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((item) => (
          <div key={item.name} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-600/10 transition-all"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-600/10 rounded-2xl">
                <item.icon className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <ArrowUpIcon className="h-3 w-3" /> {item.change}
              </div>
            </div>
            
            <h3 className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">{item.name}</h3>
            <div className="text-2xl font-black text-white">{item.value}</div>
            <p className="text-[10px] text-slate-600 mt-2 italic">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder for next step */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 h-[400px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
             <ChartBarIcon className="h-8 w-8 text-slate-700" />
          </div>
          <h4 className="text-white font-bold">התפלגות הכנסות וצמיחה</h4>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">כאן יופיע גרף ה-Revenue המפורט לאחר שנחבר את ספריית Recharts במשימה הבאה.</p>
        </div>
        
        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
           <h4 className="text-white font-bold mb-6">סטטוס לקוחות אחרונים</h4>
           <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                  <div className="flex-1">
                    <div className="h-2 w-20 bg-slate-700 rounded mb-2"></div>
                    <div className="h-2 w-12 bg-slate-800 rounded"></div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500">ACTIVE</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
