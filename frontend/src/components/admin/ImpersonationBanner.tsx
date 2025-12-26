import React from 'react';
import { securityService } from '../../utils/securityService';

export default function ImpersonationBanner() {
  const isImpersonating = localStorage.getItem('is_impersonating') === 'true';
  const tenantId = localStorage.getItem('impersonated_tenant_id');

  if (!isImpersonating) return null;

  return (
    <div className="bg-red-600 text-white p-2 text-center text-xs font-bold fixed top-0 left-0 w-full z-[9999] shadow-lg animate-pulse">
      ⚠️ מצב התחזות פעיל: אתה צופה בנתוני לקוח ({tenantId}). כל פעולה מתועדת ב-Audit Log.
      <button 
        onClick={() => securityService.stopImpersonation()}
        className="mr-4 underline hover:text-gray-200"
      >
        [סיים התחזות וחזור ל-Admin]
      </button>
    </div>
  );
}
