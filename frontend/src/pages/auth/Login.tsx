import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { firestore as db, auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Shield, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      
      // Get current user after login
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/admin');
        return;
      }
      
      // Get user data to determine redirect
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        const clientId = userData.clientId;
        
        // Redirect based on role
        if (role === 'super_admin' || role === 'admin' || role === 'system_admin') {
          navigate('/admin');
        } else if ((role === 'client_user' || role === 'org_admin' || role === 'manager') && clientId) {
          navigate(`/portal/${clientId}`);
        } else if (role === 'inspector' && clientId) {
          navigate(`/portal/${clientId}`);
        } else if (role === 'inspector') {
          navigate('/admin');
        } else {
          navigate('/admin');
        }
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error(err);
      setError('שם משתמש או סיסמה שגויים');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("הכנס כתובת אימייל לשחזור סיסמה");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("נשלח אליך מייל עם קישור לאיפוס סיסמה");
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError("לא נמצא משתמש עם כתובת אימייל זו");
      } else {
        setError("שגיאה בשליחת מייל איפוס");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">התחברות למערכת</h1>
          <p className="text-slate-500 text-sm mt-1">AEGIS Safety Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">אימייל</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-200 text-gray-900 rounded-xl py-3 pr-10 pl-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="user@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">סיסמה</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-slate-50 border border-slate-200 text-gray-900 rounded-xl py-3 pr-10 pl-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-rose-500 text-xs font-bold bg-rose-50 p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="text-left">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              שכחתי סיסמה
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'התחבר'}
          </button>
        </form>
      </div>
    </div>
  );
}
