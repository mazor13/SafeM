// ===========================================
// AEGIS - ContactsTab Component
// ניהול אנשי קשר עם רמות הסלמה
// ===========================================

import React, { useState } from 'react';
import { 
  UserPlus, Mail, Phone, Trash2, Edit2, 
  XCircle, Check, Building2, Bell, Globe,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useClient } from '../../hooks/useClients';
import { 
  Contact, 
  EscalationLevel, 
  ESCALATION_LEVELS,
  PORTAL_ROLES 
} from '../../types/safety';

// ===========================================
// TYPES
// ===========================================

interface ContactsTabProps {
  clientId: string;
  clientName: string;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  title: string;
  department: string;
  escalationLevel: EscalationLevel;
  portalAccess: {
    enabled: boolean;
    role: 'admin' | 'manager' | 'viewer';
  };
  notificationPreferences: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
    newFindings: boolean;
    findingReminders: boolean;
    reportReady: boolean;
    trainingReminders: boolean;
  };
}

const EMPTY_FORM: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mobile: '',
  title: '',
  department: '',
  escalationLevel: 1,
  portalAccess: {
    enabled: false,
    role: 'viewer'
  },
  notificationPreferences: {
    email: true,
    whatsapp: true,
    sms: false,
    newFindings: true,
    findingReminders: true,
    reportReady: true,
    trainingReminders: true
  }
};

// ===========================================
// LEVEL COLORS
// ===========================================

