#!/bin/bash

echo "🔧 Restoring YOUR CRM structure (Modals based)..."

# 1. שחזור LeadDetailPage.tsx (הקוד המקורי שלך - הוא מצוין)
# כולל את הטיפול בהמרת ליד ללקוח ויומן פעילויות
cat > frontend/src/pages/admin/crm/LeadDetailPage.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, addDoc, collection, Timestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { 
  ArrowRight, Mail, Phone, Building2, Globe,
  Edit2, Trash2, UserCheck, Clock, Activity as ActivityIcon,
  MessageSquare, Calendar, CheckCircle, X, AlertTriangle,
  Flame, Sun, Snowflake, Plus, Send, PhoneCall
} from 'lucide-react';
import { Lead, Activity, LEAD_STATUSES, LEAD_SOURCES, LEAD_RATINGS, ACTIVITY_TYPES } from '../../../types/crm';

// --- Glass Card Component ---
const GlassCard = ({ children, className = '', title, action }: { 
  children: React.ReactNode; 
  className?: string;
  title?: string;
  action?: React.ReactNode;
}) => (
  <div className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden ${className}`}>
    {title && (
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h3 className="font-bold text-white">{title}</h3>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

// --- Convert to Client Modal ---
const ConvertModal = ({ isOpen, onClose, lead, onSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [tenantData, setTenantData] = useState({
    name: lead.company || `${lead.firstName} ${lead.lastName}`,
    domain: '',
    plan: 'basic',
  });

  const handleConvert = async () => {
    setLoading(true);
    try {
      const tenantRef = await addDoc(collection(firestore, 'tenants'), {
        name: tenantData.name,
        domain: tenantData.domain,
        plan: tenantData.plan,
        status: 'active',
        healthScore: 100,
        usersCount: 1,
        usersLimit: 5,
        createdAt: Timestamp.now(),
        convertedFromLeadId: lead.id,
      });

      await addDoc(collection(firestore, 'contacts'), {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        title: lead.title,
        tenantId: tenantRef.id,
        tenantName: tenantData.name,
        isPrimary: true,
        status: 'active',
        createdAt: Timestamp.now(),
      });

      await updateDoc(doc(firestore, 'leads', lead.id), {
        status: 'converted',
        convertedAt: Timestamp.now(),
        convertedToTenantId: tenantRef.id,
        updatedAt: Timestamp.now(),
      });

      onSuccess();
    } catch (err) {
      console.error('Error converting lead:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <UserCheck size={20} className="text-emerald-400" />
            </div>
            המרה ללקוח
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <p className="text-sm text-indigo-200">
              הליד <strong>{lead.firstName} {lead.lastName}</strong> יומר ללקוח חדש במערכת.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">שם הלקוח</label>
            <input
              type="text"
              value={tenantData.name}
              onChange={(e) => setTenantData({ ...tenantData, name: e.target.value })}
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">דומיין (Subdomain)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tenantData.domain}
                onChange={(e) => setTenantData({ ...tenantData, domain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="company-name"
              />
              <span className="text-slate-500 text-sm">.safe-m.app</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors">ביטול</button>
            <button onClick={handleConvert} disabled={loading || !tenantData.domain} className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50">
              {loading ? 'מבצע...' : 'המר ללקוח'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Log Activity Modal ---
const LogActivityModal = ({ isOpen, onClose, leadId, onSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [activityData, setActivityData] = useState({
    type: 'call' as Activity['type'],
    subject: '',
    description: '',
    status: 'completed' as Activity['status'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'activities'), {
        ...activityData,
        relatedToType: 'lead',
        relatedToId: leadId,
        createdAt: Timestamp.now(),
      });
      onSuccess();
      onClose();
      setActivityData({ type: 'call', subject: '', description: '', status: 'completed' });
    } catch (err) {
      console.error('Error logging activity:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">רישום פעילות</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">נושא</label>
            <input type="text" required value={activityData.subject} onChange={(e) => setActivityData({ ...activityData, subject: e.target.value })} className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">פרטים</label>
            <textarea value={activityData.description} onChange={(e) => setActivityData({ ...activityData, description: e.target.value })} rows={3} className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors">ביטול</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50">{loading ? 'שומר...' : 'שמור'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLead();
      fetchActivities();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      const docRef = doc(firestore, 'leads', id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setLead({ id: docSnap.id, ...docSnap.data() } as Lead);
    } catch (err) { console.error('Error fetching lead:', err); } finally { setLoading(false); }
  };

  const fetchActivities = async () => {
    try {
      const q = query(collection(firestore, 'activities'), where('relatedToId', '==', id), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Activity[]);
    } catch (err) { 
      console.error('Error fetching activities:', err); 
      // שגיאה זו נפוצה אם חסר אינדקס. במקרה כזה לא נכשיל את הדף, רק נרשום בלוג
    }
  };

  if (loading) return <div className="p-10 text-white">טוען...</div>;
  if (!lead) return <div className="p-10 text-white">לא נמצא</div>;

  const statusInfo = LEAD_STATUSES.find(s => s.value === lead.status);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <button onClick={() => navigate('/admin/crm/leads')} className="hover:text-white">לידים</button>
        <ArrowRight size={14} className="rotate-180" />
        <span className="text-white">{lead.firstName} {lead.lastName}</span>
      </div>

      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-white">{lead.firstName} {lead.lastName}</h1>
        <div className="flex gap-2">
          {lead.status !== 'converted' && (
            <button onClick={() => setIsConvertModalOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2">
              <UserCheck size={18} /> המר ללקוח
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard title="פרטי קשר">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-white"><Mail size={16} className="inline ml-2" />{lead.email}</div>
              <div className="text-white"><Phone size={16} className="inline ml-2" />{lead.phone}</div>
              <div className="text-white"><Building2 size={16} className="inline ml-2" />{lead.company}</div>
            </div>
          </GlassCard>

          <GlassCard title="היסטוריית פעילות" action={
            <button onClick={() => setIsActivityModalOpen(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg font-bold flex items-center gap-1">
              <Plus size={14} /> רשום פעילות
            </button>
          }>
            {activities.length === 0 ? <p className="text-slate-500">אין פעילויות (או שחסר אינדקס ב-Firebase)</p> : (
              activities.map(act => (
                <div key={act.id} className="mb-4 border-b border-white/5 pb-2">
                  <div className="font-bold text-white">{act.subject}</div>
                  <div className="text-xs text-slate-400">{act.createdAt?.toDate?.().toLocaleDateString()}</div>
                </div>
              ))
            )}
          </GlassCard>
        </div>
      </div>

      <ConvertModal isOpen={isConvertModalOpen} onClose={() => setIsConvertModalOpen(false)} lead={lead} onSuccess={() => { setIsConvertModalOpen(false); fetchLead(); }} />
      <LogActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} leadId={lead.id} onSuccess={fetchActivities} />
    </div>
  );
}
EOF

# 2. שחזור LeadsPage.tsx (הקוד המקורי שלך - עם המודאל!)
# חזרנו להשתמש ב-CreateLeadModal הפנימי במקום לנווט לדף חיצוני
cat > frontend/src/pages/admin/crm/LeadsPage.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Filter, ArrowUpRight, Mail, Building2, AlertTriangle, Flame, Sun, Snowflake, Plus, X } from 'lucide-react';
import { Lead, LeadStatus, LEAD_STATUSES, LEAD_SOURCES, LEAD_RATINGS } from '../../../types/crm';

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const CreateLeadModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', title: '', source: 'website', rating: 'warm', notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'leads'), {
        ...formData,
        status: 'new' as LeadStatus,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      onSuccess();
      onClose();
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', title: '', source: 'website', rating: 'warm', notes: '' });
    } catch (err) { console.error('Error creating lead:', err); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <UserPlus size={20} className="text-indigo-400" /> ליד חדש
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="שם פרטי *" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="שם משפחה *" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="אימייל *" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="טלפון" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="חברה" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="תפקיד" className="bg-slate-800 text-white p-3 rounded-xl border border-white/10 w-full" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold">ביטול</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">{loading ? 'שומר...' : 'צור ליד'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const q = query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      setLeads(sn.docs.map(d => ({ id: d.id, ...d.data() })) as Lead[]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">ניהול לידים</h1>
          <p className="text-slate-400 text-sm">ניהול לידים נכנסים והזדמנויות</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2">
          <UserPlus size={18} /> ליד חדש
        </button>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">שם</th>
                <th className="px-6 py-4">חברה</th>
                <th className="px-6 py-4">סטטוס</th>
                <th className="px-6 py-4">אימייל</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? <tr><td colSpan={5} className="p-8 text-center text-slate-500">טוען...</td></tr> : leads.map(lead => (
                <tr key={lead.id} onClick={() => navigate(`/admin/crm/leads/${lead.id}`)} className="hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-bold text-white">{lead.firstName} {lead.lastName}</td>
                  <td className="px-6 py-4 text-slate-300">{lead.company || '-'}</td>
                  <td className="px-6 py-4"><span className="bg-slate-800 px-2 py-1 rounded text-xs">{LEAD_STATUSES.find(s=>s.value===lead.status)?.label}</span></td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{lead.email}</td>
                  <td className="px-6 py-4"><ArrowUpRight size={18} className="text-slate-500" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <CreateLeadModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchLeads} />
    </div>
  );
}
EOF

# 3. יצירת דפים חסרים (Contacts, Activities, Opportunities)
# כדי שלא יהיה 404 בתפריט
cat > frontend/src/pages/admin/crm/Contacts.tsx << 'EOF'
import React from 'react';
import { Users } from 'lucide-react';
export default function Contacts() {
  return <div className="p-10 text-center text-white"><Users size={48} className="mx-auto mb-4 opacity-50"/>אנשי קשר - בפיתוח</div>;
}
EOF

cat > frontend/src/pages/admin/crm/Activities.tsx << 'EOF'
import React from 'react';
import { Activity } from 'lucide-react';
export default function Activities() {
  return <div className="p-10 text-center text-white"><Activity size={48} className="mx-auto mb-4 opacity-50"/>פעילויות - בפיתוח</div>;
}
EOF

cat > frontend/src/pages/admin/crm/Opportunities.tsx << 'EOF'
import React from 'react';
import { Target } from 'lucide-react';
export default function Opportunities() {
  return <div className="p-10 text-center text-white"><Target size={48} className="mx-auto mb-4 opacity-50"/>הזדמנויות - בפיתוח</div>;
}
EOF

# 4. תיקון App.tsx שיפנה לדפים הנכונים (בלי leads/new, כי זה מודאל)
cat > frontend/src/App.tsx << 'EOF'
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './providers/AuthProvider';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';

// דפים
import AdminDashboard from './pages/admin/CommandCenter';
import ClientList from './pages/admin/ClientList';
import Client360 from './pages/admin/Client360';
import LeadsPage from './pages/admin/crm/LeadsPage';
import LeadDetailPage from './pages/admin/crm/LeadDetailPage';
import Contacts from './pages/admin/crm/Contacts';
import Activities from './pages/admin/crm/Activities';
import Opportunities from './pages/admin/crm/Opportunities';
import EquipmentPage from './pages/admin/equipment/EquipmentPage';
import EquipmentFormPage from './pages/admin/equipment/EquipmentFormPage';
import GlobalCatalog from './pages/admin/GlobalCatalog';
import SafetyFilesPage from './pages/admin/safety/SafetyFilesPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white">טוען...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/:clientId" element={<Client360 />} />
          
          {/* CRM Routes - Fixed */}
          <Route path="crm/leads" element={<LeadsPage />} />
          <Route path="crm/leads/:id" element={<LeadDetailPage />} />
          <Route path="crm/contacts" element={<Contacts />} />
          <Route path="crm/activities" element={<Activities />} />
          <Route path="crm/opportunities" element={<Opportunities />} />

          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="equipment/new" element={<EquipmentFormPage />} />
          <Route path="equipment/:equipmentId" element={<EquipmentFormPage />} />
          <Route path="products" element={<GlobalCatalog />} />
          <Route path="safety/files" element={<SafetyFilesPage />} />
          
          <Route path="*" element={<div className="p-10 text-white">404 - דף לא נמצא</div>} />
        </Route>
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
EOF

echo "🚀 Restored Modal-based CRM. Building..."
cd frontend && npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build Successful. Deploying..."
  cd ..
  firebase deploy --only hosting
else
  echo "❌ Build Failed."
fi
