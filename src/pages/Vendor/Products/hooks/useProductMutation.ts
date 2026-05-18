import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ProductFormData } from '../types/product.types';

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

export function useProductMutation() {
  const queryClient = useQueryClient();
  const token = getAuthToken();

  // Create Product Mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required. Please log in again.');

      const response = await axios.post(
        `${baseURL}/api/vendor/product/store`,
        formData,
        {
          headers: {
            'X-Auth-Token': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const isSuccess = response.data?.success === true ||
        response.data?.status === 'success' ||
        response.data?.message?.toLowerCase().includes('success');

      if (!isSuccess) {
        throw new Error(response.data?.message || 'Failed to create product');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Update Product Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      if (!token) throw new Error('Authentication required. Please log in again.');

      // Many Laravel backends require product_id as a query parameter + in body when using multipart/form-data
      formData.append('product_id', id.toString());

      const response = await axios.post(
        `${baseURL}/api/vendor/product/update?product_id=${id}`,
        formData,
        {
          headers: {
            'X-Auth-Token': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const isSuccess = response.data?.success === true ||
        response.data?.status === 'success' ||
        response.data?.status === true ||
        response.data?.data?.product?.id ||
        response.data?.message?.toLowerCase().includes('success');

      if (!isSuccess) {
        throw new Error(response.data?.message || 'Failed to update product');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });

  return {
    createProduct: createMutation.mutateAsync,
    updateProduct: (id: number, formData: FormData) => updateMutation.mutateAsync({ id, formData }),
    isLoading: createMutation.isPending || updateMutation.isPending,
    error: (createMutation.error as any)?.message || (updateMutation.error as any)?.message || null,
  };
}