import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore as db } from '../../firebase';
import { Shield, Lock, Mail, User, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get invitation token from URL
  const token = searchParams.get('token');
  const invitedEmail = searchParams.get('email');
  
  // States
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Validate invitation on load
  useEffect(() => {
    const validateInvitation = async () => {
      if (!token || !invitedEmail) {
        setError('קישור הזמנה לא תקין');
        setLoading(false);
        return;
      }

      try {
        // Find user by email with pending status
        const usersRef = doc(db, 'users', token);
        const userDoc = await getDoc(usersRef);
        
        if (!userDoc.exists()) {
          setError('הזמנה לא נמצאה');
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        
        if (userData.status !== 'pending') {
          setError('הזמנה זו כבר מומשה או פגה');
          setLoading(false);
          return;
        }

        if (userData.email !== invitedEmail.toLowerCase()) {
          setError('כתובת המייל לא תואמת להזמנה');
          setLoading(false);
          return;
        }

        setInvitation({ id: userDoc.id, ...userData });
        setEmail(userData.email);
        setFullName(userData.fullName || '');
        setLoading(false);
      } catch (err) {
        console.error('Error validating invitation:', err);
        setError('שגיאה באימות ההזמנה');
        setLoading(false);
      }
    };

    validateInvitation();
  }, [token, invitedEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    if (password !== confirmPassword) {
      setError('הסיסמאות לא תואמות');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Copy invitation data to new document with UID as ID
      const oldUserRef = doc(db, "users", invitation.id);
      const newUserRef = doc(db, "users", uid);
      
      // Create new document with correct UID
      const { setDoc, deleteDoc } = await import("firebase/firestore");
      await setDoc(newUserRef, {
        ...invitation,
        uid: uid,
        fullName: fullName,
        status: "active",
        activatedAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      // Delete old invitation document
      await deleteDoc(oldUserRef);
      setSuccess(true);

      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        if (invitation.clientId) {
          navigate(`/portal/${invitation.clientId}`);
        } else {
          navigate('/admin');
        }
      }, 2000);

    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('כתובת המייל כבר רשומה במערכת. נסה להתחבר.');
      } else if (err.code === 'auth/weak-password') {
        setError('הסיסמה חלשה מדי');
      } else {
        setError('שגיאה ביצירת החשבון: ' + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // Error state (invalid invitation)
  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">שגיאה</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all"
          >
            חזור לדף ההתחברות
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">ברוכים הבאים!</h1>
          <p className="text-slate-400">החשבון נוצר בהצלחה. מעביר אותך למערכת...</p>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AEGIS</h1>
          <p className="text-slate-400 mt-2">השלמת הרשמה</p>
        </div>

        {/* Invitation Info */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-indigo-300">
            הוזמנת להצטרף כ<strong>{invitation?.role === 'org_admin' ? 'מנהל ראשי' : invitation?.role === 'manager' ? 'מנהל עבודה' : 'מפקח'}</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (readonly) */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">
              <Mail className="w-4 h-4 inline ml-1" />
              אימייל
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">
              <User className="w-4 h-4 inline ml-1" />
              שם מלא
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">
              <Lock className="w-4 h-4 inline ml-1" />
              סיסמה
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="לפחות 6 תווים"
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">
              <Lock className="w-4 h-4 inline ml-1" />
              אימות סיסמה
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                יוצר חשבון...
              </>
            ) : (
              'צור חשבון והתחבר'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          כבר יש לך חשבון?{' '}
          <button onClick={() => navigate('/login')} className="text-indigo-400 hover:underline">
            התחבר
          </button>
        </p>
      </div>
    </div>
  );
}
