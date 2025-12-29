import React from 'react';
import { Plus, Info, Lock } from 'lucide-react';

interface ServiceProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  help: string;
  isLocked?: boolean;
  minPlan?: string;
}

interface StorageServiceCardProps {
  service: ServiceProps;
  onSelect: (service: ServiceProps) => void;
}

export default function StorageServiceCard({ service, onSelect }: StorageServiceCardProps) {
  return (
    <div 
      onClick={() => !service.isLocked && onSelect(service)}
      className={`group relative overflow-hidden rounded-3xl p-6 border transition-all duration-300
        ${service.isLocked 
          ? 'bg-slate-900/20 border-white/5 opacity-60 cursor-not-allowed grayscale' 
          : 'bg-slate-900/40 border-white/5 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/60 shadow-lg'
        }
      `}
    >
      {service.isLocked && (
        <div className="absolute top-3 right-3 bg-slate-800/80 p-2 rounded-full border border-white/10 z-10">
          <Lock size={16} className="text-slate-400" />
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl transition-transform ${service.isLocked ? 'bg-slate-800' : 'bg-slate-800 group-hover:scale-110'}`}>
          {service.icon}
        </div>
        {!service.isLocked && (
          <div className="text-slate-500 group-hover:text-indigo-400">
            <Plus size={20} />
          </div>
        )}
      </div>

      <h4 className="text-white font-bold text-lg mb-1">{service.title}</h4>
      <p className="text-slate-400 text-xs mb-4 min-h-[40px]">{service.desc}</p>
      
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-black/20 w-fit px-2 py-1 rounded-md">
         {service.isLocked ? (
             <span>נדרש שדרוג ל-{service.minPlan}</span>
         ) : (
            <><Info size={12}/> {service.help}</>
         )}
      </div>
    </div>
  );
}
