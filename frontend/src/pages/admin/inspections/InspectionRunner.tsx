import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ChevronLeft, Building2, User, Search, Loader2, Box, ArrowRight, FileText, Play } from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { firestore } from '../../../firebase';

interface Client {
  id: string;
  name: string;
  address?: string;
}

interface Equipment {
  id: string;
  name: string;
  serialNumber?: string;
  location?: string;
  domain: string; // Must have domain for filtering
}

interface Template {
  id: string;
  name: string;
  description?: string;
  domain: string;
}

export default function InspectionRunner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [clients, setClients] = useState<Client[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  
  // Selection State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Search State
  const [clientSearch, setClientSearch] = useState('');
  const [equipmentSearch, setEquipmentSearch] = useState('');

  // --- Step 1: Fetch Clients ---
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const q = query(collection(firestore, 'clients'), orderBy('name'));
        const sn = await getDocs(q);
        const data = sn.docs.map(d => ({ id: d.id, ...d.data() } as Client));
        setClients(data);
      } catch (err) {
        console.error("Error loading clients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // --- Step 2: Fetch Equipment for Selected Client ---
  useEffect(() => {
    if (step === 2 && selectedClient) {
      const fetchEquipment = async () => {
        setLoading(true);
        try {
          const q = query(
            collection(firestore, 'equipment'), 
            where('clientId', '==', selectedClient.id)
          );
          const sn = await getDocs(q);
          const data = sn.docs.map(d => ({ id: d.id, ...d.data() } as Equipment));
          setEquipmentList(data);
        } catch (err) {
          console.error("Error loading equipment", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEquipment();
    }
  }, [step, selectedClient]);

  // --- Step 3: Fetch Templates matching Equipment Domain ---
  useEffect(() => {
    if (step === 3 && selectedEquipment) {
      const fetchTemplates = async () => {
        setLoading(true);
        try {
          // Fetch templates for the specific domain
          // Note: If domain is missing, we might want to show general templates
          const domain = selectedEquipment.domain || 'general';
          
          const q = query(
            collection(firestore, 'templates'),
            where('domain', '==', domain),
            where('status', '==', 'published') // Only published templates
          );
          
          const sn = await getDocs(q);
          const data = sn.docs.map(d => ({ id: d.id, ...d.data() } as Template));
          setTemplates(data);
        } catch (err) {
          console.error("Error loading templates", err);
        } finally {
          setLoading(false);
        }
      };
      fetchTemplates();
    }
  }, [step, selectedEquipment]);

  // --- Filter Logic ---
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredEquipment = equipmentList.filter(e => 
    e.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
    e.serialNumber?.toLowerCase().includes(equipmentSearch.toLowerCase())
  );

  // --- Handlers ---
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setStep(2);
    setEquipmentSearch('');
  };

  const handleEquipmentSelect = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setStep(3);
  };

  const handleTemplateSelect = (tpl: Template) => {
    setSelectedTemplate(tpl);
    // TODO: Navigate to the actual filling page
    alert(`Starting inspection with template: ${tpl.name}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans" dir="rtl">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ClipboardCheck className="text-emerald-400" />
            ביצוע בדיקה חדשה
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
            <span className={step === 1 ? "text-emerald-400 font-bold" : step > 1 ? "text-emerald-500" : ""}>1. לקוח</span>
            <span className="text-slate-600">/</span>
            <span className={step === 2 ? "text-emerald-400 font-bold" : step > 2 ? "text-emerald-500" : ""}>2. ציוד</span>
            <span className="text-slate-600">/</span>
            <span className={step === 3 ? "text-emerald-400 font-bold" : ""}>3. תבנית</span>
          </div>
        </div>
      </header>

      {/* --- STEP 1: Select Client --- */}
      {step === 1 && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-white mb-4">בחר לקוח:</h2>
          <div className="flex items-center gap-4 mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <Search className="text-slate-400" />
            <input 
              type="text" 
              placeholder="חפש לקוח..." 
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-white"
              autoFocus
            />
          </div>
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => handleClientSelect(client)}
                  className="bg-slate-800 border border-slate-700 p-6 rounded-xl text-right hover:border-emerald-500 hover:bg-slate-800/80 transition-all group"
                >
                  <div className="flex justify-between mb-4">
                    <User className="text-slate-500 group-hover:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{client.name}</h3>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- STEP 2: Select Equipment --- */}
      {step === 2 && selectedClient && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-white mb-4">בחר ציוד ({selectedClient.name}):</h2>
          <div className="flex items-center gap-4 mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <Search className="text-slate-400" />
            <input 
              type="text" 
              placeholder="חפש ציוד..." 
              value={equipmentSearch}
              onChange={(e) => setEquipmentSearch(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-white"
              autoFocus
            />
          </div>
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEquipment.map(eq => (
                <button
                  key={eq.id}
                  onClick={() => handleEquipmentSelect(eq)}
                  className="bg-slate-800 border border-slate-700 p-5 rounded-xl text-right hover:border-emerald-500 hover:bg-slate-800/80 transition-all group flex items-center gap-4"
                >
                  <Box className="text-slate-500 group-hover:text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">{eq.name}</h3>
                    {eq.serialNumber && <p className="text-sm text-slate-400 font-mono">S/N: {eq.serialNumber}</p>}
                  </div>
                </button>
              ))}
              {filteredEquipment.length === 0 && (
                <div className="col-span-full text-center p-12 bg-slate-800/30 border border-dashed border-slate-700 rounded-xl">
                  <p className="text-slate-400">לא נמצא ציוד. <button onClick={() => navigate(`/admin/equipment/new?clientId=${selectedClient.id}`)} className="text-emerald-400 underline">הוסף חדש</button></p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- STEP 3: Select Template --- */}
      {step === 3 && selectedEquipment && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">בחר תבנית בדיקה</h2>
              <p className="text-slate-400 text-sm">
                מותאם ל: <span className="text-emerald-400 font-medium">{selectedEquipment.name}</span> (תחום: {selectedEquipment.domain})
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {templates.length > 0 ? templates.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => handleTemplateSelect(tpl)}
                  className="bg-slate-800 border border-slate-700 p-6 rounded-xl text-right hover:border-emerald-500 hover:bg-slate-800/80 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-700 rounded-lg group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{tpl.name}</h3>
                      <p className="text-sm text-slate-400">{tpl.description || 'ללא תיאור'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>התחל בדיקה</span>
                    <Play size={16} fill="currentColor" />
                  </div>
                </button>
              )) : (
                <div className="text-center p-12 bg-slate-800/30 border border-dashed border-slate-700 rounded-xl">
                  <FileText className="mx-auto text-slate-600 mb-3" size={32} />
                  <p className="text-slate-400 font-medium">לא נמצאו תבניות מתאימות לתחום "{selectedEquipment.domain}"</p>
                  <p className="text-slate-500 text-sm mt-1">יש ליצור תבנית חדשה בסטטוס "Published" לתחום זה.</p>
                  <button 
                    onClick={() => navigate('/templates')}
                    className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm underline"
                  >
                    עבור לניהול תבניות
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
