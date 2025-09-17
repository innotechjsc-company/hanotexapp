'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Settings
} from 'lucide-react';
import { useNotifications } from '@/hooks/useWebSocket';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { data: session } = useSession();
  const { notifications, markAsRead, clearNotifications, unreadCount } = useNotifications();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Technology Approved',
        message: 'Your technology "AI-Powered Image Recognition" has been approved and is now live.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        actionUrl: '/technologies/1',
        actionText: 'View Technology',
      },
      {
        id: '2',
        type: 'info',
        title: 'New Bid Received',
        message: 'You received a new bid of $15,000 for your technology auction.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        actionUrl: '/auctions/1',
        actionText: 'View Auction',
      },
      {
        id: '3',
        type: 'warning',
        title: 'Verification Required',
        message: 'Please complete your profile verification to access all features.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        actionUrl: '/profile/verify',
        actionText: 'Verify Now',
      },
      {
        id: '4',
        type: 'error',
        title: 'Payment Failed',
        message: 'Your payment for the premium subscription could not be processed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        isRead: true,
        actionUrl: '/billing',
        actionText: 'Update Payment',
      },
    ];

    setLocalNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50';
    
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-green-500';
      case 'error':
        return 'bg-red-50 border-l-red-500';
      case 'warning':
        return 'bg-yellow-50 border-l-yellow-500';
      default:
        return 'bg-blue-50 border-l-blue-500';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setLocalNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    setLocalNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    // Mark all as read in the hook
    localNotifications.forEach(notif => markAsRead(notif.id));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setLocalNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const handleClearAll = () => {
    setLocalNotifications([]);
    clearNotifications();
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCountLocal = localNotifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCountLocal > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  {unreadCountLocal}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
              <button
                onClick={handleClearAll}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Clear all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {localNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bell className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {localNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getNotificationBgColor(notification.type, notification.isRead)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              notification.isRead ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-sm mt-1 ${
                              notification.isRead ? 'text-gray-500' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                            
                            {notification.actionUrl && notification.actionText && (
                              <a
                                href={notification.actionUrl}
                                className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800"
                              >
                                {notification.actionText}
                              </a>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-green-600"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                <Settings className="h-4 w-4 mr-2" />
                Notification Settings
              </button>
              
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
