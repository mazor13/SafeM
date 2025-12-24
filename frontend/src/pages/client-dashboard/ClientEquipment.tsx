import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore as db, storage } from '../../firebase';
import { Equipment, ModuleType } from '../../types';
import { useClient } from '../../providers/ClientProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useSystem } from '../../providers/SystemProvider';

// ייבוא מפורש של כל האייקונים כדי למנוע שגיאות TypeScript
import { 
  WrenchScrewdriverIcon, 
  PlusIcon, 
  FunnelIcon, 
  FireIcon, 
  BoltIcon, 
  ShieldCheckIcon,
  XMarkIcon,
  PencilSquareIcon,
  MapPinIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ClockIcon,
  PaperClipIcon,
  ArrowPathIcon,
  CubeIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface AssetEvent {
  id: string;
  date: string;
  type: 'repair' | 'maintenance' | 'calibration' | 'inspection' | 'other';
  description: string;
  cost: number;
  currency: 'ILS' | 'USD' | 'EUR';
  providerName: string;
  documentRef?: string;
  documentUrl?: string;
  documentName?: string;
}

interface ExtendedEquipment extends Equipment {
  location?: string;
  purchaseInfo?: {
    date: string;
    price: number;
    currency: 'ILS' | 'USD' | 'EUR';
    vendor: string;
    orderNumber: string;
    fundingSource?: 'capex' | 'opex';
  };
  serviceProvider?: {
    name: string;
    phone: string;
    email: string;
    contractExpires?: string;
  };
  historyLog?: AssetEvent[];
}

export default function ClientEquipment() {
  const { clientId } = useParams<{ clientId: string }>();
  const { client } = useClient();
  const { user } = useAuth();
  const { modules, loading: systemLoading } = useSystem();
  
  const [equipmentList, setEquipmentList] = useState<ExtendedEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'procurement' | 'history'>('identity');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState<number | null>(null);

  const initialFormState = {
    name: '', type: 'safety', model: '', serialNumber: '', location: '', status: 'active', nextInspectionDate: new Date().toISOString().split('T')[0],
    purchaseDate: '', purchasePrice: 0, currency: 'ILS', vendor: '', orderNumber: '', fundingSource: 'opex',
    serviceName: '', servicePhone: '', serviceEmail: '', contractExpires: '',
    historyLog: [] as AssetEvent[]
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  // --- Dynamic Icon Helper ---
  const getModuleIcon = (iconKey: string) => {
    const map: Record<string, React.ElementType> = {
      bolt: BoltIcon,
      fire: FireIcon,
      wrench: WrenchScrewdriverIcon,
      beaker: BeakerIcon,
      shield: ShieldCheckIcon
    };
    return map[iconKey] || CubeIcon;
  };

  // --- GATEKEEPER LOGIC ---
  const isModuleActive = (moduleId: string) => {
    // זמני: פותח הכל כדי שתוכל לראות את המערכת כמנהל על
    return true; 
  };

  const fetchEquipment = async () => {
    if (!clientId) return;
    try {
      const q = collection(db, 'clients', clientId, 'equipment');
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ExtendedEquipment[];
      setEquipmentList(data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEquipment(); }, [clientId]);

  const calculateTCO = (item: ExtendedEquipment) => {
    let total = item.purchaseInfo?.price || 0;
    if (item.historyLog) {
      item.historyLog.forEach(event => total += Number(event.cost || 0));
    }
    return total;
  };

  const openModal = (item?: ExtendedEquipment) => {
    if (item) {
      setEditingId(item.id);
      setActiveTab('identity');
      const toDateStr = (ts: any) => ts instanceof Timestamp ? ts.toDate().toISOString().split('T')[0] : (ts || '');

      setFormData({
        name: item.name,
        type: item.type,
        model: item.model || '',
        serialNumber: item.serialNumber || '',
        location: item.location || '',
        status: item.status,
        nextInspectionDate: toDateStr(item.nextInspectionDate),
        purchaseDate: item.purchaseInfo?.date || '',
        purchasePrice: item.purchaseInfo?.price || 0,
        currency: item.purchaseInfo?.currency || 'ILS',
        vendor: item.purchaseInfo?.vendor || '',
        orderNumber: item.purchaseInfo?.orderNumber || '',
        fundingSource: item.purchaseInfo?.fundingSource || 'opex',
        serviceName: item.serviceProvider?.name || '',
        servicePhone: item.serviceProvider?.phone || '',
        serviceEmail: item.serviceProvider?.email || '',
        contractExpires: item.serviceProvider?.contractExpires || '',
        historyLog: item.historyLog || []
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
      setActiveTab('identity');
    }
    setIsModalOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentEventIndex !== null && clientId) {
      const file = e.target.files[0];
      setUploadingFile(true);
      try {
        const storagePath = `documents/clients/${clientId}/equipment_history/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        const updatedLog = [...formData.historyLog];
        updatedLog[currentEventIndex] = {
          ...updatedLog[currentEventIndex],
          documentUrl: downloadUrl,
          documentName: file.name
        };
        setFormData({ ...formData, historyLog: updatedLog });
      } catch (error) {
        console.error("Upload failed", error);
        alert("שגיאה בהעלאת הקובץ");
      } finally {
        setUploadingFile(false);
        setCurrentEventIndex(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = (index: number) => {
    setCurrentEventIndex(index);
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !client) return;
    setIsSubmitting(true);
    
    try {
      const equipmentData: any = {
        name: formData.name,
        type: formData.type,
        model: formData.model,
        serialNumber: formData.serialNumber,
        location: formData.location,
        status: formData.status,
        organizationId: client.organizationId, 
        clientId: clientId,
        nextInspectionDate: Timestamp.fromDate(new Date(formData.nextInspectionDate)),
        purchaseInfo: {
          date: formData.purchaseDate,
          price: Number(formData.purchasePrice),
          currency: formData.currency,
          vendor: formData.vendor,
          orderNumber: formData.orderNumber,
          fundingSource: formData.fundingSource
        },
        serviceProvider: {
          name: formData.serviceName,
          phone: formData.servicePhone,
          email: formData.serviceEmail,
          contractExpires: formData.contractExpires
        },
        historyLog: formData.historyLog
      };

      if (editingId) {
        await updateDoc(doc(db, 'clients', clientId, 'equipment', editingId), equipmentData);
      } else {
        equipmentData.createdAt = Timestamp.now();
        await addDoc(collection(db, 'clients', clientId, 'equipment'), equipmentData);
      }
      setIsModalOpen(false);
      await fetchEquipment();
    } catch (e) {
      console.error("Error saving:", e);
      alert("שגיאה בשמירה");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addHistoryEvent = () => {
    const newEvent: AssetEvent = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'repair',
      description: '',
      cost: 0,
      currency: 'ILS',
      providerName: ''
    };
    setFormData({ ...formData, historyLog: [newEvent, ...formData.historyLog] });
  };

  const updateHistoryEvent = (index: number, field: string, value: any) => {
    const updatedLog = [...formData.historyLog];
    updatedLog[index] = { ...updatedLog[index], [field]: value };
    setFormData({ ...formData, historyLog: updatedLog });
  };

  // --- Dynamic Filtering ---
  const filteredList = filterType === 'all' 
    ? equipmentList 
    : equipmentList.filter(item => item.type === filterType);
  
  const getStatusBadge = (status: string) => {
    const styles = { active: 'bg-green-100 text-green-800', storage: 'bg-orange-100 text-orange-800', maintenance: 'bg-red-100 text-red-800', retired: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status as keyof typeof styles] || styles.retired}`}>{status}</span>;
  };

  if (systemLoading) return <div>Loading system config...</div>;

  return (
    <div>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />

      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ניהול תיק מכשור</h2>
          <p className="text-sm text-gray-500">ניהול מלאי, היסטוריית טיפולים ועלויות (TCO).</p>
        </div>
        <button onClick={() => openModal()} className="mt-4 md:mt-0 ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" /> הקמת מכשיר
        </button>
      </div>

      {/* DYNAMIC Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button 
             onClick={() => setFilterType('all')} 
             className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
               filterType === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
             }`}
          >
            <FunnelIcon className="h-5 w-5 ml-2" /> הכל
          </button>

          {modules
            .filter(mod => isModuleActive(mod.id))
            .map(mod => {
              const Icon = getModuleIcon(mod.iconKey);
              return (
                <button 
                  key={mod.id}
                  onClick={() => setFilterType(mod.id)} 
                  className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    filterType === mod.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 ml-2" />
                  {mod.label}
                </button>
              );
            })}
        </nav>
      </div>

      {/* Main Table */}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מכשיר</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מיקום וסטטוס</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">TCO</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות אחרונות</th>
              <th className="relative px-6 py-3"><span className="sr-only">ערוך</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredList.map((item) => {
              const mod = modules.find(m => m.id === item.type);
              const TypeIcon = mod ? getModuleIcon(mod.iconKey) : CubeIcon;
              
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="h-6 w-6 text-gray-600"/>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center"><MapPinIcon className="h-3 w-3 ml-1 text-gray-400"/> {item.location || '-'}</div>
                    <div className="mt-1">{getStatusBadge(item.status)}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₪{calculateTCO(item).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                     {item.historyLog && item.historyLog.length > 0 ? (
                       <div className="flex flex-col space-y-1">
                         <span className="text-xs bg-gray-100 px-2 py-0.5 rounded w-fit">{item.historyLog[0].date} - {item.historyLog[0].type}</span>
                       </div>
                     ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => openModal(item)} className="text-indigo-600 hover:text-indigo-900"><PencilSquareIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsModalOpen(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">{editingId ? 'תיק מכשיר ועלויות' : 'הקמת נכס חדש'}</h3>
                <button onClick={() => setIsModalOpen(false)}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
              </div>

              <div className="border-b border-gray-200 bg-white">
                <nav className="-mb-px flex">
                  {[
                    {id: 'identity', label: 'זהות ומיקום', icon: DocumentTextIcon},
                    {id: 'procurement', label: 'רכש והסכמים', icon: BanknotesIcon},
                    {id: 'history', label: 'היסטוריה (Timeline)', icon: ClockIcon}
                  ].map((tab: any) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                      className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'}`}>
                      <tab.icon className="h-5 w-5 ml-2" /> {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <form onSubmit={handleSubmit} className="h-[500px] overflow-y-auto bg-gray-50">
                <div className="p-6">
                  {/* Tab 1: Identity */}
                  {activeTab === 'identity' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700">שם הציוד *</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                        
                        {/* DYNAMIC SELECT */}
                        <div><label className="block text-sm font-medium text-gray-700">סוג</label>
                          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="mt-1 block w-full border p-2 rounded">
                            {modules
                              .filter(mod => isModuleActive(mod.id))
                              .map(mod => (
                                <option key={mod.id} value={mod.id}>{mod.label}</option>
                              ))
                            }
                          </select>
                        </div>

                        <div><label className="block text-sm font-medium text-gray-700">סטטוס</label>
                          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="mt-1 block w-full border p-2 rounded">
                            <option value="active">פעיל</option><option value="maintenance">בתיקון</option><option value="storage">באחסון</option>
                          </select>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700">מיקום</label><input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700">יצרן / דגם</label><input value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">מספר סידורי</label><input value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">בדיקה הבאה</label><input type="date" required value={formData.nextInspectionDate} onChange={e => setFormData({...formData, nextInspectionDate: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tab 2: Procurement */}
                  {activeTab === 'procurement' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700">תאריך רכישה</label><input type="date" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">מחיר (₪)</label><input type="number" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">ספק</label><input value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">מספר הזמנה (PO)</label><input value={formData.orderNumber} onChange={e => setFormData({...formData, orderNumber: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                       </div>
                       <hr className="my-2"/>
                       <div className="grid grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700">שם נותן שירות</label><input value={formData.serviceName} onChange={e => setFormData({...formData, serviceName: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">תוקף חוזה שירות</label><input type="date" value={formData.contractExpires} onChange={e => setFormData({...formData, contractExpires: e.target.value})} className="mt-1 block w-full border p-2 rounded" /></div>
                       </div>
                    </div>
                  )}

                  {/* Tab 3: History */}
                  {activeTab === 'history' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-bold text-gray-900">ציר זמן אירועים</h4>
                        <button type="button" onClick={addHistoryEvent} className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded border border-indigo-200">+ הוסף אירוע</button>
                      </div>

                      {formData.historyLog.map((event: AssetEvent, idx: number) => (
                        <div key={idx} className="bg-white p-4 rounded border border-gray-200 flex flex-col gap-3 shadow-sm relative">
                           <div className="absolute top-4 left-4 text-xs font-bold text-gray-400">#{idx + 1}</div>
                           <div className="grid grid-cols-4 gap-4">
                             <div><label className="text-xs text-gray-500">תאריך</label><input type="date" value={event.date} onChange={e => updateHistoryEvent(idx, 'date', e.target.value)} className="w-full text-sm border-b" /></div>
                             <div><label className="text-xs text-gray-500">סוג</label>
                               <select value={event.type} onChange={e => updateHistoryEvent(idx, 'type', e.target.value)} className="w-full text-sm border-b bg-transparent">
                                 <option value="repair">תיקון</option><option value="maintenance">אחזקה</option><option value="calibration">כיול</option>
                               </select>
                             </div>
                             <div><label className="text-xs text-gray-500">עלות</label><input type="number" value={event.cost} onChange={e => updateHistoryEvent(idx, 'cost', e.target.value)} className="w-full text-sm font-bold text-red-600 border-b" /></div>
                             
                             <div className="flex items-end">
                               {event.documentUrl ? (
                                 <a href={event.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline truncate max-w-[100px]" title={event.documentName}>
                                   {event.documentName || 'צפה בקובץ'}
                                 </a>
                               ) : (
                                 <button type="button" disabled={uploadingFile} onClick={() => triggerFileUpload(idx)} className="text-xs flex items-center text-gray-500 hover:text-indigo-600">
                                   {uploadingFile && currentEventIndex === idx ? <ArrowPathIcon className="h-4 w-4 animate-spin"/> : <PaperClipIcon className="h-4 w-4 mr-1"/>}
                                   צרף מסמך
                                 </button>
                               )}
                             </div>
                           </div>
                           <input placeholder="תיאור העבודה..." value={event.description} onChange={e => updateHistoryEvent(idx, 'description', e.target.value)} className="w-full text-sm border p-1 rounded bg-gray-50" />
                        </div>
                      ))}
                    </div>
                  )}

                </div>
                {/* Footer Buttons */}
                <div className="bg-gray-100 px-4 py-3 border-t flex flex-row-reverse sticky bottom-0">
                  <button type="submit" disabled={isSubmitting} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
                    {isSubmitting ? 'שומר...' : 'שמור נתונים'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                    סגור
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
