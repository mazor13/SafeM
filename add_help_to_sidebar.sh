#!/bin/bash

echo "🚀 Adding 'Help' button to Sidebar..."

# אנחנו מחליפים את קובץ ה-Sidebar כדי לכלול את הקישור לעזרה
cat > frontend/src/components/layout/Sidebar.tsx << 'EOF'
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield, 
  FileText, 
  BarChart3, 
  Briefcase,
  Megaphone,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

const Logo = () => (
  <div className="flex items-center gap-3 px-2 mb-8">
    <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
      <Shield className="text-white w-5 h-5" />
    </div>
    <div>
      <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
        AEGIS
      </h1>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest">Admin Console</span>
    </div>
  </div>
);

const NavItem = ({ to, icon: Icon, label, badge }: any) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-medium' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
      }`
    }
  >
    <Icon size={18} strokeWidth={2} />
    <span className="text-sm">{label}</span>
    {badge && (
      <span className="mr-auto bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
        {badge}
      </span>
    )}
  </NavLink>
);

const SectionLabel = ({ label }: { label: string }) => (
  <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
    {label}
  </div>
);

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-l border-white/5 h-screen flex flex-col p-4 shrink-0 overflow-y-auto">
      <Logo />
      
      <nav className="flex-1 space-y-1">
        <SectionLabel label="ראשי" />
        <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="מגדל פיקוח" />
        <NavItem to="/admin/bi" icon={BarChart3} label="Cortex BI" badge="PRO" />

        <SectionLabel label="CRM - מכירות" />
        <NavItem to="/admin/crm/leads" icon={Megaphone} label="לידים" />
        <NavItem to="/admin/crm/contacts" icon={Users} label="אנשי קשר" />
        <NavItem to="/admin/crm/opportunities" icon={Briefcase} label="הזדמנויות" />
        
        <SectionLabel label="בטיחות" />
        <NavItem to="/admin/safety/files" icon={Shield} label="תיקי בטיחות" />
        <NavItem to="/admin/safety/surveys" icon={FileText} label="סקרים" />
        <NavItem to="/admin/safety/training" icon={GraduationCap} label="הדרכות" />

        <SectionLabel label="מערכת" />
        <NavItem to="/admin/settings" icon={Settings} label="הגדרות" />
        <NavItem to="/admin/help" icon={HelpCircle} label="מרכז עזרה" />
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
         <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/20 rounded-xl p-4">
            <h4 className="text-white text-xs font-bold mb-1">צריך עזרה?</h4>
            <p className="text-slate-400 text-[10px] mb-3">צוות התמיכה זמין עבורך</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-colors">
              צור קשר
            </button>
         </div>
      </div>
    </aside>
  );
}
EOF

echo "✅ Sidebar updated with Help link. Deploying..."
cd frontend && npm run build && cd .. && firebase deploy --only hosting
