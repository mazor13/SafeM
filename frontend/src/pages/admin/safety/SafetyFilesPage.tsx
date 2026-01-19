import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, Sparkles, Download, Activity, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
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

  // פונקציית ייצוא נתונים
  const handleExport = () => {
    if (sites.length === 0) return;
    const headers = ["שם אתר", "עיר", "סוג", "ציות בטיחות", "סטטוס"];
    const rows = sites.map(s => [s.name, s.address?.city || "-", s.type || "-", `${s.stats?.complianceScore || 0}%`, s.status === 'active' ? 'פעיל' : 'ממתין']);
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Aegis_Intelligence_Report_${new Date().toLocaleDateString('he-IL')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0E1A35] min-h-screen text-white p-8 font-sans" dir="rtl">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-black bg-gradient-to-r from-white via-white to-[#00D8FF] bg-clip-text text-transparent tracking-tight">
              ניהול תיקי בטיחות
            </h1>
            <p className="text-[#A9B3C1] text-xl font-medium mt-2">Intelligence Dashboard & Node Management</p>
          </motion.div>
          
          <div className="flex gap-4">
             <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-[#1C2435] border border-[#00D8FF]/30 text-[#00D8FF] px-8 py-4 rounded-2xl hover:bg-[#00D8FF]/10 transition-all font-black shadow-lg"
             >
                <Download className="w-6 h-6" /> ייצוא דוח
             </button>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#00D8FF] text-[#0E1A35] font-black px-10 py-4 rounded-2xl shadow-[0_0_30px_rgba(0,216,255,0.4)] hover:scale-[1.03] transition-all"
             >
                <Plus className="w-7 h-7" /> הקמת אתר חדש
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'אתרים פעילים', value: sites.length, icon: Building2, color: 'text-[#00D8FF]' },
            { label: 'ציות רשת', value: '85%', icon: Sparkles, color: 'text-[#10B981]' },
            { label: 'אנומליות בטיחות', value: '3', icon: Activity, color: 'text-[#FF8A00]' },
            { label: 'ציון מערכת', value: '92.4', icon: Filter, color: 'text-[#00D8FF]' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#1C2435] p-8 rounded-[2rem] border border-[#00D8FF]/10 group hover:border-[#00D8FF]/40 transition-all shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#A9B3C1] text-xs font-black uppercase tracking-[0.2em]">{stat.label}</span>
                <stat.icon className={`w-6 h-6 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
              </div>
              <div className="text-5xl font-black text-white tracking-tighter">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="lead-matrix-container shadow-2xl">
          <DynamicTable
            entityType={"site" as any}
            data={sites.map(s => ({
              id: s.id,
              name: s.name,
              city: s.address?.city || '-',
              type: s.type || '-',
              compliance: `${s.stats?.complianceScore || 0}%`,
              status: s.status === 'active' ? 'פעיל' : 'ממתין'
            }))}
            loading={loading}
            selectable={true}
            selectedRows={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={(id) => navigate(`/admin/safety/sites/${id}`)}
          />
        </div>
      </div>

      <SiteFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={async (d) => { await addSite(d); fetchSites(); }} />
    </div>
  );
}
