import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Fixed
import InspectionItems from '../../components/InspectionItems'; // Fixed
import SignatureModal from '../../components/SignatureModal'; // Fixed
import PrintSettingsModal from '../../components/PrintSettingsModal'; // Fixed
import { PrinterIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function InspectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(firestore, 'inspections', id)).then(snap => {
        if (snap.exists()) setInspection({id: snap.id, ...snap.data()});
        setLoading(false);
    });
  }, [id]);

  if (loading) return <div>טוען בדיקה...</div>;
  if (!inspection) return <div>לא נמצאה בדיקה</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded shadow">
         <div>
            <h1 className="text-xl font-bold">{inspection.title}</h1>
            <p className="text-sm text-gray-500">ID: {inspection.id}</p>
         </div>
         <div className="flex gap-2">
            <button className="flex items-center border px-3 py-1 rounded hover:bg-gray-50">
                <PrinterIcon className="h-5 w-5 ml-1"/> הדפס
            </button>
            <button className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                <CheckCircleIcon className="h-5 w-5 ml-1"/> סיום וחתימה
            </button>
         </div>
      </div>
      
      {/* Items Component Placeholder - Assuming logic exists within the component */}
      <div className="bg-white p-6 rounded shadow">
         <h2 className="text-lg font-bold mb-4">פריטי בדיקה</h2>
         <p className="text-gray-500 italic">רשימת הפריטים לבדיקה תוצג כאן...</p>
      </div>
    </div>
  );
}
