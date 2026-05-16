import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditProductForm } from './components/EditProductForm';
import { useProductMutation } from './hooks/useProductMutation';
import { useProduct } from './hooks/useProduct';
import { ProductFormData } from './types/product.types';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use TanStack Query for fetching
  const {
    data: productData,
    isLoading: isFetchLoading,
    error: fetchError
  } = useProduct(id);

  // Use TanStack Query for mutations
  const { updateProduct, isLoading: mutationLoading } = useProductMutation();

  console.log('🔵 [EDIT PAGE] EditProduct component rendered, ID:', id);

  const handleCancel = () => {
    navigate('/vendor/dashboard/products');
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();

      // Append all text fields
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

      // Handle new gallery images
      if (data.gallery_images && data.gallery_images.length > 0) {
        for (let i = 0; i < data.gallery_images.length; i++) {
          formData.append('gal_img[]', data.gallery_images[i]);
        }
      }

      // Handle removed images
      if (data.removed_images && data.removed_images.length > 0) {
        data.removed_images.forEach(imgName => {
          formData.append('removed_images[]', imgName);
        });
      }

      console.log('🚀 Calling updateProduct function...');
      const success = await updateProduct(Number(id), formData);

      if (success) {
        toast.success('Product updated successfully!');
        navigate('/vendor/dashboard/products');
      }
    } catch (err: any) {
      console.error('❌ Error in handleSubmit:', err);
      toast.error(err.message || 'Failed to update product');
    }
  };

  if (isFetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl border-4 border-slate-100 border-t-secondary animate-spin shadow-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Loading Details</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Preparing your premium workspace</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-20">
        <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-10 text-center shadow-xl shadow-rose-500/10">
          <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-md">
            <ArrowLeft className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Failed to Load Product</h2>
          <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-[10px]">{(fetchError as any).message || 'The product you are looking for might have been removed or moved.'}</p>
          <Button
            onClick={() => navigate('/vendor/dashboard/products')}
            className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20"
          >
            Return to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
              Edit Product
            </h1>
            <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
              Updating listing ID: #{id}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleCancel}
          className="h-12 px-6 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition-all active:scale-95 flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Discard Changes</span>
        </Button>
      </div>

      {productData && (
        <EditProductForm
          initialData={productData}
          onSubmit={handleSubmit}
          isLoading={mutationLoading}
        />
      )}
    </div>
  );
}