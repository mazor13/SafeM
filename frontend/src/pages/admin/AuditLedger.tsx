import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Shield, Clock, Terminal, Filter } from 'lucide-react';

export default function AuditLedger() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(firestore, 'admin_audit_logs'), orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans" dir="rtl">
      
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
             <Shield className="text-indigo-500" size={24} />
             System Audit Ledger
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold mt-1">Immutable Security Trail</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white/5 border border-white/10 p-2 rounded-xl text-slate-400 hover:text-white"><Filter size={18}/></button>
        </div>
      </header>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] text-slate-500 uppercase font-bold tracking-widest border-b border-white/5">
              <th className="p-4 text-center"><Clock size={12} className="inline"/></th>
              <th className="p-4">הפעולה</th>
              <th className="p-4">מבצע</th>
              <th className="p-4">פרטי JSON</th>
              <th className="p-4 text-center">חומרה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 font-mono text-[10px] text-slate-500 text-center">
                  {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString('he-IL') : '---'}
                </td>
                <td className="p-4">
                  <span className="text-sm font-bold text-indigo-400 uppercase tracking-tighter">{log.action}</span>
                </td>
                <td className="p-4 text-xs font-bold text-slate-300">{log.actorId}</td>
                <td className="p-4">
                   <div className="max-w-xs truncate bg-black/40 p-2 rounded-lg border border-white/5 text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                      {JSON.stringify(log.details)}
                   </div>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border ${
                    log.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  }`}>
                    {log.severity || 'low'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
