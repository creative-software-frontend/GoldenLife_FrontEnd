import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, Package, Tag, DollarSign, Hash, Calendar, Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import axios from 'axios';

interface ProductDetailsData {
  id: number;
  vendor_id: string;
  product_title_english: string;
  product_title_bangla: string;
  category_id: string;
  subcategory_id: string;
  ebook: string;
  short_description_english: string;
  short_description_bangla: string;
  long_description_english: string;
  long_description_bangla: string;
  seller_price: string;
  regular_price: string;
  offer_price: string;
  sku: string;
  product_image: string;
  status: string;
  stock: string;
  video_link: string | null;
  created_at: string;
  updated_at: string;
}

interface GalleryImage {
  id: number;
  product_id: string;
  gal_img: string;
  created_at: string;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailsData | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox modal & Slider state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For Lightbox
  const [currentIndex, setCurrentIndex] = useState(0); // For Slider

  const baseURL = import.meta.env.VITE_BASE_URL || 'https://admin.goldenlifeltd.com';

  // Helper functions for safe formatting
  const formatPrice = (price: string | number | undefined | null): string => {
    if (price === undefined || price === null || price === '') return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `৳ ${numPrice.toFixed(2)}`;
  };

  const formatNumber = (num: string | number | undefined | null): string => {
    if (num === undefined || num === null || num === '') return '0';
    return num.toString();
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getProductImageUrl = (filename: string | null | undefined): string => {
    if (!filename) return '/assets/default-vendor.png';
    return filename.startsWith('http') ? filename : `${baseURL}/uploads/ecommarce/product_image/${filename}`;
  };

  const getGalleryImageUrl = (filename: string | null | undefined): string => {
    if (!filename) return '/assets/default-vendor.png';
    return filename.startsWith('http') ? filename : `${baseURL}/uploads/ecommarce/gal_img/${filename}`;
  };

  // Lightbox handlers

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === 'ArrowLeft') {
        goToPreviousImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, galleryImages.length]);

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

  const getCategoryName = (cid: string | number | undefined) => {
    if (!cid) return 'N/A';
    const category = categories.find(c => c.id.toString() === cid.toString());
    return category ? category.category_name : cid;
  };

  const getSubcategoryName = (scid: string | number | undefined) => {
    if (!scid) return 'N/A';
    const subcategory = subcategories.find(s => s.id.toString() === scid.toString());
    return subcategory ? subcategory.subcategory_name : scid;
  };

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get(
          `${baseURL}/api/vendor/ecommerce/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data?.status === true) {
          setCategories(response.data.data || []);
        }
      } catch (err) {
        console.error('❌ Fetch categories error:', err);
      }
    };
    fetchCategories();
  }, [baseURL]);

  // Fetch Subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!product?.category_id) return;
      try {
        const token = getAuthToken();
        const response = await axios.get(
          `${baseURL}/api/vendor/ecommerce/subcategories`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { category_id: product.category_id }
          }
        );
        if (response.data?.status === true) {
          setSubcategories(response.data.data || []);
        }
      } catch (err) {
        console.error('❌ Fetch subcategories error:', err);
      }
    };
    fetchSubcategories();
  }, [baseURL, product?.category_id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error('Product ID is required');
        navigate('/vendor/dashboard/products');
        return;
      }

      try {
        console.log('🔄 Fetching product details for ID:', id);

        const token = getAuthToken();

        const response = await axios.get(
          `${baseURL}/api/vendor/product/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            params: {
              product_id: Number(id)
            }
          }
        );

        console.log('✅ Product details fetched successfully');
        console.log('Response data:', response.data);

        // Extract product and gallery from response
        // Expected structure: { status: true, data: { product: {...}, gallery: [...] } }
        if (response.data?.data?.product) {
          setProduct(response.data.data.product);
          setGalleryImages(response.data.data.gallery || []);
          console.log('Product loaded:', response.data.data.product.id);
          console.log('Gallery images:', response.data.data.gallery?.length || 0);
        } else {
          throw new Error('Invalid response structure - product data not found');
        }

      } catch (err: any) {
        console.error('❌ Fetch product details error:', err);
        console.error('Error response:', err.response?.data);

        let errorMessage = 'Failed to load product details';

        if (err.response?.status === 404) {
          errorMessage = 'Product not found.';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        toast.error(errorMessage);
        setTimeout(() => {
          navigate('/vendor/dashboard/products');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, baseURL, navigate]);
  // --- MERGE IMAGES FOR SLIDER & LIGHTBOX ---
  const allImages = useMemo(() => {
    if (!product) return [];

    const images = [{
      type: 'main',
      src: getProductImageUrl(product.product_image),
      id: 'main'
    }];

    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach((galImg, index) => {
        images.push({
          type: 'gallery',
          src: getGalleryImageUrl(galImg.gal_img),
          id: galImg.id ? galImg.id.toString() : `gallery-${index}`
        });
      });
    }
    return images;
  }, [product, galleryImages, baseURL]);

  // --- AUTO-SLIDE LOGIC ---
  useEffect(() => {
    if (allImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [allImages.length]);

  // --- LIGHTBOX HANDLERS ---
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowLeft') goToPreviousImage();
      else if (e.key === 'ArrowRight') goToNextImage();
      else if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, allImages.length]);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get(`${baseURL}/api/vendor/ecommerce/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.status === true) {
          setCategories(response.data.data || []);
        }
      } catch (err) {
        console.error('❌ Fetch categories error:', err);
      }
    };
    fetchCategories();
  }, [baseURL]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!product?.category_id) return;
      try {
        const token = getAuthToken();
        const response = await axios.get(`${baseURL}/api/vendor/ecommerce/subcategories`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { category_id: product.category_id }
        });
        if (response.data?.status === true) {
          setSubcategories(response.data.data || []);
        }
      } catch (err) {
        console.error('❌ Fetch subcategories error:', err);
      }
    };
    fetchSubcategories();
  }, [baseURL, product?.category_id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error('Product ID is required');
        navigate('/vendor/dashboard/products');
        return;
      }

      try {
        const token = getAuthToken();
        const response = await axios.get(`${baseURL}/api/vendor/product/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: { product_id: Number(id) }
        });

        if (response.data?.data?.product) {
          setProduct(response.data.data.product);
          setGalleryImages(response.data.data.gallery || []);
        } else {
          throw new Error('Invalid response structure - product data not found');
        }
      } catch (err: any) {
        console.error('❌ Fetch product details error:', err);
        let errorMessage = 'Failed to load product details';
        if (err.response?.status === 404) errorMessage = 'Product not found.';
        else if (err.response?.status === 401) errorMessage = 'Authentication failed. Please login again.';
        else if (err.response?.status === 500) errorMessage = 'Server error. Please try again later.';

        toast.error(errorMessage);
        setTimeout(() => navigate('/vendor/dashboard/products'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, baseURL, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 size={48} className="animate-spin text-primary-light mx-auto" />
          <p className="text-gray-600 font-semibold">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600 font-semibold">Product not found</p>
          <Button onClick={() => navigate('/vendor/dashboard/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Product Details
          </h1>
          <p className="text-sm text-muted-foreground">
            View complete information about this product
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/vendor/dashboard/products')}
          className="hidden sm:flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Button>
      </div>

      {/* Product Details Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left Column - Image Slider */}
        {/* Left Column - Image Slider */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              {/* SLIDER WRAPPER */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 group">
                {/* Automatic Slider Track */}
                <div
                  className="w-full h-full flex transition-transform duration-500 ease-in-out cursor-pointer"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  onClick={() => openLightbox(currentIndex)}
                >
                  {allImages.map((img, index) => (
                    <div key={img.id} className="w-full h-full shrink-0 relative">
                      <img
                        src={img.src}
                        alt={`${product.product_title_english} - Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load image');
                          e.currentTarget.src = '/assets/default-vendor.png';
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Gallery count badge */}
                {allImages.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 z-10">
                    <Image size={16} />
                    <span>{allImages.length} Photos</span>
                  </div>
                )}

                {/* Slider Navigation Dots */}
                {/* Slider Navigation Dots (On the Main Page) */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    {allImages.map((img, index) => (
                      <button
                        key={`thumb-${img.id}`}
                        onClick={() => {
                          // 1. Updates the main slider image
                          setCurrentIndex(index);

                          // 2. Instantly pops open the full-screen modal!
                          openLightbox(index);
                        }}
                        className={`relative group flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentIndex === index
                          ? 'border-primary opacity-100 ring-1 ring-primary ring-offset-1'
                          : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                          }`}
                      >
                        <img
                          src={img.src}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/default-vendor.png';
                          }}
                        />

                        {/* Hover overlay with an icon to indicate it opens full screen */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white transition-opacity duration-200">
                            <Image size={20} />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {/* Hover overlay instruction */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none z-0">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold text-sm shadow-lg pointer-events-auto">
                    Click to view full screen
                  </div>
                </div>
              </div>

              {/* NEW: THUMBNAIL GALLERY STRIP BELOW SLIDER */}
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, index) => (
                    <button
                      key={`thumb-${img.id}`}
                      onClick={() => setCurrentIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentIndex === index
                        ? 'border-primary opacity-100'
                        : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                        }`}
                    >
                      <img
                        src={img.src}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/default-vendor.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Titles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Product Names</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">English Name</label>
                <p className="text-base font-semibold">{product.product_title_english}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Bangla Name</label>
                <p className="text-base font-semibold">{product.product_title_bangla}</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">

                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Seller Price (Cost)</label>
                <p className="text-lg font-bold text-primary-light">
                  {formatPrice(product.seller_price)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Regular Price (MRP)</label>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(product.regular_price)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Offer Price</label>
                <p className="text-lg font-bold text-green-600">
                  {formatPrice(product.offer_price)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stock & Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Inventory & Category</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-gray-500" />
                  <label className="text-xs text-gray-500">Stock Available</label>
                </div>
                <p className="text-2xl font-bold">{formatNumber(product.stock)}</p>
                <p className="text-xs text-gray-500">units</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-500" />
                  <label className="text-xs text-gray-500">Category</label>
                </div>
                <p className="text-sm font-semibold">
                  {getCategoryName(product.category_id)}
                </p>
                <div className="text-xs text-gray-500 mt-1 flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">→</span>
                    <span className="font-medium text-gray-600">Subcategory:</span>
                    <span className="text-primary-light font-semibold">
                      {getSubcategoryName(product.subcategory_id)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descriptions */}
          {(product.short_description_english || product.long_description_english ||
            product.short_description_bangla || product.long_description_bangla) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Product Descriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.short_description_english && (
                    <div>
                      <label className="text-xs text-gray-500">Short Description (English)</label>
                      <p className="text-sm text-gray-700 mt-1" dangerouslySetInnerHTML={{ __html: product.short_description_english }} />
                    </div>
                  )}
                  {product.short_description_bangla && (
                    <div>
                      <label className="text-xs text-gray-500">Short Description (Bangla)</label>
                      <p className="text-sm text-gray-700 mt-1" dangerouslySetInnerHTML={{ __html: product.short_description_bangla }} />
                    </div>
                  )}
                  {product.long_description_english && (
                    <div>
                      <label className="text-xs text-gray-500">Long Description (English)</label>
                      <div className="prose prose-sm max-w-none mt-1">
                        <div dangerouslySetInnerHTML={{ __html: product.long_description_english }} />
                      </div>
                    </div>
                  )}
                  {product.long_description_bangla && (
                    <div>
                      <label className="text-xs text-gray-500">Long Description (Bangla)</label>
                      <div className="prose prose-sm max-w-none mt-1">
                        <div dangerouslySetInnerHTML={{ __html: product.long_description_bangla }} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Video Link */}
          {product.video_link && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Product Video</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={product.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Product Video
                </a>
              </CardContent>
            </Card>
          )}

          {/* Created Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar size={20} />
                Listing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Created At</label>
                <p className="text-sm font-semibold">
                  {formatDate(product.created_at)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {product.status === '0' && (
              <Button
                onClick={() => navigate(`/vendor/dashboard/products/edit/${id}`)}
                className="flex-1 sm:flex-none px-6 py-3 bg-primary-light text-white font-bold rounded-xl transition-all duration-300"
              >
                Edit This Product
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate('/vendor/dashboard/products')}
              className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all duration-300"
            >
              Back to List
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-6xl w-full h-[95vh] p-0 bg-black/95 border-0 shadow-2xl overflow-hidden flex flex-col justify-center">
          <div className="relative w-full h-full flex items-center justify-center">

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-all duration-200"
            >
              <X size={24} />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold tracking-wide">
              {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Previous button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousImage();
                }}
                className="absolute left-2 sm:left-4 z-50 p-2 sm:p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Next button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute right-2 sm:right-4 z-50 p-2 sm:p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* Main image */}
            <div className="w-full h-full flex items-center justify-center p-4 sm:p-16 pb-28">
              {allImages.length > 0 && (
                <img
                  key={currentImageIndex}
                  src={allImages[currentImageIndex]?.src}
                  alt={`${product?.product_title_english || 'Product'} - View ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none drop-shadow-lg"
                  onError={(e) => {
                    console.error('Failed to load image in lightbox');
                    e.currentTarget.src = '/assets/default-vendor.png';
                  }}
                />
              )}
            </div>

            {/* Thumbnail strip at bottom */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-xl overflow-x-auto max-w-[90%] sm:max-w-[80%] scrollbar-hide">
                {allImages.map((img, index) => (
                  <button
                    key={`lightbox-thumb-${img.id}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index
                      ? 'border-white scale-105 ring-1 ring-white/30'
                      : 'border-transparent opacity-50 hover:opacity-100 hover:border-gray-400'
                      }`}
                  >
                    <img
                      src={img.src}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/default-vendor.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
