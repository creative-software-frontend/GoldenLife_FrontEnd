import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditProductForm } from './components/EditProductForm';
import { useProductMutation } from './hooks/useProductMutation';
import { ProductFormData } from './types/product.types';
import axios from 'axios';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateProduct, isLoading: mutationLoading } = useProductMutation();
  const [productData, setProductData] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  console.log('🔵 [EDIT PAGE] EditProduct component rendered, ID:', id);

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

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error('Product ID is required');
        navigate('/vendor/dashboard/products');
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);

        console.log('1. Fetching product with ID:', id);

        const token = getAuthToken();
        console.log('2. Auth token present:', token ? 'Yes' : 'No');

        if (!token) {
          throw new Error('Authentication required. Please login again.');
        }

        console.log('3. Making API call to:', `${baseURL}/api/vendor/product/details`);
        const response = await axios.get(`${baseURL}/api/vendor/product/details`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { product_id: Number(id) }
        });

        console.log('4. API Response status:', response.status);
        console.log('5. API Response data:', response.data);

        let product = null;
        let gallery: any = [];

        // 1. Find product object
        if (response.data?.data?.product) {
          product = response.data.data.product;
          gallery = response.data.data.gallery || response.data.data.gallery_images || [];
        } else if (response.data?.product) {
          product = response.data.product;
          gallery = response.data.gallery || response.data.gallery_images || [];
        } else if (response.data?.data) {
          product = response.data.data;
          gallery = response.data.data.gallery || response.data.gallery || response.data.gallery_images || [];
        }

        if (!product) throw new Error('Product data not found in response');

        // 2. Search for gallery images in common locations
        // If gallery is still empty, check if it's inside the product object
        if ((!gallery || gallery.length === 0)) {
          gallery = product.gallery || product.gallery_images || product.product_gallery || [];
        }

        // 3. Handle JSON strings for gallery
        if (typeof gallery === 'string' && (gallery.startsWith('[') || gallery.includes(','))) {
          try {
            gallery = gallery.startsWith('[') ? JSON.parse(gallery) : gallery.split(',').map((s: string) => s.trim());
          } catch (e) { console.error(e); }
        }

        // 4. Final check and flattening
        if (!Array.isArray(gallery)) gallery = [];

        console.log('✅ [EDIT PAGE] ID:', product.id, 'Gallery:', gallery.length);

        const formData: ProductFormData = {
          product_title_english: product.product_title_english || '',
          product_title_bangla: product.product_title_bangla || '',
          category_id: product.category_id || 0,
          subcategory_id: product.subcategory_id || 0,
          short_description_english: product.short_description_english || '',
          short_description_bangla: product.short_description_bangla || '',
          long_description_english: product.long_description_english || '',
          long_description_bangla: product.long_description_bangla || '',
          seller_price: parseFloat(product.seller_price) || 0,
          regular_price: parseFloat(product.regular_price) || 0,
          offer_price: parseFloat(product.offer_price) || 0,
          sku: product.sku || '',
          stock: parseInt(product.stock) || 0,
          video_link: product.video_link || '',
          ebook: product.ebook ?? '0',
          images: [],
          existing_images: [
            product.product_image || '', // Main image is string at index 0
            ...gallery.map((g: any) => {
              if (!g) return null;
              // If it's just a string, we don't have an ID, but we keep the image name
              if (typeof g === 'string') return { id: 0, image: g };
              // Look for filename in common properties
              const imgName = g.gal_img || g.image || g.image_name || g.url || '';
              // Return object with ID (numeric) and image name
              return { id: Number(g.id) || 0, image: imgName };
            })
          ].filter((img, idx) => {
            // Index 0 is the main image (string or object)
            if (idx === 0) return true;
            // Subsequent indices are gallery image objects
            return img !== null && typeof img === 'object' && (img.id !== 0 || img.image !== '');
          }) as any[],
          removed_images: []
        };

        console.log('9. Form data prepared successfully');
        setProductData(formData);

      } catch (err: any) {
        console.error('10. Fetch product error:', err);
        console.error('11. Error response:', err.response?.data);

        let errorMessage = 'Failed to load product for editing';
        if (err.response?.status === 404) {
          errorMessage = 'Product not found.';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        setFetchError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    console.log('===================');
    console.log('[EDIT PAGE] UPDATE BUTTON CLICKED');
    console.log('===================');
    console.log('📊 Data received from form:', data);

    try {
      if (!id) {
        console.error('❌ No product ID found');
        throw new Error('Product ID is missing');
      }
      console.log('✅ Product ID:', id);

      const formData = new FormData();

      console.log('🔧 Building FormData:');

      // Exclude all image-related keys
      const excludedKeys = ['images', 'gallery_images', 'existing_gallery_images', 'removed_gallery_images'];

      Object.keys(data).forEach((key) => {
        if (!excludedKeys.includes(key)) {
          const value = data[key];
          if (value !== undefined && value !== null && value !== '') {
            formData.append(key, value.toString());
            console.log(`  ➕ Added ${key}: ${value}`);
          }
        }
      });

      // Handle main image
      if (data.images && data.images.length > 0) {
        console.log(`  🖼️ Added product_image: ${data.images[0].name}`);
        formData.append('product_image', data.images[0]);
      }

      // Handle new gallery images - using 'gal_img[]' as per API spec
      if (data.gallery_images && data.gallery_images.length > 0) {
        console.log(`  📸 Added ${data.gallery_images.length} new gallery images`);
        for (let i = 0; i < data.gallery_images.length; i++) {
          formData.append('gal_img[]', data.gallery_images[i]);
        }
      }

      // Handle existing gallery images (keeping) - Using keep_images[index] format for API
      if (data.existing_gallery_images && data.existing_gallery_images.length > 0) {
        console.log(`  📷 Keeping ${data.existing_gallery_images.length} existing gallery images`);
        data.existing_gallery_images.forEach((imgObj: any, index: number) => {
          // Send ID if present, otherwise just ignore (or use image name if API supports it, but Postman shows IDs)
          if (imgObj && (imgObj.id || imgObj.id === 0)) {
            const idToKeep = imgObj.id.toString();
            // Don't send '0' as it's likely a placeholder for missing ID
            if (idToKeep !== '0') {
              formData.append(`keep_images[${index}]`, idToKeep);
              console.log(`  ➕ Added keep_images[${index}]: ${idToKeep}`);
            }
          }
        });
      }

      // Handle removed gallery images
      if (data.removed_gallery_images && data.removed_gallery_images.length > 0) {
        console.log(`  🗑️ Removing ${data.removed_gallery_images.length} gallery images`);
        formData.append('removed_gallery_images', JSON.stringify(data.removed_gallery_images));
      }

      console.log('\n📦 Final FormData entries:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: 📁 File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
      console.log('=========================\n');

      console.log('🚀 Calling updateProduct function...');
      const success = await updateProduct(Number(id), formData);
      console.log('✅ Update result:', success);

      if (success) {
        toast.success('Product updated successfully!');
        navigate('/vendor/dashboard/products');
      } else {
        toast.error('Failed to update product');
      }
    } catch (err: any) {
      console.error('❌ Error in handleSubmit:', err);
      toast.error(err.message || 'Failed to update product');
    }
  };

  const handleCancel = () => {
    navigate('/vendor/dashboard/products');
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 size={48} className="animate-spin text-primary-light mx-auto" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !productData) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
        <Button variant="outline" onClick={handleCancel} className="mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Button>

        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Product</h3>
              <p className="text-red-700">{fetchError || 'Product not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Edit Product
          </h1>
          <p className="text-sm text-muted-foreground">
            Update product information and images
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel} className="hidden sm:flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Products
        </Button>
      </div>

      <EditProductForm
        initialData={productData}
        onSubmit={handleSubmit}
        isLoading={mutationLoading}
      />
    </div>
  );
}