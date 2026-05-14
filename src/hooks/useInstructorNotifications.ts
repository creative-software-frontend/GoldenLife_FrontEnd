import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

const getAuthToken = () => {
    const session = sessionStorage.getItem("instructor_session");
    if (!session) return null;
    try {
        return JSON.parse(session).token;
    } catch (e) {
        return null;
    }
};

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

export const useInstructorNotifications = () => {
    const queryClient = useQueryClient();
    const token = getAuthToken();

    // 1. Fetch All Notifications
    const { data: notifications = [], isLoading: isNotificationsLoading } = useQuery({
        queryKey: ['instructor-notifications'],
        queryFn: async () => {
            if (!token) return [];
            const { data } = await axios.get(`${baseURL}/api/notifications`, {
                headers: { 'X-Auth-Token': `Bearer ${token}` }
            });
            if (data.status) {
                return [...(data.notifications || [])].sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
            }
            return [];
        },
        enabled: !!token,
        refetchInterval: 60000, // Background refresh every 60s
    });

    // 2. Fetch Unread Count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['instructor-unread-count'],
        queryFn: async () => {
            if (!token) return 0;
            const { data } = await axios.get(`${baseURL}/api/notifications/unread`, {
                headers: { 'X-Auth-Token': `Bearer ${token}` }
            });
            if (data.status) {
                return data.unread_count ?? data.count ?? 0;
            }
            return 0;
        },
        enabled: !!token,
        refetchInterval: 30000, // Poll every 30s
    });

    // 3. Mark As Read Mutation
    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!token) throw new Error("Unauthorized");
            const { data } = await axios.post(`${baseURL}/api/notifications/read?id=${encodeURIComponent(id)}`, {}, {
                headers: { 'X-Auth-Token': `Bearer ${token}` }
            });
            return data;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['instructor-notifications'] });
            await queryClient.cancelQueries({ queryKey: ['instructor-unread-count'] });

            const previousNotifications = queryClient.getQueryData(['instructor-notifications']);
            const previousCount = queryClient.getQueryData(['instructor-unread-count']);

            queryClient.setQueryData(['instructor-notifications'], (old: any) => 
                old?.map((n: any) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            );
            queryClient.setQueryData(['instructor-unread-count'], (old: any) => Math.max(0, (old || 0) - 1));

            return { previousNotifications, previousCount };
        },
        onError: (err, newTodo, context: any) => {
            queryClient.setQueryData(['instructor-notifications'], context.previousNotifications);
            queryClient.setQueryData(['instructor-unread-count'], context.previousCount);
            console.error('Mark as read failed:', err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['instructor-unread-count'] });
        }
    });

    // 4. Mark All As Read Mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            if (!token) throw new Error("Unauthorized");
            const { data } = await axios.post(`${baseURL}/api/notifications/read-all`, {}, {
                headers: { 'X-Auth-Token': `Bearer ${token}` }
            });
            return data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['instructor-notifications'] });
            await queryClient.cancelQueries({ queryKey: ['instructor-unread-count'] });

            const previousNotifications = queryClient.getQueryData(['instructor-notifications']);
            const previousCount = queryClient.getQueryData(['instructor-unread-count']);

            const now = new Date().toISOString();
            queryClient.setQueryData(['instructor-notifications'], (old: any) => 
                old?.map((n: any) => ({ ...n, read_at: n.read_at || now }))
            );
            queryClient.setQueryData(['instructor-unread-count'], 0);

            return { previousNotifications, previousCount };
        },
        onError: (err, variables, context: any) => {
            queryClient.setQueryData(['instructor-notifications'], context.previousNotifications);
            queryClient.setQueryData(['instructor-unread-count'], context.previousCount);
            toast.error("Failed to mark all as read.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['instructor-unread-count'] });
        },
        onSuccess: (data) => {
            if (data?.status) {
                toast.success(data.message || "All notifications marked as read");
            } else {
                toast.error(data?.message || "Failed to mark all as read");
            }
        }
    });

    return {
        notifications,
        unreadCount,
        isNotificationsLoading,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        isMarkingAllAsRead: markAllAsReadMutation.isPending,
        refetchNotifications: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['instructor-unread-count'] });
        }
    };
};
