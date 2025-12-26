import React, { useState } from 'react';
import { infraLogger } from '../../../utils/infraLogger';

// הוספנו Prop חדש: onError
export const AWSConfig = ({ tenantId, onError }: { tenantId: string, onError?: (id: string) => void }) => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setStatus('testing');
    try {
      // סימולציה של הצלחה
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // כדי לבדוק שגיאה, בטל את ההערה בשורה הבאה:
      throw new Error("Invalid AWS Credentials"); 

      await infraLogger.logEvent(tenantId, 'AWS_S3', 'SUCCESS', { bucket: 'my-bucket', region: 'eu-central-1' });
      setStatus('success');
    } catch (error: any) {
      // יצירת לוג שגיאה ושמירת ה-ID שנוצר
      const docRef = await infraLogger.logEvent(tenantId, 'AWS_S3', 'ERROR', { error: error.message });
      setStatus('error');
      
      // הקפצת ה-ID למסך הראשי
      if (onError && docRef?.id) {
        onError(docRef.id);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      {/* טופס ההגדרות */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800">הגדרות חיבור ל-Amazon S3</h3>
        <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-orange-500 transition-all" placeholder="Access Key ID" />
        <input type="password" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-orange-500 transition-all" placeholder="Secret Access Key" />
        <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-orange-500 transition-all" placeholder="Bucket Name" />
        <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-orange-500 transition-all" placeholder="Region (e.g. eu-west-1)" />
        
        <button onClick={handleSave} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all">
          {status === 'testing' ? 'בודק חיבור...' : 'שמור ובצע בדיקת אימות'}
        </button>
        
        {status === 'success' && <div className="text-emerald-600 font-bold text-center">✓ החיבור אומת ותועד בלוג בהצלחה</div>}
      </div>

      {/* המדריך המובנה */}
      <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
        <h4 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
          <span>📖</span> מדריך הגדרה מהיר
        </h4>
        <ul className="space-y-4 text-sm text-orange-900">
          <li className="flex gap-3"><span className="font-bold bg-orange-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span><span>כנס ל-IAM Console ב-AWS</span></li>
          <li className="flex gap-3"><span className="font-bold bg-orange-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span><span>צור משתמש חדש עם הרשאת <b>Programmatic Access</b></span></li>
          <li className="flex gap-3"><span className="font-bold bg-orange-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span><span>הצמד את הפוליסה: <code className="bg-white px-1 rounded">AmazonS3FullAccess</code></span></li>
        </ul>
        <a href="https://console.aws.amazon.com/iam" target="_blank" className="mt-6 block text-center bg-white text-orange-700 py-2 rounded-xl font-bold text-xs border border-orange-200 hover:bg-orange-100">
          פתח את מסוף AWS &nearrow;
        </a>
      </div>
    </div>
  );
};
