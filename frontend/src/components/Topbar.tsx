import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../providers/AuthProvider';

const Topbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 w-full bg-white border-b shadow-sm h-16">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="ml-12 md:ml-0">
           {/* Breadcrumbs can go here */}
           <span className="text-slate-400 text-sm">Application / Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-700">
                {user?.displayName || 'Admin User'}
              </div>
              <div className="text-xs text-slate-500">System Admin</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              {user?.displayName?.[0] || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
