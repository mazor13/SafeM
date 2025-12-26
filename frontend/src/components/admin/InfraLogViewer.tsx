import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase';

// 1. הגדרת ה"חוזה" מול TypeScript
interface LogEntry {
  id: string;
  provider: string;
  status: string;
  details: any; // מאפשר גמישות לתוכן האובייקט
  time: string;
}

export const InfraLogViewer = () => {
  // שימוש ב-Interface בתוך ה-State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterId, setFilterId] = useState('');

  useEffect(() => {
    const q = query(
      collection(firestore, 'infrastructure_logs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // 2. מיפוי מפורש של הנתונים כדי ש-TS יבין מה יש בפנים
      const newLogs: LogEntry[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          provider: data.provider || 'UNKNOWN',
          status: data.status || 'INFO',
          details: data.details || {},
          time: data.timestamp?.toDate().toLocaleTimeString('he-IL') || 'Now'
        };
      });
      
      const filtered = filterId 
        ? newLogs.filter(log => log.id.includes(filterId) || JSON.stringify(log.details).includes(filterId))
        : newLogs;

      setLogs(filtered);
    });

    return () => unsubscribe();
  }, [filterId]);

  return (
    <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 font-mono text-xs h-[400px] flex flex-col border border-slate-700 shadow-2xl">
      
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
        <h3 className="font-bold flex items-center gap-2">
          <span className="text-emerald-500 animate-pulse">●</span> 
          <span>&gt; SYSTEM_LOGS_STREAM</span>
        </h3>
        <input 
          placeholder="חפש לפי Event ID..." 
          onChange={(e) => setFilterId(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white px-3 py-1 rounded text-xs w-64 focus:border-indigo-500 outline-none"
        />
      </div>
      
      <div className="overflow-y-auto flex-1 space-y-1 pr-2">
        {logs.length === 0 && <div className="text-slate-600 italic text-center py-10">ממתין לנתונים...</div>}
        
        {logs.map(log => (
          <div key={log.id} className="group grid grid-cols-12 gap-2 hover:bg-white/5 p-2 rounded transition-all border-l-2 border-transparent hover:border-indigo-500 cursor-pointer">
            <span className="col-span-2 text-slate-500 text-[10px]">{log.time}</span>
            <span className="col-span-3 text-indigo-400 font-bold select-all" title="Click to copy ID">#{log.id.slice(0, 8)}</span>
            <span className={`col-span-2 font-bold ${log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {log.status}
            </span>
            <span className="col-span-5 text-slate-300 truncate group-hover:whitespace-normal break-all">
              {log.status === 'ERROR' ? `ERR: ${log.details?.error || 'Unknown Error'}` : JSON.stringify(log.details)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
