#!/bin/bash

echo "🚀 Implementing Buying Committee & Contact Roles..."

cat > frontend/src/pages/admin/crm/OpportunitiesPage.tsx << 'EOF'
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc, Timestamp, where } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { 
  Plus, X, DollarSign, Calendar, Building2, 
  Layout, Trash2, Edit2, Save, CheckCircle2, Search, Database, UserPlus, Users 
} from 'lucide-react';
import { 
  Opportunity, STAGES, Stage, OpportunityRole
} from '../../../types/crm';

// --- COMPONENTS ---
const GlassCard = ({ children, className = '', onDragStart, draggable, onDelete, onClick }: any) => (
  <div 
    draggable={draggable}
    onDragStart={onDragStart}
    onClick={onClick}
    className={`bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm relative group/card ${className}`}
  >
    <button 
      onClick={(e) => {
        e.stopPropagation(); 
        if(confirm('האם אתה בטוח שברצונך למחוק הזדמנות זו?')) onDelete();
      }}
      className="absolute top-2 left-2 p-1.5 bg-rose-500/10 text-rose-400 rounded-lg opacity-0 group-hover/card:opacity-100 transition-all hover:bg-rose-500 hover:text-white z-10"
    >
      <Trash2 size={14} />
    </button>
    {children}
  </div>
);

const Badge = ({ children, color = 'bg-slate-700 text-slate-300' }: any) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>
    {children}
  </span>
);

