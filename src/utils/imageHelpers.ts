// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

// Image path configurations
const IMAGE_PATHS = {
  VENDOR_PROFILE: '/uploads/vendor/image',
  PRODUCT: '/uploads/ecommarce/product_image',
  PRODUCT_GALLERY: '/uploads/ecommarce/gal_img',
} as const;

// Fallback images (using placeholders or default images)
const FALLBACK_IMAGES = {
  VENDOR_PROFILE: '/assets/default-vendor.png',
  PRODUCT: '/placeholder-product.jpg',
  GALLERY: '/placeholder-gallery.jpg',
} as const;

/**
 * Get full URL for vendor profile/business image
 */
export const getVendorImageUrl = (filename?: string | null): string => {
  if (!filename || filename === '') {
    return FALLBACK_IMAGES.VENDOR_PROFILE;
  }

  // If already a full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  return `${API_BASE_URL}${IMAGE_PATHS.VENDOR_PROFILE}/${filename}`;
};

/**
 * Get full URL for product main image
 */
export const getProductImageUrl = (filename?: string | null): string => {
  if (!filename || filename === '') {
    return FALLBACK_IMAGES.PRODUCT;
  }

  // If already a full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  return `${API_BASE_URL}${IMAGE_PATHS.PRODUCT}/${filename}`;
};

/**
 * Get full URL for product gallery image
 */
export const getProductGalleryUrl = (filename?: string | null): string => {
  if (!filename || filename === '') {
    return FALLBACK_IMAGES.GALLERY;
  }

  // If already a full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  return `${API_BASE_URL}${IMAGE_PATHS.PRODUCT_GALLERY}/${filename}`;
};

/**
 * Get fallback image URL based on type
 */
export const getFallbackImage = (type: 'vendor' | 'product' | 'gallery'): string => {
  switch (type) {
    case 'vendor':
      return FALLBACK_IMAGES.VENDOR_PROFILE;
    case 'product':
      return FALLBACK_IMAGES.PRODUCT;
    case 'gallery':
      return FALLBACK_IMAGES.GALLERY;
    default:
      return FALLBACK_IMAGES.PRODUCT;
  }
};

/**
 * Handle image load error - returns fallback image
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackType: 'vendor' | 'product' | 'gallery' = 'product'
) => {
  const img = event.target as HTMLImageElement;
  img.src = getFallbackImage(fallbackType);
};

/**
 * Check if image exists (async)
 */
export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
