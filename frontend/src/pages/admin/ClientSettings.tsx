import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

export default function ClientSettings() {
  const { tenantId } = useParams();
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState({
    laser: false,
    fire: false,
    height: false
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!tenantId) return;
      // חיפוש ה-subscription המשויך ללקוח
      const subRef = doc(firestore, 'subscriptions', tenantId); // לצורך הפשטות נשתמש ב-ID של הלקוח כמפתח
      const docSnap = await getDoc(subRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFeatures(data.features || {});
      }
      setLoading(false);
    };
    fetchSubscription();
  }, [tenantId]);

  const toggleFeature = async (featureName: string) => {
    if (!tenantId) return;
    const newFeatures = { ...features, [featureName]: !features[featureName] };
    setFeatures(newFeatures);

    try {
      const subRef = doc(firestore, 'subscriptions', tenantId);
      await updateDoc(subRef, {
        features: newFeatures,
        updatedAt: new Date()
      });
      console.log(`Feature ${featureName} updated successfully`);
    } catch (error) {
      console.error("Error updating feature:", error);
      alert("שגיאה בעדכון הפיצ'ר");
    }
  };

  if (loading) return <div className="p-8 text-center">טוען הגדרות לקוח...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow-lg rounded-2xl mt-10 text-right" dir="rtl">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">ניהול מודולים ופיצ'רים</h2>
      <div className="space-y-4">
        {Object.entries(features).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <span className="font-bold text-gray-700 uppercase">{key}</span>
            <button
              onClick={() => toggleFeature(key)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                value ? 'bg-green-500 text-white shadow-md' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {value ? 'פעיל' : 'כבוי'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
