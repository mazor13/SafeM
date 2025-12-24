import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase'; // תיקון נתיב
import { 
  PaperAirplaneIcon, 
  SparklesIcon, 
  BoltIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/solid';

export default function SuperAdminDashboard() {
  const [input, setInput] = useState('');
  const [clientsCount, setClientsCount] = useState(0);
  const navigate = useNavigate();

  const insights = [
    { type: 'critical', text: '3 רישיונות פגים בעוד 48 שעות (טבע, אינטל, אלביט).', action: 'שלח תזכורת חידוש' },
    { type: 'growth', text: 'ביקוש למודול "לייזר" עלה ב-15% השבוע. הזדמנות ל-Upsell.', action: 'הצג לקוחות פוטנציאליים' },
    { type: 'alert', text: 'דפוס חריג: 5 לקוחות דיווחו על אותה תקלה במודול הציוד.', action: 'פתח דוח שגיאות' },
  ];

  useEffect(() => {
    getDocs(collection(firestore, 'clients')).then(snap => setClientsCount(snap.size));
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.includes('לקוח') || input.includes('client')) navigate('/admin/clients');
    if (input.includes('מוצר') || input.includes('product')) navigate('/admin/products');
    setInput('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 p-6">
      
      {/* 1. Hero Section */}
      <div className="text-center space-y-6 pt-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4 ring-4 ring-indigo-50">
          <SparklesIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          בוקר טוב, המערכת מוכנה.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          אני מנטר כרגע {clientsCount} ארגונים פעילים. זיהיתי מספר נושאים שדורשים את תשומת ליבך.
        </p>

        {/* 2. The Omnibox (AI Input) */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <form onSubmit={handleCommand} className="relative">
            <input
              type="text"
              dir="rtl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="בקש מהמערכת לעשות משהו... (למשל: 'הקם לקוח חדש')"
              className="block w-full p-5 pl-14 pr-6 text-lg rounded-lg border-none shadow-2xl focus:ring-2 focus:ring-indigo-500 bg-white placeholder-gray-400 text-gray-900"
            />
            <button type="submit" className="absolute left-3 top-3 p-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors">
              <PaperAirplaneIcon className="h-5 w-5 transform rotate-180" />
            </button>
          </form>
          
          <div className="flex justify-center gap-3 mt-4 text-sm">
            <span onClick={() => navigate('/admin/clients')} className="cursor-pointer px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors">➕ הקמת לקוח</span>
            <span onClick={() => navigate('/admin/products')} className="cursor-pointer px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors">📦 מוצרים</span>
            <span onClick={() => navigate('/admin/analytics')} className="cursor-pointer px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors">📊 דוחות</span>
          </div>
        </div>
      </div>

      {/* 3. The Insight Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BoltIcon className="h-5 w-5 ml-2 text-yellow-500"/> תובנות ופעולות מומלצות
          </h3>
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-start">
                <div className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${
                  insight.type === 'critical' ? 'bg-red-500' : 
                  insight.type === 'growth' ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
                <div className="mr-4 flex-1">
                  <p className="text-gray-800 text-sm font-medium leading-snug">{insight.text}</p>
                  <button className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                    {insight.action} &larr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Live System Pulse */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 ml-2 text-green-500"/> דופק מערכת (Live)
          </h3>
          <div className="bg-gray-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
             
             <div className="relative z-10 space-y-6">
               <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                 <span className="text-gray-400 text-sm">לקוחות אונליין</span>
                 <span className="text-3xl font-mono font-bold text-green-400">24</span>
               </div>
               <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                 <span className="text-gray-400 text-sm">ניצולת שרתים</span>
                 <span className="text-3xl font-mono font-bold text-blue-400">12%</span>
               </div>
               <div className="flex justify-between items-end">
                 <span className="text-gray-400 text-sm">שאילתות AI היום</span>
                 <span className="text-3xl font-mono font-bold text-purple-400">843</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
