import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../providers/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { firestore as db } from '../firebase';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [clientId, setClientId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getClientId = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setClientId(userDoc.data().clientId);
        }
      }
    };
    getClientId();
  }, [user]);

  const goToPortal = () => {
    if (clientId) {
      navigate(`/portal/${clientId}`);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md text-center">
        <ShieldExclamationIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">אין הרשאה</h1>
        <p className="text-gray-400 mb-6">אין לך הרשאה לגשת לדף זה.</p>
        
        <div className="space-y-3">
          {clientId && (
            <button
              onClick={goToPortal}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              חזור לפורטל שלי
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            התנתק
          </button>
        </div>
      </div>
    </div>
  );
}
