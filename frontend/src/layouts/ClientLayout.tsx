import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function ClientLayout() {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'דאשבורד', to: '/client', end: true, icon: HomeIcon },
    { name: 'הבדיקות שלי', to: '/client/inspections', icon: ClipboardDocumentCheckIcon },
    { name: 'ניהול ידע (תבניות)', to: '/client/templates', icon: DocumentDuplicateIcon }, // הגישה החדשה
    { name: 'צוות עובדים', to: '/client/personnel', icon: UserGroupIcon },
    { name: 'לומדות והדרכות', to: '/client/training', icon: AcademicCapIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <span className="text-xl font-bold text-indigo-600 tracking-tight text-right w-full">PORTAL</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="ml-3 h-6 w-6" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center mb-4 px-2">
             <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
               {user?.firstName?.[0]}
             </div>
             <div className="mr-3">
               <p className="text-xs font-bold text-gray-900">{user?.firstName}</p>
               <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user?.role}</p>
             </div>
          </div>
          <button onClick={() => logout()} className="w-full flex items-center text-xs text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
            <ArrowRightOnRectangleIcon className="h-4 w-4 ml-2" /> התנתק
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        <Outlet />
      </main>
    </div>
  );
}
