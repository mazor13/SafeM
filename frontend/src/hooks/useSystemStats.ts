import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { firestore } from '../firebase';

export interface SystemStats {
  totalTenants: number;
  totalRevenue: number;
  totalUsers: number;
  healthScore: number;
}

export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats>({
    totalTenants: 0,
    totalRevenue: 0,
    totalUsers: 0,
    healthScore: 100
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // מאזין לכל הלקוחות כדי לחשב נתונים בזמן אמת
    const q = query(collection(firestore, 'clients'));
    
    const unsub = onSnapshot(q, (snap) => {
      let users = 0;
      let revenue = 0;
      
      snap.docs.forEach(doc => {
        const data = doc.data();
        users += (data.userCount || 0);
        revenue += (data.mrr || 0); // Monthly Recurring Revenue
      });

      setStats({
        totalTenants: snap.size,
        totalRevenue: revenue,
        totalUsers: users,
        healthScore: 98 // כרגע סטטי, נחבר ללוגיקה בעתיד
      });
      setLoading(false);
    });

    return unsub;
  }, []);

  return { stats, loading };
}
