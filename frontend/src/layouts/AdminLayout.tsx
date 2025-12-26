import React from 'react';
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
  Shield
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Guard Clause: אם אין משתמש והטעינה הסתיימה -> לך להתחברות
  if (!loading && !user) {
      return <Navigate to="/login" replace />;
  }

  // בזמן שטוענים את המשתמש, לא מציגים כלום (או ספינר) כדי לא לקפוץ
  if (loading) {
      return <div className="h-screen flex items-center justify-center bg-slate-50 text-indigo-600">טוען...</div>;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'מגדל פיקוח', to: '/admin', end: true, icon: Home },
    { name: 'Cortex BI', to: '/admin/dashboard-bi', icon: LayoutDashboard },
    { name: 'לקוחות', to: '/admin/clients', icon: Users },
    { name: 'ניהול ידע', to: '/admin/templates', icon: FileText },
    { name: 'פיננסים', to: '/admin/finance', icon: CreditCard },
    { name: 'מוצרים', to: '/admin/products', icon: Package },
    { name: 'הגדרות', to: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans" dir="rtl">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col flex-shrink-0 shadow-2xl z-50 transition-all">
        <div className="h-20 flex items-center px-6 bg-[#0f172a] border-b border-slate-800">
           <div className="flex items-center gap-3 text-indigo-500">
             <Shield size={28} />
             <div>
                <h1 className="text-xl font-black tracking-wider text-white">AEGIS</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Console</p>
             </div>
           </div>
        </div>

        <div className="p-4 mx-4 mt-6 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg">
               {user?.firstName?.[0] || 'A'}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold truncate text-white">{user?.firstName || 'Admin'}</p>
               <p className="text-xs text-indigo-400 truncate">Super User</p>
             </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase mb-2">Main Menu</p>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 translate-x-1'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                }`
              }
            >
              <item.icon className={`ml-3 h-5 w-5 transition-colors`} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 text-sm text-rose-400 hover:text-white hover:bg-rose-500/20 p-3 rounded-xl transition-all font-bold"
          >
            <LogOut size={18} /> התנתק
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 relative scroll-smooth">
        <Outlet />
      </main>
    </div>
  );
}
