import React, { useState } from 'react';
import { 
  ArrowDownTrayIcon, 
  AdjustmentsHorizontalIcon,
  PresentationChartLineIcon,
  MagnifyingGlassIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

export default function Analytics() {
  const [reportType, setReportType] = useState('safety');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  // נתוני דמו לגרף
  const technicalStats = [
    { label: 'כשל ציוד', value: 35, color: 'bg-red-500' },
    { label: 'טעות אנוש', value: 45, color: 'bg-orange-500' },
    { label: 'חריגת תקן', value: 15, color: 'bg-yellow-500' },
    { label: 'אחר', value: 5, color: 'bg-gray-400' },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('הדוח הוכן בהצלחה! יורד למחשב כ-PDF...');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      
      {/* 1. AI Cortex Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center mb-2">
            <CpuChipIcon className="h-8 w-8 ml-3 text-cyan-400" />
            Cortex Analytics Engine
          </h1>
          <p className="text-indigo-200 mb-6 max-w-2xl">
            מנוע BI וניתוח נתונים מתקדם. שאל את המערכת שאלה או בנה דוח מותאם אישית.
          </p>

          {/* AI Query Box */}
          <div className="relative max-w-3xl">
            <input 
              type="text" 
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="נסה לשאול: 'השווה בין תקלות בטיחות במפעל צפון מול דרום בחודש האחרון'..." 
              className="w-full bg-white/10 border border-indigo-400/30 rounded-lg py-4 px-12 text-white placeholder-indigo-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-md"
            />
            <MagnifyingGlassIcon className="absolute right-4 top-4 h-6 w-6 text-indigo-300" />
            <button className="absolute left-2 top-2 bg-cyan-500 hover:bg-cyan-400 text-indigo-900 font-bold py-2 px-4 rounded-md transition-colors text-sm">
              נתח
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Report Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <h3 className="font-bold text-gray-900 flex items-center">
            <AdjustmentsHorizontalIcon className="h-5 w-5 ml-2 text-gray-500"/> הגדרות דוח
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג הדוח</label>
            <div className="grid grid-cols-3 gap-2">
              {['safety', 'tech', 'finance'].map(type => (
                <button 
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-2 py-2 text-xs font-bold rounded border ${
                    reportType === type 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type === 'safety' ? 'בטיחות' : type === 'tech' ? 'טכני' : 'כספי'}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full flex justify-center items-center bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            {isGenerating ? <span className="animate-pulse">מעבד...</span> : <><ArrowDownTrayIcon className="h-5 w-5 ml-2" /> חולל דוח PDF</>}
          </button>
        </div>

        {/* Right: Visualization & Heatmap */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-900 flex items-center">
               <PresentationChartLineIcon className="h-5 w-5 ml-2 text-indigo-500"/> תצוגה מקדימה (Live Data)
             </h3>
             <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-bold">Live</span>
          </div>

          {/* Technical Breakdown */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-500 mb-4">פילוח תקלות טכניות</h4>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
              {technicalStats.map((stat, idx) => (
                <div key={idx} className={`h-full ${stat.color}`} style={{ width: `${stat.value}%` }} title={stat.label}></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
               {technicalStats.map((stat, idx) => (
                 <div key={idx} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${stat.color} ml-1`}></div>
                    {stat.label} ({stat.value}%)
                 </div>
               ))}
            </div>
          </div>

          {/* Heatmap */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">מפת חום: עומס אירועים חודשי</h4>
            <div className="grid grid-cols-7 gap-1">
               {Array.from({ length: 28 }).map((_, i) => {
                 const intensity = Math.random();
                 let bg = 'bg-gray-50';
                 if (intensity > 0.8) bg = 'bg-indigo-600';
                 else if (intensity > 0.6) bg = 'bg-indigo-400';
                 else if (intensity > 0.3) bg = 'bg-indigo-200';
                 return (
                   <div key={i} className={`h-8 rounded-sm ${bg} hover:ring-2 ring-offset-1 ring-indigo-500 transition-all cursor-pointer`} title="לחץ לפרטים"></div>
                 )
               })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
