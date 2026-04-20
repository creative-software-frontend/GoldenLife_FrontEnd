import { useState, useCallback } from 'react';
import axios from 'axios';
import { Category, Subcategory } from '../types/product.types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  // Get auth token from session storage
  const getAuthToken = () => {
    const session = sessionStorage.getItem('vendor_session');
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      return parsed.token || null;
    } catch {
      return null;
    }
  };

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      console.log('🔄 [useCategories] Fetching categories...');
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      console.log('[useCategories] Auth token:', token ? 'Present' : 'Missing');

      const url = `${baseURL}/api/vendor/ecommerce/categories`;
      console.log('[useCategories] API URL:', url);

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      console.log('📥 [useCategories] Raw API Response:', {
        status: response.data?.status,
        hasData: !!response.data?.data,
        dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'N/A',
        firstItem: Array.isArray(response.data?.data) ? response.data.data[0] : 'N/A'
      });

      const rawData = response.data?.data || [];
      const mappedCategories: Category[] = rawData.map((item: any) => ({
        id: item.id,
        category_name: item.category_name || 'Category',
        category_name_bangla: item.category_name_bangla || item.category_name,
        category_slug: item.category_slug,
        category_image: item.category_image
      }));

      console.log('✅ [useCategories] Mapped Categories:', {
        count: mappedCategories.length,
        categories: mappedCategories.map(c => ({ id: c.id, name: c.category_name }))
      });

      setCategories(mappedCategories);
      return mappedCategories;
    } catch (err: any) {
      console.error('❌ [useCategories] Failed to fetch categories:', err);
      console.error('[useCategories] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load categories';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
      console.log('[useCategories] Loading complete');
    }
  }, [baseURL]);

  // Fetch subcategories by category ID
  const fetchSubcategories = useCallback(async (categoryId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      const response = await axios.get(
        `${baseURL}/api/vendor/ecommerce/subcategories?category_id=${categoryId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );

      const rawData = response.data?.data || [];
      const mappedSubcategories: Subcategory[] = rawData.map((item: any) => ({
        id: item.id,
        category_id: item.category_id,
        subcategory_name: item.subcategory_name || 'Subcategory',
        subcategory_name_bangla: item.subcategory_name_bangla || item.subcategory_name,
        subcategory_slug: item.subcategory_slug
      }));

      setSubcategories(mappedSubcategories);
      return mappedSubcategories;
    } catch (err: any) {
      console.error('Failed to fetch subcategories:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load subcategories';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  // Clear subcategories when category changes
  const clearSubcategories = useCallback(() => {
    setSubcategories([]);
  }, []);

  // Helper function to get category name by ID
  const getCategoryNameById = (categoryId: number, categories: Category[]): string => {
    console.log('[useCategories.getCategoryNameById] Called with:', { categoryId, categoriesCount: categories.length });
    const category = categories.find(cat => cat.id === categoryId);
    const result = category ? category.category_name : `ID: ${categoryId}`;
    console.log('[useCategories.getCategoryNameById] Result:', result);
    return result;
  };

  return {
    categories,
    subcategories,
    isLoading,
    error,
    fetchCategories,
    fetchSubcategories,
    clearSubcategories,
    getCategoryNameById,
  };
}
