import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function BrandingSettings() {
  // --- States ---
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [domain, setDomain] = useState('');
  const [dnsStatus, setDnsStatus] = useState<'idle' | 'searching' | 'propagating' | 'active'>('idle');
  const [showGuide, setShowGuide] = useState(false);

  // --- Logic ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setLogoUrl(localUrl);
    setIsUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `logos/company_logo_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const publicUrl = await getDownloadURL(storageRef);
      setLogoUrl(publicUrl);
    } catch (err) {
      console.error(err);
      alert("שגיאה בהעלאה");
    } finally {
      setIsUploading(false);
    }
  };

  const checkDNS = () => {
    if (!domain.includes('.')) {
        alert("נא להזין כתובת דומיין תקינה");
        return;
    }
    setDnsStatus('searching');
    setTimeout(() => {
        setDnsStatus('propagating');
        setTimeout(() => {
            setDnsStatus('active');
        }, 2500);
    }, 2000);
  };

  const getHostName = () => {
    if (!domain) return 'www / subdomain';
    const parts = domain.split('.');
    if (parts.length > 2) return parts[0];
    return '@';
  };

  return (
    <div className="p-8 text-right bg-slate-50 min-h-screen font-sans" dir="rtl">
      
      {/* --- Modal המדריך --- */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
                <div className="bg-slate-900 p-5 flex justify-between items-center text-white shrink-0">
                    <h3 className="text-xl font-bold flex items-center gap-2">🎓 מדריך: בחירת כתובת למערכת</h3>
                    <button onClick={() => setShowGuide(false)} className="hover:bg-white/20 p-2 rounded-full transition-all">✕</button>
                </div>
                
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* אפשרות 1: בסיסית */}
                    <div className="border-2 border-slate-100 rounded-2xl p-5 hover:border-slate-300 transition-all bg-slate-50 flex flex-col h-full">
                        <div className="bg-slate-200 w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3">🏠</div>
                        <h4 className="font-bold text-lg text-slate-800 mb-2">אפשרות א': כתובת ברירת מחדל</h4>
                        <div className="inline-block bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-mono mb-3 self-start">company.aegis.app</div>
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed flex-grow">
                            מתאים למי שרוצה להתחיל לעבוד מיד, ללא צורך בהגדרות טכניות. הכתובת ניתנת לך בחינם כחלק מהחבילה.
                        </p>
                        <ul className="text-sm space-y-2 text-slate-700 mt-auto">
                            <li className="flex gap-2"><span>✅</span> <span>ללא עלות נוספת</span></li>
                            <li className="flex gap-2"><span>✅</span> <span>מוכן מיידית לשימוש</span></li>
                            <li className="flex gap-2"><span>✅</span> <span>אין צורך באיש IT</span></li>
                        </ul>
                    </div>

                    {/* אפשרות 2: מתקדמת (התיקון: צמצום רווחים - Compact Layout) */}
                    <div className="border-2 border-indigo-100 rounded-2xl p-5 hover:border-indigo-300 transition-all bg-indigo-50 relative overflow-hidden h-auto flex flex-col min-h-full">
                        <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl z-10">מומלץ למיתוג</div>
                        
                        {/* הקטנת אייקון ומרווח תחתון */}
                        <div className="bg-indigo-200 w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3">🌐</div>
                        
                        <h4 className="font-bold text-lg text-indigo-900 mb-2">אפשרות ב': דומיין פרטי</h4>
                        
                        {/* צמצום מרווח סביב הדוגמא */}
                        <div className="inline-block bg-white text-indigo-600 border border-indigo-200 px-2 py-1 rounded text-xs font-mono mb-3 self-start">safety.your-company.com</div>
                        
                        <p className="text-sm text-indigo-800 mb-3 leading-snug">
                            מתאים לארגונים שרוצים שהמערכת תראה "שלהם". דורש גישה לניהול הדומיין של החברה.
                        </p>
                        
                        {/* תיבת שלבים מהודקת יותר */}
                        <div className="bg-white rounded-xl p-3 border border-indigo-100 text-xs space-y-2 flex-grow">
                            <p className="font-bold text-indigo-900 border-b border-indigo-50 pb-1">📋 שלבי הביצוע:</p>
                            <ol className="space-y-1 text-indigo-800 list-decimal list-inside pb-1 leading-tight">
                                <li>הזן את הכתובת הרצויה בשדה השמאלי.</li>
                                <li>העתק את הנתונים מהטבלה השחורה.</li>
                                <li>צור רשומת <b>CNAME</b> אצל ספק הדומיין.</li>
                                <li>חזור לכאן ולחץ על "אמת הגדרות".</li>
                            </ol>
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-4 text-center border-t border-slate-200 shrink-0">
                    <button onClick={() => setShowGuide(false)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">הבנתי, תודה</button>
                </div>
            </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-800 italic">
              White Label <span className="text-indigo-600">Suite</span>
            </h2>
            <div className="flex items-center gap-4 mt-2">
                <p className="text-slate-500">התאמה אישית של המערכת ללקוח (Branding & Domain)</p>
                <button 
                    onClick={() => setShowGuide(true)}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-all animate-bounce-subtle"
                >
                    <span>💡</span> איך זה עובד? מדריך מהיר
                </button>
            </div>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>AEGIS Core:</span>
            <span className="text-emerald-500 flex items-center gap-1">Online ●</span>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* כרטיס דומיין */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col h-full relative overflow-hidden group">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">🌐</span> חיבור דומיין פרטי
            </h3>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">כתובת רצויה (Subdomain)</label>
                <div className="flex bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden focus-within:ring-2 ring-indigo-100 transition-all">
                  <input 
                    value={domain}
                    onChange={(e) => {
                        setDomain(e.target.value);
                        setDnsStatus('idle');
                    }}
                    placeholder="safety.client-site.com" 
                    className="flex-1 bg-transparent p-4 outline-none text-left font-mono text-sm text-slate-700 font-bold"
                    dir="ltr"
                  />
                  <div className="bg-slate-100 px-4 flex items-center border-r border-slate-200 text-slate-400 text-xs font-bold">HTTPS</div>
                </div>
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden">
                {dnsStatus === 'active' && (
                    <div className="absolute inset-0 bg-emerald-500/95 flex flex-col items-center justify-center text-white z-10 animate-fadeIn">
                        <div className="text-5xl mb-2">✓</div>
                        <h4 className="font-bold text-xl">החיבור פעיל ומאובטח!</h4>
                    </div>
                )}

                <h4 className="font-bold text-indigo-900 text-sm mb-4 flex items-center gap-2">
                    🛠️ הגדרות DNS (להעברה ל-IT)
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                    <span className="block text-slate-400 mb-1 uppercase text-[10px] font-bold">Type</span>
                    <span className="font-mono font-bold text-slate-700 text-base">CNAME</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                    <span className="block text-slate-400 mb-1 uppercase text-[10px] font-bold">TTL</span>
                    <span className="font-mono font-bold text-slate-700 text-base">1H</span>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 col-span-1 shadow-sm relative group cursor-help">
                    <span className="block text-yellow-700 mb-1 uppercase text-[10px] font-bold">Host ⓘ</span>
                    <span className="font-mono font-black text-slate-800 text-lg break-all">{getHostName()}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 col-span-1 shadow-sm">
                    <span className="block text-slate-400 mb-1 uppercase text-[10px] font-bold">Target</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm break-all">ingress.aegis.app</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={checkDNS}
                disabled={dnsStatus === 'active'}
                className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-3
                  ${dnsStatus === 'idle' ? 'bg-slate-900 text-white hover:bg-slate-800' : ''}
                  ${dnsStatus === 'searching' ? 'bg-indigo-600 text-white cursor-wait' : ''}
                  ${dnsStatus === 'propagating' ? 'bg-amber-500 text-white cursor-wait' : ''}
                  ${dnsStatus === 'active' ? 'bg-emerald-500 text-white' : ''}
                `}
              >
                {dnsStatus === 'idle' && 'אמת הגדרות דומיין'}
                {dnsStatus === 'searching' && 'בודק...'}
                {dnsStatus === 'propagating' && 'מאמת...'}
                {dnsStatus === 'active' && 'מחובר ✔'}
              </button>
            </div>
          </div>

          {/* כרטיס מיתוג */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="bg-pink-100 p-2 rounded-lg text-pink-600">🎨</span> נראות המערכת
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">צבע מותג ראשי</label>
                <div className="flex gap-4 items-center">
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-16 h-16 rounded-2xl cursor-pointer" />
                  <div className="text-xs text-slate-500">הצבע ישפיע על כל האלמנטים באפליקציה.</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">לוגו לקוח</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50 h-40 flex flex-col items-center justify-center">
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  {logoUrl ? <img src={logoUrl} className="max-h-full max-w-full object-contain" /> : <span className="text-slate-400 text-sm">לחץ להעלאת לוגו</span>}
                </div>
              </div>

              {/* Preview Phone */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold text-center mb-4">תצוגה מקדימה לנייד</p>
                <div className="bg-slate-900 w-48 mx-auto h-[300px] rounded-[2rem] border-[4px] border-slate-800 overflow-hidden flex flex-col relative">
                  <div style={{ backgroundColor: primaryColor }} className="h-16 w-full flex items-end justify-center pb-2 px-4">
                     {logoUrl ? <img src={logoUrl} className="h-6 object-contain brightness-0 invert" /> : <span className="text-white text-xs font-bold">AEGIS</span>}
                  </div>
                  <div className="bg-slate-50 flex-1 p-3 space-y-2">
                    <div className="h-16 w-full bg-white rounded-xl shadow-sm"></div>
                    <div style={{ backgroundColor: primaryColor }} className="h-8 w-full rounded-lg mt-2 opacity-90"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
