import React, { useEffect, useState } from 'react';
import { checkUserQuota, QuotaStatus } from '../../utils/quotaService';

export default function QuotaDisplay({ tenantId }: { tenantId: string }) {
  const [status, setStatus] = useState<QuotaStatus | null>(null);

  useEffect(() => {
    checkUserQuota(tenantId).then(setStatus);
  }, [tenantId]);

  if (!status) return <div>טוען נתוני ניצול...</div>;

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm mt-4 text-right" dir="rtl">
      <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">ניצול משאבים (משתמשים)</h3>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${status.usagePercent > 90 ? 'bg-red-500' : 'bg-indigo-600'}`}
            style={{ width: `${Math.min(status.usagePercent, 100)}%` }}
          ></div>
        </div>
        <span className="text-sm font-bold text-gray-700">{status.current} / {status.limit}</span>
      </div>
      {status.usagePercent >= 90 && (
        <p className="text-red-500 text-[10px] font-bold mt-1 animate-pulse">
          ⚠️ חריגה קרובה! יש לשקול שדרוג חבילה.
        </p>
      )}
    </div>
  );
}
