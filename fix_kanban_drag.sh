#!/bin/bash

echo "🚀 Activating Drag & Drop Engine and Safe Data Display..."

cat > frontend/src/pages/admin/crm/OpportunitiesPage.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { 
  Plus, X, DollarSign, Calendar, Building2, 
  Layout, Search 
} from 'lucide-react';
import { 
  Opportunity, STAGES, Stage
} from '../../../types/crm';

const GlassCard = ({ children, className = '', onDragStart, draggable }: any) => (
  <div 
    draggable={draggable}
    onDragStart={onDragStart}
    className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, color = 'bg-slate-700 text-slate-300' }: any) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>
    {children}
  </span>
);

// פונקציית עזר לפרמוט בטוח
const formatCurrency = (val: any) => {
  const num = Number(val);
  return isNaN(num) ? '0' : num.toLocaleString();
};

const formatDate = (val: any) => {
  if (!val) return '-';
  // טיפול ב-Timestamp של Firebase או סתם Date string
  const date = val.toDate ? val.toDate() : new Date(val);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('he-IL');
};

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  
  // טופס יצירה
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: '', amount: 0, stage: 'discovery', probability: 25,
    accountName: '', closeDate: '', 
    hasBudget: false, hasAuthority: false, hasNeed: false, hasTimeline: false
  });

  const fetchOpps = async () => {
    try {
      const q = query(collection(firestore, 'opportunities'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      const data = sn.docs.map(d => ({ id: d.id, ...d.data() })) as Opportunity[];
      setOpps(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchOpps(); }, []);

  // --- DRAG AND DROP LOGIC ---
  const handleDragStart = (id: string) => {
    setDraggedOppId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // חובה כדי לאפשר Drop
  };

  const handleDrop = async (targetStage: Stage) => {
    if (!draggedOppId) return;

    const stageInfo = STAGES.find(s => s.value === targetStage);
    if (!stageInfo) return;

    // 1. עדכון אופטימי ב-UI (כדי שירגיש מהר)
    setOpps(prev => prev.map(o => {
      if (o.id === draggedOppId) {
        return { ...o, stage: targetStage, probability: stageInfo.prob };
      }
      return o;
    }));

    // 2. עדכון בשרת
    const ref = doc(firestore, 'opportunities', draggedOppId);
    await updateDoc(ref, { 
      stage: targetStage, 
      probability: stageInfo.prob,
      updatedAt: Timestamp.now()
    });

    setDraggedOppId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let bantScore = 0;
      if (formData.hasBudget) bantScore++;
      if (formData.hasAuthority) bantScore++;
      if (formData.hasNeed) bantScore++;
      if (formData.hasTimeline) bantScore++;

      await addDoc(collection(firestore, 'opportunities'), {
        ...formData,
        accountId: 'temp-id',
        bantScore,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // המרת התאריך לפורמט תקין
        closeDate: formData.closeDate ? new Date(formData.closeDate).toISOString() : null
      });
      setIsModalOpen(false);
      fetchOpps();
      setFormData({
        title: '', amount: 0, stage: 'discovery', probability: 25,
        accountName: '', closeDate: '', 
        hasBudget: false, hasAuthority: false, hasNeed: false, hasTimeline: false
      });
    } catch (e) { console.error(e); }
  };

  // Forecast Calc
  const totalValue = opps.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const weightedValue = opps.reduce((sum, o) => sum + ((Number(o.amount) || 0) * ((o.probability || 0) / 100)), 0);

  return (
    <div className="flex flex-col h-screen p-6 overflow-hidden" dir="rtl">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layout className="text-indigo-400" /> הזדמנויות (Pipeline)
          </h1>
          <div className="flex gap-6 mt-2 text-sm">
            <div className="text-slate-400">
              שווי צנרת: <span className="text-white font-bold">₪{formatCurrency(totalValue)}</span>
            </div>
            <div className="text-slate-400">
              צפי משוקלל: <span className="text-emerald-400 font-bold">₪{formatCurrency(weightedValue)}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-bold flex gap-2 items-center">
          <Plus size={18} /> הזדמנות חדשה
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-[1400px]">
          {STAGES.map(stage => (
            <div 
              key={stage.value} 
              className="flex-1 flex flex-col min-w-[260px] max-w-[320px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.value as Stage)}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-3 px-1 border-b border-white/5 pb-2">
                <div className="font-bold text-slate-300 text-sm flex items-center gap-2">
                  {stage.label}
                  <Badge>{stage.prob}%</Badge>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {opps.filter(o => o.stage === stage.value).length}
                </span>
              </div>

              {/* Drop Zone */}
              <div className={`flex-1 bg-slate-900/20 border border-white/5 rounded-2xl p-2 space-y-3 overflow-y-auto transition-colors ${draggedOppId ? 'hover:bg-slate-800/50 hover:border-indigo-500/30' : ''}`}>
                {opps.filter(o => o.stage === stage.value).map(opp => (
                  <GlassCard 
                    key={opp.id} 
                    draggable={true}
                    onDragStart={() => handleDragStart(opp.id)}
                    className="p-4 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all group relative"
                  >
                    <div className="mb-3">
                      <h4 className="font-bold text-white text-sm leading-snug mb-1">{opp.title}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-indigo-300">
                        <Building2 size={12} />
                        {opp.accountName || 'ללא לקוח'}
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/5 pt-3">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase mb-0.5">שווי</div>
                        <div className="text-sm font-bold text-white flex items-center">
                          <DollarSign size={12} className="text-slate-400" />
                          {formatCurrency(opp.amount)}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-slate-500 uppercase mb-0.5">סגירה</div>
                        <div className="text-xs text-slate-300 flex items-center gap-1">
                          <Calendar size={10} />
                          {formatDate(opp.closeDate)}
                        </div>
                      </div>
                    </div>
                    
                    {/* BANT Dots */}
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
      
      {/* Modal kept simple for brevity of this script, assume same modal structure */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">יצירת הזדמנות</h2>
            <form onSubmit={handleCreate} className="space-y-4">
               <input required placeholder="שם העסקה" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
               <input required placeholder="שם הלקוח" value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
               <input type="number" placeholder="סכום" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
               <input type="date" required value={formData.closeDate} onChange={e => setFormData({...formData, closeDate: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
               
               {/* BANT Section */}
               <div className="grid grid-cols-2 gap-2 mt-4">
                  <label className="flex gap-2 text-white text-sm"><input type="checkbox" onChange={e => setFormData({...formData, hasBudget: e.target.checked})} /> תקציב (Budget)</label>
                  <label className="flex gap-2 text-white text-sm"><input type="checkbox" onChange={e => setFormData({...formData, hasAuthority: e.target.checked})} /> סמכות (Authority)</label>
                  <label className="flex gap-2 text-white text-sm"><input type="checkbox" onChange={e => setFormData({...formData, hasNeed: e.target.checked})} /> צורך (Need)</label>
                  <label className="flex gap-2 text-white text-sm"><input type="checkbox" onChange={e => setFormData({...formData, hasTimeline: e.target.checked})} /> לו"ז (Timeline)</label>
               </div>

               <div className="flex justify-end gap-2 mt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="text-white px-4 py-2">ביטול</button>
                 <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl">צור</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
EOF

echo "✅ Drag & Drop activated. Deploying..."
cd frontend && npm run build && cd .. && firebase deploy --only hosting
