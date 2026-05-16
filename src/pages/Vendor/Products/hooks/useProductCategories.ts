import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Category, Subcategory } from '../types/product.types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

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

export function useProductCategories() {
  const token = getAuthToken();

  // Categories Query
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/api/vendor/ecommerce/categories`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'X-Auth-Token': `Bearer ${token}` })
        }
      });

      const rawData = response.data?.data || [];
      return rawData.map((item: any) => ({
        id: item.id,
        category_name: item.category_name || 'Category',
        category_name_bangla: item.category_name_bangla || item.category_name,
        category_slug: item.category_slug,
        category_image: item.category_image
      })) as Category[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Subcategories Query helper
  const getSubcategoriesQuery = (categoryId: number | string | null) => {
    return useQuery({
      queryKey: ['subcategories', categoryId],
      queryFn: async () => {
        if (!categoryId || categoryId === '0' || categoryId === 0) return [];
        
        const response = await axios.get(
          `${baseURL}/api/vendor/ecommerce/subcategories?category_id=${categoryId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'X-Auth-Token': `Bearer ${token}` })
            }
          }
        );

        const rawData = response.data?.data || [];
        return rawData.map((item: any) => ({
          id: item.id,
          category_id: item.category_id,
          subcategory_name: item.subcategory_name || 'Subcategory',
          subcategory_name_bangla: item.subcategory_name_bangla || item.subcategory_name,
          subcategory_slug: item.subcategory_slug
        })) as Subcategory[];
      },
      enabled: !!categoryId && categoryId !== '0' && categoryId !== 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    categories: categoriesQuery.data || [],
    isLoadingCategories: categoriesQuery.isLoading,
    categoriesError: categoriesQuery.error,
    refetchCategories: categoriesQuery.refetch,
    getSubcategoriesQuery,
  };
}
