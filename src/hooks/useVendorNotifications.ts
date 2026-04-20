import { useState, useEffect, useCallback } from 'react';

interface NotificationData {
  title: string;
  message: string;
  [key: string]: any;
}

export interface NotificationItem {
  id: string;
  read_at: string | null;
  created_at: string;
  data: NotificationData;
  type?: string;
}

interface NotificationsResponse {
  status: boolean;
  unread_count?: number;
  count?: number;
  notifications: NotificationItem[];
}

export const useVendorNotifications = (baseURL: string, token: string | null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!token) {
      console.warn('🔴 No token available for notifications');
      return;
    }
    if (!silent) setSyncing(true);

    try {
      console.log('🔵 Fetching notifications from:', `${baseURL}/api/notifications`);
      console.log('🔵 Token present:', !!token);

      const response = await fetch(`${baseURL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('🔵 Response status:', response.status);
      
      if (!response.ok) {
        console.error('🔴 Notification fetch failed with status:', response.status);
        return;
      }

      const data: NotificationsResponse = await response.json();
      console.log('🔵 Response data:', data);
      
      if (data.status) {
        const sorted = [...(data.notifications || [])].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setNotifications(sorted);

        // Use whichever key the backend returns
        const realCount = data.unread_count ?? data.count ?? 0;
        setUnreadCount(realCount);
        console.log('🟢 Notifications loaded:', sorted.length, 'Unread:', realCount);
      } else {
        console.warn('🟡 API returned status: false');
      }
    } catch (error) {
      console.error('🔴 Failed to fetch notifications:', error);
    } finally {
      if (!silent) setSyncing(false);
    }
  }, [baseURL, token]);

  // Background polling: 
  // - When CLOSED → only fast unread count (lightweight)
  // - When OPEN → full notifications refresh (so list is always fresh)
  const backgroundPoll = useCallback(async () => {
    if (!token) return;

    if (isOpen) {
      // Full refresh when dropdown is open
      fetchNotifications(true);
    } else {
      // Only count when closed (saves bandwidth)
      try {
        console.log('🔵 Polling unread count from:', `${baseURL}/api/notifications/unread`);
        const response = await fetch(`${baseURL}/api/notifications/unread`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('🔵 Unread count response status:', response.status);
        
        if (!response.ok) return;

        const data = await response.json();
        console.log('🔵 Unread count data:', data);
        
        if (data.status) {
          const realCount = data.unread_count ?? data.count ?? 0;
          setUnreadCount(realCount);
        }
      } catch (error) {
        console.error('🔴 Poll unread count failed:', error);
      }
    }
  }, [baseURL, token, isOpen, fetchNotifications]);

  // Initial load (silent)
  useEffect(() => {
    fetchNotifications(true);
  }, [fetchNotifications]);

  // Polling interval – changes automatically when you open/close the bell
  useEffect(() => {
    const intervalMs = isOpen ? 3000 : 12000;
    const interval = setInterval(backgroundPoll, intervalMs);
    return () => clearInterval(interval);
  }, [backgroundPoll, isOpen]);

  // Whenever you click the bell and isOpen becomes true → immediately fetch fresh notifications
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(true);
    }
  }, [isOpen, fetchNotifications]);

  const markAsRead = async (id: string) => {
    const wasUnread = notifications.some(n => n.id === id && !n.read_at);
    if (!wasUnread) return;

    // Instant visual update
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
      )
    );

    try {
      console.log('🔵 Marking as read:', id);
      const response = await fetch(`${baseURL}/api/notifications/read?id=${encodeURIComponent(id)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('🔵 Mark as read response status:', response.status);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      console.log('🔵 Mark as read result:', result);
      
      if (!result.status) throw new Error('Backend failed');

      // Immediate sync after marking read
      setTimeout(() => fetchNotifications(true), 100);
    } catch (error) {
      console.error('🔴 Mark as read failed:', error);
      fetchNotifications(true);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    // Instant visual update
    const now = new Date().toISOString();
    setNotifications(prev => prev.map(notif => ({ ...notif, read_at: now })));

    try {
      console.log('🔵 Marking all as read');
      const response = await fetch(`${baseURL}/api/notifications/read-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('🔵 Mark all as read response status:', response.status);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      console.log('🔵 Mark all as read result:', result);
      
      if (!result.status) throw new Error('Backend failed');

      // Immediate sync after marking all read
      setTimeout(() => fetchNotifications(true), 200);
    } catch (error) {
      console.error('🔴 Mark all failed:', error);
      fetchNotifications(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUnread = (notif: NotificationItem) => !notif.read_at;

  return {
    isOpen,
    setIsOpen,
    notifications,
    unreadCount,
    syncing,
    markAsRead,
    markAllAsRead,
    formatDate,
    isUnread,
    fetchNotifications,
  };
};
