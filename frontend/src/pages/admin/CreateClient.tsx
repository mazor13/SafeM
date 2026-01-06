import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, writeBatch, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Building2, Globe, Mail, ShieldCheck, ArrowRight, Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react';

// --- Blueprints Definition ---
const BLUEPRINTS = {
  starter: { 
    label: 'Starter', 
    maxUsers: 5, 
    storage: '5GB', 
    modules: ['safety_basic'],
    support: 'email'
  },
  pro: { 
    label: 'Professional', 
    maxUsers: 50, 
    storage: '50GB', 
    modules: ['safety_pro', 'reports', 'api'],
    support: 'priority'
  },
  enterprise: { 
    label: 'Enterprise', 
    maxUsers: 9999, 
    storage: 'BYOS', 
    modules: ['all', 'white_label', 'sso'],
    support: 'dedicated_csm'
  }
};

export default function CreateClient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    contactPerson: '',
    email: '',
    plan: 'pro' as keyof typeof BLUEPRINTS,
  });

  // --- Smart Slugify ---
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const autoSlug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({ ...prev, name, domain: autoSlug }));
  };

  // --- Real-time Availability Check ---
  useEffect(() => {
    const checkSlug = async () => {
      if (!formData.domain || formData.domain.length < 3) {
        setSlugStatus('idle');
        return;
      }
      setSlugStatus('checking');
      try {
        const q = query(collection(firestore, 'clients'), where('domain', '==', formData.domain));
        const snapshot = await getDocs(q);
        setSlugStatus(snapshot.empty ? 'available' : 'taken');
      } catch (err) {
        console.error("Slug check failed", err);
        setSlugStatus('idle');
      }
    };
    const debounce = setTimeout(checkSlug, 500);
    return () => clearTimeout(debounce);
  }, [formData.domain]);

  // --- The Atomic Provisioning Engine ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugStatus === 'taken') return;
    
    setLoading(true);

    try {
      const selectedBlueprint = BLUEPRINTS[formData.plan];
      const batch = writeBatch(firestore); // מתחילים אצווה (Batch)

      // 1. הכנת מזהים ייחודיים מראש
      const newTenantRef = doc(collection(firestore, 'clients'));
      const newUserRef = doc(collection(firestore, 'users'));

      // 2. הכנת מסמך הלקוח (Tenant)
      const newTenantData = {
        name: formData.name,
        domain: formData.domain,
        status: 'active',
        healthScore: 100,
        plan: formData.plan,
        usersLimit: selectedBlueprint.maxUsers,
        activeModules: selectedBlueprint.modules,
        storageConfig: selectedBlueprint.storage,
        logoUrl: '',
        contactPerson: formData.contactPerson,
        adminEmail: formData.email,
        createdAt: serverTimestamp(),
        lastActive: new Date().toISOString()
      };

      // 3. הכנת מסמך האדמין (User)
      const newUserData = {
        email: formData.email,
        firstName: formData.contactPerson.split(' ')[0],
        lastName: formData.contactPerson.split(' ')[1] || '',
        role: 'org_admin',
        tenantId: newTenantRef.id, // קישור ל-ID החדש שנוצר
        status: 'pending_invite', // סימון שעדיין אין לו סיסמה
        createdAt: serverTimestamp()
      };

      // 4. הוספה לאצווה
      batch.set(newTenantRef, newTenantData);
      batch.set(newUserRef, newUserData);

      // 5. ביצוע אטומי (Commit) - שניהם נוצרים ביחד!
      await batch.commit();

      console.log(`Provisioned Environment Successfully: Tenant ${newTenantRef.id}`);

      // 6. הפניה לטבלה
      navigate('/admin/clients');
      
    } catch (error) {
      console.error("Provisioning failed:", error);
      alert("שגיאה בתהליך ההקצאה. הפעולה בוטלה במלואה.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 flex items-center justify-center font-sans" dir="rtl">
      
      <div className="w-full max-w-3xl">
        <button onClick={() => navigate('/admin/clients')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm font-bold">
            <ArrowRight size={16} /> חזרה למרכז הבקרה
        </button>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-600"></div>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <span className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
                            <Zap size={24} />
                        </span>
                        מנוע הקצאת לקוחות
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-md">
                        Provisioning Engine v2.0 • הגדרת סביבה אטומית והקצאת משאבים.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Step 1: Identity */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-6 h-[1px] bg-indigo-500/50"></span> שלב 1: זהות ארגונית
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300">שם החברה</label>
                            <div className="relative">
                                <Building2 className="absolute right-3 top-3 text-slate-500" size={18} />
                                <input 
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className="w-full bg-black/20 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="הכנס שם חברה..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300">מזהה מערכת (Slug)</label>
                            <div className="relative">
                                <Globe className="absolute right-3 top-3 text-slate-500" size={18} />
                                <input 
                                    name="domain"
                                    readOnly
                                    value={formData.domain}
                                    className={`w-full bg-black/40 border rounded-xl py-3 pr-10 pl-10 text-slate-300 outline-none font-mono text-sm transition-colors
                                        ${slugStatus === 'available' ? 'border-emerald-500/50' : slugStatus === 'taken' ? 'border-rose-500/50' : 'border-slate-700'}
                                    `}
                                />
                                <div className="absolute left-3 top-3">
                                    {slugStatus === 'checking' && <Loader2 size={18} className="animate-spin text-indigo-400" />}
                                    {slugStatus === 'available' && <CheckCircle2 size={18} className="text-emerald-400" />}
                                    {slugStatus === 'taken' && <XCircle size={18} className="text-rose-400" />}
                                </div>
                            </div>
                            {slugStatus === 'taken' && <p className="text-[10px] text-rose-400 mt-1">המזהה הזה תפוס.</p>}
                        </div>
                    </div>
                </div>

                {/* Step 2: Admin */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                         <span className="w-6 h-[1px] bg-indigo-500/50"></span> שלב 2: אדמין ראשי
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300">שם מלא</label>
                            <input 
                                name="contactPerson"
                                required
                                value={formData.contactPerson}
                                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                                className="w-full bg-black/20 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="ישראל ישראלי"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300">אימייל</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-3 text-slate-500" size={18} />
                                <input 
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-black/20 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="admin@org.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3: Blueprint */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                         <span className="w-6 h-[1px] bg-indigo-500/50"></span> שלב 3: חבילת שירות
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(Object.keys(BLUEPRINTS) as Array<keyof typeof BLUEPRINTS>).map((planKey) => {
                            const plan = BLUEPRINTS[planKey];
                            const isSelected = formData.plan === planKey;
                            return (
                                <div 
                                    key={planKey}
                                    onClick={() => setFormData({...formData, plan: planKey})}
                                    className={`cursor-pointer border rounded-xl p-4 transition-all relative group overflow-hidden ${
                                        isSelected 
                                        ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                                        : 'bg-black/20 border-slate-700 hover:bg-white/5'
                                    }`}
                                >
                                    {isSelected && <div className="absolute top-0 right-0 w-full h-1 bg-indigo-500"></div>}
                                    <div className="flex justify-between items-center mb-3">
                                        <span className={`font-black uppercase text-sm ${isSelected ? 'text-white' : 'text-slate-400'}`}>{plan.label}</span>
                                        {isSelected && <ShieldCheck size={18} className="text-indigo-400" />}
                                    </div>
                                    <ul className="space-y-2 text-xs text-slate-400">
                                        <li>{plan.maxUsers > 1000 ? '∞ משתמשים' : `עד ${plan.maxUsers} משתמשים`}</li>
                                        <li>מודולים: {plan.modules.length}</li>
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading || slugStatus === 'taken'}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                        {loading ? 'מבצע Provisioning...' : 'בצע הקצאה (Atomic)'}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}
