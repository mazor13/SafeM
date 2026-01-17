#!/bin/bash

echo "🚀 Starting Phase 1: Sales Core Implementation..."

# 1. עדכון Types (הוספת ההגדרות החדשות לקובץ הקיים)
# אנחנו משתמשים ב-cat >> כדי להוסיף לסוף הקובץ, אבל עדיף לוודא שהמבנה נכון.
# כאן אני מייצר את הקובץ מחדש עם כל ההגדרות (הישנות + החדשות) ליתר ביטחון.

cat > frontend/src/types/crm.ts << 'EOF'
import { Timestamp } from 'firebase/firestore';

// --- Leads ---
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'חדש' },
  { value: 'contacted', label: 'נוצר קשר' },
  { value: 'qualified', label: 'מוסמך' },
  { value: 'unqualified', label: 'לא רלוונטי' },
  { value: 'converted', label: 'הומר ללקוח' },
];

export const LEAD_SOURCES = [
  { value: 'website', label: 'אתר אינטרנט' },
  { value: 'referral', label: 'הפניה' },
  { value: 'linkedin', label: 'לינקדאין' },
  { value: 'cold_call', label: 'שיחה יזומה' },
  { value: 'event', label: 'כנס/אירוע' },
];

export const LEAD_RATINGS = [
  { value: 'hot', label: 'חם', emoji: '🔥' },
  { value: 'warm', label: 'פושר', emoji: '☀️' },
  { value: 'cold', label: 'קר', emoji: '❄️' },
];

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  status: LeadStatus;
  source: string;
  rating: string;
  notes?: string;
  createdAt: any;
  updatedAt: any;
  convertedToTenantId?: string;
  convertedAt?: any;
}

// --- Contacts (חדש) ---
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  tenantId: string; // חובה לקשר ללקוח
  tenantName: string;
  isPrimary: boolean;
  createdAt: any;
}

// --- Opportunities (חדש) ---
export type OpportunityStage = 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';

export const OPP_STAGES: { value: OpportunityStage; label: string; color: string }[] = [
  { value: 'discovery', label: 'זיהוי צרכים', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'proposal', label: 'הצעת מחיר', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'negotiation', label: 'משא ומתן', color: 'bg-purple-500/20 text-purple-400' },
  { value: 'won', label: 'סגירה (זכייה)', color: 'bg-emerald-500/20 text-emerald-400' },
  { value: 'lost', label: 'הפסד', color: 'bg-rose-500/20 text-rose-400' },
];

export interface Opportunity {
  id: string;
  title: string;
  value: number;
  stage: OpportunityStage;
  probability: number;
  expectedCloseDate: any;
  contactId?: string;
  tenantId?: string;
  tenantName?: string;
  assignedTo: string;
  createdAt: any;
}

// --- Activities ---
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'whatsapp';

export const ACTIVITY_TYPES = [
  { value: 'call', label: 'שיחה', icon: '📞' },
  { value: 'email', label: 'אימייל', icon: '📧' },
  { value: 'meeting', label: 'פגישה', icon: '📅' },
  { value: 'note', label: 'הערה', icon: '📝' },
];

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description: string;
  relatedToType: 'lead' | 'contact' | 'opportunity';
  relatedToId: string;
  status: 'completed' | 'scheduled';
  createdAt: any;
}

// --- Safety Files ---
export type SafetyFileType = 'laser' | 'fire_risk' | 'machinery' | 'chemical' | 'general' | 'heights' | 'accessibility' | 'radiation';
export type SafetyFileStatus = 'draft' | 'in_progress' | 'pending_approval' | 'approved' | 'expired' | 'active' | 'review_needed' | 'archived';

export const SAFETY_FILE_TYPES = [
  { value: 'general', label: 'תיק מפעל כללי' },
  { value: 'fire_risk', label: 'תיק שטח (אש)' },
  { value: 'laser', label: 'בטיחות לייזר' },
  { value: 'radiation', label: 'בטיחות קרינה' },
];

