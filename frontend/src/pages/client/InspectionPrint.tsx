import React from 'react';
import { firestore } from '../../firebase'; // Fixed

export default function InspectionPrint() {
  return (
    <div className="p-8 print:p-0">
      <h1 className="text-2xl font-bold mb-4">תצוגת הדפסה</h1>
      <p>כאן יופיע דוח הבדיקה להדפסה.</p>
      <button onClick={() => window.print()} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded print:hidden">
        הדפס עכשיו
      </button>
    </div>
  );
}
