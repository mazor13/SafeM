import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { Site } from '../../../types/site.types';
import { 
  Activity, Building2, Shield, FileText, ArrowRight, MapPin, 
  Phone, AlertTriangle, Mail, User
} from 'lucide-react';
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
        }
      } catch (error) {
        console.error('Error fetching site:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500">טוען נתוני אתר...</div>;
  if (!site) return <div className="p-12 text-center text-red-500">האתר לא נמצא או הוסר.</div>;

  const tabs = [
    { id: 'overview', label: 'סקירה כללית', icon: Activity },
    { id: 'locations', label: 'מבנים ואזורים', icon: Building2 },
    { id: 'equipment', label: 'ציוד ונכסים', icon: Shield },
    { id: 'inspections', label: 'מבדקים', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-12 text-white" dir="rtl">
      
      {/* Top Banner - Dark */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
            <button 
              onClick={() => navigate('/admin/safety/files')} 
              className="flex items-center text-slate-400 hover:text-blue-400 transition-colors mb-6 text-sm font-medium"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              חזרה לרשימת האתרים
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex items-start gap-5">
                <div className="p-5 bg-slate-700/50 rounded-2xl text-blue-400 border border-slate-600 shadow-inner">
                   <Building2 className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">{site.name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>{site.address?.street || 'רחוב לא הוזן'}, {site.address?.city || 'עיר לא הוזנה'}</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div className="flex items-center gap-1.5 uppercase tracking-wide text-xs font-bold bg-slate-700 px-2 py-1 rounded text-slate-300 border border-slate-600">
                      {site.type}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border shadow-sm
                ${site.riskLevel === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                  site.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                  'bg-green-500/20 text-green-400 border-green-500/30'}`}
              >
                <AlertTriangle className="w-4 h-4" />
                רמת סיכון: {site.riskLevel === 'high' ? 'גבוהה' : site.riskLevel === 'medium' ? 'בינונית' : 'נמוכה'}
              </div>
            </div>
            
            {/* Tabs - Dark Style */}
            <div className="flex gap-2 mt-8 overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold text-sm transition-all border-b-2 relative top-[2px]
                    ${activeTab === tab.id 
                      ? 'bg-slate-900 border-blue-500 text-blue-400 z-10' 
                      : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* Content Area - Dark */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contact Card */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 hover:border-slate-600 transition-all h-fit">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> פרטי איש קשר ראשי
               </h3>
               
               {site.primaryContact?.name ? (
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold text-xl border border-slate-600">
                            {site.primaryContact.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-white text-lg">{site.primaryContact.name}</div>
                            <div className="text-slate-400 text-sm font-medium">{site.primaryContact.role || 'תפקיד לא הוגדר'}</div>
                        </div>
                    </div>
                    <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3 text-slate-300">
                            <Phone className="w-4 h-4 text-slate-500" />
                            <span dir="ltr" className="font-mono text-sm">{site.primaryContact.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <Mail className="w-4 h-4 text-slate-500" />
                            <span className="text-sm">{site.primaryContact.email}</span>
                        </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-center py-8 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    לא הוגדר איש קשר ראשי
                 </div>
               )}
            </div>

            {/* Stats Grid - Dark */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm group hover:border-blue-500/50 transition-all">
                  <div className="text-slate-400 font-bold text-sm mb-1 flex justify-between">
                    <span>ציוד באתר</span>
                    <Shield className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors"/>
                  </div>
                  <div className="text-4xl font-black text-white tracking-tight">{site.stats?.equipmentCount || 0}</div>
                  <div className="mt-3 text-xs text-green-400 font-bold bg-green-500/10 inline-block px-2.5 py-1 rounded-md border border-green-500/20">פעיל ותקין</div>
               </div>
               
               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm group hover:border-blue-500/50 transition-all">
                  <div className="text-slate-400 font-bold text-sm mb-1 flex justify-between">
                    <span>מבנים ומתחמים</span>
                    <Building2 className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors"/>
                  </div>
                  <div className="text-4xl font-black text-white tracking-tight">{site.stats?.buildingsCount || 0}</div>
               </div>

               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm group hover:border-blue-500/50 transition-all">
                  <div className="text-slate-400 font-bold text-sm mb-1 flex justify-between">
                    <span>ציון ציות</span>
                    <Activity className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors"/>
                  </div>
                  <div className="flex items-end gap-2">
                      <div className="text-4xl font-black text-blue-400 tracking-tight">{site.stats?.complianceScore || 0}%</div>
                  </div>
                  <div className="w-full bg-slate-700 h-2.5 rounded-full mt-4 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${site.stats?.complianceScore || 0}%` }}></div>
                  </div>
               </div>

               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm group hover:border-red-500/50 transition-all">
                  <div className="text-slate-400 font-bold text-sm mb-1 flex justify-between">
                    <span>ליקויים פתוחים</span>
                    <AlertTriangle className="w-4 h-4 text-slate-600 group-hover:text-red-500 transition-colors"/>
                  </div>
                  <div className="text-4xl font-black text-red-500 tracking-tight">{site.stats?.openFindingsCount || 0}</div>
                  <div className="mt-3 text-xs text-red-400 font-bold bg-red-500/10 inline-block px-2.5 py-1 rounded-md border border-red-500/20">דורש טיפול מיידי</div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SiteLocationsTab siteId={site.id} />
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-16 text-center">
            <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ניהול ציוד ונכסים</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              צפה ברשימת הציוד המלאה המשויכת לאתר זה.
            </p>
            <button 
                onClick={() => navigate('/admin/equipment')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all"
            >
                עבור לרשימת הציוד
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
