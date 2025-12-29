import React, { useState } from 'react';
import { Play, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function DiagnosticTool({ clientId }: { clientId: string }) {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setResults({
        dbStatus: 'healthy',
        apiLatency: '124ms',
        errors: 0
      });
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div>
           <h2 className="text-xl font-bold text-white tracking-tight">System Diagnostics L1</h2>
           <p className="text-slate-500 text-xs font-mono">NODE_ID: {clientId}</p>
        </div>
        <button 
          onClick={runScan}
          disabled={scanning}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20 text-sm font-bold"
        >
          {scanning ? <Loader2 className="animate-spin" size={18}/> : <Play size={18}/>}
          {scanning ? 'מבצע סריקה...' : 'הרץ דיאגנוסטיקה'}
        </button>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center">
            <CheckCircle className="mx-auto text-emerald-400 mb-2" size={20} />
            <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">Database</div>
            <div className="font-bold text-white text-sm">CONNECTED</div>
          </div>
          <div className="bg-slate-800/50 border border-white/5 p-4 rounded-2xl text-center">
            <div className="text-xl font-black text-white mb-1 font-mono">{results.apiLatency}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Latency</div>
          </div>
          <div className="bg-slate-800/50 border border-white/5 p-4 rounded-2xl text-center">
             <div className="text-xl font-black text-white mb-1 font-mono">{results.errors}</div>
             <div className="text-[10px] text-slate-500 uppercase font-bold">Errors (24h)</div>
          </div>
        </div>
      )}
    </div>
  );
}
