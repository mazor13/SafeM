import LegalConsentModal from '../components/legal/LegalConsentModal';
import React, { useState, useEffect } from 'react';
import { OnboardingWizard } from '../components/onboarding';
import { GlobalSearch } from '../components/search';
import { NotificationBell } from '../components/notifications';
import HelpCenter from '../components/HelpCenter';
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
  Book
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
  const [showHelp, setShowHelp] = useState<boolean>(false);

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
    const interval = setInterval(fetchPendingCount, 60000);
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
      <div className="h-screen flex items-center justify-center bg-[#0E1A35]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-[#00D8FF] border-t-transparent rounded-full"></div>
          <span className="text-[#A9B3C1] text-sm">טוען...</span>
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

  const equipmentNavigation: NavItem[] = [
    { name: 'ציוד', to: '/admin/equipment', icon: Box },
    { name: 'ממצאים', to: '/admin/findings', icon: AlertTriangle },
    { name: 'בדיקות', to: '/admin/inspections', icon: ClipboardCheck },
    { name: 'ממתין לאישור', to: '/admin/pending-approvals', icon: Clock, badge: pendingCount },
  ];

  const projectNavigation: NavItem[] = [
    { name: 'משימות', to: '/admin/tasks', icon: CheckSquare },
  ];

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
    { name: 'בקרה וניהול הצהרות משתמש', to: '/admin/users', icon: Users },
    { name: 'הגדרות', to: '/admin/settings', icon: Settings },
  ];

  const NavSection = ({ title, items, sectionKey, color = 'cyan' }: { title: string; items: NavItem[]; sectionKey: string; color?: string }) => {
    const isExpanded = expandedSections.includes(sectionKey);
    
    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-[#6B7C93] uppercase tracking-wider hover:text-[#00D8FF] transition-colors"
        >
          {title}
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 mx-2 relative ${
                  isActive
                    ? 'bg-[rgba(0,216,255,0.12)] text-[#00D8FF] shadow-[0_0_20px_rgba(0,216,255,0.3)] border-r-2 border-[#00D8FF]'
                    : 'text-[#A9B3C1] hover:bg-[rgba(0,216,255,0.05)] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D8FF] rounded-full shadow-[0_0_10px_rgba(0,216,255,0.8)]"></div>
                  )}
                  <item.icon className={`ml-3 h-4 w-4 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,216,255,0.8)]' : ''}`} />
                  {item.name}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="mr-auto bg-[#00D8FF] text-[#0E1A35] text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,216,255,0.5)]">
                      {item.badge}
                    </span>
                  )}
                </>
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
    <div className="flex h-screen bg-[#0E1A35] overflow-hidden font-sans" dir="rtl">
      
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
      <aside className="w-72 bg-[#0E1A35] text-white flex flex-col flex-shrink-0 border-l border-[rgba(0,216,255,0.15)] z-50 shadow-[0_0_30px_rgba(0,216,255,0.1)]">
        
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-[rgba(0,216,255,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00D8FF] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,216,255,0.5)]">
              <Shield size={22} className="text-[#0E1A35]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider text-white drop-shadow-[0_0_10px_rgba(0,216,255,0.3)]">AEGIS</h1>
              <p className="text-[10px] text-[#6B7C93] uppercase tracking-widest">Intelligence Console</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-6 bg-[#1C2435] rounded-2xl border border-[rgba(0,216,255,0.2)] flex items-center gap-3 shadow-[0_0_15px_rgba(0,216,255,0.1)]">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D8FF] to-[#0EA5E9] flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(0,216,255,0.4)] text-[#0E1A35]">
            {user?.firstName?.[0] || 'U'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold truncate text-white">{user?.firstName || 'User'}</p>
            <p className="text-xs text-[#00D8FF] truncate">Super User</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 overflow-y-auto custom-scrollbar space-y-1">
          
          {/* Main Navigation */}
          <div className="mb-4">
            <p className="px-4 py-2 text-xs font-bold text-[#6B7C93] uppercase tracking-wider">ראשי</p>
            {mainNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 mx-2 relative ${
                    isActive
                      ? 'bg-[rgba(0,216,255,0.12)] text-[#00D8FF] shadow-[0_0_20px_rgba(0,216,255,0.3)] border-r-2 border-[#00D8FF]'
                      : 'text-[#A9B3C1] hover:bg-[rgba(0,216,255,0.05)] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D8FF] rounded-full shadow-[0_0_10px_rgba(0,216,255,0.8)]"></div>
                    )}
                    <item.icon className={`ml-3 h-4 w-4 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,216,255,0.8)]' : ''}`} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Sections */}
          <NavSection title="CRM - מכירות" items={crmNavigation} sectionKey="crm" />
          <NavSection title="בטיחות" items={safetyNavigation} sectionKey="safety" />
          <NavSection title="ניהול ציוד" items={equipmentNavigation} sectionKey="equipment" />
          <NavSection title="פרויקטים" items={projectNavigation} sectionKey="projects" />
          <NavSection title="דוחות" items={reportsNavigation} sectionKey="reports" />
          <NavSection title="ניהול" items={managementNavigation} sectionKey="management" />
          
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[rgba(0,216,255,0.15)]">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 text-sm text-[#FF6B6B] hover:text-white hover:bg-[rgba(255,107,107,0.15)] p-3 rounded-xl transition-all font-bold border border-[rgba(255,107,107,0.2)] hover:border-[rgba(255,107,107,0.4)]"
          >
            <LogOut size={18} /> התנתק
          </button>
        </div>
      </aside>

      <LegalConsentModal />
      <main className="flex-1 overflow-y-auto bg-[#0E1A35] relative">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-10 bg-[#1C2435] border-b border-[rgba(0,216,255,0.2)] px-6 py-3 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <GlobalSearch />
          <div className="flex items-center gap-4">
            {/* Help Button */}
            <button 
              onClick={() => navigate('/admin/help')}
              className="p-2 text-[#A9B3C1] hover:text-[#00D8FF] hover:bg-[rgba(0,216,255,0.1)] rounded-lg transition-colors relative group"
              title="מרכז עזרה"
            >
              <Book size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#00D8FF] rounded-full shadow-[0_0_8px_rgba(0,216,255,0.8)]"></span>
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
