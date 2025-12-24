import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState('');

  const templates = [
    { id: '1', title: 'בדיקת בטיחות אש שנתית', category: 'safety', itemsCount: 12, lastUpdated: '10/12/2024' },
    { id: '2', title: 'ביקורת ציוד מגן אישי (PPE)', category: 'audit', itemsCount: 5, lastUpdated: '15/12/2024' },
    { id: '3', title: 'בדיקת תקינות גנרטור חירום', category: 'maintenance', itemsCount: 8, lastUpdated: '20/12/2024' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול תבניות וטפסים</h1>
          <p className="text-gray-500 mt-1">כאן יוצרים ומנהלים את סטנדרט הבדיקות של המערכת.</p>
        </div>
        <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-all">
          <PlusIcon className="h-5 w-5 ml-2" />
          תבנית חדשה
        </button>
      </div>

      <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" />
          <input 
            type="text" 
            placeholder="חיפוש תבנית..." 
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
          <FunnelIcon className="h-5 w-5 ml-2 text-gray-500" />
          סינון
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                  <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${template.category === 'safety' ? 'bg-red-100 text-red-700' : 
                    template.category === 'maintenance' ? 'bg-blue-100 text-blue-700' : 
                    'bg-gray-100 text-gray-700'}`}>
                  {template.category === 'safety' ? 'בטיחות' : 
                   template.category === 'maintenance' ? 'תחזוקה' : 'ביקורת'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{template.title}</h3>
              
              <div className="flex items-center text-sm text-gray-500 space-x-4 space-x-reverse">
                <span>{template.itemsCount} שאלות</span>
                <span>•</span>
                <span>עודכן ב-{template.lastUpdated}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">ערוך תבנית &larr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
