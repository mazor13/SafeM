import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useAuth } from '../../providers/AuthProvider';
import { Client, InspectionTemplate } from '../../types';
import { 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function NewInspection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // States
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // Data
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<InspectionTemplate[]>([]);
  
  // Selection
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<InspectionTemplate | null>(null);
  const [siteName, setSiteName] = useState('');

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Clients (only if admin/employee)
        if (user?.role === 'super_admin' || user?.role === 'admin') {
          const clientsSnapshot = await getDocs(collection(firestore, 'clients'));
          setClients(clientsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Client)));
        }

        // Fetch Templates
        const templatesSnapshot = await getDocs(collection(firestore, 'inspection_templates'));
        setTemplates(templatesSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as InspectionTemplate)));
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // 2. Start Inspection Logic
  const handleStart = async () => {
    if (!selectedTemplate || !siteName) return;
    
    // אם המשתמש הוא לקוח, הלקוח הוא הארגון שלו. אם הוא אדמין, הוא בחר לקוח.
    const targetClient = user?.role === 'client_user' ? { id: user.id, name: user.firstName } : selectedClient;

    if (!targetClient && user?.role !== 'client_user') {
      alert('נא לבחור לקוח');
      return;
    }

    setCreating(true);

    try {
      // Create the Inspection Document
      const inspectionData = {
        clientId: targetClient?.id || 'unknown',
        clientName: targetClient?.name || 'Unknown',
        siteName: siteName,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.title,
        templateSnapshot: selectedTemplate.sections || [],
        inspectorId: user?.id || user?.uid || 'anonymous',  // ✅ תיקון: fallback למניעת undefined
        inspectorName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown Inspector',
        status: 'in_progress',
        progress: 0,
        score: 0,
        answers: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(firestore, 'inspections'), inspectionData);
      
      // Redirect to the Execution Page
      navigate(`/client/inspections/${docRef.id}`);
      
    } catch (error) {
      console.error("Error creating inspection:", error);
      alert("שגיאה ביצירת הבדיקה");
      setCreating(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-900">טוען נתונים...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">התחלת בדיקה חדשה</h1>

      {/* Steps Indicator */}
      <div className="flex items-center mb-8">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
        <div className="h-1 w-16 bg-gray-200 mx-2">
           <div className={`h-full bg-indigo-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        <div className="h-1 w-16 bg-gray-200 mx-2">
           <div className={`h-full bg-indigo-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
      </div>

      {/* Step 1: Select Client (Only for Admin) */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
            <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
            בחר לקוח / ארגון
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map(client => (
              <div 
                key={client.id}
                onClick={() => { setSelectedClient(client); setStep(2); }}
                className="p-4 border rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3 bg-white"
              >
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {client.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{client.name}</div>
                  <div className="text-sm text-gray-500">{client.address || 'אין כתובת'}</div>
                </div>
              </div>
            ))}
            
            {clients.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-gray-700">לא נמצאו לקוחות. יש להקים לקוח במערכת הניהול.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Select Template */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
              <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
              בחר סוג בדיקה (תבנית)
            </h2>
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-900">חזרה לבחירת לקוח</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <div 
                key={template.id}
                onClick={() => { setSelectedTemplate(template); setStep(3); }}
                className="p-5 border rounded-xl cursor-pointer hover:shadow-md hover:border-indigo-500 transition-all bg-white group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${template.category === 'safety' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {template.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">{template.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.description || 'ללא תיאור'}</p>
                <div className="text-xs text-indigo-600 font-medium group-hover:underline">בחר תבנית זו &larr;</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Final Details & Start */}
      {step === 3 && selectedClient && selectedTemplate && (
        <div className="space-y-6 animate-fadeIn max-w-lg mx-auto">
          <div className="text-center mb-6">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">כמעט מוכנים!</h2>
            <p className="text-gray-500">אנא אמת את הפרטים לפני תחילת הבדיקה</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
            <div>
              <label className="text-sm text-gray-500 block mb-1">לקוח נבחר</label>
              <div className="font-medium text-lg text-gray-900">{selectedClient.name}</div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">סוג בדיקה</label>
              <div className="font-medium text-lg text-gray-900">{selectedTemplate.title}</div>
            </div>

            <div>
              <label className="text-sm text-gray-700 font-bold block mb-1">שם האתר / מיקום הבדיקה</label>
              <input 
                type="text" 
                autoFocus
                placeholder="למשל: בניין ראשי, קומה 2"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-white"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => setStep(2)}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium bg-white"
            >
              חזרה
            </button>
            <button 
              onClick={handleStart}
              disabled={!siteName || creating}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              {creating ? 'יוצר בדיקה...' : 'התחל בדיקה עכשיו'}
              {!creating && <PlayIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}