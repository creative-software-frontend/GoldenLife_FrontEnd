import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface CategorySlice {
    categories: any[];
    fetchCategories: () => Promise<void>;
}

export const createCategorySlice: StateCreator<AppState, [], [], CategorySlice> = (set, get) => ({
    categories: [],

    fetchCategories: async () => {
        // Guard: If we're already loading or already have categories, skip.
        if (get().isCategoryLoading || get().isCategoryFetched) return;

        set({ isCategoryLoading: true });

        try {
            const token = getAuthToken();
            const res = await axios.get(`${baseURL}/api/getProductCategory`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            const rawData = res.data?.data?.categories || res.data?.data || [];
            const mapped = rawData.map((item: any) => ({
                id: item.id,
                name_en: item.category_name_english || item.category_name || "Category",
                name_bn: item.category_name_bangla || item.category_name || "Category",
                icon: `${baseURL}/uploads/ecommarce/category_image/${item.category_image}`,
                slug: item.category_slug
            }));

            set({
                categories: mapped,
                isCategoryLoading: false,
                isCategoryFetched: true
            });
        } catch (error) {
            console.error("Categories Fetch Error:", error);
            set({ isCategoryLoading: false });
        }
    },
});