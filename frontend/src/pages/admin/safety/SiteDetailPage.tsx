import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Shield, Activity, AlertTriangle, 
  CheckCircle2, Clock, Zap, Cpu, BarChart3 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSites } from '../../../hooks/useSites';

export default function SiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sites, loading, fetchSites } = useSites();
  const site = sites.find(s => s.id === id);

  useEffect(() => {
    if (sites.length === 0) fetchSites();
  }, [sites, fetchSites]);

  if (loading) return <div className="p-20 text-center text-[#00D8FF] animate-pulse">חילוץ נתוני Node...</div>;
  if (!site) return <div className="p-20 text-center text-white">האתר לא נמצא במערכת.</div>;

  return (
    <div className="min-h-screen bg-[#0E1A35] text-white p-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/admin/safety/files')}
            className="flex items-center gap-2 text-[#A9B3C1] hover:text-[#00D8FF] transition-colors font-bold"
          >
            <ArrowRight size={20} />
            חזרה לניהול אתרים
          </button>
          <div className="flex items-center gap-3 bg-[#1C2435] px-4 py-2 rounded-full border border-[#00D8FF]/20">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_#10B981]" />
            <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-widest">Node Operational</span>
          </div>
        </div>

        {/* Hero Section - Intelligence Node */}
        <div className="relative overflow-hidden bg-[#1C2435] border border-[#00D8FF]/30 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00D8FF] to-transparent opacity-50" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-[#0E1A35] rounded-3xl flex items-center justify-center border border-[#00D8FF]/30 shadow-[0_0_30px_rgba(0,216,255,0.2)]">
                <Cpu size={48} className="text-[#00D8FF]" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tighter mb-2">{site.name}</h1>
                <p className="text-[#A9B3C1] text-lg flex items-center gap-2">
                  <Shield size={18} className="text-[#00D8FF]" />
                  מזהה מערכת: <span className="font-mono">{site.id.slice(0, 8)}...</span>
                </p>
              </div>
            </div>
            <div className="bg-[#0E1A35]/50 p-6 rounded-2xl border border-[#00D8FF]/10 text-center min-w-[200px]">
              <div className="text-[#A9B3C1] text-xs font-bold uppercase mb-2 tracking-widest">ציון בטיחות משוקלל</div>
              <div className="text-5xl font-black text-[#00D8FF]">{site.stats?.complianceScore || 0}%</div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Risk Analysis */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#1C2435] p-8 rounded-[2rem] border border-[#00D8FF]/10 relative group"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">ניתוח סיכונים AI</h3>
              <Zap size={24} className="text-[#FF8A00]" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#A9B3C1]">רמת איום נוכחית</span>
                <span className="text-white font-bold">נמוכה</span>
              </div>
              <div className="h-2 bg-[#0E1A35] rounded-full overflow-hidden">
                <div className="h-full bg-[#FF8A00] w-[30%]" />
              </div>
              <p className="text-xs text-[#A9B3C1] leading-relaxed italic mt-4">
                "אלגוריתם Aegis מזהה יציבות תפעולית גבוהה ב-48 השעות האחרונות."
              </p>
            </div>
          </motion.div>

          {/* Compliance History */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#1C2435] p-8 rounded-[2rem] border border-[#00D8FF]/10"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">היסטוריית ציות</h3>
              <BarChart3 size={24} className="text-[#00D8FF]" />
            </div>
            <div className="flex items-end gap-2 h-24">
              {[40, 70, 55, 90, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-[#00D8FF]/20 rounded-t-lg relative group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="bg-[#00D8FF] rounded-t-lg transition-all group-hover:bg-white"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-[#A9B3C1] font-bold uppercase">
              <span>ינואר</span>
              <span>יוני</span>
            </div>
          </motion.div>

          {/* Critical Alerts */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#1C2435] p-8 rounded-[2rem] border border-[#00D8FF]/10"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">התראות מערכת</h3>
              <AlertTriangle size={24} className="text-[#d4183d]" />
            </div>
            <div className="space-y-3">
              {[
                { title: 'בדיקת אש תקופתית', date: 'עוד 3 ימים', color: 'text-white' },
                { title: 'חידוש הדרכת בטיחות', date: 'הושלם', color: 'text-[#10B981]' }
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0E1A35]/50 rounded-xl border border-white/5">
                  <span className={`text-sm font-bold ${alert.color}`}>{alert.title}</span>
                  <span className="text-[10px] text-[#A9B3C1] font-mono uppercase">{alert.date}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Content Tabs - Placeholder for Tables/Forms */}
        <div className="bg-[#1C2435] rounded-[2.5rem] border border-[#00D8FF]/20 p-8">
           <div className="flex gap-8 border-b border-[#00D8FF]/10 pb-6 mb-8">
              {['תיקי בטיחות', 'סקירות', 'ציוד', 'משימות'].map((tab, i) => (
                <button 
                  key={i} 
                  className={`text-lg font-bold transition-all ${i === 0 ? 'text-[#00D8FF] border-b-2 border-[#00D8FF]' : 'text-[#A9B3C1] hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
           </div>
           <div className="py-20 text-center text-[#A9B3C1] italic">
              המערכת מוכנה להזרקת נתונים מפורטים עבור {site.name}
           </div>
        </div>
      </div>
    </div>
  );
}
