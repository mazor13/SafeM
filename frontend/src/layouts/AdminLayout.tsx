import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import {
  Home,
  LayoutDashboard,
  Users,
  Package,
  Settings,
  FileText,
  CreditCard,
  LogOut,
  Shield,
  UserPlus,
  Target,
  Building2,
  Activity,
  ClipboardCheck,
  GraduationCap,
  Wrench,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  name: string;
  to: string;
  icon: any;
  end?: boolean;
}

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['crm', 'safety']);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          <span className="text-slate-400 text-sm">טוען...</span>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const mainNavigation: NavItem[] = [
    { name: 'מגדל פיקוח', to: '/admin', end: true, icon: Home },
    { name: 'Cortex BI', to: '/admin/dashboard-bi', icon: LayoutDashboard },
  ];

  const crmNavigation: NavItem[] = [
    { name: 'לידים', to: '/admin/crm/leads', icon: UserPlus },
    { name: 'אנשי קשר', to: '/admin/crm/contacts', icon: Users },
    { name: 'הזדמנויות', to: '/admin/crm/opportunities', icon: Target },
    { name: 'פעילויות', to: '/admin/crm/activities', icon: Activity },
  ];

  const safetyNavigation: NavItem[] = [
    { name: 'תיקי בטיחות', to: '/admin/safety/files', icon: Shield },
    { name: 'סקרים', to: '/admin/safety/surveys', icon: ClipboardCheck },
    { name: 'הדרכות', to: '/admin/safety/training', icon: GraduationCap },
    { name: 'ציוד', to: '/admin/safety/equipment', icon: Wrench },
  ];

  const managementNavigation: NavItem[] = [
    { name: 'לקוחות', to: '/admin/clients', icon: Building2 },
    { name: 'ניהול ידע', to: '/admin/templates', icon: FileText },
    { name: 'מסמכים', to: '/admin/documents', icon: FileText },
    { name: 'פיננסים', to: '/admin/finance', icon: CreditCard },
    { name: 'מוצרים', to: '/admin/products', icon: Package },
    { name: 'הגדרות', to: '/admin/settings', icon: Settings },
  ];

  const NavSection = ({ title, items, sectionKey }: { title: string; items: NavItem[]; sectionKey: string }) => {
    const isExpanded = expandedSections.includes(sectionKey);
    
    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
        >
          <span>{title}</span>
          <ChevronDown 
            size={14} 
            className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
        
        <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 mx-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="ml-3 h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden font-sans" dir="rtl">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col flex-shrink-0 border-l border-slate-800/50 z-50">
        
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider text-white">AEGIS</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg">
            {user?.firstName?.[0] || 'U'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold truncate text-white">{user?.firstName || 'User'}</p>
            <p className="text-xs text-indigo-400 truncate">Super User</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 overflow-y-auto custom-scrollbar space-y-1">
          
          {/* Main Navigation */}
          <div className="mb-4">
            <p className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">ראשי</p>
            {mainNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 mx-2 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="ml-3 h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* CRM Section */}
          <NavSection title="CRM - מכירות" items={crmNavigation} sectionKey="crm" />
          
          {/* Safety Section */}
          <NavSection title="בטיחות" items={safetyNavigation} sectionKey="safety" />
          
          {/* Management Section */}
          <NavSection title="ניהול" items={managementNavigation} sectionKey="management" />
          
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 text-sm text-rose-400 hover:text-white hover:bg-rose-500/20 p-3 rounded-xl transition-all font-bold"
          >
            <LogOut size={18} /> התנתק
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0f172a] relative">
        <Outlet />
      </main>
    </div>
  );
}
