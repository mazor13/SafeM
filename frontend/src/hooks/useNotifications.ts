import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { 
  Notification, 
  NotificationFilters
} from '../types/notifications';

export function useNotifications(userId: string, filters?: NotificationFilters) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('🔔 useNotifications - Starting listener for userId:', userId);
    
    if (!userId) {
      console.warn('⚠️ useNotifications - No userId provided');
      setLoading(false);
      return;
    }

    try {
      // Build query
      let q = query(
        collection(firestore, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      // Apply filters
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      if (filters?.isRead !== undefined) {
        q = query(q, where('isRead', '==', filters.isRead));
      }

      // Real-time listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log('📬 useNotifications - Received', snapshot.size, 'notifications');
          
          const notifs: Notification[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            console.log('📋 Notification:', docSnap.id, data);
            notifs.push({
              id: docSnap.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              readAt: data.readAt?.toDate() || undefined,
            } as Notification);
          });

          setNotifications(notifs);
          
          const unread = notifs.filter(n => !n.isRead).length;
          console.log('🔢 Unread count:', unread);
          setUnreadCount(unread);
          
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('❌ useNotifications - Error:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => {
        console.log('🛑 useNotifications - Cleaning up listener');
        unsubscribe();
      };
    } catch (err) {
      console.error('❌ useNotifications - Setup error:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [userId, filters?.type, filters?.isRead]);

  const markAsRead = async (notificationId: string) => {
    try {
      const notifRef = doc(firestore, 'notifications', notificationId);
      await updateDoc(notifRef, {
        isRead: true,
        readAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.isRead);
      const batch = writeBatch(firestore);

      unreadNotifs.forEach((notif) => {
        const notifRef = doc(firestore, 'notifications', notif.id);
        batch.update(notifRef, {
          isRead: true,
          readAt: Timestamp.now(),
        });
      });

      await batch.commit();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  };
}
