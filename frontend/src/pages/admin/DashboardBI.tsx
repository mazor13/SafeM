import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Activity, AlertTriangle, Cpu, Radio } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics'; // Import the brain

// --- Glass Components ---
const GlassCard = ({ children, className = '', title, action }: { children: React.ReactNode, className?: string, title?: string, action?: any }) => (
  <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:bg-slate-800/40 group ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    {(title || action) && (
      <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
        {title && <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-3">{title}</h3>}
        {action}
      </div>
    )}
    <div className="p-6 relative z-10 h-full">{children}</div>
  </div>
);

const NeonButton = ({ label, color = 'blue', onClick }: { label: string, color?: 'blue' | 'purple' | 'red', onClick?: () => void }) => {
  const colors = {
    blue: 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.15)]',
    purple: 'border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500/10 shadow-[0_0_15px_rgba(232,121,249,0.15)]',
    red: 'border-rose-500 text-rose-400 hover:bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
  };
  return (
    <button onClick={onClick} className={`px-5 py-2 rounded-full border text-xs font-bold transition-all duration-300 uppercase tracking-wider ${colors[color]}`}>
      {label}
    </button>
  );
};

export default function DashboardBI() {
  // חיבור ל-Hook
  const { loading, kpis, churnRisks, financialData } = useAnalytics();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 font-sans selection:bg-indigo-500/30 overflow-hidden relative" dir="rtl">
      
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Anomaly Banner */}
      <div className="mb-8 animate-slideDown relative z-20">
        <div className="bg-gradient-to-l from-rose-900/40 to-rose-600/10 border border-rose-500/20 rounded-xl p-4 flex items-center justify-between backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.1)]">
          <div className="flex items-center gap-4">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div>
              <h4 className="font-bold text-rose-200 text-sm flex items-center gap-2">
                <AlertTriangle size={14} /> זוהתה חריגת שימוש גלובלית
              </h4>
              <p className="text-xs text-rose-300/70">זוהתה ירידה חדה בייצור דוחות ב-3 לקוחות אסטרטגיים בשעתיים האחרונות.</p>
            </div>
          </div>
          <NeonButton label="חקור אירוע" color="red" />
        </div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-end mb-10 relative z-20">
        <div>
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 mb-2 tracking-tight">
            The Master Insights
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide flex items-center gap-2">
            <Cpu size={14} className="text-indigo-400" />
            מגדל הפיקוח הראשי • מנוע AI פעיל • גרסה 5.2
          </p>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-slate-900/50 border border-white/10 px-5 py-2.5 rounded-2xl flex flex-col items-center backdrop-blur-md">
                <span className="text-[10px] text-slate-400 uppercase font-bold mb-1">System Load</span>
                <span className="text-emerald-400 font-mono font-bold text-lg flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 34%
                </span>
            </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

        {/* 1. KPIs */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((stat) => (
            <GlassCard key={stat.id} className="group hover:-translate-y-1 !bg-slate-800/30">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  <stat.icon size={20} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border 
                  ${stat.status === 'healthy' 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}>
                   {stat.trend > 0 ? '+' : ''}{stat.trend}%
                </span>
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-3xl font-black text-white font-mono group-hover:text-indigo-200 transition-colors tracking-tight">
                {loading ? <div className="h-8 w-24 bg-slate-700/50 rounded animate-pulse"></div> : stat.value}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* 2. Global Health Radar */}
        <div className="lg:col-span-8">
            <GlassCard 
              title="🧬 Global Health Radar" 
              className="h-full min-h-[450px]" 
              action={<div className="flex items-center gap-2 text-xs font-mono text-slate-400"><Radio size={14} className="animate-pulse text-indigo-400" /> Live Monitoring</div>}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
                    {/* Chart */}
                    <div className="md:col-span-2 flex flex-col h-full">
                         <div className="flex-1 w-full min-h-[250px] relative">
                            {loading ? (
                                <div className="w-full h-full bg-slate-800/20 animate-pulse rounded-xl"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={financialData}>
                                    <defs>
                                    <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#818cf8' }}
                                    />
                                    <Area type="monotone" dataKey="mrr" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" />
                                </AreaChart>
                                </ResponsiveContainer>
                            )}
                         </div>
                    </div>
                    
                    {/* Side Stats */}
                    <div className="md:col-span-1 space-y-6 border-r border-white/5 pr-6">
                        <div>
                            <div className="flex justify-between text-xs mb-2 font-bold">
                                <span className="text-slate-400">Database Latency</span>
                                <span className="text-emerald-400 font-mono">12ms</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[15%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-2 font-bold">
                                <span className="text-slate-400">Storage (S3)</span>
                                <span className="text-blue-400 font-mono">42%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-[42%] rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                            </div>
                        </div>
                        
                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mt-8">
                             <h5 className="text-[10px] font-bold text-indigo-300 uppercase mb-3 flex items-center gap-2">
                                <Activity size={12} /> אזורים פעילים (Hotspots)
                             </h5>
                             <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-indigo-500/20 rounded text-[10px] text-indigo-200 border border-indigo-500/30">תל אביב</span>
                                <span className="px-2 py-1 bg-indigo-500/20 rounded text-[10px] text-indigo-200 border border-indigo-500/30">חיפה</span>
                                <span className="px-2 py-1 bg-indigo-500/20 rounded text-[10px] text-indigo-200 border border-indigo-500/30">באר שבע</span>
                             </div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>

        {/* 3. AI Churn Predictor */}
        <div className="lg:col-span-4">
            <GlassCard 
                title="🔮 AI Churn Predictor" 
                className="h-full !bg-gradient-to-b from-indigo-900/20 to-slate-900/40 border-indigo-500/20"
                action={<span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded text-white font-bold shadow-lg shadow-indigo-500/30">BETA</span>}
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                            <div className="absolute inset-0 rounded-full h-10 w-10 border-t-2 border-cyan-400 opacity-30 animate-ping"></div>
                        </div>
                        <span className="text-xs text-indigo-300 animate-pulse font-mono">מנתח נתוני שימוש...</span>
                    </div>
                ) : (
                    <div className="space-y-4 h-full flex flex-col">
                        <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                            האלגוריתם זיהה <span className="text-white font-bold">{churnRisks.length} לקוחות</span> עם דפוס התנהגות המעיד על סכנת נטישה מיידית.
                        </p>

                        <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                            {churnRisks.map((risk) => (
                                <div key={risk.id} className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl flex justify-between items-center group cursor-pointer hover:bg-rose-500/10 hover:border-rose-500/30 transition-all">
                                    <div>
                                        <h5 className="font-bold text-rose-200 text-sm group-hover:text-white transition-colors">{risk.clientName}</h5>
                                        <div className="text-[10px] text-rose-300/60 mt-1 flex gap-3">
                                            <span className="flex items-center gap-1"><TrendingUp size={10} className="rotate-180" /> {risk.dropRate}% ירידה</span>
                                            <span>🕒 {risk.lastActive}</span>
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                                        !
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-auto py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5">
                            צור קשר יזום (Retention Flow)
                        </button>
                    </div>
                )}
            </GlassCard>
        </div>

      </div>
    </div>
  );
}
