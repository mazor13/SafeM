import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function ClientLayout() {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'לוח בקרה', to: '/client', end: true, icon: HomeIcon },
    { name: 'כל הבדיקות', to: '/client/inspections', icon: ClipboardDocumentCheckIcon },
    { name: 'בדיקה חדשה', to: '/client/new-inspection', icon: PlusCircleIcon },
    { name: 'הגדרות', to: '/client/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="w-64 bg-white text-gray-800 flex flex-col flex-shrink-0 border-l border-gray-200 shadow-sm z-20">
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
           <h1 className="text-xl font-bold text-indigo-600 tracking-tight">
             Client Portal
           </h1>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`ml-3 flex-shrink-0 h-6 w-6 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} aria-hidden="true" />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center mb-3">
             <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
               {user?.firstName?.[0] || 'U'}
             </div>
             <div className="mr-3 overflow-hidden">
               <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName}</p>
             </div>
          </div>
          <button onClick={() => logout()} className="w-full flex items-center text-sm text-gray-500 hover:text-red-600">
            <ArrowRightOnRectangleIcon className="h-5 w-5 ml-2" /> יציאה
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
