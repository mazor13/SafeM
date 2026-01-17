#!/bin/bash

echo "🚀 Building Enterprise UI for Sales Pipeline..."

# 1. יצירת דף OpportunitiesPage החדש
# כולל: Kanban משוכלל, חישוב Forecast, וטופס BANT
cat > frontend/src/pages/admin/crm/OpportunitiesPage.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { 
  Plus, X, DollarSign, Calendar, Building2, 
  AlertTriangle, CheckCircle2, Layout, ListFilter 
} from 'lucide-react';
import { 
  Opportunity, STAGES, Stage, 
  ForecastCategory 
} from '../../../types/crm';

// --- Components ---

const GlassCard = ({ children, className = '', onClick }: any) => (
  <div onClick={onClick} className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'bg-slate-700 text-slate-300' }: any) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>
    {children}
  </span>
);

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // טופס יצירה מורכב
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: '',
    amount: 0,
    stage: 'discovery',
    probability: 25,
    accountName: '', // בשלב זה טקסט חופשי, בהמשך יהיה Lookup
    closeDate: '',
    hasBudget: false,
    hasAuthority: false,
    hasNeed: false,
    hasTimeline: false
  });

  // טעינת נתונים
  const fetchOpps = async () => {
    try {
      const q = query(collection(firestore, 'opportunities'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      
      // המרה חכמה של הנתונים (כולל טיפול בנתונים ישנים אם יש)
      const data = sn.docs.map(d => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          // מוודאים שיש ערכים דיפולטיביים לשדות החדשים
          stage: raw.stage || 'discovery',
          probability: raw.probability || 25,
          forecastCategory: raw.forecastCategory || 'pipeline'
        };
      }) as Opportunity[];
      
      setOpps(data);
    } catch (e) { 
      console.error("Error fetching opportunities:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchOpps(); }, []);

  // יצירת הזדמנות חדשה
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.accountName) return;

    try {
      // חישוב BANT Score אוטומטי
      let bantScore = 0;
      if (formData.hasBudget) bantScore++;
      if (formData.hasAuthority) bantScore++;
      if (formData.hasNeed) bantScore++;
      if (formData.hasTimeline) bantScore++;

      const newOpp: any = {
        ...formData,
        currency: 'ILS',
        accountId: 'temp-id', // TODO: חיבור אמיתי ל-Account
        ownerId: 'current-user-id',
        bantScore,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        closeDate: formData.closeDate ? new Date(formData.closeDate) : new Date()
      };

      await addDoc(collection(firestore, 'opportunities'), newOpp);
      setIsModalOpen(false);
      fetchOpps();
      
      // איפוס טופס
      setFormData({
        title: '', amount: 0, stage: 'discovery', probability: 25,
        accountName: '', closeDate: '', 
        hasBudget: false, hasAuthority: false, hasNeed: false, hasTimeline: false
      });
    } catch (e) {
      console.error("Error creating opp:", e);
      alert("שגיאה ביצירת ההזדמנות");
    }
  };

  // חישוב Forecast (Weighted Pipeline)
  const calculateForecast = () => {
    const total = opps.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const weighted = opps.reduce((sum, o) => sum + ((Number(o.amount) || 0) * (o.probability / 100)), 0);
    return { total, weighted };
  };

  const forecast = calculateForecast();

  // גרירה והעברה בין שלבים (Simulated for now with click)
  const handleStageChange = async (oppId: string, newStage: Stage) => {
    const stageInfo = STAGES.find(s => s.value === newStage);
    if (!stageInfo) return;

    // עדכון מקומי מהיר
    setOpps(prev => prev.map(o => o.id === oppId ? { ...o, stage: newStage, probability: stageInfo.prob } : o));

    // עדכון בשרת
    const ref = doc(firestore, 'opportunities', oppId);
    await updateDoc(ref, { 
      stage: newStage, 
      probability: stageInfo.prob,
      updatedAt: Timestamp.now()
    });
  };

  return (
    <div className="flex flex-col h-screen p-6 overflow-hidden" dir="rtl">
      
      {/* Header & Forecast Bar */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layout className="text-indigo-400" /> הזדמנויות (Pipeline)
          </h1>
          <div className="flex gap-6 mt-2 text-sm">
            <div className="text-slate-400">
              שווי צנרת כולל: <span className="text-white font-bold text-lg">₪{forecast.total.toLocaleString()}</span>
            </div>
            <div className="text-slate-400">
              צפי משוקלל (Forecast): <span className="text-emerald-400 font-bold text-lg">₪{forecast.weighted.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> הזדמנות חדשה
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-[1400px]">
          {STAGES.map(stage => (
            <div key={stage.value} className="flex-1 flex flex-col min-w-[260px] max-w-[320px]">
              {/* Column Header */}
              <div className="flex justify-between items-center mb-3 px-1">
                <div className="font-bold text-slate-300 text-sm flex items-center gap-2">
                  {stage.label}
                  <Badge>{stage.prob}%</Badge>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {opps.filter(o => o.stage === stage.value).length}
                </span>
              </div>

              {/* Drop Zone */}
              <div className="flex-1 bg-slate-900/30 border border-white/5 rounded-2xl p-2 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                {opps.filter(o => o.stage === stage.value).map(opp => (
                  <GlassCard 
                    key={opp.id} 
                    className="p-4 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all group relative"
                  >
                    {/* Title & Account */}
                    <div className="mb-3">
                      <h4 className="font-bold text-white text-sm leading-snug mb-1">{opp.title}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-indigo-300">
                        <Building2 size={12} />
                        {opp.accountName}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex justify-between items-end border-t border-white/5 pt-3">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase mb-0.5">שווי</div>
                        <div className="text-sm font-bold text-white flex items-center">
                          <DollarSign size={12} className="text-slate-400" />
                          {Number(opp.amount).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-slate-500 uppercase mb-0.5">סגירה</div>
                        <div className="text-xs text-slate-300 flex items-center gap-1">
                          <Calendar size={10} />
                          {opp.closeDate ? new Date(opp.closeDate).toLocaleDateString('he-IL') : '-'}
                        </div>
                      </div>
                    </div>

                    {/* BANT Indicators (Mini) */}
                    {(opp.bantScore || 0) > 0 && (
                      <div className="absolute top-3 left-3 flex gap-0.5">
                         {[...Array(opp.bantScore)].map((_,i) => (
                           <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                         ))}
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Opportunity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
              <h2 className="text-xl font-bold text-white">הזדמנות חדשה</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto">
              <form id="create-opp-form" onSubmit={handleCreate} className="space-y-8">
                
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">פרטי העסקה</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">נושא ההזדמנות *</label>
                      <input required 
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                        placeholder="למשל: הטמעת מערכת בטיחות שנתית" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">שם הלקוח (Account) *</label>
                      <input required 
                        value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                        placeholder="חפש לקוח..." />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">שווי מוערך (₪)</label>
                      <input type="number" 
                        value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">תאריך סגירה צפוי *</label>
                      <input type="date" required
                        value={formData.closeDate} onChange={e => setFormData({...formData, closeDate: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">שלב התחלתי</label>
                      <select 
                        value={formData.stage} onChange={e => {
                          const s = STAGES.find(st => st.value === e.target.value);
                          setFormData({...formData, stage: e.target.value as any, probability: s?.prob || 0});
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none"
                      >
                        {STAGES.map(s => <option key={s.value} value={s.value}>{s.label} ({s.prob}%)</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10"></div>

                {/* Section 2: Qualification (BANT) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">סינון (BANT Qualification)</h3>
                    <div className="text-xs text-slate-500">חובה לסמן לפחות 2 כדי להתקדם</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.hasBudget ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800 border-slate-700'}`}>
                      <input type="checkbox" checked={formData.hasBudget} onChange={e => setFormData({...formData, hasBudget: e.target.checked})} className="w-4 h-4 accent-emerald-500" />
                      <div>
                        <div className="text-sm font-bold text-white">Budget (תקציב)</div>
                        <div className="text-xs text-slate-400">יש תקציב מאושר</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.hasAuthority ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800 border-slate-700'}`}>
                      <input type="checkbox" checked={formData.hasAuthority} onChange={e => setFormData({...formData, hasAuthority: e.target.checked})} className="w-4 h-4 accent-emerald-500" />
                      <div>
                        <div className="text-sm font-bold text-white">Authority (סמכות)</div>
                        <div className="text-xs text-slate-400">יש קשר למקבל החלטות</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.hasNeed ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800 border-slate-700'}`}>
                      <input type="checkbox" checked={formData.hasNeed} onChange={e => setFormData({...formData, hasNeed: e.target.checked})} className="w-4 h-4 accent-emerald-500" />
                      <div>
                        <div className="text-sm font-bold text-white">Need (צורך)</div>
                        <div className="text-xs text-slate-400">יש בעיה עסקית ברורה</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.hasTimeline ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800 border-slate-700'}`}>
                      <input type="checkbox" checked={formData.hasTimeline} onChange={e => setFormData({...formData, hasTimeline: e.target.checked})} className="w-4 h-4 accent-emerald-500" />
                      <div>
                        <div className="text-sm font-bold text-white">Timeline (לו"ז)</div>
                        <div className="text-xs text-slate-400">יש תאריך יעד ליישום</div>
                      </div>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-slate-800/50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-300 hover:bg-white/5 transition-colors">
                ביטול
              </button>
              <button 
                type="submit" 
                form="create-opp-form"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                <Plus size={18} /> צור הזדמנות
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
EOF

echo "✅ UI Refactored. Installing dependencies & Building..."

cd frontend && npm run build

if [ $? -eq 0 ]; then
  echo "🚀 Build Successful! Deploying to Firebase..."
  cd ..
  firebase deploy --only hosting
else
  echo "❌ Build Failed. Please check the logs."
fi
