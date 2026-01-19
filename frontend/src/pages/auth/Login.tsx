import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { firestore as db, auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Shield, Lock, Mail, Loader2, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginIntro from '../../components/LoginIntro';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('חובה לאשר את תנאי השימוש והקוקיז כדי להמשיך');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/admin');
        return;
      }
      
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        const clientId = userData.clientId;
        
        if (role === 'super_admin' || role === 'admin' || role === 'system_admin') {
          navigate('/admin');
        } else {
          navigate(`/portal/${clientId || ''}`);
        }
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError('שם משתמש או סיסמה שגויים');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <LoginIntro key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#0E1A35] flex items-center justify-center p-4 relative overflow-hidden"
            dir="rtl"
          >
            <div className="relative bg-[#1C2435] p-8 rounded-3xl w-full max-w-md border-2 border-[#00D8FF]/30 shadow-[0_0_60px_rgba(0,216,255,0.2)] z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D8FF] to-[#0EA5E9] text-[#0E1A35] mb-4 shadow-[0_0_30px_rgba(0,216,255,0.4)]">
                  <Shield size={32} />
                </div>
                <h1 className="text-2xl font-black text-white">AEGIS</h1>
                <p className="text-[#00D8FF] text-xs font-bold uppercase tracking-widest mt-1">Intelligence Platform</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#A9B3C1] mb-2">אימייל</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full bg-[#0E1A35] border-2 border-[#00D8FF]/20 text-white rounded-xl py-3 px-4 text-sm focus:border-[#00D8FF] outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A9B3C1] mb-2">סיסמה</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      className="w-full bg-[#0E1A35] border-2 border-[#00D8FF]/20 text-white rounded-xl py-3 px-4 text-sm focus:border-[#00D8FF] outline-none transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-3 text-[#6B7C93]">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Consent Checkbox - NEW */}
                <div className="flex items-start gap-3 p-3 bg-[#0E1A35]/50 rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#00D8FF]/30 bg-[#0E1A35] text-[#00D8FF] focus:ring-[#00D8FF]"
                  />
                  <label htmlFor="consent" className="text-[11px] text-[#A9B3C1] leading-tight">
                    אני מאשר את <Link to="/terms" className="text-[#00D8FF] hover:underline">תנאי השימוש</Link>, את <Link to="/privacy" className="text-[#00D8FF] hover:underline">מדיניות הפרטיות</Link> ואת השימוש ב-Cookies לצורך אבטחה ותפעול המערכת.
                  </label>
                </div>

                {error && <div className="text-[#FF6B6B] text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#00D8FF] to-[#0EA5E9] text-[#0E1A35] py-3 rounded-xl font-black shadow-[0_0_20px_rgba(0,216,255,0.3)] disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'התחבר למערכת'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
