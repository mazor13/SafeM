import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Cloud, HardDrive, Share2, FolderTree, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StorageServiceCard from './infra/StorageServiceCard';
import StorageConfigWizard from './infra/StorageConfigWizard';

const SERVICES_METADATA = [
  {
    id: 'google_drive',
    icon: <Cloud className="text-blue-400" />,
    title: 'Google Drive',
    desc: 'שיתוף דוחות אוטומטי לצוות.',
    help: 'צור תיקייה ושתף עם ה-Service Account.',
    minPlan: 'starter'
  },
  {
    id: 'onedrive',
    icon: <Cloud className="text-blue-600" />,
    title: 'Microsoft OneDrive',
    desc: 'מתאים לסביבת Microsoft 365.',
    help: 'דורש רישום אפליקציה ב-Azure AD.',
    minPlan: 'pro'
  },
  {
    id: 's3',
    icon: <Share2 className="text-orange-400" />,
    title: 'Amazon S3 / Azure Blob',
    desc: 'אחסון ענן מקצועי למדיה כבדה.',
    help: 'דורש Bucket ומפתחות IAM.',
    minPlan: 'enterprise'
  },
  {
    id: 'local_server',
    icon: <HardDrive className="text-slate-400" />,
    title: 'שרת פרטי (SFTP)',
    desc: 'שמירת מידע מקומית בארגון.',
    help: 'דורש IP סטטי וגישת SFTP.',
    minPlan: 'enterprise'
  }
];

const getPlanLevel = (plan: string) => {
    const normalizedPlan = plan?.toLowerCase().trim() || 'starter';
    if (normalizedPlan === 'enterprise') return 3;
    if (normalizedPlan === 'pro') return 2;
    return 1;
};

export default function InfraHub({ clientId, clientName, clientPlan, initialData }: any) {
  const [activeTab, setActiveTab] = useState<'list' | 'selection' | 'config'>('list');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [activeEngines, setActiveEngines] = useState<any[]>(initialData?.storageEngines || []);

  const currentLevel = getPlanLevel(clientPlan);

  const processedServices = SERVICES_METADATA.map(s => ({
      ...s,
      isLocked: getPlanLevel(s.minPlan) > currentLevel
  }));

  const handleSaveConfig = async (config: any) => {
      const newEngine = {
          id: `${config.type}_${Date.now()}`,
          ...config,
          label: SERVICES_METADATA.find(s => s.id === config.type)?.title || config.type,
          status: 'active',
          createdAt: new Date().toISOString()
      };
      const tenantRef = doc(firestore, 'clients', clientId);
      await updateDoc(tenantRef, { storageEngines: arrayUnion(newEngine) });
      setActiveEngines([...activeEngines, newEngine]);
      setActiveTab('list');
      setSelectedService(null);
  };

  const handleRemoveEngine = async (engine: any) => {
      if (!confirm('האם אתה בטוח שברצונך למחוק חיבור זה?')) return;
      const tenantRef = doc(firestore, 'clients', clientId);
      try {
          await updateDoc(tenantRef, { storageEngines: arrayRemove(engine) });
          setActiveEngines(activeEngines.filter(e => e.id !== engine.id));
      } catch (err) { alert("שגיאה במחיקת היעד"); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* ללא סטיקר דיבוג - נקי! */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 flex items-start gap-6">
        <div className="p-4 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
          <FolderTree size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">AEGIS Auto-Organizer™ פעיל</h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            המערכת מסדרת אוטומטית את הקבצים עבור <b>{clientName}</b>:
            <span className="text-indigo-300 font-mono mx-1"> 2025 &gt; חודש &gt; קטגוריה</span>.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">יעדים מחוברים ({activeEngines.length})</h3>
              <button onClick={() => setActiveTab('selection')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                <Plus size={16}/> הוסף חיבור
              </button>
            </div>
            
            {activeEngines.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/40 rounded-3xl border border-white/5 border-dashed">
                    <p className="text-slate-500 text-sm">עדיין לא הוגדרו יעדי אחסון.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeEngines.map((engine, idx) => (
                    <div key={idx} className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-700 rounded-lg text-indigo-400"><Cloud size={20}/></div>
                        <div>
                        <h4 className="font-bold text-white text-sm">{engine.label || engine.type}</h4>
                        <p className="text-[10px] text-emerald-400 flex items-center gap-1"><CheckCircle2 size={10}/> פעיל ומסונכרן</p>
                        </div>
                    </div>
                    <button onClick={() => handleRemoveEngine(engine)} className="p-2 text-slate-600 hover:text-rose-400 transition-colors hover:bg-white/5 rounded-lg"><Trash2 size={18}/></button>
                    </div>
                ))}
                </div>
            )}
          </motion.div>
        )}

        {activeTab === 'selection' && (
          <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processedServices.map((service) => (
              <StorageServiceCard key={service.id} service={service} onSelect={(s) => { setSelectedService(s); setActiveTab('config'); }} />
            ))}
          </motion.div>
        )}

        {activeTab === 'config' && selectedService && (
          <motion.div key="config" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
             <StorageConfigWizard service={selectedService} clientId={clientId} onBack={() => setActiveTab('selection')} onSave={handleSaveConfig} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
