import React from 'react';
import { useInspections } from '../../hooks/useInspections'; // תיקון נתיב ../../
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function InspectionsDashboard() {
  const { inspections, loading } = useInspections();
  const navigate = useNavigate();

  if (loading) return <div>טוען בדיקות...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">לוח בקרה - בדיקות</h1>
        <button 
          onClick={() => navigate('/client/new-inspection')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 ml-2"/> בדיקה חדשה
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {/* כאן יבואו הווידג'טים של הדשבורד */}
         <div className="bg-white p-6 rounded-lg shadow border-t-4 border-indigo-500">
            <h3 className="text-lg font-medium text-gray-500">בדיקות החודש</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{inspections.length}</p>
         </div>
      </div>
    </div>
  );
}
