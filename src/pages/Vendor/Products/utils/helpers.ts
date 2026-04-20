// helpers.ts

/**
 * Auto-generate SKU from product name
 */
export const generateSKU = (productName: string): string => {
  const prefix = productName.substring(0, 3).toUpperCase().replace(/\s/g, '');
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${timestamp}`;
};

/**
 * Calculate profit margin percentage
 */
export const calculateProfitMargin = (sellerPrice: number, offerPrice: number): number => {
  if (sellerPrice === 0) return 0;
  return ((offerPrice - sellerPrice) / sellerPrice) * 100;
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (regularPrice: number, offerPrice: number): number => {
  if (regularPrice === 0) return 0;
  return Math.round(((regularPrice - offerPrice) / regularPrice) * 100);
};

/**
 * Validate image file (type and size)
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WEBP files are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 2MB' };
  }

  return { valid: true };
};

/**
 * Create preview URL for image file
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Format price with BDT currency
 */
export const formatPrice = (price: number, currency: string = '৳'): string => {
  return `${currency} ${price.toFixed(2)}`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get full image URL from filename
 */
export const getProductImageUrl = (filename: string | undefined): string => {
  if (!filename) return '';

  // If already a full URL, return as-is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  // If it's a relative path starting with /, prepend API base URL
  if (filename.startsWith('/')) {
    return `${baseURL}${filename}`;
  }

  // Otherwise, assume it's just a filename and construct full URL
  return `${baseURL}/uploads/ecommarce/product_image/${filename}`;
};
