import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationType } from '../types/notifications';

export default function Notifications() {
  const navigate = useNavigate();
  const [userId, setUserId] = React.useState<string>('');
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user?.uid || '');
    });
    return () => unsubscribe();
  }, []);

  const filters = {
    type: filterType !== 'all' ? filterType : undefined,
    isRead: filterRead === 'unread' ? false : filterRead === 'read' ? true : undefined,
  };

  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead,
    markAllAsRead 
  } = useNotifications(userId, filters);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    if (notification.linkTo) {
      navigate(notification.linkTo);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task': return '📋';
      case 'automation': return '⚡';
      case 'mention': return '💬';
      case 'system': return '🔔';
      default: return '📢';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">התראות</h1>
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} התראות שלא נקראו` : 'כל ההתראות נקראו'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                סמן הכל כנקרא
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-4 mt-4">
            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">כל הסוגים</option>
              <option value="system">מערכת 🔔</option>
              <option value="automation">אוטומציה ⚡</option>
              <option value="task">משימה 📋</option>
              <option value="mention">אזכור 💬</option>
            </select>

            {/* Filter by Read Status */}
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">הכל</option>
              <option value="unread">לא נקראו</option>
              <option value="read">נקראו</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          {loading && (
            <div className="px-6 py-12 text-center text-gray-500">
              טוען...
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              אין התראות להצגה
            </div>
          )}

          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-base font-semibold text-gray-900">
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.body}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(notification.createdAt, {
                      addSuffix: true,
                      locale: he
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
