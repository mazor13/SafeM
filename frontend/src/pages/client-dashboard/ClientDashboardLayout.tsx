import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ClientProvider, useClient } from '../../providers/ClientProvider';
import { SystemProvider } from '../../providers/SystemProvider';
import { ThemeProvider, useTheme } from '../../providers/ThemeProvider';
import { RoleProvider, useRole } from '../../providers/RoleProvider';
import { useAuth } from '../../providers/AuthProvider';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore as db } from '../../firebase';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentCheckIcon, 
  DocumentTextIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'dark', label: 'כהה', icon: MoonIcon },
    { id: 'light', label: 'בהיר', icon: SunIcon },
    { id: 'system', label: 'מערכת', icon: ComputerDesktopIcon },
  ] as const;

  return (
    <div className="flex items-center justify-center gap-1 p-1 rounded-lg bg-gray-200 dark:bg-slate-700">
      {themes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`p-2 rounded-md transition-all ${
            theme === id
              ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};

const DashboardContent = () => {
  const { client, loading, error } = useClient();
  const { user, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  const { isConsultant, isClient, role } = useRole();
  const navigate = useNavigate();
  
  const [alertCount, setAlertCount] = useState<number>(0);

  // Fetch findings that need attention (rejected or open)
  useEffect(() => {
    const fetchAlertCount = async () => {
      if (!client?.id) return;
      try {
        const findingsRef = collection(db, 'clients', client.id, 'findings');
        const q = query(findingsRef, where('status', 'in', ['rejected', 'open']));
        const snapshot = await getDocs(q);
        setAlertCount(snapshot.size);
      } catch (err) {
        console.error('Error fetching alert count:', err);
      }
    };
    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 60000);
    return () => clearInterval(interval);
  }, [client?.id]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">טוען נתוני לקוח...</div>;
  if (error || !client) return <div className="p-8 text-center text-red-500">שגיאה: {error}</div>;

  const showPersonnel = !client.contractDetails?.activeModules || client.contractDetails.activeModules.includes('training');

  const navigation = [
    { name: 'סקירה כללית', href: '.', icon: HomeIcon, end: true },
    { name: 'מתחמים', href: 'facilities', icon: BuildingOfficeIcon, end: false },
    { name: 'ציוד ונכסים', href: 'equipment', icon: WrenchScrewdriverIcon, end: false },
    { name: 'בדיקות', href: 'inspections', icon: ClipboardDocumentCheckIcon, end: false },
    { name: 'ממצאים', href: 'findings', icon: ExclamationTriangleIcon, end: false },
    { name: 'מסמכים', href: 'documents', icon: DocumentTextIcon, end: false },
    ...(showPersonnel ? [{ name: 'עובדים והדרכות', href: 'personnel', icon: UsersIcon, end: false }] : []),
  ];

  // תצוגת תפקיד
  const getRoleDisplay = () => {
    if (isConsultant) return { label: 'יועץ', color: 'bg-purple-100 text-purple-800' };
    if (isClient) return { label: 'לקוח', color: 'bg-blue-100 text-blue-800' };
    return { label: role || 'משתמש', color: 'bg-gray-100 text-gray-800' };
  };
  const roleDisplay = getRoleDisplay();

  return (
    <div className={`flex h-screen ${resolvedTheme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`w-64 flex flex-col hidden md:flex ${
        resolvedTheme === 'dark' 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      } border-l`}>
        {/* Logo/Brand */}
        <div className="p-4 border-b border-slate-700 bg-indigo-600">
          <h1 className="text-xl font-bold text-white">AEGIS</h1>
          <p className="text-xs text-indigo-200">Client Portal</p>
        </div>

        {/* Client Info */}
        <div className={`p-4 border-b ${resolvedTheme === 'dark' ? 'border-slate-700' : 'border-gray-100'}`}>
          <h2 className={`font-bold truncate ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`} title={client.name}>
            {client.name}
          </h2>
          <div className="flex gap-2 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              {client.contractDetails?.status === 'active' ? 'פעיל' : 'לא פעיל'}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${roleDisplay.color}`}>
              {roleDisplay.label}
            </span>
          </div>
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
                    ? resolvedTheme === 'dark'
                      ? 'bg-slate-700 text-indigo-400'
                      : 'bg-indigo-50 text-indigo-700'
                    : resolvedTheme === 'dark'
                      ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className={`ml-3 flex-shrink-0 h-5 w-5 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Theme Switcher */}
        <div className={`p-4 border-t ${resolvedTheme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <p className={`text-xs mb-2 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>ערכת נושא</p>
          <ThemeSwitcher />
        </div>

        {/* User Info & Logout */}
        <div className={`p-4 border-t ${resolvedTheme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center mb-3">
            <UserCircleIcon className={`h-8 w-8 ml-2 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-400 bg-red-900/20 rounded-md hover:bg-red-900/30 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 ml-2" />
            התנתק
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${resolvedTheme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {/* Top Header Bar with Bell */}
        <div className={`sticky top-0 z-10 px-6 py-3 flex justify-end items-center border-b ${
          resolvedTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => navigate('findings')}
            className={`relative p-2 rounded-lg transition-colors ${
              resolvedTheme === 'dark' 
                ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="ממצאים לטיפול"
          >
            <BellIcon className="h-5 w-5" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                {alertCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default function ClientDashboardLayout() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <SystemProvider>
          <ClientProvider>
            <DashboardContent />
          </ClientProvider>
        </SystemProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}
