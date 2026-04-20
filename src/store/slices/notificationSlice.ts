import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface NotificationItem {
    id: string;
    read_at: string | null;
    created_at: string;
    data: {
        title: string;
        message: string;
        [key: string]: any;
    };
    type?: string;
}

export interface NotificationSlice {
    unreadCount: number;
    notifications: NotificationItem[];
    
    fetchNotifications: (silent?: boolean) => Promise<void>;
    pollUnreadCount: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const createNotificationSlice: StateCreator<AppState, [], [], NotificationSlice> = (set, get) => ({
    unreadCount: 0,
    notifications: [],

    fetchNotifications: async (silent = false) => {
        // Guard: Prevent concurrent fetches
        if (get().isNotificationLoading) return;
        
        const token = getAuthToken();
        if (!token) return;

        if (!silent) set({ isNotificationLoading: true });

        try {
            const response = await axios.get(`${baseURL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.status) {
                const rawNotifications = response.data.notifications || [];
                const sorted = [...rawNotifications].sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                
                // Use whichever key backend returns for count
                const realCount = response.data.unread_count ?? response.data.count ?? 0;
                
                set({ 
                    notifications: sorted, 
                    unreadCount: realCount,
                    isNotificationFetched: true 
                });
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            if (!silent) set({ isNotificationLoading: false });
        }
    },

    pollUnreadCount: async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await axios.get(`${baseURL}/api/notifications/unread`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data?.status) {
                const realCount = response.data.unread_count ?? response.data.count ?? 0;
                set({ unreadCount: realCount });
            }
        } catch (error) {
            console.error('Poll unread count failed:', error);
        }
    },

    markAsRead: async (id: string) => {
        const { notifications, unreadCount } = get();
        const wasUnread = notifications.some(n => n.id === id && !n.read_at);
        if (!wasUnread) return;

        // Optimistic update
        const updated = notifications.map(n => 
            n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        );
        set({ notifications: updated, unreadCount: Math.max(0, unreadCount - 1) });

        try {
            const token = getAuthToken();
            await axios.post(`${baseURL}/api/notifications/read?id=${encodeURIComponent(id)}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error('Mark as read failed:', error);
            // Optional: rollback or silent refetch
            get().fetchNotifications(true);
        }
    },

    markAllAsRead: async () => {
        if (get().unreadCount === 0) return;

        // Optimistic update
        const now = new Date().toISOString();
        const updated = get().notifications.map(n => ({ ...n, read_at: now }));
        set({ notifications: updated, unreadCount: 0 });

        try {
            const token = getAuthToken();
            await axios.post(`${baseURL}/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error('Mark all read failed:', error);
            get().fetchNotifications(true);
        }
    }
});
