import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', to: '/', icon: <HomeIcon className="w-5 h-5" /> },
  { name: 'Inspections', to: '/inspections', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
  { name: 'Clients', to: '/clients', icon: <UsersIcon className="w-5 h-5" /> },
  { name: 'Reports', to: '/reports', icon: <DocumentTextIcon className="w-5 h-5" /> },
  { name: 'Settings', to: '/settings', icon: <Cog6ToothIcon className="w-5 h-5" /> },
];

const SidebarContent: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="flex items-center gap-2 px-6 py-6 border-b">
        <div className="text-2xl font-bold text-indigo-600">SafeM</div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            to={item.to}
            key={item.name}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t bg-slate-50">
        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Organization</div>
        <div className="px-2 py-1 bg-white border rounded text-sm text-slate-700">
           Mazor Safety
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const setMobileOpen = useUIStore((s) => s.setMobileSidebarOpen);
  const mobileOpen = useUIStore((s) => s.mobileSidebarOpen);

  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:w-64 md:flex md:flex-col z-20">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 z-30 p-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md bg-white shadow-md text-slate-600"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-72 bg-white shadow-xl">
             <div className="absolute top-0 right-0 pt-2 pr-2">
               <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500">
                 <XMarkIcon className="w-6 h-6" />
               </button>
             </div>
             <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
