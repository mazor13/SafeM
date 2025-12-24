import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  BanknotesIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'מגדל פיקוח', to: '/admin', end: true, icon: HomeIcon },
    { name: 'Cortex BI', to: '/admin/analytics', icon: CpuChipIcon },
    { name: 'פיננסים', to: '/admin/finance', icon: BanknotesIcon },
    { name: 'לקוחות', to: '/admin/clients', icon: UsersIcon },
    { name: 'מוצרים', to: '/admin/products', icon: CubeIcon },
    { name: 'הגדרות', to: '/admin/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Dark Admin Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col flex-shrink-0 transition-all duration-300 shadow-xl z-20">
        <div className="h-16 flex items-center justify-center bg-indigo-950 shadow-md border-b border-indigo-800">
           <h1 className="text-xl font-bold tracking-wider flex items-center">
             <CpuChipIcon className="h-6 w-6 ml-2 text-cyan-400" />
             AEGIS Admin
           </h1>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-700 text-white shadow-lg border-r-4 border-cyan-400'
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`
              }
            >
              <item.icon className="ml-3 flex-shrink-0 h-6 w-6 text-indigo-300 group-hover:text-white" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 bg-indigo-950 border-t border-indigo-800">
          <div className="flex items-center mb-3">
             <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold ring-2 ring-indigo-400/30">
               {user?.firstName?.[0] || 'A'}
             </div>
             <div className="mr-3">
               <p className="text-sm font-medium">{user?.firstName}</p>
               <p className="text-xs text-indigo-300 opacity-80">Super Admin</p>
             </div>
          </div>
          <button onClick={() => logout()} className="w-full flex items-center text-sm text-indigo-200 hover:text-white hover:bg-indigo-800/50 p-2 rounded transition-colors">
            <ArrowRightOnRectangleIcon className="h-5 w-5 ml-2" /> התנתק
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        <Outlet />
      </main>
    </div>
  );
}
