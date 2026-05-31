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
    course_type?: string;
    download_url?: string | null;
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
        // Refined Guard: Only skip if already fetched and not a silent refresh.
        if (get().isOrdersFetched && !silent) return;

        const token = getAuthToken();
        if (!token) return;

        if (!silent) set({ isOrdersLoading: true });

        // Try multiple student order history endpoint variations
        const endpointsToTry = [
            `${baseURL}/api/student/orders`,
            `${baseURL}/api/student/orders/history`,
            `${baseURL}/api/student/order/history`,
            `${baseURL}/api/student/order`
        ];

        let rawOrders: any[] = [];
        let success = false;

        for (const url of endpointsToTry) {
            try {
                console.log(`📡 orderSlice: Fetching orders from ${url}`);
                const response = await axios.get(url, {
                    headers: { 'X-Auth-Token': `Bearer ${token}` }
                });

                const resData = response.data;
                if (resData) {
                    if (Array.isArray(resData.orders)) {
                        rawOrders = resData.orders;
                    } else if (Array.isArray(resData.data)) {
                        rawOrders = resData.data;
                    } else if (Array.isArray(resData)) {
                        rawOrders = resData;
                    }
                }

                console.log(`✅ orderSlice: Fetched ${rawOrders.length} raw orders from ${url}`);
                success = true;
                break; // Exit loop if endpoint returns successfully
            } catch (error: any) {
                console.warn(`⚠️ orderSlice failed endpoint ${url}:`, error.message);
            }
        }

        if (success) {
            // Normalize orders data structure
            const normalizedOrders = rawOrders.map((order: any) => {
                const items = order.items || order.products || [];
                
                // Calculate total if null/empty
                let totalAmount = order.total_amount || order.total;
                if (!totalAmount && items.length > 0) {
                    totalAmount = items.reduce((sum: number, item: any) => sum + Number(item.subtotal || 0), 0).toString();
                } else if (!totalAmount) {
                    totalAmount = "0.00";
                }

                return {
                    id: order.id,
                    order_no: order.order_no || "",
                    user_id: order.user_id || "",
                    vendor_id: order.vendor_id || "",
                    user_name: order.user_name || order.address?.name || "",
                    user_phone: order.user_phone || order.address?.phone || "",
                    user_address: order.user_address || order.address?.address || "",
                    delivery_charge: order.delivery_charge || "0.00",
                    total: totalAmount,
                    status: order.status || order.payment_status || "Order Placed",
                    created_at: order.created_at || new Date().toISOString(),
                    updated_at: order.updated_at || new Date().toISOString(),
                    payment: order.payment || (order.payment_status ? {
                        payment_method: order.payment_method || "Wallet",
                        transaction_number: order.transaction_number || ""
                    } : null),
                    products: items.map((item: any) => {
                        const details = item.course || item.product || item.details || {};
                        // Comprehensive download_url extraction — covers all known API field variants
                        const resolvedDownloadUrl =
                            details.download_url ||
                            details.video_link ||
                            details.class_link ||
                            details.stream_url ||
                            details.link ||
                            item.download_url ||
                            item.video_link ||
                            item.class_link ||
                            item.stream_url ||
                            null;
                        const resolvedCourseType =
                            details.course_type ||
                            item.course_type ||
                            details.type ||
                            item.type ||
                            "";
                        return {
                            id: item.order_product_id || item.id,
                            order_no: order.order_no || "",
                            product_id: details.id || item.product_id || "",
                            product_name: details.product_title_english || details.course_title_english || item.product_name || details.product_name || details.name || "Unknown Item",
                            product_image: details.image || details.product_image || item.product_image || "",
                            quantity: item.quantity?.toString() || "1",
                            subtotal: item.subtotal?.toString() || "0.00",
                            service_type: item.service_type || "product",
                            ebook: (resolvedCourseType.toLowerCase().includes("ebook") || details.ebook === 1 || details.ebook === "1") ? "1" : "0",
                            video_link: resolvedDownloadUrl,
                            course_type: resolvedCourseType,
                            download_url: resolvedDownloadUrl,
                            created_at: item.created_at || order.created_at,
                            updated_at: item.updated_at || order.updated_at
                        };
                    }),
                    student_address: order.student_address || order.address || undefined
                };
            });

            set({
                orders: normalizedOrders,
                isOrdersFetched: true
            });
        } else {
            console.error("❌ orderSlice: All student orders endpoints failed.");
        }

        if (!silent) set({ isOrdersLoading: false });
    },

    fetchOrderDetails: async (orderNo: string) => {
        const token = getAuthToken();
        if (!token) return;

        set({ isOrderDetailsLoading: true });

        try {
            // Always fetch from detail API — the list endpoint often omits download_url.
            // Fall back to cached order only if the API call fails.
            console.log(`📡 orderSlice: Fetching order details for ${orderNo} from API`);

            const response = await axios.get(`${baseURL}/api/order-details?order_no=${orderNo}`, {
                headers: { 'X-Auth-Token': `Bearer ${token}` }
            });

            // Debug: log raw response to see actual structure
            console.log('📦 orderSlice: order-details raw response:', JSON.stringify(response.data, null, 2));

            // Handle multiple API response shapes:
            // { status: "success", order: {...} } OR { success: true, data: {...} } OR { order: {...} }
            const resData = response.data;
            const rawOrder =
                resData?.order ||
                resData?.data?.order ||
                resData?.data ||
                (resData?.success || resData?.status === 'success' ? resData : null);

            if (rawOrder && typeof rawOrder === 'object' && !Array.isArray(rawOrder)) {
                const order = rawOrder;
                const items = order.items || order.products || [];
                
                // Calculate total if null/empty
                let totalAmount = order.total_amount || order.total;
                if (!totalAmount && items.length > 0) {
                    totalAmount = items.reduce((sum: number, item: any) => sum + Number(item.subtotal || 0), 0).toString();
                } else if (!totalAmount) {
                    totalAmount = "0.00";
                }

                const normalizedOrder = {
                    ...order,
                    total: totalAmount,
                    delivery_charge: order.delivery_charge || "0.00",
                    status: order.status || order.payment_status || "Order Placed",
                    products: items.map((item: any) => {
                        const details = item.course || item.product || item.details || {};
                        // Comprehensive download_url extraction — covers all known API field variants
                        const resolvedDownloadUrl =
                            details.download_url ||
                            details.video_link ||
                            details.class_link ||
                            details.stream_url ||
                            details.link ||
                            item.download_url ||
                            item.video_link ||
                            item.class_link ||
                            item.stream_url ||
                            null;
                        const resolvedCourseType =
                            details.course_type ||
                            item.course_type ||
                            details.type ||
                            item.type ||
                            "";
                        return {
                            id: item.order_product_id || item.id,
                            order_no: order.order_no || "",
                            product_id: details.id || item.product_id || "",
                            product_name: details.product_title_english || details.course_title_english || item.product_name || details.product_name || details.name || "Unknown Item",
                            product_image: details.image || details.product_image || item.product_image || "",
                            quantity: item.quantity?.toString() || "1",
                            subtotal: item.subtotal?.toString() || "0.00",
                            service_type: item.service_type || "product",
                            ebook: (resolvedCourseType.toLowerCase().includes("ebook") || details.ebook === 1 || details.ebook === "1") ? "1" : "0",
                            video_link: resolvedDownloadUrl,
                            course_type: resolvedCourseType,
                            download_url: resolvedDownloadUrl
                        };
                    })
                };

                set({ currentOrder: normalizedOrder });
            }
        } catch (error) {
            console.error("Order Details Fetch Error:", error);
            // Fallback: use cached order from the list if API fails
            const existingOrders = get().orders;
            const cachedOrder = existingOrders.find(
                (o: any) => o.order_no === orderNo || o.id?.toString() === orderNo
            );
            if (cachedOrder) {
                console.warn(`⚠️ orderSlice: API failed, using cached order for ${orderNo}`);
                set({ currentOrder: cachedOrder });
            }
        } finally {
            set({ isOrderDetailsLoading: false });
        }
    }
});
