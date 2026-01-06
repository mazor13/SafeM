import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, addDoc, collection, Timestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { 
  ArrowRight, Mail, Phone, Building2, MapPin, Globe,
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
      // 1. Create new tenant
      const tenantRef = await addDoc(collection(firestore, 'clients'), {
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

      // 2. Create contact from lead
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

      // 3. Update lead status
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
              נוצר אוטומטית גם איש קשר ראשי.
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

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">תוכנית</label>
            <select
              value={tenantData.plan}
              onChange={(e) => setTenantData({ ...tenantData, plan: e.target.value })}
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors"
            >
              ביטול
            </button>
            <button
              onClick={handleConvert}
              disabled={loading || !tenantData.domain}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck size={18} />
                  המר ללקוח
                </>
              )}
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
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">סוג פעילות</label>
            <div className="grid grid-cols-5 gap-2">
              {ACTIVITY_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setActivityData({ ...activityData, type: type.value })}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    activityData.type === type.value
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-800 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-lg">{type.icon}</span>
                  <div className="text-[10px] mt-1">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">נושא</label>
            <input
              type="text"
              required
              value={activityData.subject}
              onChange={(e) => setActivityData({ ...activityData, subject: e.target.value })}
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="תיאור קצר של הפעילות"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">פרטים</label>
            <textarea
              value={activityData.description}
              onChange={(e) => setActivityData({ ...activityData, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="פרטים נוספים..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'שומר...' : 'שמור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---
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
      if (docSnap.exists()) {
        setLead({ id: docSnap.id, ...docSnap.data() } as Lead);
      }
    } catch (err) {
      console.error('Error fetching lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const q = query(
        collection(firestore, 'activities'),
        where('relatedToId', '==', id),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Activity[]);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  const handleStatusChange = async (newStatus: Lead['status']) => {
    if (!lead) return;
    try {
      await updateDoc(doc(firestore, 'leads', lead.id), {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
      setLead({ ...lead, status: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async () => {
    if (!lead || !confirm('האם אתה בטוח שברצונך למחוק ליד זה?')) return;
    try {
      await deleteDoc(doc(firestore, 'leads', lead.id));
      navigate('/admin/crm/leads');
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const getRatingDisplay = (rating: string) => {
    switch (rating) {
      case 'hot': return { icon: <Flame size={16} />, label: 'חם', color: 'text-rose-500 bg-rose-500/10' };
      case 'warm': return { icon: <Sun size={16} />, label: 'פושר', color: 'text-amber-500 bg-amber-500/10' };
      case 'cold': return { icon: <Snowflake size={16} />, label: 'קר', color: 'text-blue-400 bg-blue-500/10' };
      default: return { icon: null, label: rating, color: 'text-slate-400 bg-slate-500/10' };
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-10 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">הליד לא נמצא</h2>
        <button onClick={() => navigate('/admin/crm/leads')} className="text-indigo-400 hover:text-indigo-300">
          חזרה לרשימת הלידים
        </button>
      </div>
    );
  }

  const rating = getRatingDisplay(lead.rating);
  const statusInfo = LEAD_STATUSES.find(s => s.value === lead.status);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6" dir="rtl">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <button onClick={() => navigate('/admin/crm/leads')} className="hover:text-white transition-colors">
          לידים
        </button>
        <ArrowRight size={14} className="rotate-180" />
        <span className="text-white">{lead.firstName} {lead.lastName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
            {lead.firstName?.[0]}{lead.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{lead.firstName} {lead.lastName}</h1>
            <p className="text-slate-400">{lead.title} {lead.company && `@ ${lead.company}`}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {lead.status !== 'converted' && (
            <button
              onClick={() => setIsConvertModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              <UserCheck size={18} />
              המר ללקוח
            </button>
          )}
          <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors">
            <Edit2 size={18} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Contact Info */}
          <GlassCard title="פרטי קשר">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">אימייל</div>
                  <a href={`mailto:${lead.email}`} className="text-white hover:text-indigo-400 transition-colors">
                    {lead.email}
                  </a>
                </div>
              </div>
              
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Phone size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase">טלפון</div>
                    <a href={`tel:${lead.phone}`} className="text-white hover:text-indigo-400 transition-colors">
                      {lead.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {lead.company && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Building2 size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase">חברה</div>
                    <span className="text-white">{lead.company}</span>
                  </div>
                </div>
              )}
              
              {lead.website && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Globe size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase">אתר</div>
                    <a href={lead.website} target="_blank" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      {lead.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {lead.notes && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="text-xs text-slate-500 uppercase mb-2">הערות</div>
                <p className="text-slate-300 whitespace-pre-wrap">{lead.notes}</p>
              </div>
            )}
          </GlassCard>

          {/* Activity Timeline */}
          <GlassCard 
            title="היסטוריית פעילות" 
            action={
              <button 
                onClick={() => setIsActivityModalOpen(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg font-bold transition-colors flex items-center gap-1"
              >
                <Plus size={14} />
                רשום פעילות
              </button>
            }
          >
            {activities.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ActivityIcon size={32} className="mx-auto mb-3 opacity-50" />
                <p>עדיין אין פעילויות מתועדות</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg">
                        {ACTIVITY_TYPES.find(t => t.value === activity.type)?.icon || '📋'}
                      </div>
                      {index < activities.length - 1 && (
                        <div className="w-px h-full bg-slate-800 my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{activity.subject}</span>
                        <span className="text-xs text-slate-500">
                          {activity.createdAt?.toDate?.()?.toLocaleDateString('he-IL')}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-slate-400">{activity.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          
          {/* Status Card */}
          <GlassCard title="סטטוס ודירוג">
            <div className="space-y-4">
              {/* Current Status */}
              <div>
                <div className="text-xs text-slate-500 uppercase mb-2">סטטוס נוכחי</div>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value as Lead['status'])}
                  disabled={lead.status === 'converted'}
                  className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                >
                  {LEAD_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Rating */}
              <div>
                <div className="text-xs text-slate-500 uppercase mb-2">דירוג</div>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${rating.color}`}>
                  {rating.icon}
                  <span className="font-bold">{rating.label}</span>
                </div>
              </div>
              
              {/* Source */}
              <div>
                <div className="text-xs text-slate-500 uppercase mb-2">מקור</div>
                <span className="text-white">
                  {LEAD_SOURCES.find(s => s.value === lead.source)?.label || lead.source}
                </span>
              </div>
              
              {/* Created */}
              <div>
                <div className="text-xs text-slate-500 uppercase mb-2">נוצר בתאריך</div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock size={14} />
                  {lead.createdAt?.toDate?.()?.toLocaleDateString('he-IL')}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard title="פעולות מהירות">
            <div className="space-y-2">
              <button 
                onClick={() => setIsActivityModalOpen(true)}
                className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-right"
              >
                <PhoneCall size={18} className="text-emerald-400" />
                <span className="text-white">רשום שיחה</span>
              </button>
              <button 
                onClick={() => window.location.href = `mailto:${lead.email}`}
                className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-right"
              >
                <Send size={18} className="text-blue-400" />
                <span className="text-white">שלח אימייל</span>
              </button>
              <button 
                onClick={() => setIsActivityModalOpen(true)}
                className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-right"
              >
                <Calendar size={18} className="text-purple-400" />
                <span className="text-white">קבע פגישה</span>
              </button>
              <button 
                onClick={() => setIsActivityModalOpen(true)}
                className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-right"
              >
                <MessageSquare size={18} className="text-amber-400" />
                <span className="text-white">הוסף הערה</span>
              </button>
            </div>
          </GlassCard>

          {/* Converted Notice */}
          {lead.status === 'converted' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <CheckCircle size={18} />
                <span className="font-bold">הומר ללקוח</span>
              </div>
              <p className="text-sm text-emerald-200/70">
                ליד זה הומר ללקוח בתאריך {lead.convertedAt?.toDate?.()?.toLocaleDateString('he-IL')}
              </p>
              {lead.convertedToTenantId && (
                <button
                  onClick={() => navigate(`/admin/clients/${lead.convertedToTenantId}`)}
                  className="mt-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  צפה בכרטיס הלקוח ←
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConvertModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        lead={lead}
        onSuccess={() => {
          setIsConvertModalOpen(false);
          fetchLead();
        }}
      />

      <LogActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        leadId={lead.id}
        onSuccess={fetchActivities}
      />
    </div>
  );
}
