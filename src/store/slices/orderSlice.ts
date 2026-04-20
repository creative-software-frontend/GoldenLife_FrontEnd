import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface OrderProduct {
    id: number;
    vendor_id?: string;
    order_no: string;
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: string;
    subtotal: string;
    created_at: string;
    updated_at: string;
    service_type: string;
    ebook?: string;
    video_link?: string;
}

export interface Order {
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
    district?: string;
    division?: string;
    thana?: string;
    payment?: {
        id: number;
        order_no: string;
        user_id: string;
        payment_method: string;
        transaction_number: string;
        transaction_id: string | null;
        total: string;
        created_at: string;
        updated_at: string;
    } | null;
    products: OrderProduct[];
    student_address?: {
        id: number;
        user_id: string;
        name: string;
        phone: string;
        address: string;
        division_id: string;
        district_id: string;
        thana_id: string;
        upazila_id: string | null;
        is_default: string;
        created_at: string;
        updated_at: string;
    };
    student?: any;
}

export interface OrderSlice {
    orders: Order[];
    currentOrder: Order | null;
    isOrdersLoading: boolean;
    isOrdersFetched: boolean;
    isOrderDetailsLoading: boolean;

    fetchOrders: (silent?: boolean) => Promise<void>;
    fetchOrderDetails: (orderNo: string) => Promise<void>;
}

export const createOrderSlice: StateCreator<AppState, [], [], OrderSlice> = (set, get) => ({
    orders: [],
    currentOrder: null,
    isOrdersLoading: false,
    isOrdersFetched: false,
    isOrderDetailsLoading: false,

    fetchOrders: async (silent = false) => {
        // Redined Guard: Only skip if already fetched and not a silent refresh.
        if (get().isOrdersFetched && !silent) return;

        const token = getAuthToken();
        if (!token) return;

        if (!silent) set({ isOrdersLoading: true });

        try {
            const url = `${baseURL}/api/student/orders`;
            console.log(`📡 orderSlice: Fetching orders from ${url}`);
            
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const rawOrders = Array.isArray(response.data.orders) ? response.data.orders : [];
            console.log(`✅ orderSlice: Fetched ${rawOrders.length} orders`);
            
            set({ 
                orders: rawOrders, 
                isOrdersFetched: true 
            });
        } catch (error: any) {
            console.error("❌ orderSlice Fetch Error:", error.response?.data || error.message);
        } finally {
            if (!silent) set({ isOrdersLoading: false });
        }
    },

    fetchOrderDetails: async (orderNo: string) => {
        const token = getAuthToken();
        if (!token) return;

        set({ isOrderDetailsLoading: true });

        try {
            const response = await axios.get(`${baseURL}/api/order-details?order_no=${orderNo}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data?.status === "success" && response.data.order) {
                set({ currentOrder: response.data.order });
            }
        } catch (error) {
            console.error("Order Details Fetch Error:", error);
        } finally {
            set({ isOrderDetailsLoading: false });
        }
    }
});
