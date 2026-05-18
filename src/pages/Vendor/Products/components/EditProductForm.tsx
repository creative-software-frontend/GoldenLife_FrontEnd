'use client';

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
import {
  Sparkles, TrendingUp, Percent, Loader2, Upload, X,
  Youtube, Link2, Info, Package, Image as ImageIcon,
  DollarSign, FileText, CheckCircle2, RotateCcw
} from 'lucide-react';
import { generateSKU, calculateProfitMargin, calculateDiscount } from '../utils/helpers';
import { cn } from '@/lib/utils';

interface EditProductFormProps {
  initialData: ProductFormData;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function EditProductForm({ initialData, onSubmit, isLoading }: EditProductFormProps) {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<any[]>(
    (initialData?.existing_images?.slice(1) || []).filter((img: any) => !!img)
  );
  const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'short-en' | 'short-bn' | 'long-en' | 'long-bn'>('short-en');
  const [isEbook, setIsEbook] = useState(initialData?.ebook === '1');
  const hasSynced = useRef(false);

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

  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0 || hasSynced.current) return;

    reset(initialData);
    setIsEbook(initialData.ebook === '1');

    const rawImages = initialData.existing_images;
    if (rawImages && Array.isArray(rawImages)) {
      if (rawImages.length > 1) {
        const gallery = rawImages.slice(1).filter((img: any) => !!img);
        setExistingGalleryImages(gallery);
      } else {
        // If there is no gallery or only 1 item (the main image), make sure to clear existingGalleryImages
        setExistingGalleryImages([]);
      }
    } else {
      setExistingGalleryImages([]);
    }
    hasSynced.current = true;
  }, [initialData, reset]);

  useEffect(() => {
    if (isLoading) {
      hasSynced.current = false;
    }
  }, [isLoading]);

  const sellerPrice = watch('seller_price');
  const regularPrice = watch('regular_price');
  const offerPrice = watch('offer_price');
  const productTitleEnglish = watch('product_title_english');

  useEffect(() => {
    if (dirtyFields.seller_price && sellerPrice && sellerPrice > 0) {
      const seller = Number(sellerPrice);
      const regular = seller + (seller * 0.30);
      const offer = regular + (regular * 0.20);

      setValue('offer_price', Math.round(regular), { shouldValidate: true });
      setValue('regular_price', Math.round(offer), { shouldValidate: true });
    }
  }, [sellerPrice, dirtyFields.seller_price, setValue]);

  const profitMargin = calculateProfitMargin(sellerPrice, offerPrice);
  const discount = calculateDiscount(regularPrice, offerPrice);

  const handleAutoGenerateSKU = () => {
    if (productTitleEnglish) {
      const sku = generateSKU(productTitleEnglish);
      setValue('sku', sku);
    }
  };

  const handleMainImageChange = (file: File | null) => {
    setMainImage(file);
    if (file) {
      setValue('images', [file]);
    } else {
      setValue('images', []);
    }
  };

  const handleGalleryImagesChange = (files: File[]) => {
    setGalleryImages(files);
  };

  const handleExistingGalleryImageRemove = (index: number) => {
    const imageObj = existingGalleryImages[index];
    const newExistingImages = existingGalleryImages.filter((_, i) => i !== index);
    setExistingGalleryImages(newExistingImages);

    const imgName = typeof imageObj === 'string'
      ? imageObj
      : (imageObj?.gal_img || imageObj?.image || imageObj?.product_gal_img || '');
    const newRemovedImages = [...removedGalleryImages, imgName];
    setRemovedGalleryImages(newRemovedImages);
    setValue('removed_images', newRemovedImages);
  };

  const onFormSubmit = async (data: ProductFormData) => {
    const submitData: any = {
      ...data,
      images: mainImage ? [mainImage] : [],
      gallery_images: galleryImages,
      existing_gallery_images: existingGalleryImages,
      removed_gallery_images: removedGalleryImages,
    };
    await onSubmit(submitData);
  };

  const handleReset = () => {
    setMainImage(null);
    setGalleryImages([]);
    const gallery = (initialData?.existing_images?.slice(1) || []).filter((img: any) => !!img);
    setExistingGalleryImages(gallery);
    setRemovedGalleryImages([]);
    setActiveTab('short-en');
    setIsEbook(initialData?.ebook === '1');
    reset(initialData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">

        {/* Left Column */}
        <div className="space-y-8">

          {/* Section: Basic Information */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Basic Information</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">Edit core product details</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="product_title_english" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Product Title (English) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="product_title_english"
                    {...register('product_title_english')}
                    placeholder="e.g. Premium Cotton T-Shirt"
                    className={cn(
                      "h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-bold text-slate-900",
                      errors.product_title_english && "border-rose-500 bg-rose-50/30"
                    )}
                  />
                  {errors.product_title_english && (
                    <p className="px-1 text-[10px] font-bold text-rose-500 uppercase tracking-tight">{errors.product_title_english.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_title_bangla" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Product Title (Bangla) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="product_title_bangla"
                    {...register('product_title_bangla')}
                    placeholder="পণ্যের নাম বাংলায় লিখুন"
                    className={cn(
                      "h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-bold text-slate-900",
                      errors.product_title_bangla && "border-rose-500 bg-rose-50/30"
                    )}
                  />
                  {errors.product_title_bangla && (
                    <p className="px-1 text-[10px] font-bold text-rose-500 uppercase tracking-tight">{errors.product_title_bangla.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
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
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="sku" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Product SKU <span className="text-rose-500">*</span>
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="sku"
                    {...register('sku')}
                    placeholder="SKU-XXXXXX"
                    className={cn(
                      "h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-bold text-slate-900 uppercase tracking-widest",
                      errors.sku && "border-rose-500 bg-rose-50/30"
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAutoGenerateSKU}
                    disabled={!productTitleEnglish}
                    className="h-14 px-6 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition-all active:scale-95 flex items-center gap-2 shrink-0 shadow-sm"
                  >
                    <Sparkles size={18} className="text-secondary" />
                    <span>Auto</span>
                  </Button>
                </div>
                {errors.sku && (
                  <p className="px-1 text-[10px] font-bold text-rose-500 uppercase tracking-tight">{errors.sku.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Pricing & Inventory */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Pricing & Inventory</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">Profit margins & stock levels</p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="seller_price" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Seller Price (৳) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="seller_price"
                    type="number"
                    step="0.01"
                    {...register('seller_price', { valueAsNumber: true })}
                    placeholder="0.00"
                    className={cn(
                      "h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-bold text-slate-900",
                      errors.seller_price && "border-rose-500 bg-rose-50/30"
                    )}
                  />
                  {errors.seller_price && (
                    <p className="px-1 text-[10px] font-bold text-rose-500 uppercase tracking-tight">{errors.seller_price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regular_price" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Regular Price (৳)
                  </Label>
                  <div className="relative">
                    <Input
                      id="regular_price"
                      type="number"
                      step="0.01"
                      {...register('regular_price', { valueAsNumber: true })}
                      placeholder="0.00"
                      className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-100/50 cursor-not-allowed font-black text-emerald-600"
                      readOnly
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-md border border-emerald-100">Auto</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offer_price" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Offer Price (৳)
                  </Label>
                  <div className="relative">
                    <Input
                      id="offer_price"
                      type="number"
                      step="0.01"
                      {...register('offer_price', { valueAsNumber: true })}
                      placeholder="0.00"
                      className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-100/50 cursor-not-allowed font-black text-slate-900"
                      readOnly
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="px-2 py-1 bg-slate-200 text-slate-600 text-[8px] font-black uppercase rounded-md border border-slate-300">Auto</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Metrics */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Profit Margin</p>
                      <p className="text-xl font-black text-slate-900">{profitMargin.toFixed(2)}%</p>
                    </div>
                  </div>
                  <div className="h-10 w-24 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Verified</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-amber-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <Percent className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Discount</p>
                      <p className="text-xl font-black text-slate-900">{discount}% OFF</p>
                    </div>
                  </div>
                  <div className="h-10 w-24 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">Auto Apply</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Current Stock Quantity <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="stock"
                      type="number"
                      {...register('stock', { valueAsNumber: true })}
                      placeholder="0"
                      className={cn(
                        "h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-bold text-slate-900",
                        errors.stock && "border-rose-500 bg-rose-50/30"
                      )}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Units</span>
                    </div>
                  </div>
                </div>

                {/* <div className="flex items-center justify-between p-4 bg-primary-light/5 border border-primary-light/10 rounded-2xl">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900">E-book Product</Label>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Digital file delivery</p>
                  </div>
                  <Switch
                    checked={isEbook}
                    onCheckedChange={(checked) => {
                      setIsEbook(checked);
                      setValue('ebook', checked ? '1' : '0', { shouldDirty: true });
                    }}
                    className="data-[state=checked]:bg-secondary"
                  />
                </div> */}
              </div>
            </div>
          </div>

          {/* Section: Product Descriptions */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Detailed Descriptions</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">Content for product page</p>
              </div>
            </div>

            <div className="p-8">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-8">
                <div className="flex justify-center">
                  <TabsList className="h-14 bg-slate-100 p-1.5 rounded-[1.25rem] w-full max-w-2xl border border-slate-200">
                    <TabsTrigger value="short-en" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">Short EN</TabsTrigger>
                    <TabsTrigger value="short-bn" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">Short BN</TabsTrigger>
                    <TabsTrigger value="long-en" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">Long EN</TabsTrigger>
                    <TabsTrigger value="long-bn" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">Long BN</TabsTrigger>
                  </TabsList>
                </div>

                <div className="pt-2">
                  <TabsContent value="short-en" className="space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between px-1">
                      <Label htmlFor="short_description_english" className="text-[10px] font-black uppercase tracking-widest text-slate-500">English Summary</Label>
                      <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase", (watch('short_description_english')?.length || 0) > 200 ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-400")}>
                        {watch('short_description_english')?.length || 0}/200
                      </span>
                    </div>
                    <Textarea
                      id="short_description_english"
                      {...register('short_description_english')}
                      placeholder="Brief summary..."
                      className="min-h-[120px] p-6 rounded-[1.5rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-medium text-slate-800 leading-relaxed resize-none"
                    />
                  </TabsContent>
                  <TabsContent value="short-bn" className="space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between px-1">
                      <Label htmlFor="short_description_bangla" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bengali Summary</Label>
                      <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase", (watch('short_description_bangla')?.length || 0) > 200 ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-400")}>
                        {watch('short_description_bangla')?.length || 0}/200
                      </span>
                    </div>
                    <Textarea id="short_description_bangla" {...register('short_description_bangla')} placeholder="পণ্য সম্পর্কে সংক্ষেপে বাংলায় লিখুন..." className="min-h-[120px] p-6 rounded-[1.5rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-medium text-slate-800 leading-relaxed resize-none" />
                  </TabsContent>

                  <TabsContent value="long-en" className="space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between px-1">
                      <Label htmlFor="long_description_english" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full English Details</Label>
                      <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase", (watch('long_description_english')?.length || 0) > 1000 ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-400")}>
                        {watch('long_description_english')?.length || 0}/1000
                      </span>
                    </div>
                    <Textarea id="long_description_english" {...register('long_description_english')} placeholder="Detailed description..." className="min-h-[250px] p-6 rounded-[1.5rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-medium text-slate-800 leading-relaxed resize-none" />
                  </TabsContent>

                  <TabsContent value="long-bn" className="space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between px-1">
                      <Label htmlFor="long_description_bangla" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Bengali Details</Label>
                      <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase", (watch('long_description_bangla')?.length || 0) > 1000 ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-400")}>
                        {watch('long_description_bangla')?.length || 0}/1000
                      </span>
                    </div>
                    <Textarea id="long_description_bangla" {...register('long_description_bangla')} placeholder="পণ্য সম্পর্কে বিস্তারিত বাংলায় লিখুন..." className="min-h-[250px] p-6 rounded-[1.5rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-medium text-slate-800 leading-relaxed resize-none" />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">

          {/* Section: Main Image */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden sticky top-8">
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Cover Image</h3>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div
                className={cn(
                  "relative aspect-square rounded-[2rem] border-4 border-dashed transition-all flex flex-col items-center justify-center text-center overflow-hidden group cursor-pointer",
                  mainImage || initialData?.existing_images?.[0] ? "border-amber-500/20" : "border-slate-100 bg-slate-50 hover:bg-slate-100/80"
                )}
                onClick={() => document.getElementById('main-image-upload')?.click()}
              >
                {mainImage ? (
                  <img src={URL.createObjectURL(mainImage)} alt="Main product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : initialData?.existing_images?.[0] ? (
                  <img src={initialData.existing_images[0] && initialData.existing_images[0].toString().startsWith('http') ? initialData.existing_images[0] : `https://admin.goldenlifeltd.com/uploads/ecommarce/product_image/${initialData.existing_images[0]}`} alt="Current" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="p-6">
                    <Upload className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload cover</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white p-3 rounded-xl text-slate-900 shadow-xl flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Change Image</span>
                  </div>
                </div>
              </div>

              <input id="main-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMainImageChange(file);
              }} />

              {/* Gallery Preview */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gallery Items</h4>
                  <button type="button" onClick={() => document.getElementById('gallery-upload')?.click()} className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                    <Upload className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {existingGalleryImages.map((imgObj, index) => {
                    let imgName = '';
                    if (typeof imgObj === 'string') {
                      imgName = imgObj;
                    } else if (imgObj) {
                      imgName = imgObj.gal_img || imgObj.image || imgObj.product_gal_img || imgObj.name || String(imgObj);
                    }
                    // Handle case where imgName is still an object string representation
                    if (imgName === '[object Object]' && typeof imgObj === 'object') {
                      // Try to find any property that looks like an image
                      const possibleImg = Object.values(imgObj).find(val => typeof val === 'string' && (val.endsWith('.jpg') || val.endsWith('.png') || val.endsWith('.jpeg') || val.endsWith('.webp')));
                      if (possibleImg) imgName = possibleImg as string;
                    }

                    const srcUrl = imgName && imgName.toString().startsWith('http')
                      ? imgName
                      : `https://admin.goldenlifeltd.com/uploads/ecommarce/gal_img/${imgName}`;

                    return (
                      <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 group shadow-sm">
                        <img src={srcUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-gallery.jpg'; }} />
                        <button type="button" onClick={() => handleExistingGalleryImageRemove(index)} className="absolute top-1 right-1 h-5 w-5 bg-rose-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md hover:bg-rose-600">
                          <X size={10} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/60 text-white text-[6px] font-bold text-center p-0.5 uppercase tracking-tighter">Existing</div>
                      </div>
                    );
                  })}
                  {galleryImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-emerald-100 bg-emerald-50 group shadow-sm">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <button type="button" onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== index))} className="absolute top-1 right-1 h-5 w-5 bg-rose-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md">
                        <X size={10} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 text-white text-[6px] font-bold text-center p-0.5 uppercase tracking-tighter">New</div>
                    </div>
                  ))}
                </div>
                <input id="gallery-upload" type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) handleGalleryImagesChange([...galleryImages, ...files]);
                }} />
              </div>

              {/* Actions */}
              <div className="pt-6 space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-base font-black tracking-[0.1em] shadow-xl shadow-amber-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={24} />
                      <span>UPDATE PRODUCT</span>
                    </>
                  )}
                </Button>


              </div>
            </div>
          </div>

          {/* Security / Info */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Info className="w-5 h-5 text-secondary" />
              <h4 className="text-xs font-black uppercase tracking-widest">Editing Note</h4>
            </div>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed">
              Updates to title and pricing will take effect immediately. Ensure images are high quality to maintain listing rank.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}