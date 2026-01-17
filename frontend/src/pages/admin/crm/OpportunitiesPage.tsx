import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc, Timestamp, where } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { 
  Plus, X, DollarSign, Calendar, Building2, 
  Layout, Trash2, Edit2, Save, CheckCircle2, Search, Database, UserPlus, Users,
  Phone, Mail, MessageSquare, Clock
} from 'lucide-react';
import { 
  Opportunity, STAGES, Stage, OpportunityRole, Activity
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
  const [activeTab, setActiveTab] = useState<'details' | 'timeline'>('details');
  
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Search State
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<any>(null);

  // Contact Roles State
  const [contactResults, setContactResults] = useState<any[]>([]);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [contactSearchText, setContactSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<OpportunityRole>('influencer');

  // Timeline State
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({ type: 'call', subject: '', description: '' });

  // Main Form Data
  const [formData, setFormData] = useState<Partial<Opportunity> & { contactRoles?: any[] }>({
    title: '', amount: 0, stage: 'discovery', probability: 25,
    accountName: '', accountId: '', closeDate: '', 
    hasBudget: false, hasAuthority: false, hasNeed: false, hasTimeline: false,
    contactRoles: []
  });

  const fetchOpps = async () => {
    try {
      const q = query(collection(firestore, 'opportunities'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      const data = sn.docs.map(d => ({ id: d.id, ...d.data() })) as Opportunity[];
      setOpps(data);
    } catch (e) { console.error(e); }
  };

  const fetchActivities = async (oppId: string) => {
      if (!oppId) return;
      try {
          const q = query(collection(firestore, 'activities'), where('opportunityId', '==', oppId), orderBy('createdAt', 'desc'));
          const sn = await getDocs(q);
          const acts = sn.docs.map(d => ({ id: d.id, ...d.data() })) as Activity[];
          setActivities(acts);
      } catch (e) { console.error("Error fetching activities", e); }
  };

  useEffect(() => { fetchOpps(); }, []);

  // --- ACTIONS ---
  const handleLogActivity = async () => {
      if (!editingId || !newActivity.subject) return;
      try {
          await addDoc(collection(firestore, 'activities'), {
              opportunityId: editingId,
              accountId: formData.accountId,
              type: newActivity.type,
              subject: newActivity.subject,
              description: newActivity.description,
              createdAt: Timestamp.now(),
              createdBy: 'current-user'
          });
          
          fetchActivities(editingId);
          setNewActivity({ type: 'call', subject: '', description: '' });
      } catch (e) { console.error(e); }
  };

  const handleEdit = (opp: Opportunity) => {
    setEditingId(opp.id);
    setActiveTab('details'); // Default tab
    fetchActivities(opp.id);

    let dateStr = '';
    try {
        const d = opp.closeDate?.toDate ? opp.closeDate.toDate() : new Date(opp.closeDate);
        if (!isNaN(d.getTime())) dateStr = d.toISOString().split('T')[0];
    } catch(e) {}

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

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'opportunities', id));
      setOpps(prev => prev.filter(o => o.id !== id));
    } catch (e) { console.error(e); }
  };

  const handleAccountSearch = async (text: string) => {
    setFormData(prev => ({ ...prev, accountName: text }));
    if (!text) { setFormData(prev => ({ ...prev, accountId: '' })); setSearchResults([]); setShowDropdown(false); return; }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
        try {
            const q = query(collection(firestore, 'tenants')); const sn = await getDocs(q);
            const results = sn.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(t => t.name?.toLowerCase().includes(text.toLowerCase()));
            setSearchResults(results); setShowDropdown(true);
        } catch(e) {}
    }, 300);
  };

  const handleContactSearch = async (text: string) => {
    setContactSearchText(text);
    if (!text) { setContactResults([]); setShowContactDropdown(false); return; }
    setTimeout(async () => {
        try {
            const q = query(collection(firestore, 'contacts')); const sn = await getDocs(q);
            const results = sn.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(c => (c.firstName + ' ' + c.lastName).toLowerCase().includes(text.toLowerCase()));
            setContactResults(results); setShowContactDropdown(true);
        } catch(e) {}
    }, 300);
  };

  const addContactRole = (contact: any) => {
      if (formData.contactRoles?.some(r => r.contactId === contact.id)) { alert('איש קשר זה כבר קיים'); return; }
      const newRole = { contactId: contact.id, name: `${contact.firstName} ${contact.lastName}`, role: selectedRole, email: contact.email };
      setFormData(prev => ({ ...prev, contactRoles: [...(prev.contactRoles || []), newRole] }));
      setContactSearchText(''); setShowContactDropdown(false);
  };

  const removeContactRole = (contactId: string) => {
      setFormData(prev => ({ ...prev, contactRoles: prev.contactRoles?.filter(r => r.contactId !== contactId) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let bantScore = 0;
      if (formData.hasBudget) bantScore++; if (formData.hasAuthority) bantScore++; if (formData.hasNeed) bantScore++; if (formData.hasTimeline) bantScore++;
      const payload = { ...formData, bantScore, updatedAt: Timestamp.now(), closeDate: formData.closeDate ? new Date(formData.closeDate).toISOString() : null };
      if (editingId) { await updateDoc(doc(firestore, 'opportunities', editingId), payload); } 
      else { await addDoc(collection(firestore, 'opportunities'), { ...payload, createdAt: Timestamp.now() }); }
      setIsModalOpen(false); setEditingId(null); fetchOpps(); setFormData({ title: '', amount: 0, stage: 'discovery', probability: 25, accountName: '', accountId: '', closeDate: '', hasBudget: false, hasAuthority: false, hasNeed: false, hasTimeline: false, contactRoles: [] });
    } catch (e) { console.error(e); }
  };

  // Drag & Drop
  const handleDragStart = (id: string) => setDraggedOppId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (targetStage: Stage) => {
    if (!draggedOppId) return;
    const stageInfo = STAGES.find(s => s.value === targetStage); if (!stageInfo) return;
    setOpps(prev => prev.map(o => o.id === draggedOppId ? { ...o, stage: targetStage, probability: stageInfo.prob } : o));
    await updateDoc(doc(firestore, 'opportunities', draggedOppId), { stage: targetStage, probability: stageInfo.prob, updatedAt: Timestamp.now() });
    setDraggedOppId(null);
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
            <div className="text-slate-400">שווי צנרת: <span className="text-white font-bold">₪{formatCurrency(totalValue)}</span></div>
            <div className="text-slate-400">צפי משוקלל: <span className="text-emerald-400 font-bold">₪{formatCurrency(weightedValue)}</span></div>
          </div>
        </div>
        <button 
            onClick={() => { setEditingId(null); setFormData({contactRoles: []}); setActiveTab('details'); setIsModalOpen(true); }} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> הזדמנות חדשה
        </button>
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
                  {stage.label} <Badge>{stage.prob}%</Badge>
                </div>
                <span className="text-xs text-slate-500 font-mono">{opps.filter(o => o.stage === stage.value).length}</span>
              </div>
              <div className={`flex-1 bg-slate-900/20 border border-white/5 rounded-2xl p-2 space-y-3 overflow-y-auto transition-colors ${draggedOppId ? 'hover:bg-slate-800/50 hover:border-indigo-500/30' : ''}`}>
                {opps.filter(o => o.stage === stage.value).map(opp => (
                  <GlassCard 
                    key={opp.id} 
                    draggable={true} onDragStart={() => handleDragStart(opp.id)} onClick={() => handleEdit(opp)} onDelete={() => handleDelete(opp.id)}
                    className="p-4 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
                  >
                    <div className="mb-3 pl-6">
                      <h4 className="font-bold text-white text-sm leading-snug mb-1">{opp.title || 'ללא שם'}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-indigo-300"><Building2 size={12} /> {opp.accountName || 'ללא לקוח'}</div>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/5 pt-3">
                      <div><div className="text-[10px] text-slate-500 uppercase mb-0.5">שווי</div><div className="text-sm font-bold text-white flex items-center"><DollarSign size={12} className="text-slate-400" />{formatCurrency(opp.amount)}</div></div>
                      <div className="text-left"><div className="text-[10px] text-slate-500 uppercase mb-0.5">סגירה</div><div className="text-xs text-slate-300 flex items-center gap-1"><Calendar size={10} />{formatDate(opp.closeDate)}</div></div>
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-1">
                        {(opp.bantScore || 0) > 0 && [...Array(opp.bantScore)].map((_,i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>)}
                        {((opp as any).contactRoles?.length || 0) > 0 && <div className="ml-2 flex items-center text-[10px] text-slate-500 gap-0.5"><Users size={10} /> {(opp as any).contactRoles.length}</div>}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* MODAL WITH TABS */}
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

            {/* TABS */}
            <div className="flex border-b border-white/10 px-6">
                <button 
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'details' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    פרטי העסקה (Details)
                </button>
                {editingId && (
                    <button 
                        onClick={() => setActiveTab('timeline')}
                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'timeline' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                        יומן פעילות (Timeline)
                    </button>
                )}
            </div>

            <div className="p-8 overflow-y-auto min-h-[400px]">
              
              {/* === DETAILS TAB === */}
              {activeTab === 'details' && (
                <form id="opp-form" onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Building2 size={14} /> פרטי העסקה</h3>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">שם העסקה</label>
                        <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" placeholder="שם העסקה..." />
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">לקוח</label>
                        <input value={formData.accountName} onChange={e => handleAccountSearch(e.target.value)} onFocus={() => { if(formData.accountName) handleAccountSearch(formData.accountName || ''); }} className={`w-full bg-slate-800 border rounded-lg p-3 pl-10 text-white outline-none ${formData.accountId ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-700'}`} placeholder="חפש לקוח..." autoComplete="off" />
                        <Search size={16} className="absolute top-3.5 left-3 text-slate-500" />
                        {showDropdown && searchResults.length > 0 && <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">{searchResults.map(res => <div key={res.id} onClick={() => { setFormData(prev => ({ ...prev, accountName: res.name, accountId: res.id })); setShowDropdown(false); }} className="p-3 hover:bg-indigo-600/20 cursor-pointer border-b border-white/5 font-bold text-white">{res.name}</div>)}</div>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">שווי (₪)</label>
                        <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <div><label className="block text-xs font-medium text-slate-400 mb-1.5">תאריך סגירה</label><input type="date" required value={formData.closeDate} onChange={e => setFormData({...formData, closeDate: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" /></div>
                      <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">שלב</label>
                          <select value={formData.stage} onChange={e => { const s = STAGES.find(st => st.value === e.target.value); setFormData({...formData, stage: e.target.value as any, probability: s?.prob || 0}); }} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none">
                              {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full"></div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2"><CheckCircle2 size={14} /> סינון BANT</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[{ k: 'hasBudget', l: 'Budget (תקציב)' }, { k: 'hasAuthority', l: 'Authority (סמכות)' }, { k: 'hasNeed', l: 'Need (צורך)' }, { k: 'hasTimeline', l: 'Timeline (לו"ז)' }].map((item: any) => (
                        <label key={item.k} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-slate-800 ${formData[item.k as keyof Opportunity] ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/30 border-white/5'}`}>
                          <input type="checkbox" checked={formData[item.k as keyof Opportunity] as boolean} onChange={e => setFormData({...formData, [item.k]: e.target.checked})} className="mt-1 w-4 h-4 accent-emerald-500" />
                          <div className="text-sm font-bold text-white">{item.l}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full"></div>

                  <div className="space-y-4">
                      <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2"><Users size={14} /> צוות העסקה</h3>
                      <div className="flex gap-2 items-end bg-slate-800/30 p-3 rounded-xl border border-white/5">
                          <div className="flex-1 relative">
                               <input value={contactSearchText} onChange={e => handleContactSearch(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" placeholder="חפש איש קשר..." />
                               {showContactDropdown && contactResults.length > 0 && <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-40 overflow-y-auto">{contactResults.map(c => <div key={c.id} onClick={() => addContactRole(c)} className="p-2 hover:bg-indigo-600/20 cursor-pointer border-b border-white/5 text-sm text-white">{c.firstName} {c.lastName}</div>)}</div>}
                          </div>
                          <div className="w-40">
                              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value as any)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white">
                                  <option value="decision_maker">מקבל החלטות</option><option value="blocker">חוסם</option><option value="champion">תומך</option><option value="economic_buyer">מאשר תקציב</option><option value="influencer">משפיע</option>
                              </select>
                          </div>
                      </div>
                      <div className="space-y-2">
                          {formData.contactRoles?.map((role: any) => (
                              <div key={role.contactId} className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-white/5">
                                  <div className="text-sm font-bold text-white">{role.name}</div>
                                  <div className="flex gap-2"><RoleBadge role={role.role} /><button type="button" onClick={() => removeContactRole(role.contactId)} className="text-slate-500 hover:text-rose-400"><Trash2 size={14} /></button></div>
                              </div>
                          ))}
                      </div>
                  </div>
                </form>
              )}

              {/* === TIMELINE TAB === */}
              {activeTab === 'timeline' && (
                  <div className="space-y-6">
                      {/* New Activity Form */}
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-3">
                          <div className="flex gap-2 mb-2">
                              {['call', 'meeting', 'email', 'note'].map(type => (
                                  <button 
                                    key={type}
                                    onClick={() => setNewActivity({...newActivity, type})}
                                    className={`flex-1 p-2 rounded-lg text-xs font-bold capitalize flex justify-center items-center gap-2 border ${newActivity.type === type ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-transparent hover:bg-slate-800'}`}
                                  >
                                      {type === 'call' && <Phone size={12}/>}
                                      {type === 'meeting' && <Calendar size={12}/>}
                                      {type === 'email' && <Mail size={12}/>}
                                      {type === 'note' && <MessageSquare size={12}/>}
                                      {type}
                                  </button>
                              ))}
                          </div>
                          <input 
                            placeholder="נושא (למשל: שיחת היכרות)"
                            value={newActivity.subject}
                            onChange={e => setNewActivity({...newActivity, subject: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none"
                          />
                          <textarea 
                            placeholder="תיאור הפעילות..."
                            value={newActivity.description}
                            onChange={e => setNewActivity({...newActivity, description: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none min-h-[80px]"
                          />
                          <div className="flex justify-end">
                              <button onClick={handleLogActivity} disabled={!newActivity.subject} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                  <Save size={14}/> תיעוד פעילות
                              </button>
                          </div>
                      </div>

                      {/* Activity Feed */}
                      <div className="relative border-r border-slate-700 mr-4 pr-4 space-y-6">
                          {activities.length === 0 && <div className="text-center text-slate-500 text-sm py-4">אין פעילויות מתועדות.</div>}
                          
                          {activities.map(act => (
                              <div key={act.id} className="relative">
                                  <div className="absolute top-0 -right-[21px] w-3 h-3 rounded-full bg-slate-900 border-2 border-slate-600"></div>
                                  <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5 hover:bg-slate-800/50 transition-colors">
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-center gap-2">
                                              <span className={`p-1.5 rounded-lg ${act.type==='call'?'bg-blue-500/20 text-blue-400':act.type==='meeting'?'bg-purple-500/20 text-purple-400':'bg-slate-700 text-slate-400'}`}>
                                                  {act.type==='call'?<Phone size={12}/>:act.type==='meeting'?<Calendar size={12}/>:<MessageSquare size={12}/>}
                                              </span>
                                              <span className="font-bold text-white text-sm">{act.subject}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                              <Clock size={10}/> 
                                              {act.createdAt?.toDate ? act.createdAt.toDate().toLocaleDateString('he-IL') : 'Just now'}
                                          </div>
                                      </div>
                                      <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{act.description}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-white/10 bg-slate-800/50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">ביטול</button>
              {activeTab === 'details' && (
                  <button type="submit" form="opp-form" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all">
                    <Save size={18} /> {editingId ? 'שמור שינויים' : 'צור הזדמנות'}
                  </button>
              )}
              {activeTab === 'timeline' && (
                  <button onClick={() => setIsModalOpen(false)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20">סגור</button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
