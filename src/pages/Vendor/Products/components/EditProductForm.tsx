import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchemaWithValidation, ProductFormData } from '../validation/product.validation';
import { CategorySelect } from './CategorySelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Sparkles, TrendingUp, Percent, Loader2, Upload, X, Youtube, Link2 } from 'lucide-react';
import { generateSKU, calculateProfitMargin, calculateDiscount } from '../utils/helpers';

interface EditProductFormProps {
  initialData: ProductFormData;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function EditProductForm({ initialData, onSubmit, isLoading }: EditProductFormProps) {
  // State for tracking images
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<any[]>(
    (initialData?.existing_images?.slice(1) || []).filter((img: any) => !!img)
  );
  const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'short-en' | 'short-bn' | 'long-en' | 'long-bn'>('short-en');
  const [isEbook, setIsEbook] = useState(initialData?.ebook === '1');
  const hasSynced = useRef(false);

  console.log('🔵 [EDIT FORM] EditProductForm rendered, hasSynced:', hasSynced.current);



  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchemaWithValidation) as any,
    defaultValues: {
      product_title_english: initialData?.product_title_english || '',
      product_title_bangla: initialData?.product_title_bangla || '',
      category_id: initialData?.category_id || 0,
      subcategory_id: initialData?.subcategory_id || 0,
      short_description_english: initialData?.short_description_english || '',
      short_description_bangla: initialData?.short_description_bangla || '',
      long_description_english: initialData?.long_description_english || '',
      long_description_bangla: initialData?.long_description_bangla || '',
      seller_price: initialData?.seller_price || 0,
      regular_price: initialData?.regular_price || 0,
      offer_price: initialData?.offer_price || 0,
      sku: initialData?.sku || '',
      stock: initialData?.stock || 0,
      video_link: initialData?.video_link || '',
      ebook: initialData?.ebook || '0',
      images: [],
      existing_images: initialData?.existing_images || [],
      removed_images: [],
    },
  });

  // 🔄 SYNC: Move this AFTER useForm to avoid "reset before initialization" error
  useEffect(() => {
    // Only sync if initialData is present AND we haven't synced yet
    if (!initialData || Object.keys(initialData).length === 0 || hasSynced.current) return;

    console.log('🔄 [EDIT FORM] First-time sync into form using reset()');
    reset(initialData);

    // Set Ebook toggle
    if (initialData.ebook) {
      setIsEbook(initialData.ebook === '1');
    }

    // Safely Parse Gallery Images for the UI Grid
    const rawImages = initialData.existing_images;
    if (rawImages && Array.isArray(rawImages)) {
      // Index 0 is main image, 1+ are gallery
      if (rawImages.length > 1) {
        // Filter out nulls
        const gallery = rawImages.slice(1).filter((img: any) => !!img);
        setExistingGalleryImages(gallery);
      }
    } else if (typeof rawImages === 'string') {
      try {
        const parsed = rawImages.startsWith('[') ? JSON.parse(rawImages) : rawImages.split(',');
        const array = (Array.isArray(parsed) ? parsed : [parsed]).filter(Boolean);
        // If it's just strings from a legacy format, keep them as is
        setExistingGalleryImages(array.slice(1));
      } catch (e) { console.error(e); }
    }

    hasSynced.current = true; // 👈 Mark as synced so we don't overwrite manual edits
  }, [initialData, reset]);

  // Watch price fields for calculations
  const sellerPrice = watch('seller_price');
  const regularPrice = watch('regular_price');
  const offerPrice = watch('offer_price');
  const productTitleEnglish = watch('product_title_english');

  // Auto-calculate prices ONLY when seller price is manually changed by user
  useEffect(() => {
    if (dirtyFields.seller_price && sellerPrice && sellerPrice > 0) {
      const seller = Number(sellerPrice);

      const offerVal = seller + (seller * 0.30);
      const regularVal = offerVal + (offerVal * 0.20);

      setValue('offer_price', parseFloat(offerVal.toFixed(2)), { shouldValidate: true });
      setValue('regular_price', parseFloat(regularVal.toFixed(2)), { shouldValidate: true });
    }
  }, [sellerPrice, dirtyFields.seller_price, setValue]);

  // Calculate profit margin and discount
  const profitMargin = calculateProfitMargin(sellerPrice, offerPrice);
  const discount = calculateDiscount(regularPrice, offerPrice);

  // Auto-generate SKU handler
  const handleAutoGenerateSKU = () => {
    if (productTitleEnglish) {
      const sku = generateSKU(productTitleEnglish);
      setValue('sku', sku);
      console.log('🔧 [EDIT FORM] Auto-generated SKU:', sku);
    }
  };

  // Handle main image change
  const handleMainImageChange = (file: File | null) => {
    console.log('🖼️ [EDIT FORM] Main image changed:', file?.name || 'No file');
    setMainImage(file);
    if (file) {
      setValue('images', [file]);
    } else {
      setValue('images', []);
    }
  };

  // Handle gallery images change
  const handleGalleryImagesChange = (files: File[]) => {
    console.log('📸 [EDIT FORM] Gallery images changed:', files.length, 'files');
    setGalleryImages(files);
  };

  // Handle existing gallery image removal
  const handleExistingGalleryImageRemove = (index: number) => {
    const imageObj = existingGalleryImages[index];
    const newExistingImages = existingGalleryImages.filter((_, i) => i !== index);
    setExistingGalleryImages(newExistingImages);

    // Track removed image names for safety
    const imgName = typeof imageObj === 'string' ? imageObj : imageObj.image;
    const newRemovedImages = [...removedGalleryImages, imgName];
    setRemovedGalleryImages(newRemovedImages);
    setValue('removed_images', newRemovedImages);
  };

  // Submit handler
  const onFormSubmit = async (data: ProductFormData) => {
    console.log('🔴 [EDIT FORM] onFormSubmit CALLED');

    // Prepare submit data for EDIT mode
    const submitData: any = {
      ...data,
      images: mainImage ? [mainImage] : [],
      gallery_images: galleryImages,
      existing_gallery_images: existingGalleryImages,
      removed_gallery_images: removedGalleryImages,
    };

    console.log('📦 [EDIT FORM] Submit data prepared:');
    console.log('  - Main images:', submitData.images?.length || 0);
    console.log('  - New gallery images:', submitData.gallery_images?.length || 0);
    console.log('  - Existing gallery images:', submitData.existing_gallery_images?.length || 0);
    console.log('  - Removed gallery images:', submitData.removed_gallery_images?.length || 0);

    await onSubmit(submitData);
  };

  // Update state when initialData changes
  // useEffect(() => {
  //   if (initialData?.ebook) {
  //     setIsEbook(initialData.ebook === '1');
  //   }

  //   const rawImages = initialData?.existing_images;

  //   if (!rawImages) {
  //     setExistingGalleryImages([]);
  //     return;
  //   }

  //   let parsedImages: string[] = [];

  //   // 1. If it's already an array:
  //   if (Array.isArray(rawImages)) {
  //     parsedImages = rawImages;
  //   }
  //   // 2. If it's a string from the database:
  //   else if (typeof rawImages === 'string') {
  //     // Check if it's a JSON array string like '["img1.jpg", "img2.jpg"]'
  //     if (rawImages.startsWith('[')) {
  //       try {
  //         parsedImages = JSON.parse(rawImages);
  //       } catch (e) {
  //         console.error("Failed to parse images JSON string", e);
  //       }
  //     } else {
  //       // It's probably a comma-separated string like "img1.jpg,img2.jpg"
  //       parsedImages = rawImages.split(',').map(img => img.trim());
  //     }
  //   }

  //   // Now safely slice it. (Assuming index 0 is the main image, so gallery starts at index 1)
  //   if (parsedImages.length > 1) {
  //     setExistingGalleryImages(parsedImages.slice(1));
  //   } else {
  //     setExistingGalleryImages([]); // Only 1 image (or 0) means no gallery images
  //   }

  // }, [initialData]);
  // 👈 FIX: Use react-hook-form's reset() instead of individual setValues
  const handleReset = () => {
    setMainImage(null);
    setGalleryImages([]);
    const gallery = (initialData?.existing_images?.slice(1) || []).filter((img: any) => !!img);
    setExistingGalleryImages(gallery);
    setRemovedGalleryImages([]);
    setActiveTab('short-en');
    setIsEbook(initialData?.ebook === '1');

    reset({
      product_title_english: initialData?.product_title_english || '',
      product_title_bangla: initialData?.product_title_bangla || '',
      category_id: initialData?.category_id || 0,
      subcategory_id: initialData?.subcategory_id || 0,
      short_description_english: initialData?.short_description_english || '',
      short_description_bangla: initialData?.short_description_bangla || '',
      long_description_english: initialData?.long_description_english || '',
      long_description_bangla: initialData?.long_description_bangla || '',
      seller_price: initialData?.seller_price || 0,
      regular_price: initialData?.regular_price || 0,
      offer_price: initialData?.offer_price || 0,
      sku: initialData?.sku || '',
      stock: initialData?.stock || 0,
      video_link: initialData?.video_link || '',
      ebook: initialData?.ebook || '0',
      images: [],
      existing_images: initialData?.existing_images || [],
      removed_images: [],
    });
  };

  // ... (Your JSX Return Statement goes here)

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product_title_english" className="font-semibold">
                Product Title (English) *
              </Label>
              <Input
                id="product_title_english"
                {...register('product_title_english')}
                placeholder="Enter product name in English"
                className={errors.product_title_english ? 'border-red-500' : ''}
              />
              {errors.product_title_english && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.product_title_english.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="product_title_bangla" className="font-semibold">
                Product Title (Bangla) *
              </Label>
              <Input
                id="product_title_bangla"
                {...register('product_title_bangla')}
                placeholder="পণ্যের নাম বাংলায় লিখুন"
                className={errors.product_title_bangla ? 'border-red-500' : ''}
              />
              {errors.product_title_bangla && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.product_title_bangla.message}
                </p>
              )}
            </div>
          </div>

          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Controller
                name="subcategory_id"
                control={control}
                render={({ field: subField }) => (
                  <CategorySelect
                    categoryId={field.value}
                    subcategoryId={subField.value}
                    onCategoryChange={(value) => {
                      field.onChange(value);
                      subField.onChange(0);
                    }}
                    onSubcategoryChange={subField.onChange}
                    errors={{ category_id: errors.category_id, subcategory_id: errors.subcategory_id }}
                  />
                )}
              />
            )}
          />

          <div>
            <Label htmlFor="sku" className="font-semibold">SKU *</Label>
            <div className="flex gap-2">
              <Input
                id="sku"
                {...register('sku')}
                placeholder="Product SKU"
                className={errors.sku ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoGenerateSKU}
                disabled={!productTitleEnglish}
                className="shrink-0"
              >
                <Sparkles size={16} className="mr-2" />
                Auto
              </Button>
            </div>
            {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="short-en">Short EN</TabsTrigger>
              <TabsTrigger value="short-bn">Short BN</TabsTrigger>
              <TabsTrigger value="long-en">Long EN</TabsTrigger>
              <TabsTrigger value="long-bn">Long BN</TabsTrigger>
            </TabsList>

            <TabsContent value="short-en" className="space-y-2">
              <Label htmlFor="short_description_english">Short Description (English)</Label>
              <Textarea
                id="short_description_english"
                {...register('short_description_english')}
                placeholder="Brief product description in English"
                rows={4}
                className={errors.short_description_english ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500">
                {watch('short_description_english')?.length || 0}/200 characters
              </p>
            </TabsContent>

            <TabsContent value="short-bn" className="space-y-2">
              <Label htmlFor="short_description_bangla">Short Description (Bangla)</Label>
              <Textarea
                id="short_description_bangla"
                {...register('short_description_bangla')}
                placeholder="সংক্ষিপ্ত পণ্য বিবরণ বাংলায়"
                rows={4}
                className={errors.short_description_bangla ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500">
                {watch('short_description_bangla')?.length || 0}/200 characters
              </p>
            </TabsContent>

            <TabsContent value="long-en" className="space-y-2">
              <Label htmlFor="long_description_english">Long Description (English)</Label>
              <Textarea
                id="long_description_english"
                {...register('long_description_english')}
                placeholder="Detailed product description in English"
                rows={6}
                className={errors.long_description_english ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500">
                {watch('long_description_english')?.length || 0}/1000 characters
              </p>
            </TabsContent>

            <TabsContent value="long-bn" className="space-y-2">
              <Label htmlFor="long_description_bangla">Long Description (Bangla)</Label>
              <Textarea
                id="long_description_bangla"
                {...register('long_description_bangla')}
                placeholder="বিস্তারিত পণ্য বিবরণ বাংলায়"
                rows={6}
                className={errors.long_description_bangla ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500">
                {watch('long_description_bangla')?.length || 0}/1000 characters
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Seller Price remains same */}
            <div>
              <Label htmlFor="seller_price">Seller Price (Cost) *</Label>
              <Input
                id="seller_price"
                type="number"
                step="0.01"
                {...register('seller_price', { valueAsNumber: true })}
                placeholder="৳"
              />
            </div>

            {/* Regular Price Label */}
            <div>
              <Label htmlFor="regular_price_field">Regular Price (MRP) *</Label>
              <Input
                id="regular_price_field"
                type="number"
                step="0.01"
                {...register('regular_price', { valueAsNumber: true })}
                placeholder="৳"
                className={`bg-gray-100 cursor-not-allowed ${errors.regular_price ? 'border-red-500' : ''}`}
                readOnly
              />
              {errors.regular_price && (
                <p className="mt-1 text-xs text-red-500">{errors.regular_price.message}</p>
              )}
            </div>

            {/* Offer Price Label */}
            <div>
              <Label htmlFor="offer_price_field">Offer Price (Selling) *</Label>
              <Input
                id="offer_price_field"
                type="number"
                step="0.01"
                {...register('offer_price', { valueAsNumber: true })}
                placeholder="৳"
                className={`bg-gray-100 cursor-not-allowed ${errors.offer_price ? 'border-red-500' : ''}`}
                readOnly
              />
              {errors.offer_price && (
                <p className="mt-1 text-xs text-red-500">{errors.offer_price.message}</p>
              )}
            </div>
          </div>


          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Percent size={18} className="text-primary-light" />
              <div>
                <p className="text-xs text-gray-600">Discount</p>
                <p className="text-sm font-bold text-gray-900">{discount}% OFF</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-dark" />
              <div>
                <p className="text-xs text-gray-600">Profit Margin</p>
                <p className="text-sm font-bold text-gray-900">
                  {profitMargin >= 0 ? '+' : ''}{profitMargin.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                placeholder="Available quantity"
                className={errors.stock ? 'border-red-500' : ''}
              />
              {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Media Upload */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Upload size={20} />
              Main Product Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 flex-shrink-0">
                {mainImage ? (
                  <img src={URL.createObjectURL(mainImage)} alt="Main product" className="w-full h-full object-cover" />
                ) : initialData?.existing_images?.[0] ? (
                  <img
                    src={`https://admin.goldenlifeltd.com/uploads/ecommarce/product_image/${initialData.existing_images[0]}`}
                    alt="Current main image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload size={32} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Label className="font-semibold mb-2 block">Upload New Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMainImageChange(file);
                  }}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 800x800px minimum. Square format preferred.
                </p>
                {mainImage && (
                  <Button type="button" variant="outline" size="sm" onClick={() => handleMainImageChange(null)} className="mt-2">
                    <X size={14} className="mr-1" /> Remove
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Images Upload */}
        {/* Gallery Images Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Upload size={20} />
              Gallery Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="font-semibold mb-2 block">Add Gallery Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      // FIX 1: Use setGalleryImages to ensure local state updates and triggers a re-render
                      setGalleryImages((prev) => [...(prev || []), ...files]);
                    }
                  }}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Add up to 5 additional images for product gallery
                </p>
              </div>

              {/* FIX 2: Safely check lengths with optional chaining */}
              {/* This will now safely trigger because the array is formatted properly */}
              {/* Unified Gallery Grid (Marge) */}
              {(existingGalleryImages.length > 0 || galleryImages.length > 0) && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {/* Existing Images */}
                  {existingGalleryImages.map((imgObj, index) => {
                    const imgName = typeof imgObj === 'string' ? imgObj : imgObj.image;
                    return (
                      <div key={`existing-${index}`} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-100 hover:border-primary-light transition-all shadow-sm">
                        <img
                          src={imgName.startsWith('http') ? imgName : `https://admin.goldenlifeltd.com/uploads/ecommarce/gal_img/${imgName}`}
                          alt={`Existing Gallery ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleExistingGalleryImageRemove(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-primary-dark/70 text-white text-[8px] font-bold text-center p-0.5 backdrop-blur-sm">Existing</div>
                      </div>
                    );
                  })}

                  {/* New Images */}
                  {galleryImages.map((file, index) => (
                    <div key={`new-${index}`} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-green-100 hover:border-green-500 transition-all shadow-sm">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = galleryImages.filter((_, i) => i !== index);
                          setGalleryImages(newGallery);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-[8px] font-bold text-center p-0.5 backdrop-blur-sm">New</div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
          className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          Reset Form
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-primary-light text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Update Product'
          )}
        </Button>
      </div>
    </form >
  );
}