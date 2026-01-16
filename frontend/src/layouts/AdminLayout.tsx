import React, { useState, useEffect } from 'react';
import { OnboardingWizard } from '../components/onboarding';
import { GlobalSearch } from '../components/search';
import { NotificationBell } from '../components/notifications';
import HelpCenter from '../components/HelpCenter'; // Import HelpCenter
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore as db } from '../firebase';
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
  ChevronDown,
  Box,
  AlertTriangle,
  Clock,
  PieChart,
  History,
  CheckCircle,
  Palette,
  Cloud,
  Zap,
  CheckSquare,
  Book // Added Book icon
} from 'lucide-react';

interface NavItem {
  name: string;
  to: string;
  icon: any;
  end?: boolean;
  badge?: number;
}

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['crm', 'safety', 'equipment', 'projects', 'reports']);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false); // Help Center State

  // Fetch pending approvals count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const clientsSnapshot = await getDocs(collection(db, "clients"));
        let count = 0;
        for (const clientDoc of clientsSnapshot.docs) {
          const findingsRef = collection(db, "clients", clientDoc.id, "findings");
          const q = query(findingsRef, where("status", "==", "pending_approval"));
          const findingsSnapshot = await getDocs(q);
          count += findingsSnapshot.size;
        }
        setPendingCount(count);
      } catch (err) {
        console.error("Error fetching pending count:", err);
      }
    };
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);
  
  // Check if user needs onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("safem_onboarding_complete");
    if (!hasSeenOnboarding && user) {
      setShowOnboarding(true);
    }
  }, [user]);

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
  ];

  // Phase 4 - Equipment Management
  const equipmentNavigation: NavItem[] = [
    { name: 'ציוד', to: '/admin/equipment', icon: Box },
    { name: 'ממצאים', to: '/admin/findings', icon: AlertTriangle },
    { name: 'בדיקות', to: '/admin/inspections', icon: ClipboardCheck },
    { name: 'ממתין לאישור', to: '/admin/pending-approvals', icon: Clock, badge: pendingCount },
  ];

  // Phase 6 - Project Management
  const projectNavigation: NavItem[] = [
    { name: 'משימות', to: '/admin/tasks', icon: CheckSquare },
  ];

  // Phase 5 - Reports & Analytics
  const reportsNavigation: NavItem[] = [
    { name: 'אנליטיקות', to: '/admin/analytics', icon: PieChart },
    { name: 'היסטוריית בדיקות', to: '/admin/reports/history', icon: History },
    { name: 'ציות', to: '/admin/reports/compliance', icon: CheckCircle },
  ];

  const managementNavigation: NavItem[] = [
    { name: 'לקוחות', to: '/admin/clients', icon: Building2 },
    { name: 'ניהול ידע', to: '/admin/templates', icon: FileText },
    { name: 'מסמכים', to: '/admin/documents', icon: FileText },
    { name: 'פיננסים', to: '/admin/finance', icon: CreditCard },
    { name: 'מוצרים', to: '/admin/products', icon: Package },
    { name: 'מיתוג', to: '/admin/branding', icon: Palette },
    { name: 'אוטומציות', to: '/admin/automation', icon: Zap },
    { name: 'הגדרות', to: '/admin/settings', icon: Settings },
  ];

  const NavSection = ({ title, items, sectionKey, color = 'indigo' }: { title: string; items: NavItem[]; sectionKey: string; color?: string }) => {
    const isExpanded = expandedSections.includes(sectionKey);
    
    const colorClasses: Record<string, string> = {
      indigo: 'bg-indigo-600 shadow-indigo-900/50',
      emerald: 'bg-emerald-600 shadow-emerald-900/50',
      cyan: 'bg-cyan-600 shadow-cyan-900/50',
      amber: 'bg-amber-600 shadow-amber-900/50',
      rose: 'bg-rose-600 shadow-rose-900/50',
      purple: 'bg-purple-600 shadow-purple-900/50',
    };

    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
        >
          {title}
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 mx-2 ${
                  isActive
                    ? `${colorClasses[color]} text-white shadow-lg`
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="ml-3 h-4 w-4" />
              {item.name}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="mr-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    );
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("safem_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem("safem_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden font-sans" dir="rtl">
      
      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
          userName={user?.displayName || undefined}
        />
      )}

      {/* Help Center Component */}
      <HelpCenter isOpen={showHelp} onClose={() => setShowHelp(false)} />

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

          {/* Sections */}
          <NavSection title="CRM - מכירות" items={crmNavigation} sectionKey="crm" color="amber" />
          <NavSection title="בטיחות" items={safetyNavigation} sectionKey="safety" color="rose" />
          <NavSection title="ניהול ציוד" items={equipmentNavigation} sectionKey="equipment" color="emerald" />
          <NavSection title="פרויקטים" items={projectNavigation} sectionKey="projects" color="purple" />
          <NavSection title="דוחות" items={reportsNavigation} sectionKey="reports" color="cyan" />
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

      <main className="flex-1 overflow-y-auto bg-[#0f172a] relative">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-10 bg-[#1e293b] border-b border-slate-700/50 px-6 py-3 flex justify-between items-center">
          <GlobalSearch />
          <div className="flex items-center gap-4">
            {/* Help Button */}
            <button 
              onClick={() => setShowHelp(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors relative group"
              title="מרכז עזרה"
            >
              <Book size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>

            {/* Notification Bell */}
            <NotificationBell />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
