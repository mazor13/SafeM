import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OPS_REGISTRY } from './registry';
import { ShieldCheck, ChevronRight, Activity } from 'lucide-react';
import DiagnosticTool from './l1/DiagnosticTool';

// מפת הקומפוננטות - כאן נרשום כל כלי חדש שנוסיף
const COMPONENT_MAP: Record<string, any> = {
  'DiagnosticTool': DiagnosticTool,
};

export default function OpsCenter({ clientId, supportLevel = 1 }: any) {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const allowedTools = OPS_REGISTRY.filter(tool => supportLevel >= tool.minLevel);
  const activeToolDef = OPS_REGISTRY.find(t => t.id === selectedToolId);
  const ActiveComponent = activeToolDef ? COMPONENT_MAP[activeToolDef.component] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="space-y-2">
        <p className="text-[10px] text-slate-500 font-bold uppercase mb-4 pr-2 tracking-widest">Ops Toolbox</p>
        {allowedTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedToolId(tool.id)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border text-right ${
              selectedToolId === tool.id 
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' 
              : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <tool.icon size={18} />
              <div className="text-right">
                <span className="text-xs font-bold block">{tool.title}</span>
                <span className="text-[9px] opacity-60 block leading-tight">{tool.desc}</span>
              </div>
            </div>
            {selectedToolId === tool.id && <ChevronRight size={14} />}
          </button>
        ))}
      </div>

      <div className="lg:col-span-3 min-h-[500px] bg-slate-900/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
         <AnimatePresence mode="wait">
           {!ActiveComponent ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center">
                <Activity size={48} className="text-slate-700 mb-4" />
                <h4 className="text-slate-400 font-bold">ממתין לבחירת כלי</h4>
                <p className="text-xs text-slate-600 mt-2">כל הפעולות במרכז הבקרה מתועדות לצרכי Audit</p>
             </motion.div>
           ) : (
             <motion.div key={selectedToolId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <ActiveComponent clientId={clientId} />
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}
