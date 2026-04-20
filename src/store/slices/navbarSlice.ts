import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface NavbarSlice {
    isNavbarLoading: boolean;
    isNavbarFetched: boolean;
    fetchNavbarData: (silent?: boolean) => Promise<void>;
}

export const createNavbarSlice: StateCreator<AppState, [], [], NavbarSlice> = (set, get) => ({
    isNavbarLoading: false,
    isNavbarFetched: false,

    fetchNavbarData: async (silent = false) => {
        const token = getAuthToken();
        if (!token) return;

        if (!silent) {
            set({ 
                isNavbarLoading: true,
                isWalletLoading: true,
                isProfileLoading: true,
                isNotificationLoading: true
            });
        }

        try {
            const response = await axios.get(`${baseURL}/api/navbar`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = response.data;
            if (data?.status) {
                // 1. Update Wallet Balance
                if (data.balance !== undefined) {
                    set({ walletBalance: data.balance.toString() });
                }

                // 2. Update Notifications
                if (data.notifications) {
                    const sorted = [...data.notifications].sort((a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );
                    set({ 
                        notifications: sorted,
                        unreadCount: data.count ?? 0
                    });
                }

                // 3. Update Profile (Partial) - Only merge to avoid losing details from full profile fetch
                if (data.user_info) {
                    const isVendor = window.location.pathname.includes('/vendor');
                    if (isVendor) {
                        const currentProfile = get().vendorProfile;
                        set({
                            vendorProfile: {
                                ...currentProfile,
                                user: {
                                    ...(currentProfile?.user || {}),
                                    ...(data.user_info.name && { name: data.user_info.name }),
                                    ...(data.user_info.email && { email: data.user_info.email }),
                                    ...(data.user_info.image && { image: data.user_info.image }),
                                },
                            } as any
                        });
                    } else {
                        const currentProfile = get().studentProfile;
                        // Only set if we don't have a profile or to update specific fields
                        set({
                            studentProfile: {
                                ...(currentProfile || {}),
                                ...(data.user_info.name && { name: data.user_info.name }),
                                ...(data.user_info.email && { email: data.user_info.email }),
                                ...(data.user_info.image && { image: data.user_info.image }),
                            } as any
                        });
                    }
                }

                set({ isNavbarFetched: true });
            }
        } catch (error) {
            console.error("Navbar Fetch Error:", error);
        } finally {
            if (!silent) {
                set({ 
                    isNavbarLoading: false,
                    isWalletLoading: false,
                    isProfileLoading: false,
                    isNotificationLoading: false
                });
            }
        }
    }
});