const LEVEL_STYLES: Record<EscalationLevel, { bg: string; border: string; text: string; icon: string }> = {
  1: { 
    bg: 'bg-rose-500/10', 
    border: 'border-rose-500/30', 
    text: 'text-rose-400',
    icon: '🔴'
  },
  2: { 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-500/30', 
    text: 'text-amber-400',
    icon: '🟠'
  },
  3: { 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-500/30', 
    text: 'text-yellow-400',
    icon: '🟡'
  }
};

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function ContactsTab({ clientId, clientName }: ContactsTabProps) {
  const { 
    contacts, 
    loading, 
    addContact, 
    updateContact, 
    deleteContact,
    getContactsByLevel 
  } = useClient(clientId);

  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true });

  // Toggle level expansion
  const toggleLevel = (level: number) => {
    setExpandedLevels(prev => ({ ...prev, [level]: !prev[level] }));
  };

  // Open modal for new contact
  const handleAddNew = (level: EscalationLevel = 1) => {
    setEditingContact(null);
    setFormData({ ...EMPTY_FORM, escalationLevel: level });
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || '',
      mobile: contact.mobile || '',
      title: contact.title || '',
      department: contact.department || '',
      escalationLevel: contact.escalationLevel,
      portalAccess: contact.portalAccess || { enabled: false, role: 'viewer' },
      notificationPreferences: contact.notificationPreferences || EMPTY_FORM.notificationPreferences
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (contact: Contact) => {
    if (!window.confirm(`למחוק את ${contact.firstName} ${contact.lastName}?`)) return;
    
    try {
      await deleteContact(contact.id);
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('שגיאה במחיקת איש קשר');
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingContact) {
        await updateContact(editingContact.id, {
          ...formData,
          status: 'active'
        });
      } else {
        await addContact({
          ...formData,
          status: 'active'
        });
      }
      setShowModal(false);
      setFormData(EMPTY_FORM);
      setEditingContact(null);
    } catch (err) {
      console.error('Error saving contact:', err);
      alert('שגיאה בשמירת איש קשר');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-500 italic">טוען אנשי קשר...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <div>
          <h3 className="text-lg font-bold text-white">אנשי קשר</h3>
          <p className="text-xs text-slate-500">{contacts.length} אנשי קשר מוגדרים</p>
        </div>
        <button 
          onClick={() => handleAddNew()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
        >
          <UserPlus size={16} /> הוסף איש קשר
        </button>
      </div>

      {/* Levels */}
      {ESCALATION_LEVELS.map(({ level, labelHe, description }) => {
        const levelContacts = getContactsByLevel(level);
        const style = LEVEL_STYLES[level];
        const isExpanded = expandedLevels[level];

        return (
          <div 
            key={level} 
            className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden`}
          >
            {/* Level Header */}
            <button
              onClick={() => toggleLevel(level)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{style.icon}</span>
                <div className="text-right">
                  <h4 className={`font-bold ${style.text}`}>
                    רמה {level} - {labelHe}
                  </h4>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${style.bg} ${style.text} border ${style.border}`}>
                  {levelContacts.length} אנשי קשר
                </span>
                {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </div>
            </button>

            {/* Level Content */}
            {isExpanded && (
              <div className="p-4 pt-0 space-y-2">
                {levelContacts.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 border border-dashed border-white/10 rounded-xl">
                    <p className="mb-2">אין אנשי קשר ברמה זו</p>
                    <button
                      onClick={() => handleAddNew(level)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      + הוסף איש קשר
                    </button>
                  </div>
                ) : (
                  <>
                    {levelContacts.map(contact => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        onEdit={() => handleEdit(contact)}
                        onDelete={() => handleDelete(contact)}
                      />
                    ))}
                    <button
                      onClick={() => handleAddNew(level)}
                      className="w-full py-2 text-sm text-slate-500 hover:text-indigo-400 transition-colors border border-dashed border-white/10 rounded-xl hover:border-indigo-500/30"
                    >
                      + הוסף איש קשר נוסף
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Modal */}
      {showModal && (
        <ContactModal
          formData={formData}
          setFormData={setFormData}
          isEditing={!!editingContact}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
            setEditingContact(null);
            setFormData(EMPTY_FORM);
          }}
        />
      )}
    </div>
  );
}

// ===========================================
// CONTACT CARD
// ===========================================

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}

function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const hasPortalAccess = contact.portalAccess?.enabled;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-all group">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-lg">
          {contact.firstName?.[0]}{contact.lastName?.[0]}
        </div>
        
        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-200">
              {contact.firstName} {contact.lastName}
            </h4>
            {hasPortalAccess && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Globe size={10} className="inline ml-1" />
                פורטל
              </span>
            )}
          </div>
          
          {contact.title && (
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Building2 size={12} /> {contact.title}
              {contact.department && ` • ${contact.department}`}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Mail size={12} /> {contact.email}
            </span>
            {contact.mobile && (
              <span className="flex items-center gap-1">
                <Phone size={12} /> {contact.mobile}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onEdit}
          className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="עריכה"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400 hover:text-rose-300 transition-colors"
          title="מחיקה"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

// ===========================================
// CONTACT MODAL
// ===========================================

interface ContactModalProps {
  formData: ContactFormData;
  setFormData: (data: ContactFormData) => void;
  isEditing: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

function ContactModal({ 
  formData, 
  setFormData, 
  isEditing, 
  isSubmitting, 
  onSubmit, 
  onClose 
}: ContactModalProps) {
  const [activeSection, setActiveSection] = useState<'basic' | 'portal' | 'notifications'>('basic');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserPlus className="text-indigo-500" />
            {isEditing ? 'עריכת איש קשר' : 'הוספת איש קשר'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <XCircle size={24} />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-white/5">
          {[
            { id: 'basic', label: 'פרטים בסיסיים' },
            { id: 'portal', label: 'גישה לפורטל' },
            { id: 'notifications', label: 'התראות' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                activeSection === tab.id 
                  ? 'text-indigo-400 border-b-2 border-indigo-400' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Basic Info Section */}
          {activeSection === 'basic' && (
            <div className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">שם פרטי *</label>
                  <input
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="עדי"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">שם משפחה *</label>
                  <input
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="דובלרו"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">אימייל *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="adi@company.com"
                  dir="ltr"
                />
              </div>

              {/* Phones */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">נייד</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="050-1234567"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">טלפון</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="03-1234567"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Title & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">תפקיד</label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="ממונה בטיחות"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">מחלקה</label>
                  <input
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="ייצור"
                  />
                </div>
              </div>

              {/* Escalation Level */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">רמת הסלמה *</label>
                <div className="grid grid-cols-3 gap-2">
                  {ESCALATION_LEVELS.map(({ level, labelHe }) => {
                    const style = LEVEL_STYLES[level];
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, escalationLevel: level })}
                        className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                          formData.escalationLevel === level
                            ? `${style.bg} ${style.border} ${style.text}`
                            : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-lg ml-2">{style.icon}</span>
                        {labelHe}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  {formData.escalationLevel === 1 && 'מקבל את ההתראה הראשונה על ליקויים'}
                  {formData.escalationLevel === 2 && 'מקבל התראה אם רמה 1 לא מגיב'}
                  {formData.escalationLevel === 3 && 'מקבל התראה אם רמה 2 לא מגיב'}
                </p>
              </div>
            </div>
          )}

          {/* Portal Access Section */}
          {activeSection === 'portal' && (
            <div className="space-y-4">
              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Globe size={18} className="text-indigo-400" />
                    גישה לפורטל לקוח
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    מאפשר לאיש הקשר להתחבר לפורטל ולצפות בליקויים ודוחות
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    portalAccess: {
                      ...formData.portalAccess,
                      enabled: !formData.portalAccess.enabled
                    }
                  })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    formData.portalAccess.enabled ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                    formData.portalAccess.enabled ? 'right-1' : 'right-7'
                  }`} />
                </button>
              </div>

              {/* Role Selection */}
              {formData.portalAccess.enabled && (
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">הרשאות בפורטל</label>
                  <div className="space-y-2">
                    {PORTAL_ROLES.map(role => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          portalAccess: { ...formData.portalAccess, role: role.value }
                        })}
                        className={`w-full p-4 rounded-xl border text-right transition-all ${
                          formData.portalAccess.role === role.value
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                            : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{role.label}</span>
                          {formData.portalAccess.role === role.value && (
                            <Check size={18} className="text-indigo-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              {/* Channels */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-3">ערוצי התראה</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'email', label: 'אימייל', icon: '📧' },
                    { key: 'whatsapp', label: 'וואטסאפ', icon: '💬' },
                    { key: 'sms', label: 'SMS', icon: '📱' }
                  ].map(channel => (
                    <button
                      key={channel.key}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        notificationPreferences: {
                          ...formData.notificationPreferences,
                          [channel.key]: !formData.notificationPreferences[channel.key as keyof typeof formData.notificationPreferences]
                        }
                      })}
                      className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                        formData.notificationPreferences[channel.key as keyof typeof formData.notificationPreferences]
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                          : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-lg ml-2">{channel.icon}</span>
                      {channel.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-3">סוגי התראות</label>
                <div className="space-y-2">
                  {[
                    { key: 'newFindings', label: 'ליקויים חדשים', desc: 'קבלת התראה כשמזוהה ליקוי חדש' },
                    { key: 'findingReminders', label: 'תזכורות לטיפול', desc: 'תזכורות על ליקויים שמתקרבים לדדליין' },
                    { key: 'reportReady', label: 'דוח מוכן', desc: 'התראה כשדוח ביקורת מוכן לצפייה' },
                    { key: 'trainingReminders', label: 'תזכורות הדרכות', desc: 'תזכורות על הדרכות קרובות' }
                  ].map(notif => (
                    <div
                      key={notif.key}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-white/5"
                    >
                      <div>
                        <h5 className="font-bold text-slate-200 text-sm">{notif.label}</h5>
                        <p className="text-xs text-slate-500">{notif.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          notificationPreferences: {
                            ...formData.notificationPreferences,
                            [notif.key]: !formData.notificationPreferences[notif.key as keyof typeof formData.notificationPreferences]
                          }
                        })}
                        className={`w-12 h-7 rounded-full transition-colors relative ${
                          formData.notificationPreferences[notif.key as keyof typeof formData.notificationPreferences]
                            ? 'bg-indigo-600'
                            : 'bg-slate-700'
                        }`}
                      >
                        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                          formData.notificationPreferences[notif.key as keyof typeof formData.notificationPreferences]
                            ? 'right-1'
                            : 'right-6'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'שומר...' : isEditing ? 'עדכן' : 'הוסף'}
          </button>
        </div>
      </div>
    </div>
  );
}
