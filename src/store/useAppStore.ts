import { create } from 'zustand';
import { createCategorySlice, CategorySlice } from './slices/categorySlice';
import { createProfileSlice, ProfileSlice } from './slices/profileSlice';
import { createWalletSlice, WalletSlice } from './slices/walletSlice';
import { createNotificationSlice, NotificationSlice } from './slices/notificationSlice';
import { createNavbarSlice, NavbarSlice } from './slices/navbarSlice';
import { createOrderSlice, OrderSlice } from './slices/orderSlice';
import { createProductSlice, ProductSlice } from './slices/productSlice';
import { createVendorDashboardSlice, VendorDashboardSlice } from './slices/vendorDashboardSlice';
import { createChatbotSlice, ChatbotSlice } from './slices/chatbotSlice';

// 1. Define the master AppState that combines all slices
export type AppState = CategorySlice & ProfileSlice & WalletSlice & NotificationSlice & NavbarSlice & OrderSlice & ProductSlice & VendorDashboardSlice & ChatbotSlice & {
    isCategoryLoading: boolean;
    isProfileLoading: boolean;
    isWalletLoading: boolean;
    isNotificationLoading: boolean;
    isDashboardLoading: boolean;
    
    isCategoryFetched: boolean;
    isProfileFetched: boolean;
    isWalletFetched: boolean;
    isNotificationFetched: boolean;
    isDashboardFetched: boolean;
};

// 2. Create the store and spread the slices inside
export const useAppStore = create<AppState>()((set, get, api) => ({
    isCategoryLoading: false,
    isProfileLoading: false,
    isWalletLoading: false,
    isNotificationLoading: false,
    isDashboardLoading: false,
    
    isCategoryFetched: false,
    isProfileFetched: false,
    isWalletFetched: false,
    isNotificationFetched: false,
    isDashboardFetched: false,

    // Inject all the specific slices
    ...createCategorySlice(set, get, api),
    ...createProfileSlice(set, get, api),
    ...createWalletSlice(set, get, api),
    ...createNotificationSlice(set, get, api),
    ...createNavbarSlice(set, get, api),
    ...createOrderSlice(set, get, api),
    ...createProductSlice(set, get, api),
    ...createVendorDashboardSlice(set, get, api),
    ...createChatbotSlice(set, get, api),
}));