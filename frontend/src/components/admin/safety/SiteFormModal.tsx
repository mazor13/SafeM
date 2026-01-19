import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Building, Globe, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SiteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function SiteFormModal({ isOpen, onClose, onSubmit }: SiteFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'office',
    riskLevel: 'low',
    address: { city: '', street: '' },
    clientId: 'LeadMatrix-Node-01'
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-[#0E1A35]/80 backdrop-blur-md" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#1C2435] border border-[#00D8FF]/30 rounded-[2rem] w-full max-w-2xl shadow-[0_0_50px_rgba(0,216,255,0.15)] overflow-hidden"
        >
          {/* Header - Intelligence Style */}
          <div className="relative p-8 border-b border-[#00D8FF]/10 bg-[#0E1A35]/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00D8FF]/10 rounded-xl flex items-center justify-center border border-[#00D8FF]/20 shadow-[0_0_15px_rgba(0,216,255,0.2)]">
                <Zap className="w-6 h-6 text-[#00D8FF]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Establish New Node</h2>
                <p className="text-[#A9B3C1] text-sm font-medium">הגדרת אתר חדש ברשת המודיעין של Aegis</p>
              </div>
            </div>
            <button onClick={onClose} className="absolute top-8 left-8 text-[#A9B3C1] hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#A9B3C1] mr-1">
                  <Building size={14} className="text-[#00D8FF]" /> שם האתר
                </label>
                <input
                  required
                  type="text"
                  placeholder="לדוגמה: קמפוס צורן"
                  className="w-full bg-[#0E1A35] border border-[#00D8FF]/20 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#00D8FF] focus:ring-2 focus:ring-[#00D8FF]/20 transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Node Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#A9B3C1] mr-1">
                  <Globe size={14} className="text-[#00D8FF]" /> סיווג מתקן
                </label>
                <select 
                  className="w-full bg-[#0E1A35] border border-[#00D8FF]/20 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#00D8FF] transition-all font-medium appearance-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="office">משרדים</option>
                  <option value="industrial">תעשייה</option>
                  <option value="logistics">לוגיסטיקה</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#A9B3C1] mr-1">
                  <MapPin size={14} className="text-[#00D8FF]" /> עיר / מיקום
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-[#0E1A35] border border-[#00D8FF]/20 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#00D8FF] transition-all font-medium"
                  value={formData.address.city}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                />
              </div>

              {/* Risk Level */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#A9B3C1] mr-1">
                  <ShieldCheck size={14} className="text-[#00D8FF]" /> רמת סיכון (AI Score)
                </label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({...formData, riskLevel: level})}
                      className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.riskLevel === level 
                        ? 'bg-[#00D8FF] text-[#0E1A35] border-[#00D8FF]' 
                        : 'border-[#00D8FF]/20 text-[#A9B3C1] hover:bg-[#00D8FF]/5'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-8 py-4 bg-transparent border border-[#00D8FF]/20 text-[#A9B3C1] font-bold rounded-2xl hover:bg-[#00D8FF]/5 transition-all"
              >
                ביטול
              </button>
              <button 
                type="submit"
                disabled={submitting}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-[#00D8FF] to-[#0099CC] text-[#0E1A35] font-black rounded-2xl shadow-[0_0_25px_rgba(0,216,255,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {submitting ? 'מעבד...' : 'בצע הקמה (Establish)'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
