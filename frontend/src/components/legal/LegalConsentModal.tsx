import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, Cookie } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore as db } from '../../firebase';
import { useAuth } from '../../providers/AuthProvider';
import { Link } from 'react-router-dom';

const CURRENT_LEGAL_VERSION = "1.0.0";

export default function LegalConsentModal() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // בדיקה אם המשתמש כבר אישר את הגרסה הנוכחית (כולל קוקיז)
  const hasConsented = user?.legalConsent?.accepted && user?.legalConsent?.version === CURRENT_LEGAL_VERSION;

  if (hasConsented || !isVisible) return null;

  const handleAccept = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        legalConsent: {
          accepted: true,
          acceptedAt: serverTimestamp(),
          version: CURRENT_LEGAL_VERSION,
          cookiesAccepted: true // תיעוד אישור קוקיז
        }
      });
      setIsVisible(false);
    } catch (error) {
      console.error("Error updating consent:", error);
      alert("שגיאה בעדכון האישור. נא לנסות שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-[#0E1A35]/95 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1C2435] border border-[#00D8FF]/30 rounded-[2.5rem] max-w-lg w-full p-10 shadow-[0_0_60px_rgba(0,216,255,0.3)]"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center gap-4">
            <div className="w-16 h-16 bg-[#00D8FF]/10 rounded-2xl flex items-center justify-center border border-[#00D8FF]/20">
              <ShieldCheck className="text-[#00D8FF] w-8 h-8" />
            </div>
            <div className="w-16 h-16 bg-[#00D8FF]/10 rounded-2xl flex items-center justify-center border border-[#00D8FF]/20">
              <Cookie className="text-[#00D8FF] w-8 h-8" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">אישור תנאים ו-Cookies</h2>
            <p className="text-[#A9B3C1] text-lg leading-relaxed text-right">
              לצורך תפעול תקין של מערכת **AEGIS**, שיפור חוויית המשתמש ואבטחת המידע, אנו משתמשים בעוגיות (Cookies) ומבקשים את אישורך לתנאים המעודכנים.
            </p>
          </div>

          <div className="bg-[#0E1A35]/50 rounded-2xl border border-white/5 p-4 text-right">
            <p className="text-xs text-[#6B7C93] leading-relaxed">
              בלחיצה על הכפתור למטה, הינך מאשר את <Link to="/terms" target="_blank" className="text-[#00D8FF] hover:underline">תנאי השימוש</Link>, את <Link to="/privacy" target="_blank" className="text-[#00D8FF] hover:underline">מדיניות הפרטיות</Link> ואת השימוש בעוגיות הכרחיות וסטטיסטיות כפי שמפורט במסמכים אלו.
            </p>
          </div>

          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-[#00D8FF] text-[#0E1A35] font-black py-4 rounded-2xl text-xl shadow-[0_0_25px_rgba(0,216,255,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? 'מעדכן פרוטוקול...' : 'אני מאשר וממשיך'}
          </button>
          
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
             <span className="text-[10px] text-[#6B7C93] font-mono uppercase tracking-widest text-right">Compliance: GDPR / Cookie Law</span>
             <span className="text-[10px] text-[#6B7C93] font-mono uppercase tracking-widest">v{CURRENT_LEGAL_VERSION}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
