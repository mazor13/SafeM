import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { Site } from '../../../types/site.types';
import { 
  Activity, 
  Building2, 
  Shield, 
  FileText, 
  ArrowRight, 
  MapPin, 
  Phone, 
  AlertTriangle
} from 'lucide-react';
// Import the new tab component
import SiteLocationsTab from '../../../components/admin/safety/SiteLocationsTab';

export default function SiteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchSite = async () => {
      if (!id) return;
      try {
        const docRef = doc(firestore, 'sites', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSite({ id: docSnap.id, ...docSnap.data() } as Site);
        } else {
          console.error('Site not found');
        }
      } catch (error) {
        console.error('Error fetching site:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">טוען נתוני אתר...</div>;
  if (!site) return <div className="p-8 text-center text-red-500">האתר לא נמצא או הוסר.</div>;

  const tabs = [
    { id: 'overview', label: 'סקירה כללית', icon: Activity },
    { id: 'locations', label: 'מבנים ואזורים', icon: Building2 },
    { id: 'equipment', label: 'ציוד ונכסים', icon: Shield },
    { id: 'inspections', label: 'מבדקים', icon: FileText },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6" dir="rtl">
      {/* Header Navigation */}
      <div>
        <button 
          onClick={() => navigate('/admin/safety/files')} 
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4 text-sm font-medium"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          חזרה לרשימת האתרים
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{site.address?.street}, {site.address?.city}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{site.type}</span>
              </div>
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2
            ${site.riskLevel === 'high' ? 'bg-red-100 text-red-700' : 
              site.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            רמת סיכון: {site.riskLevel === 'high' ? 'גבוהה' : site.riskLevel === 'medium' ? 'בינונית' : 'נמוכה'}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-t-xl border-b border-gray-200 px-4">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="bg-white rounded-b-xl shadow-sm p-6 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card: Primary Contact */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  איש קשר ראשי
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">שם מלא:</span>
                    <span className="font-medium">{site.primaryContact?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">תפקיד:</span>
                    <span className="font-medium">{site.primaryContact?.role || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">טלפון:</span>
                    <span className="font-medium" dir="ltr">{site.primaryContact?.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">אימייל:</span>
                    <span className="font-medium">{site.primaryContact?.email || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Card: Stats */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  סטטוס תפעולי
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-gray-900">{site.stats?.buildingsCount || 0}</div>
                    <div className="text-xs text-gray-500">מבנים</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-gray-900">{site.stats?.equipmentCount || 0}</div>
                    <div className="text-xs text-gray-500">פריטי ציוד</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-red-600">{site.stats?.openFindingsCount || 0}</div>
                    <div className="text-xs text-gray-500">ליקויים פתוחים</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-green-600">{site.stats?.complianceScore || 0}%</div>
                    <div className="text-xs text-gray-500">ציון ציות</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ NEW: Connected Locations Tab */}
        {activeTab === 'locations' && (
          <SiteLocationsTab siteId={site.id} />
        )}

        {activeTab === 'equipment' && (
          <div className="text-center py-12 text-gray-400">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-gray-900">ניהול ציוד</h3>
            <p>רכיב זה יפותח במשימה הבאה (Equipment Registry).</p>
          </div>
        )}
        
        {activeTab === 'inspections' && (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-gray-900">היסטוריית מבדקים</h3>
            <p>יוצג כאן יומן מבדקים מלא.</p>
          </div>
        )}
      </div>
    </div>
  );
}
