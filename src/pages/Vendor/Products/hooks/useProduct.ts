import { useQuery } from '@tanstack/react-query';
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

export function useProduct(id: number | string | undefined) {
  const token = getAuthToken();

  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id || !token) throw new Error('Product ID and authentication required');

      const response = await axios.get(
        `${baseURL}/api/vendor/product/details`,
        {
          headers: { 'X-Auth-Token': `Bearer ${token}` },
          params: { product_id: Number(id) }
        }
      );

      const responseData = response.data;
      let productData = responseData?.data?.product || responseData?.product || responseData?.data || responseData;
      const gallery = responseData?.data?.gallery || responseData?.data?.gallery_images || productData?.gallery_images || [];

      // Transform to ProductFormData
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
          ...(Array.isArray(gallery) ? gallery : [])
        ].filter(Boolean),
        removed_images: []
      };

      return formData;
    },
    enabled: !!id && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
