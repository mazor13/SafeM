import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, Search, Filter, Layout, BarChart3, ShieldAlert, Activity } from 'lucide-react';
import { useSites } from '../../../hooks/useSites';
import DynamicTable from '../../../components/dynamic-columns/DynamicTable';
import SiteFormModal from '../../../components/admin/safety/SiteFormModal';

export default function SafetyFilesPage() {
  const navigate = useNavigate();
  const { sites, loading, fetchSites, addSite } = useSites();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const tableData = sites.map(site => ({
    id: site.id,
    name: site.name,
    location: site.address?.city || '-',
    type: site.type,
    risk: site.riskLevel,
    compliance: `${site.stats?.complianceScore || 0}%`,
    status: site.status
  }));

  const handleCreateSite = async (data: any) => {
    try {
      await addSite({ ...data, safetyDomains: [], status: 'active' });
      fetchSites(); 
    } catch (error) {
      console.error('Failed to create site:', error);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#0f172a] min-h-screen text-slate-100 font-sans" dir="rtl">
      
      <style>{`
        .analytics-style-table { background: #1e293b !important; border: 1px solid #334155 !important; border-radius: 1rem !important; }
        .analytics-style-table table { border-collapse: separate !important; border-spacing: 0 !important; width: 100% !important; }
        .analytics-style-table th { background: #1e293b !important; color: #94a3b8 !important; border-bottom: 2px solid #334155 !important; padding: 1rem !important; font-size: 0.85rem !important; text-transform: uppercase !important; }
        .analytics-style-table td { background: transparent !important; color: #f1f5f9 !important; border-bottom: 1px solid #334155 !important; padding: 1rem !important; font-weight: 500 !important; }
        .analytics-style-table tr:hover td { background: #33415566 !important; }
        
        [role="dialog"], .popover-content { background: #1e293b !important; color: white !important; border: 1px solid #475569 !important; border-radius: 12px !important; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important; z-index: 9999 !important; }
        [role="dialog"] label, [role="dialog"] span, [role="dialog"] h2 { color: #f1f5f9 !important; }
        [role="dialog"] button { color: #94a3b8 !important; }
        
        .glow-text { text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
      `}</style>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-l from-blue-900/40 to-slate-800/40 p-8 rounded-3xl border border-blue-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/50">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">מנוע ניהול אתרים ותיקי בטיחות</h1>
            </div>
            <p className="text-slate-400 text-lg font-medium opacity-90 mr-12">ניהול מבוסס נתונים ומיפוי סיכונים בזמן אמת</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 border border-blue-400/30"
          >
            + הוספת אתר חדש
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'סה״כ אתרים', value: sites.length, icon: Layout, color: 'text-blue-400' },
          { label: 'ציון ציות', value: '85%', icon: BarChart3, color: 'text-emerald-400' },
          { label: 'ליקויים פתוחים', value: '12', icon: ShieldAlert, color: 'text-rose-400' },
          { label: 'מבדקים בתוקף', value: '94%', icon: Activity, color: 'text-amber-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/80 transition-all group">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className={`text-3xl font-black text-white glow-text`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="analytics-style-table overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-700 bg-slate-800/30 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="חיפוש חכם..." 
                className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl pl-3 pr-9 py-2 focus:ring-1 focus:ring-blue-500 outline-none w-64 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-tight">{sites.length} רשומות במנוע</span>
          </div>
        </div>

        <div className="p-2">
          <DynamicTable
            entityType={"site" as any}
            data={tableData}
            loading={loading}
            selectable={true}
            selectedRows={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={(id) => navigate(`/admin/safety/sites/${id}`)}
            emptyMessage="אין נתונים להצגה."
          />
        </div>
      </div>

      <SiteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSite}
      />
    </div>
  );
}