export interface SafetyFile {
  id: string;
  title: string;
  type: SafetyFileType;
  status: SafetyFileStatus;
  tenantId: string;
  tenantName?: string;
  validUntil?: any;
  responsibleOfficerName?: string;
  createdAt: any;
}
EOF

# 2. יצירת דף ContactsPage.tsx
cat > frontend/src/pages/admin/crm/ContactsPage.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { Users, Search, Mail, Phone, Building2, Plus, X } from 'lucide-react';
import { Contact } from '../../../types/crm';

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${className}`}>{children}</div>
);

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', role: '', tenantName: '' });

  const fetchContacts = async () => {
    try {
      const q = query(collection(firestore, 'contacts'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      setContacts(sn.docs.map(d => ({ id: d.id, ...d.data() })) as Contact[]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'contacts'), {
        ...formData,
        tenantId: 'temp-id', // בעתיד יחובר ל-Tenant אמיתי
        isPrimary: false,
        createdAt: Timestamp.now()
      });
      setIsModalOpen(false);
      fetchContacts();
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: '', tenantName: '' });
    } catch (e) { console.error(e); }
  };

  const filtered = contacts.filter(c => 
    c.firstName.includes(search) || c.lastName.includes(search) || c.email.includes(search)
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">אנשי קשר</h1>
          <p className="text-slate-400 text-sm">ניהול אנשי קשר בכל הארגונים</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex gap-2 items-center">
          <Plus size={18} /> איש קשר חדש
        </button>
      </div>

      <GlassCard className="p-4 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-2.5 text-slate-500" size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חיפוש..." className="w-full bg-slate-800 text-white px-10 py-2 rounded-xl border border-white/10" />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="text-white p-4">טוען...</div> : filtered.map(c => (
          <GlassCard key={c.id} className="p-5 hover:border-indigo-500/30 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-white">
                  {c.firstName[0]}{c.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-white">{c.firstName} {c.lastName}</h3>
                  <p className="text-xs text-slate-400">{c.role} @ {c.tenantName}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300"><Mail size={14}/> {c.email}</div>
              <div className="flex items-center gap-2 text-slate-300"><Phone size={14}/> {c.phone}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-white">איש קשר חדש</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400"/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required placeholder="שם פרטי" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input required placeholder="שם משפחה" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input required placeholder="אימייל" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input placeholder="טלפון" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input placeholder="תפקיד" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input placeholder="חברה (שם הלקוח)" value={formData.tenantName} onChange={e => setFormData({...formData, tenantName: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">שמור</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
EOF

# 3. יצירת דף OpportunitiesPage.tsx (Kanban)
cat > frontend/src/pages/admin/crm/OpportunitiesPage.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { Target, Plus, X, DollarSign, Calendar } from 'lucide-react';
import { Opportunity, OPP_STAGES, OpportunityStage } from '../../../types/crm';

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm ${className}`}>{children}</div>
);

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', value: 0, stage: 'discovery', probability: 20 });

  const fetchOpps = async () => {
    try {
      const q = query(collection(firestore, 'opportunities'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      setOpps(sn.docs.map(d => ({ id: d.id, ...d.data() })) as Opportunity[]);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchOpps(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(firestore, 'opportunities'), {
      ...formData,
      createdAt: Timestamp.now(),
      assignedTo: 'Me',
    });
    setIsModalOpen(false);
    fetchOpps();
  };

  const calculateTotal = () => opps.reduce((sum, item) => sum + Number(item.value), 0);

  return (
    <div className="p-6 h-screen flex flex-col" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">הזדמנויות (Pipeline)</h1>
          <p className="text-slate-400 text-sm">שווי צנרת כולל: ₪{calculateTotal().toLocaleString()}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex gap-2 items-center">
          <Plus size={18} /> הזדמנות חדשה
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-[1200px] h-full pb-4">
          {OPP_STAGES.map(stage => (
            <div key={stage.value} className="flex-1 flex flex-col gap-3 min-w-[280px]">
              <div className={`p-3 rounded-xl font-bold text-sm flex justify-between items-center ${stage.color}`}>
                <span>{stage.label}</span>
                <span className="bg-black/20 px-2 py-0.5 rounded text-xs">
                  {opps.filter(o => o.stage === stage.value).length}
                </span>
              </div>
              
              <div className="flex-1 bg-slate-900/20 rounded-xl p-2 space-y-3 overflow-y-auto">
                {opps.filter(o => o.stage === stage.value).map(opp => (
                  <GlassCard key={opp.id} className="p-4 cursor-grab active:cursor-grabbing hover:border-white/20 transition-all">
                    <div className="font-bold text-white mb-2">{opp.title}</div>
                    <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
                      <div className="flex items-center gap-1"><DollarSign size={12}/> {Number(opp.value).toLocaleString()}</div>
                      <div>{opp.probability}%</div>
                    </div>
                    {opp.tenantName && (
                      <div className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded w-fit">
                        {opp.tenantName}
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">הזדמנות חדשה</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required placeholder="שם העסקה" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <input type="number" required placeholder="שווי מוערך (₪)" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10" />
              <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value as any})} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-white/10">
                {OPP_STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">צור הזדמנות</button>
            </form>
            <button onClick={() => setIsModalOpen(false)} className="mt-2 w-full text-slate-400 text-sm">ביטול</button>
          </div>
        </div>
      )}
    </div>
  );
}
EOF

# 4. חיבור ל-Router (App.tsx)
# אנחנו משתמשים ב-sed כדי להחליף את קבצי ה"Coming Soon" בקבצים האמיתיים שיצרנו הרגע.
# במקום לדרוס את כל הקובץ, אנחנו נחליף רק את השורות הרלוונטיות.

# החלפת ה-Import של Contacts
sed -i "s|import Contacts from './pages/admin/crm/Contacts';|import ContactsPage from './pages/admin/crm/ContactsPage';|g" frontend/src/App.tsx
# החלפת ה-Route של Contacts
sed -i "s|<Route path=\"crm/contacts\" element={<Contacts />} />|<Route path=\"crm/contacts\" element={<ContactsPage />} />|g" frontend/src/App.tsx

# החלפת ה-Import של Opportunities
sed -i "s|import Opportunities from './pages/admin/crm/Opportunities';|import OpportunitiesPage from './pages/admin/crm/OpportunitiesPage';|g" frontend/src/App.tsx
# החלפת ה-Route של Opportunities
sed -i "s|<Route path=\"crm/opportunities\" element={<Opportunities />} />|<Route path=\"crm/opportunities\" element={<OpportunitiesPage />} />|g" frontend/src/App.tsx

# 5. יצירת תיעוד למשתמש (User Guide)
mkdir -p frontend/public/docs
cat > frontend/public/docs/SALES_USER_GUIDE.md << 'EOF'
# מדריך משתמש - מודול מכירות (Sales Core)
גרסה: 1.0

## 1. ניהול אנשי קשר
דף אנשי הקשר מרכז את כל בעלי התפקידים אצל הלקוחות שלך.
* **יצירה:** לחץ על "איש קשר חדש" ומלא את הפרטים.
* **שיוך:** חובה לרשום את שם החברה (Tenant) אליה שייך איש הקשר.

## 2. ניהול הזדמנויות (Pipeline)
לוח ה-Kanban מאפשר לך לראות את כל העסקאות הפתוחות.
* **שלבים:** כל עסקה מתחילה ב"זיהוי צרכים" ומתקדמת ימינה עד לסגירה.
* **יצירה:** לחץ על "הזדמנות חדשה", תן לה שם ושווי כספי.
* **מדדים:** בראש העמוד תוכל לראות את סך כל הכסף שנמצא כרגע בצנרת.

## תמיכה
נתקלת בבעיה? פנה למנהל המערכת.
EOF

echo "✅ Phase 1 Implemented (Types, Pages, Docs, Router)."
echo "🏗️ Building and Deploying..."

cd frontend && npm run build

if [ $? -eq 0 ]; then
  echo "🚀 Build Success! Deploying to Firebase..."
  cd ..
  firebase deploy --only hosting
else
  echo "❌ Build Failed. Check errors above."
fi
