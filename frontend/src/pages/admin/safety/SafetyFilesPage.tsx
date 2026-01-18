import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, MapPin, Activity } from 'lucide-react';
import { useSites } from '../../../hooks/useSites';
import DynamicTable from '../../../components/dynamic-columns/DynamicTable';
import { Site } from '../../../types/site.types';

export default function SafetyFilesPage() {
  const navigate = useNavigate();
  const { sites, loading, fetchSites } = useSites();
  
  // State עבור שורות נבחרות (לאפשרויות עתידיות כמו מחיקה מרובה)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // טעינת הנתונים בעת עליית הדף
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // הכנת הנתונים לטבלה (Flattening במידת הצורך)
  const tableData = sites.map(site => ({
    id: site.id,
    name: site.name,
    // שדות משוערים לשימוש בטבלה הדינמית - המשתמש יבחר מה להציג
    'address.city': site.address?.city || '',
    type: site.type,
    riskLevel: site.riskLevel,
    'stats.complianceScore': site.stats?.complianceScore || 0,
    status: site.status,
    clientId: site.clientId
  }));

  const handleAddSite = () => {
    // שלב הבא: נחבר את זה למודאל יצירת אתר
    console.log('Open Add Site Modal');
    alert('בשלב הבא: ייפתח מודאל להוספת אתר חדש'); 
  };

  const handleRowClick = (rowId: string) => {
    // ניווט לדף פירוט אתר (ניצור אותו במשימה הבאה)
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
          onClick={handleAddSite}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          אתר חדש
        </button>
      </div>

      {/* אזור סטטיסטיקה מהיר (Placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">סה״כ אתרים פעילים</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{sites.length}</div>
        </div>
        {/* אפשר להוסיף עוד כרטיסים כאן בעתיד */}
      </div>

      {/* הטבלה הדינמית */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <DynamicTable
          entityType="site" // זהו המפתח! הטבלה תשמור את הגדרות העמודות תחת מפתח זה
          data={tableData}
          loading={loading}
          selectable={true}
          selectedRows={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={handleRowClick}
          emptyMessage="לא נמצאו אתרים. לחץ על 'אתר חדש' כדי להתחיל."
        />
      </div>
    </div>
  );
}
