import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ClientProvider, useClient } from '../../providers/ClientProvider';
import { SystemProvider } from '../../providers/SystemProvider';
import { useAuth } from '../../providers/AuthProvider';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentCheckIcon, 
  DocumentTextIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const DashboardContent = () => {
  const { client, loading, error } = useClient();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col hidden md:flex">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200 bg-indigo-600">
          <h1 className="text-xl font-bold text-white">AEGIS</h1>
          <p className="text-xs text-indigo-200">Client Portal</p>
        </div>

        {/* Client Info */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 truncate" title={client.name}>
            {client.name}
          </h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
            {client.contractDetails?.status === 'active' ? 'פעיל' : 'לא פעיל'}
          </span>
        </div>

        {/* Navigation */}
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

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <UserCircleIcon className="h-8 w-8 text-gray-400 ml-2" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 ml-2" />
            התנתק
          </button>
        </div>
      </div>

      {/* Main Content */}
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
