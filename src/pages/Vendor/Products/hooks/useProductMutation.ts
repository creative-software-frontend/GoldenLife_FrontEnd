import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ProductFormData } from '../types/product.types';

export function useProductMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const createProduct = async (formData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await axios.post(
        `${baseURL}/api/vendor/product/store`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const isSuccess = response.data?.success === true ||
        response.data?.status === 'success' ||
        response.data?.message?.toLowerCase().includes('success');

      if (isSuccess) {
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to create product');
      }
    } catch (err: any) {
      console.error('Create product error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: number, formData: FormData): Promise<boolean> => {
    console.log('🟢 [API] updateProduct CALLED with ID:', id);
    console.log('🟢 [API] FormData keys:', Array.from(formData.keys()));

    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }


      // Ensure product_id is in the form data, matching API expectations
      formData.append('product_id', id.toString()); console.log('🟢 [API] Sending update request for product ID:', id);
      console.log('🟢 [API] Full API URL:', `${baseURL}/api/vendor/product/update?product_id=${id}`);
      console.log('🟢 [API] FormData entries:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      const response = await axios.post(
        `${baseURL}/api/vendor/product/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('🟢 [API] Update response received:', response.data);
      console.log('🟢 [API] Checking success criteria...');

      const isSuccess = response.data?.success === true ||
        response.data?.status === 'success' ||
        response.data?.message?.toLowerCase().includes('success');

      if (isSuccess) {
        toast.success('Product updated successfully!');
        return true;
      } else {
        const errorMessage = response.data?.message || 'Failed to update product';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('Update product error:', err);
      if (err.response) {
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
      }

      let errorMessage = 'Failed to update product';
      if (err.response?.status === 404) {
        errorMessage = 'Update endpoint not found.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductById = async (id: number): Promise<ProductFormData> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await axios.get(
        `${baseURL}/api/vendor/product/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { product_id: id }
        }
      );

      let productData = response.data?.data || response.data?.product || response.data;

      if (response.data?.status === true || response.data?.success === true) {
        productData = response.data?.data || response.data?.product || productData;
      }

      const formData: ProductFormData = {
        product_title_english: productData.product_title_english || '',
        product_title_bangla: productData.product_title_bangla || '',
        category_id: productData.category_id || 0,
        subcategory_id: productData.subcategory_id || 0,
        short_description_english: productData.short_description_english || '',
        short_description_bangla: productData.short_description_bangla || '',
        long_description_english: productData.long_description_english || '',
        long_description_bangla: productData.long_description_bangla || '',
        seller_price: parseFloat(productData.seller_price) || 0,
        regular_price: parseFloat(productData.regular_price) || 0,
        offer_price: parseFloat(productData.offer_price) || 0,
        sku: productData.sku || '',
        stock: parseInt(productData.stock) || 0,
        video_link: productData.video_link || '',
        ebook: productData.ebook ?? '0',
        images: [],
        existing_images: [
          productData.product_image,
          ...(productData.gallery_images || [])
        ].filter(Boolean),
        removed_images: []
      };

      return formData;
    } catch (err: any) {
      console.error('Fetch product error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    fetchProductById,
    isLoading,
    error,
  };
}