import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductForm } from './components/ProductForm';
import { useProductMutation } from './hooks/useProductMutation';
import { ProductFormData } from './types/product.types';
import { useProfile } from '../Profile/hooks/useProfile';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

export default function AddProduct() {
  const navigate = useNavigate();
  const { createProduct, isLoading } = useProductMutation();
  const { data, isLoading: profileLoading } = useProfile();
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    if (data?.vendor) {
      setVendor(data.vendor);
    }
  }, [data]);

  const { percentage, isComplete, missingFields } = useProfileCompletion(vendor);

  // Blocked Popup Component
  const BlockedPopup = () => (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
      <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-amber-900 mb-2">
        Profile Completion Required
      </h2>
      <p className="text-amber-700 mb-6">
        You need to complete your profile before adding products. Your profile is currently 
        <span className="font-bold"> {percentage}% complete</span>.
      </p>
      
      <div className="bg-white rounded-xl p-4 mb-6 border border-amber-200">
        <h3 className="font-bold text-amber-900 mb-3 text-left">Missing Required Fields:</h3>
        <ul className="space-y-2 text-left">
          {missingFields.map((field: string, index: number) => (
            <li key={index} className="flex items-start gap-2 text-amber-800">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
              {field}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={() => navigate('/vendor/dashboard/profile')}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-amber-600/30"
        >
          Complete Profile Now
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/vendor/dashboard/products')}
          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  // FIXED: Only check after data is loaded
  if (profileLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light" />
      </div>
    );
  }

  // Only show popup when data is loaded AND vendor exists AND profile is NOT complete
  if (!profileLoading && vendor && !isComplete) {
    return <BlockedPopup />;
  }

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== 'images' && key !== 'existing_images' && key !== 'removed_images') {
          const value = data[key as keyof ProductFormData];
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        }
      });

      // Handle main product image
      if (data.images && data.images.length > 0) {
        formData.append('product_image', data.images[0]);
      }

      // Handle new gallery images - matches ProductForm.tsx structure
      if (data.gallery_images && data.gallery_images.length > 0) {
        console.log(`📸 Adding ${data.gallery_images.length} gallery images to FormData`);
        for (let i = 0; i < data.gallery_images.length; i++) {
          formData.append('gal_img[]', data.gallery_images[i]);
        }
      }

      const success = await createProduct(formData);

      if (success) {
        toast.success('Product created successfully!');
        navigate('/vendor/dashboard/products');
      }
    } catch (err: any) {
      console.error('Create product error:', err);
      toast.error(err.message || 'Failed to create product');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Add New Product
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new product listing for your store
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/vendor/dashboard/products')}
          className="hidden sm:flex items-center gap-2"
        >
          Back to Products
        </Button>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode="add"
      />
    </div>
  );
}