import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase';

export default function AuditLedger() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(firestore, 'admin_audit_logs'), orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div className="p-8 text-right" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">יומן פעולות מערכת (Audit Trail)</h1>
      <div className="bg-white shadow-sm border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">זמן</th>
              <th className="p-4">פעולה</th>
              <th className="p-4">מבצע</th>
              <th className="p-4">פרטים</th>
              <th className="p-4">חומרה</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-xs text-gray-400">
                  {log.timestamp?.toDate().toLocaleString()}
                </td>
                <td className="p-4 font-bold">{log.action}</td>
                <td className="p-4">{log.actorId}</td>
                <td className="p-4 text-xs text-gray-500">{JSON.stringify(log.details)}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    log.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {log.severity}
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
