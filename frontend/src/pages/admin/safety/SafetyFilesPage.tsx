import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2 } from 'lucide-react';
import { useSites } from '../../../hooks/useSites';
import DynamicTable from '../../../components/dynamic-columns/DynamicTable';
import SiteFormModal from '../../../components/admin/safety/SiteFormModal';

export default function SafetyFilesPage() {
  const navigate = useNavigate();
  const { sites, loading, fetchSites, addSite } = useSites();
  
  // State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // טעינת הנתונים
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // הכנת הנתונים לטבלה
  const tableData = sites.map(site => ({
    id: site.id,
    name: site.name,
    'address.city': site.address?.city || '',
    type: site.type,
    riskLevel: site.riskLevel,
    'stats.complianceScore': site.stats?.complianceScore || 0,
    status: site.status,
    clientId: site.clientId
  }));

  const handleCreateSite = async (data: any) => {
    try {
      // הוספת האתר ל-Firestore דרך ה-Hook
      await addSite({
        ...data,
        safetyDomains: [], // ברירת מחדל
        status: 'active'
      });
      // רענון הרשימה מתבצע אוטומטית ב-Hook, אבל אפשר גם לקרוא ל-fetchSites
      fetchSites(); 
    } catch (error) {
      console.error('Failed to create site:', error);
      alert('אירעה שגיאה ביצירת האתר');
    }
  };

  const handleRowClick = (rowId: string) => {
    navigate(`/admin/safety/sites/${rowId}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* כותרת ופעולות */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            ניהול אתרים ומתקנים
          </h1>
          <p className="text-gray-500 mt-1">צפייה וניהול של כל האתרים, רמות הסיכון ומצב הציות.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          אתר חדש
        </button>
      </div>

      {/* אזור סטטיסטיקה מהיר */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">סה״כ אתרים פעילים</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{sites.length}</div>
        </div>
      </div>

      {/* הטבלה הדינמית */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <DynamicTable
          entityType="site"
          data={tableData}
          loading={loading}
          selectable={true}
          selectedRows={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={handleRowClick}
          emptyMessage="לא נמצאו אתרים. לחץ על 'אתר חדש' כדי להתחיל."
        />
      </div>

      {/* מודאל הוספת אתר */}
      <SiteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSite}
      />
    </div>
  );
}
