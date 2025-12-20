import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export default function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  return (element: React.ReactElement) => {
    if (loading) {
      return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }
    // הערה: כרגע ביטלתי את ההפניה ל-Login כדי שתוכל לראות את הדשבורד גם בלי להתחבר
    // בעתיד נחזיר את השורה הזו:
    // if (!user) { navigate('/login'); return <div />; }
    return element;
  };
}
