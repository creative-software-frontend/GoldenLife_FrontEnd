import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface OverviewStats {
    total_parcel: { count: number; amount: number };
    delivered: { count: number; amount: number };
    pending: { count: number; amount: number };
    cancel: { count: number; percentage: number; amount: number };
}

export interface ChartPerformance {
    date_label: string;
    total_sales: string;
}

export interface ChartData {
    highest: number;
    lowest: number;
    performance: ChartPerformance[];
}

export interface RecentOrder {
    id: number;
    order_no: string;
    user_id: string;
    vendor_id: string;
    user_name: string;
    user_phone: string;
    user_address: string;
    delivery_charge: string;
    total: string;
    created_at: string;
    updated_at: string;
    status: string;
    district: string;
    division: string;
    thana: string;
}

export interface DashboardData {
    overview: {
        today: OverviewStats;
        weekly: OverviewStats;
        monthly: OverviewStats;
        yearly: OverviewStats;
    };
    total_revenue: number;
    active_orders: number;
    store_rating: number;
    sales_charts: {
        week: ChartData;
        month: ChartData;
        year: ChartData;
    };
    inventory: {
        low_stock_count: number;
    };
    recent_orders: RecentOrder[];
}

export interface VendorDashboardSlice {
    dashboardData: DashboardData | null;
    isDashboardLoading: boolean;
    isDashboardFetched: boolean;
    fetchVendorDashboard: (silent?: boolean) => Promise<void>;
}

export const createVendorDashboardSlice: StateCreator<AppState, [], [], VendorDashboardSlice> = (set, get) => ({
    dashboardData: null,
    isDashboardLoading: false,
    isDashboardFetched: false,

    fetchVendorDashboard: async (silent = false) => {
        const token = getAuthToken();
        if (!token) return;

        if (!silent) set({ isDashboardLoading: true });

        try {
            const response = await axios.get(`${baseURL}/api/vendor/WebDashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data?.status || response.data?.data) {
                set({
                    dashboardData: response.data.data,
                    isDashboardFetched: true
                });
            }
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
        } finally {
            if (!silent) set({ isDashboardLoading: false });
        }
    }
});
