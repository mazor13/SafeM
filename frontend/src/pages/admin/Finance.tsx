import React, { useState } from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  BoltIcon, 
  ExclamationTriangleIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/react/24/solid';

export default function Finance() {
  // נתוני דמו: הכנסות חצי שנה אחורה + צפי חודש הבא
  const revenueData = [45000, 48000, 42000, 56000, 59000, 65000];
  const predictedRevenue = 72000; // תחזית AI
  
  // תובנות AI
  const aiInsights = [
    { 
      id: 1, 
      type: 'warning', 
      text: 'חברת "טבע" מאחרת בתשלום באופן קבוע ב-3 החודשים האחרונים. סיכון נטישה בינוני.',
      action: 'הפעל נוהל גבייה אוטומטי' 
    },
    { 
      id: 2, 
      type: 'success', 
      text: 'מגמת עלייה במכירת מודול "לייזר". צפי לתוספת הכנסה של 12K בחודש הבא.',
      action: 'שלח דוח למנהל מכירות' 
    }
  ];

  const transactions = [
    { id: 'INV-001', client: 'אינטל אלקטרוניקה', amount: 12500, riskScore: 5, status: 'paid', date: 'היום, 10:00' },
    { id: 'INV-002', client: 'מפעלי ים המלח', amount: 4200, riskScore: 85, status: 'overdue', date: 'אתמול' },
    { id: 'INV-003', client: 'אלביט מערכות', amount: 28000, riskScore: 12, status: 'pending', date: '22/10/2025' },
    { id: 'INV-004', client: 'בית חולים רמב"ם', amount: 6400, riskScore: 30, status: 'paid', date: '20/10/2025' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen">
      
      {/* Header With AI Badge */}
      <div className="flex justify-between items-end">
        <div>
           <div className="flex items-center space-x-2 space-x-reverse mb-1">
              <h1 className="text-3xl font-bold text-gray-900">פיננסים ובקרה</h1>
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center shadow-sm">
                <SparklesIcon className="h-3 w-3 ml-1" /> AI Powered
              </span>
           </div>
           <p className="text-gray-500">מערכת חיזוי פיננסי וניהול תזרים הכנסות (Revenue Intelligence).</p>
        </div>
        <div className="text-left">
           <p className="text-sm text-gray-400">הכנסה חודשית נוכחית (MRR)</p>
           <p className="text-3xl font-mono font-bold text-gray-900">₪65,000</p>
        </div>
      </div>

      {/* Top Section: The Graph & The Brain */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Revenue Graph (Visual Intelligence) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-800 flex items-center">
               <ArrowTrendingUpIcon className="h-5 w-5 ml-2 text-indigo-500"/> מגמת הכנסות ותחזית
             </h3>
             <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">+15% צמיחה חזויה</span>
           </div>
           
           {/* Custom SVG Graph */}
           <div className="h-64 w-full flex items-end justify-between px-2 space-x-2 space-x-reverse">
              {revenueData.map((val, i) => {
                 const height = (val / 80000) * 100;
                 return (
                   <div key={i} className="w-full flex flex-col justify-end items-center group">
                      <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 mb-1 transition-opacity">₪{val/1000}k</div>
                      <div 
                        className="w-full bg-indigo-500 rounded-t-md opacity-80 hover:opacity-100 transition-all duration-500 relative" 
                        style={{ height: `${height}%` }}
                      >
                         <div className="absolute top-0 w-full h-1 bg-indigo-400/50"></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400 font-mono">H-{i+1}</div>
                   </div>
                 )
              })}
              {/* Prediction Column */}
              <div className="w-full flex flex-col justify-end items-center group">
                 <div className="text-xs text-purple-500 font-bold mb-1">AI ₪{predictedRevenue/1000}k</div>
                 <div 
                    className="w-full bg-gray-100 rounded-t-md relative border-2 border-dashed border-purple-400" 
                    style={{ height: `${(predictedRevenue / 80000) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-purple-50 opacity-50 animate-pulse"></div>
                  </div>
                 <div className="mt-2 text-xs text-purple-600 font-bold">צפי</div>
              </div>
           </div>
        </div>

        {/* 2. AI Insights (The Brain) */}
        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
           
           <h3 className="font-bold text-lg mb-4 flex items-center relative z-10">
             <BoltIcon className="h-5 w-5 ml-2 text-yellow-400"/> תובנות עסקיות
           </h3>
           
           <div className="space-y-4 relative z-10">
             {aiInsights.map(insight => (
               <div key={insight.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="flex items-start">
                    {insight.type === 'warning' ? (
                       <ExclamationTriangleIcon className="h-5 w-5 text-orange-400 flex-shrink-0 ml-3 mt-0.5" />
                    ) : (
                       <CheckBadgeIcon className="h-5 w-5 text-green-400 flex-shrink-0 ml-3 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium leading-snug opacity-90">{insight.text}</p>
                      <button className="mt-3 text-xs bg-white text-gray-900 px-3 py-1.5 rounded shadow-sm hover:bg-gray-100 font-bold transition-transform active:scale-95">
                        {insight.action}
                      </button>
                    </div>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Bottom Section: Intelligent Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">ניתוח סיכונים ותשלומים אחרונים</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">צפה בהכל &larr;</button>
         </div>
         <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
               <tr>
                 <th className="px-6 py-3 text-right">לקוח</th>
                 <th className="px-6 py-3 text-right">סכום</th>
                 <th className="px-6 py-3 text-right">AI Risk Score</th>
                 <th className="px-6 py-3 text-right">סטטוס</th>
                 <th className="px-6 py-3 text-right">מועד</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {transactions.map(tx => (
                 <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="font-bold text-gray-900">{tx.client}</div>
                       <div className="text-xs text-gray-400 font-mono">{tx.id}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">₪{tx.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                       {/* Risk Bar */}
                       <div className="flex items-center">
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full mr-2 overflow-hidden">
                             <div 
                               className={`h-full rounded-full ${
                                  tx.riskScore > 50 ? 'bg-red-500' : 
                                  tx.riskScore > 20 ? 'bg-orange-400' : 'bg-green-500'
                               }`} 
                               style={{ width: `${tx.riskScore}%` }}
                             ></div>
                          </div>
                          <span className={`text-xs font-bold ${
                              tx.riskScore > 50 ? 'text-red-600' : 'text-gray-500'
                          }`}>{tx.riskScore}%</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-100' :
                          tx.status === 'overdue' ? 'bg-red-50 text-red-700 border border-red-100' :
                          'bg-yellow-50 text-yellow-700 border border-yellow-100'
                       }`}>
                          {tx.status === 'paid' && <CheckBadgeIcon className="h-3 w-3 ml-1"/>}
                          {tx.status === 'overdue' && <ExclamationTriangleIcon className="h-3 w-3 ml-1"/>}
                          {tx.status === 'pending' && <ClockIcon className="h-3 w-3 ml-1"/>}
                          {tx.status === 'paid' ? 'שולם' : tx.status === 'overdue' ? 'בפיגור' : 'ממתין'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