const RoleBadge = ({ role }: { role: string }) => {
    let color = 'bg-slate-700 text-slate-300';
    let label = role;
    
    switch(role) {
        case 'decision_maker': color = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'; label = 'מקבל החלטות 👑'; break;
        case 'blocker': color = 'bg-rose-500/20 text-rose-400 border border-rose-500/30'; label = 'חוסם 🛡️'; break;
        case 'champion': color = 'bg-blue-500/20 text-blue-400 border border-blue-500/30'; label = 'תומך (Champion) 🚀'; break;
        case 'economic_buyer': color = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'; label = 'מאשר תקציב 💰'; break;
        case 'influencer': color = 'bg-purple-500/20 text-purple-400'; label = 'משפיע'; break;
    }
    return <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${color}`}>{label}</span>;
};

const formatCurrency = (val: any) => {
  const num = Number(val);
  return isNaN(num) ? '0' : num.toLocaleString();
};

const formatDate = (val: any) => {
  if (!val) return '-';
  try {
    const date = val.toDate ? val.toDate() : new Date(val);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('he-IL');
  } catch (e) { return '-'; }
};

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Search State - Account
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<any>(null);

  // Search State - Contacts
  const [contactResults, setContactResults] = useState<any[]>([]);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [contactSearchText, setContactSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<OpportunityRole>('influencer');

  // Form Data including Roles array
  const [formData, setFormData] = useState<Partial<Opportunity> & { contactRoles?: any[] }>({
    title: '', amount: 0, stage: 'discovery', probability: 25,
    accountName: '', accountId: '', closeDate: '', 
    hasBudget: false, hasAuthority: false, hasNeed: false, hasTimeline: false,
    contactRoles: [] // Array of { contactId, name, role }
  });

  const fetchOpps = async () => {
    try {
      const q = query(collection(firestore, 'opportunities'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      const data = sn.docs.map(d => ({ id: d.id, ...d.data() })) as Opportunity[];
      setOpps(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchOpps(); }, []);

  // --- SMART SEARCH LOGIC (ACCOUNT) ---
  const handleAccountSearch = async (text: string) => {
    setFormData(prev => ({ ...prev, accountName: text }));
    if (!text) {
        setFormData(prev => ({ ...prev, accountId: '' }));
        setSearchResults([]);
        setShowDropdown(false);
        return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
        try {
            const q = query(collection(firestore, 'tenants')); 
            const sn = await getDocs(q);
            const results = sn.docs
                .map(d => ({ id: d.id, ...d.data() } as any))
                .filter(t => t.name?.toLowerCase().includes(text.toLowerCase()));
            setSearchResults(results);
            setShowDropdown(true);
        } catch (e) { console.error(e); }
    }, 300);
  };

  // --- SMART SEARCH LOGIC (CONTACTS) ---
  const handleContactSearch = async (text: string) => {
    setContactSearchText(text);
    if (!text) {
        setContactResults([]);
        setShowContactDropdown(false);
        return;
    }
    // Simple search (in real app, filter by accountId if present)
    setTimeout(async () => {
        try {
            const q = query(collection(firestore, 'contacts')); 
            const sn = await getDocs(q);
            const results = sn.docs
                .map(d => ({ id: d.id, ...d.data() } as any))
                .filter(c => 
                    (c.firstName + ' ' + c.lastName).toLowerCase().includes(text.toLowerCase())
                );
            setContactResults(results);
            setShowContactDropdown(true);
        } catch (e) { console.error(e); }
    }, 300);
  };

  const addContactRole = (contact: any) => {
      // Check duplicate
      if (formData.contactRoles?.some(r => r.contactId === contact.id)) {
          alert('איש קשר זה כבר קיים בצוות העסקה');
          return;
      }
      
      const newRole = {
          contactId: contact.id,
          name: `${contact.firstName} ${contact.lastName}`,
          role: selectedRole,
          email: contact.email
      };

      setFormData(prev => ({
          ...prev,
          contactRoles: [...(prev.contactRoles || []), newRole]
      }));
      
      setContactSearchText('');
      setShowContactDropdown(false);
  };

  const removeContactRole = (contactId: string) => {
      setFormData(prev => ({
          ...prev,
          contactRoles: prev.contactRoles?.filter(r => r.contactId !== contactId)
      }));
  };

  // --- DEMO DATA GENERATORS ---
  const createDemoTenants = async () => {
      const demos = ['Google', 'Microsoft', 'NVIDIA', 'Osem'];
      for (const name of demos) {
          await addDoc(collection(firestore, 'tenants'), { name, status: 'active', createdAt: Timestamp.now() });
      }
      alert('חברות דמו נוצרו!');
  };

  const createDemoContacts = async () => {
      const demos = [
          { firstName: 'Sundar', lastName: 'Pichai', role: 'CEO', tenantName: 'Google' },
          { firstName: 'Satya', lastName: 'Nadella', role: 'CEO', tenantName: 'Microsoft' },
          { firstName: 'Jensen', lastName: 'Huang', role: 'CEO', tenantName: 'NVIDIA' },
          { firstName: 'Avi', lastName: 'Ben-Assayag', role: 'CEO', tenantName: 'Osem' },
      ];
      for (const c of demos) {
          await addDoc(collection(firestore, 'contacts'), { ...c, email: 'demo@test.com', phone: '050000000', tenantId: 'demo', createdAt: Timestamp.now() });
      }
      alert('אנשי קשר דמו נוצרו! נסה לחפש "Sundar" או "Satya".');
  };

  // --- CRUD ACTIONS ---
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'opportunities', id));
      setOpps(prev => prev.filter(o => o.id !== id));
    } catch (e) { console.error(e); }
  };

  const handleEdit = (opp: Opportunity) => {
    setEditingId(opp.id);
    let dateStr = '';
    try {
        const d = opp.closeDate?.toDate ? opp.closeDate.toDate() : new Date(opp.closeDate);
        if (!isNaN(d.getTime())) dateStr = d.toISOString().split('T')[0];
    } catch(e) {}

    // Load existing data + roles
    setFormData({
      title: opp.title || '',
      amount: opp.amount || 0,
      stage: opp.stage || 'discovery',
      probability: opp.probability || 25,
      accountName: opp.accountName || '',
      accountId: opp.accountId || '',
      closeDate: dateStr,
      hasBudget: opp.hasBudget || false,
      hasAuthority: opp.hasAuthority || false,
      hasNeed: opp.hasNeed || false,
      hasTimeline: opp.hasTimeline || false,
      contactRoles: (opp as any).contactRoles || [] 
    });
    setIsModalOpen(true);
  };

  const handleDragStart = (id: string) => setDraggedOppId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDrop = async (targetStage: Stage) => {
    if (!draggedOppId) return;
    const stageInfo = STAGES.find(s => s.value === targetStage);
    if (!stageInfo) return;

    setOpps(prev => prev.map(o => o.id === draggedOppId ? { ...o, stage: targetStage, probability: stageInfo.prob } : o));
    await updateDoc(doc(firestore, 'opportunities', draggedOppId), { 
      stage: targetStage, probability: stageInfo.prob, updatedAt: Timestamp.now()
    });
    setDraggedOppId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let bantScore = 0;
      if (formData.hasBudget) bantScore++;
      if (formData.hasAuthority) bantScore++;
      if (formData.hasNeed) bantScore++;
      if (formData.hasTimeline) bantScore++;

      const payload = {
        ...formData,
        bantScore,
        updatedAt: Timestamp.now(),
        closeDate: formData.closeDate ? new Date(formData.closeDate).toISOString() : null
      };

      if (editingId) {
        await updateDoc(doc(firestore, 'opportunities', editingId), payload);
      } else {
        await addDoc(collection(firestore, 'opportunities'), {
          ...payload,
          createdAt: Timestamp.now()
        });
      }

      setIsModalOpen(false);
      setEditingId(null);
      fetchOpps();
      setFormData({ 
          title: '', amount: 0, stage: 'discovery', probability: 25, accountName: '', accountId: '', closeDate: '', hasBudget: false, hasAuthority: false, hasNeed: false, hasTimeline: false, contactRoles: [] 
      });
    } catch (e) { console.error(e); }
  };

  const totalValue = opps.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const weightedValue = opps.reduce((sum, o) => sum + ((Number(o.amount) || 0) * ((o.probability || 0) / 100)), 0);

  return (
    <div className="flex flex-col h-screen p-6 overflow-hidden" dir="rtl">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layout className="text-indigo-400" /> הזדמנויות (Pipeline)
          </h1>
          <div className="flex gap-6 mt-2 text-sm">
            <div className="text-slate-400">
              שווי צנרת: <span className="text-white font-bold">₪{formatCurrency(totalValue)}</span>
            </div>
            <div className="text-slate-400">
              צפי משוקלל: <span className="text-emerald-400 font-bold">₪{formatCurrency(weightedValue)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
             <button onClick={createDemoTenants} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl font-bold text-xs border border-white/5">
              <Database size={14} className="ml-2 inline"/> חברות דמו
            </button>
            <button onClick={createDemoContacts} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl font-bold text-xs border border-white/5">
              <UserPlus size={14} className="ml-2 inline"/> אנשי קשר דמו
            </button>
            <button 
                onClick={() => { setEditingId(null); setFormData({contactRoles: []}); setIsModalOpen(true); }} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
            >
            <Plus size={18} /> הזדמנות חדשה
            </button>
        </div>
      </div>

      {/* KANBAN */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-[1400px]">
          {STAGES.map(stage => (
            <div 
              key={stage.value} 
              className="flex-1 flex flex-col min-w-[260px] max-w-[320px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.value as Stage)}
            >
              <div className="flex justify-between items-center mb-3 px-1 border-b border-white/5 pb-2">
                <div className="font-bold text-slate-300 text-sm flex items-center gap-2">
                  {stage.label}
                  <Badge>{stage.prob}%</Badge>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {opps.filter(o => o.stage === stage.value).length}
                </span>
              </div>

              <div className={`flex-1 bg-slate-900/20 border border-white/5 rounded-2xl p-2 space-y-3 overflow-y-auto transition-colors ${draggedOppId ? 'hover:bg-slate-800/50 hover:border-indigo-500/30' : ''}`}>
                {opps.filter(o => o.stage === stage.value).map(opp => (
                  <GlassCard 
                    key={opp.id} 
                    draggable={true}
                    onDragStart={() => handleDragStart(opp.id)}
                    onClick={() => handleEdit(opp)}
                    onDelete={() => handleDelete(opp.id)}
                    className="p-4 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
                  >
                    <div className="mb-3 pl-6">
                      <h4 className="font-bold text-white text-sm leading-snug mb-1">{opp.title || 'ללא שם'}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-indigo-300">
                        <Building2 size={12} />
                        {opp.accountName || 'ללא לקוח'}
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/5 pt-3">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase mb-0.5">שווי</div>
                        <div className="text-sm font-bold text-white flex items-center">
                          <DollarSign size={12} className="text-slate-400" />
                          {formatCurrency(opp.amount)}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-slate-500 uppercase mb-0.5">סגירה</div>
                        <div className="text-xs text-slate-300 flex items-center gap-1">
                          <Calendar size={10} />
                          {formatDate(opp.closeDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 flex gap-1">
                        {/* BANT Dots */}
                        {(opp.bantScore || 0) > 0 && [...Array(opp.bantScore)].map((_,i) => (
                           <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                         ))}
                         {/* Contact Roles Indicator */}
                         {((opp as any).contactRoles?.length || 0) > 0 && (
                             <div className="ml-2 flex items-center text-[10px] text-slate-500 gap-0.5">
                                 <Users size={10} /> {(opp as any).contactRoles.length}
                             </div>
                         )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* PROFESSIONAL MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingId ? <Edit2 size={20} className="text-indigo-400"/> : <Plus size={20} className="text-indigo-400"/>}
                {editingId ? 'עריכת הזדמנות' : 'הזדמנות חדשה'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            <div className="p-8 overflow-y-auto min-h-[400px]">
              <form id="opp-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Core Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Building2 size={14} /> פרטי העסקה
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">שם העסקה</label>
                      <input required 
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-all" 
                        placeholder="למשל: הטמעת מערכת בטיחות שנתית" />
                    </div>
                    
                    <div className="relative">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">לקוח (Account Search)</label>
                      <div className="relative">
                        <input 
                            value={formData.accountName} 
                            onChange={e => handleAccountSearch(e.target.value)}
                            onFocus={() => { if(formData.accountName) handleAccountSearch(formData.accountName || ''); }}
                            className={`w-full bg-slate-800 border rounded-lg p-3 pl-10 text-white focus:border-indigo-500 outline-none transition-all ${formData.accountId ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-700'}`}
                            placeholder="חפש לקוח..." 
                            autoComplete="off"
                        />
                        <Search size={16} className="absolute top-3.5 left-3 text-slate-500" />
                        {showDropdown && searchResults.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                              {searchResults.map(res => (
                                  <div key={res.id} onClick={() => { setFormData(prev => ({ ...prev, accountName: res.name, accountId: res.id })); setShowDropdown(false); }}
                                    className="p-3 hover:bg-indigo-600/20 cursor-pointer border-b border-white/5 flex items-center justify-between">
                                      <span className="font-bold text-white">{res.name}</span>
                                  </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                       <label className="block text-xs font-medium text-slate-400 mb-1.5">שווי (₪)</label>
                       <div className="relative">
                         <DollarSign size={16} className="absolute top-3.5 left-3 text-slate-500" />
                         <input type="number" 
                            value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-indigo-500 outline-none" />
                       </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">תאריך סגירה</label>
                      <input type="date" required 
                        value={formData.closeDate} onChange={e => setFormData({...formData, closeDate: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">שלב</label>
                        <select 
                            value={formData.stage} 
                            onChange={e => {
                                const s = STAGES.find(st => st.value === e.target.value);
                                setFormData({...formData, stage: e.target.value as any, probability: s?.prob || 0});
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                        >
                            {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full"></div>

                {/* 2. BANT */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                       <CheckCircle2 size={14} /> סינון BANT
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'hasBudget', label: 'Budget (תקציב)', sub: 'יש תקציב מאושר' },
                      { key: 'hasAuthority', label: 'Authority (סמכות)', sub: 'דיברנו עם המחליט' },
                      { key: 'hasNeed', label: 'Need (צורך)', sub: 'יש בעיה ברורה' },
                      { key: 'hasTimeline', label: 'Timeline (לו"ז)', sub: 'יש תאריך יעד' }
                    ].map((item: any) => (
                      <label key={item.key} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-800 ${formData[item.key as keyof Opportunity] ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/30 border-white/5'}`}>
                        <input type="checkbox" checked={formData[item.key as keyof Opportunity] as boolean} onChange={e => setFormData({...formData, [item.key]: e.target.checked})} className="mt-1 w-4 h-4 accent-emerald-500" />
                        <div>
                          <div className="text-sm font-bold text-white">{item.label}</div>
                          <div className="text-xs text-slate-500">{item.sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full"></div>

                {/* 3. BUYING COMMITTEE (NEW!) */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                        <Users size={14} /> צוות העסקה (Buying Committee)
                    </h3>
                    
                    {/* Add New Role */}
                    <div className="flex gap-2 items-end bg-slate-800/30 p-3 rounded-xl border border-white/5">
                        <div className="flex-1 relative">
                             <label className="text-xs text-slate-500 mb-1 block">חפש איש קשר</label>
                             <input 
                                value={contactSearchText}
                                onChange={e => handleContactSearch(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
                                placeholder="למשל: סאטיה נאדלה..."
                             />
                             {showContactDropdown && contactResults.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                                    {contactResults.map(c => (
                                        <div key={c.id} onClick={() => addContactRole(c)}
                                            className="p-2 hover:bg-indigo-600/20 cursor-pointer border-b border-white/5 text-sm flex justify-between">
                                            <span className="text-white">{c.firstName} {c.lastName}</span>
                                            <span className="text-slate-400 text-xs">{c.tenantName}</span>
                                        </div>
                                    ))}
                                </div>
                             )}
                        </div>
                        <div className="w-40">
                            <label className="text-xs text-slate-500 mb-1 block">תפקיד בעסקה</label>
                            <select 
                                value={selectedRole}
                                onChange={e => setSelectedRole(e.target.value as any)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
                            >
                                <option value="decision_maker">מקבל החלטות</option>
                                <option value="economic_buyer">מאשר תקציב</option>
                                <option value="champion">תומך (Champion)</option>
                                <option value="blocker">חוסם</option>
                                <option value="influencer">משפיע</option>
                            </select>
                        </div>
                    </div>

                    {/* Roles List */}
                    <div className="space-y-2">
                        {formData.contactRoles && formData.contactRoles.length > 0 ? (
                            formData.contactRoles.map((role: any) => (
                                <div key={role.contactId} className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                                            {role.name.substr(0,2)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{role.name}</div>
                                            <div className="text-xs text-slate-500">{role.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RoleBadge role={role.role} />
                                        <button onClick={() => removeContactRole(role.contactId)} className="text-slate-500 hover:text-rose-400 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-4 text-slate-500 text-xs border border-dashed border-slate-700 rounded-xl">
                                לא נוספו בעלי תפקידים. חפש איש קשר והוסף אותו כדי למפות את מקבלי ההחלטות.
                            </div>
                        )}
                    </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-white/10 bg-slate-800/50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                ביטול
              </button>
              <button 
                type="submit" 
                form="opp-form"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
              >
                <Save size={18} />
                {editingId ? 'שמור שינויים' : 'צור הזדמנות'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
EOF

echo "✅ Contact Roles & Buying Committee implemented. Deploying..."
cd frontend && npm run build && cd .. && firebase deploy --only hosting
