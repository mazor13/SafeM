import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { ClientProvider, useClient } from '../../providers/ClientProvider';
import { SystemProvider } from '../../providers/SystemProvider';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentCheckIcon, 
  DocumentTextIcon,
  UsersIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const DashboardContent = () => {
  const { client, loading, error } = useClient();

  if (loading) return <div className="p-8 text-center text-gray-500">טוען נתוני לקוח...</div>;
  if (error || !client) return <div className="p-8 text-center text-red-500">שגיאה: {error}</div>;

  const showPersonnel = !client.contractDetails?.activeModules || client.contractDetails.activeModules.includes('training');

  const navigation = [
    { name: 'סקירה כללית', href: '.', icon: HomeIcon, end: true },
    { name: 'מתחמים', href: 'facilities', icon: BuildingOfficeIcon, end: false },
    { name: 'ציוד ונכסים', href: 'equipment', icon: WrenchScrewdriverIcon, end: false },
    { name: 'בדיקות', href: 'inspections', icon: ClipboardDocumentCheckIcon, end: false },
    { name: 'מסמכים', href: 'documents', icon: DocumentTextIcon, end: false },
    ...(showPersonnel ? [{ name: 'עובדים והדרכות', href: 'personnel', icon: UsersIcon, end: false }] : []),
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-100">
          <Link to="/admin/clients" className="text-xs text-indigo-600 flex items-center mb-2 hover:underline">
            <ArrowLeftIcon className="h-3 w-3 ml-1" />
            חזרה לרשימת הלקוחות
          </Link>
          <h2 className="font-bold text-gray-900 truncate" title={client.name}>
            {client.name}
          </h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
            {client.contractDetails?.status === 'active' ? 'פעיל' : 'לא פעיל'}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="ml-3 flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default function ClientDashboardLayout() {
  return (
    <SystemProvider>
      <ClientProvider>
        <DashboardContent />
      </ClientProvider>
    </SystemProvider>
  );
}
