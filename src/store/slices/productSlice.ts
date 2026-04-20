import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface ProductSlice {
    allProducts: any[];
    featuredProducts: any[];
    isProductLoading: boolean;
    isProductFetched: boolean;

    fetchProducts: (keyword?: string) => Promise<void>;
}

export const createProductSlice: StateCreator<AppState, [], [], ProductSlice> = (set) => ({
    allProducts: [],
    featuredProducts: [],
    isProductLoading: false,
    isProductFetched: false,

    fetchProducts: async (keyword = "") => {
        const token = getAuthToken();
        if (!token) return;

        set({ isProductLoading: true });

        try {
            const endpoint = keyword
                ? `${baseURL}/api/products/search?keyword=${keyword}`
                : `${baseURL}/api/products`;

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });

            let rawData = response.data?.products || response.data?.data?.products || response.data?.data || [];
            if (!Array.isArray(rawData)) rawData = [];

            const mappedData = rawData.map((item: any) => ({
                ...item,
                id: item.id,
                date: item.created_at ? new Date(item.created_at).getTime() : item.id,
                titleEn: item.product_title_english || item.name_en || "Product",
                titleBn: item.product_title_bangla || item.name_bn || "",
                offer_price: parseFloat(item.offer_price) || parseFloat(item.price) || 0,
                regular_price: parseFloat(item.regular_price) || parseFloat(item.mrp) || 0,
                stock_qty: item.stock || item.quantity || 0,
                product_image: item.product_image?.startsWith("http")
                    ? item.product_image
                    : `${baseURL}/uploads/ecommarce/product_image/${item.product_image}`
            }));

            if (keyword) {
                set({ 
                    allProducts: mappedData,
                    isProductFetched: true 
                });
            } else {
                set({ 
                    allProducts: mappedData,
                    featuredProducts: mappedData.slice(0, 10),
                    isProductFetched: true 
                });
            }
        } catch (error) {
            console.error("Products Fetch Error:", error);
        } finally {
            set({ isProductLoading: false });
        }
    }
});
