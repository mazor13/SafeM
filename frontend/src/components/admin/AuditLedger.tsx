import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { FileText, LogIn, Settings, ShieldAlert, UserPlus, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface LogEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: any;
  status: 'success' | 'failure' | 'warning';
  details?: string;
  module: string;
}

const getIcon = (action: string) => {
    if (action.includes('login')) return <LogIn size={14} />;
    if (action.includes('create')) return <UserPlus size={14} />;
    if (action.includes('delete')) return <Trash2 size={14} />;
    if (action.includes('infra')) return <Settings size={14} />;
    return <FileText size={14} />;
};

export default function AuditLedger({ clientId }: { clientId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
        collection(firestore, 'audit_logs'),
        where('tenantId', '==', clientId),
        orderBy('timestamp', 'desc'),
        limit(15)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedLogs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as LogEntry[];
        setLogs(fetchedLogs);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  if (loading) return <div className="h-48 flex items-center justify-center text-slate-500 text-xs animate-pulse">טוען יומן אירועים...</div>;

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-900/60">
         <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert size={16} className="text-indigo-400" /> יומן פעילות (Live Audit)
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">תיעוד בזמן אמת לצרכי תמיכה ואבטחה</p>
         </div>
         <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">
            Last {logs.length} Events
         </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                <FileText size={32} className="mb-2" />
                <p className="text-xs">אין פעילות מתועדת לאחרונה</p>
            </div>
        ) : (
            logs.map((log) => (
                <div key={log.id} className="group flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all cursor-default border border-transparent hover:border-white/5">
                    <div className={`p-2 rounded-lg ${
                        log.status === 'failure' ? 'bg-rose-500/10 text-rose-400' : 
                        log.status === 'warning' ? 'bg-amber-500/10 text-amber-400' : 
                        'bg-indigo-500/10 text-indigo-400'
                    }`}>
                        {getIcon(log.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="text-xs font-bold text-slate-200 truncate">{log.action}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                                {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 truncate">{log.performedBy} • {log.module}</span>
                            {log.status === 'failure' && <XCircle size={10} className="text-rose-500" />}
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
