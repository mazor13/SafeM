import React, { useEffect, useState } from 'react';
import { Plus, Building as BuildingIcon, MapPin, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useSiteHierarchy } from '../../../hooks/useSiteHierarchy';
import BuildingFormModal from './BuildingFormModal';
import AreaFormModal from './AreaFormModal';
import { Building, SiteArea } from '../../../types/site.types';

interface SiteLocationsTabProps {
  siteId: string;
}

export default function SiteLocationsTab({ siteId }: SiteLocationsTabProps) {
  const { 
    buildings, 
    areas, 
    loading, 
    fetchBuildings, 
    fetchAreas, 
    addBuilding, 
    addArea, 
    deleteBuilding 
  } = useSiteHierarchy(siteId);

  // Modal States
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [expandedBuildingId, setExpandedBuildingId] = useState<string | null>(null);

  // Load Data
  useEffect(() => {
    fetchBuildings();
    fetchAreas();
  }, [fetchBuildings, fetchAreas]);

  // Handlers
  const handleAddBuilding = async (data: any) => {
    await addBuilding(data);
  };

  const handleAddArea = async (data: any) => {
    await addArea(data);
  };

  const toggleBuilding = (id: string) => {
    if (expandedBuildingId === id) {
      setExpandedBuildingId(null);
    } else {
      setExpandedBuildingId(id);
    }
  };

  const getBuildingAreas = (buildingId: string) => {
    return areas.filter(a => a.buildingId === buildingId);
  };

  if (loading && buildings.length === 0) return <div className="p-8 text-center text-gray-400">טוען מבנים...</div>;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="font-bold text-gray-900">מבנה האתר</h3>
          <p className="text-sm text-gray-500">ניהול היררכיית מבנים, קומות וחדרים</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsBuildingModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            מבנה חדש
          </button>
          <button 
            onClick={() => setIsAreaModalOpen(true)}
            disabled={buildings.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            אזור חדש
          </button>
        </div>
      </div>

      {/* Buildings List */}
      <div className="space-y-4">
        {buildings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <BuildingIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-gray-900 font-medium">אין מבנים מוגדרים</h4>
            <p className="text-gray-500 text-sm mb-4">התחל בהוספת המבנה הראשון לאתר</p>
            <button 
              onClick={() => setIsBuildingModalOpen(true)}
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              הוסף מבנה כעת
            </button>
          </div>
        ) : (
          buildings.map(building => {
            const buildingAreas = getBuildingAreas(building.id);
            const isExpanded = expandedBuildingId === building.id;

            return (
              <div key={building.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all hover:shadow-md">
                {/* Building Header */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleBuilding(building.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <BuildingIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{building.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{building.floors} קומות</span>
                        <span>•</span>
                        <span>{buildingAreas.length} אזורים מוגדרים</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteBuilding(building.id); }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="מחק מבנה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {/* Areas List (Collapsed) */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    {buildingAreas.length === 0 ? (
                      <div className="text-center py-4 text-sm text-gray-500">
                        אין אזורים משויכים למבנה זה. 
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline mr-1"
                          onClick={() => setIsAreaModalOpen(true)}
                        >
                          הוסף אזור
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {buildingAreas.map(area => (
                          <div key={area.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                            <MapPin className={`w-4 h-4 ${
                              area.riskLevel === 'high' ? 'text-red-500' : 
                              area.riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'
                            }`} />
                            <div>
                              <div className="font-medium text-sm text-gray-900">{area.name}</div>
                              <div className="text-xs text-gray-500">קומה {area.floor || '0'} • {area.type}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
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
