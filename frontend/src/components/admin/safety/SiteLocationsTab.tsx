import React, { useEffect, useState } from 'react';
import { Plus, Building as BuildingIcon, MapPin, Trash2, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { useSiteHierarchy } from '../../../hooks/useSiteHierarchy';
import BuildingFormModal from './BuildingFormModal';
import AreaFormModal from './AreaFormModal';

interface SiteLocationsTabProps {
  siteId: string;
}

export default function SiteLocationsTab({ siteId }: SiteLocationsTabProps) {
  const { 
    buildings, areas, loading, fetchBuildings, fetchAreas, 
    addBuilding, addArea, deleteBuilding 
  } = useSiteHierarchy(siteId);

  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [expandedBuildingId, setExpandedBuildingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBuildings();
    fetchAreas();
  }, [fetchBuildings, fetchAreas]);

  const handleAddBuilding = async (data: any) => {
    await addBuilding(data);
  };

  const handleAddArea = async (data: any) => {
    await addArea(data);
  };

  const toggleBuilding = (id: string) => {
    setExpandedBuildingId(expandedBuildingId === id ? null : id);
  };

  const getBuildingAreas = (buildingId: string) => {
    return areas.filter(a => a.buildingId === buildingId);
  };

  if (loading && buildings.length === 0) return <div className="p-12 text-center text-slate-500">טוען נתונים...</div>;

  return (
    <div className="space-y-6 text-white">
      {/* Toolbar - Dark */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
        <div>
          <h3 className="font-bold text-white text-lg">מבנה האתר</h3>
          <p className="text-sm text-slate-400">ניהול היררכיית מבנים, קומות וחדרים</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsBuildingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-600 font-bold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            מבנה חדש
          </button>
          <button 
            onClick={() => setIsAreaModalOpen(true)}
            disabled={buildings.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            אזור חדש
          </button>
        </div>
      </div>

      {/* Buildings Grid - Dark */}
      <div className="space-y-4">
        {buildings.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingIcon className="w-8 h-8 text-slate-600" />
            </div>
            <h4 className="text-slate-300 font-bold text-lg">אין מבנים מוגדרים</h4>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">האתר עדיין ריק. התחל בהוספת המבנה הראשון.</p>
            <button 
              onClick={() => setIsBuildingModalOpen(true)}
              className="text-blue-400 font-bold text-sm hover:underline"
            >
              + הוסף מבנה ראשון
            </button>
          </div>
        ) : (
          buildings.map(building => {
            const buildingAreas = getBuildingAreas(building.id);
            const isExpanded = expandedBuildingId === building.id;

            return (
              <div key={building.id} className="bg-slate-700/20 rounded-xl border border-slate-700 overflow-hidden shadow-sm hover:border-slate-600 transition-all">
                {/* Building Header */}
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-700/30 transition-colors"
                  onClick={() => toggleBuilding(building.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-700 text-blue-400 rounded-xl border border-slate-600">
                      <BuildingIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{building.name}</h4>
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Layers className="w-3 h-3"/> {building.floors} קומות</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {buildingAreas.length} אזורים</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteBuilding(building.id); }}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                      title="מחק מבנה"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                         <ChevronDown className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Areas List (Collapsed) */}
                {isExpanded && (
                  <div className="border-t border-slate-700 bg-slate-900/30 p-6 animate-in slide-in-from-top-2 duration-200">
                    {buildingAreas.length === 0 ? (
                      <div className="text-center py-6 text-sm text-slate-500 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                        אין אזורים משויכים למבנה זה. 
                        <span 
                          className="text-blue-400 cursor-pointer hover:underline mr-1 font-bold"
                          onClick={() => setIsAreaModalOpen(true)}
                        >
                          הוסף אזור עכשיו
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {buildingAreas.map(area => (
                          <div key={area.id} className="flex items-start gap-3 p-4 bg-slate-800 border border-slate-700 rounded-xl shadow-sm hover:border-slate-500 transition-colors">
                            <MapPin className={`w-5 h-5 mt-0.5 ${
                              area.riskLevel === 'high' ? 'text-red-500' : 
                              area.riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'
                            }`} />
                            <div>
                              <div className="font-bold text-slate-200">{area.name}</div>
                              <div className="text-xs text-slate-400 mt-1 font-medium bg-slate-900 px-2 py-0.5 rounded-md inline-block">
                                קומה {area.floor || '0'} • {area.type === 'room' ? 'חדר' : area.type === 'corridor' ? 'מסדרון' : area.type}
                              </div>
                            </div>
                          </div>
                        ))}
                         <button 
                            onClick={() => setIsAreaModalOpen(true)}
                            className="flex flex-col items-center justify-center gap-2 p-4 border border-dashed border-slate-600 rounded-xl text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-800 transition-all"
                         >
                            <Plus className="w-6 h-6" />
                            <span className="text-sm font-bold">הוסף אזור</span>
                         </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <BuildingFormModal 
        isOpen={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        onSubmit={handleAddBuilding}
      />
      
      <AreaFormModal
        isOpen={isAreaModalOpen}
        onClose={() => setIsAreaModalOpen(false)}
        onSubmit={handleAddArea}
        buildings={buildings}
      />
    </div>
  );
}
