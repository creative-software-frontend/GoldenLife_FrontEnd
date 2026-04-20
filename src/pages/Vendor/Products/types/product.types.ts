// Product interfaces matching API structure
// product.types.ts
// Category interface
export interface Category {
  id: number;
  category_name: string;
  category_name_bangla?: string;
  category_slug?: string;
  category_image?: string;
}

// Subcategory interface
export interface Subcategory {
  id: number;
  category_id: number;
  subcategory_name: string;
  subcategory_name_bangla?: string;
  subcategory_slug?: string;
}

// Product form data for add/edit operations
export interface ProductFormData {
  product_title_english: string;
  product_title_bangla: string;
  category_id: number | string;
  subcategory_id: number | string;
  short_description_english: string;
  short_description_bangla: string;
  long_description_english: string;
  long_description_bangla: string;
  seller_price: number;
  regular_price: number;
  offer_price: number;
  sku: string;
  stock: number;
  video_link?: string;
  ebook: string; // Required field with default '0'
  images: File[];
  existing_images?: string[]; // For edit mode - URLs of existing images
  removed_images?: string[]; // Track deleted images in edit mode
}

// Product response from API (for edit mode)
export interface ProductApiResponse {
  id: number;
  product_title_english: string;
  product_title_bangla: string;
  category_id: number;
  subcategory_id: number;
  short_description_english: string;
  short_description_bangla: string;
  long_description_english: string;
  long_description_bangla: string;
  seller_price: number;
  regular_price: number;
  offer_price: number;
  sku: string;
  stock: number;
  video_link?: string;
  ebook?: string;
  status: 0 | 1;
  product_image: string;
  gallery_images?: string[];
  created_at: string;
  updated_at: string;
}

// API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Image file with preview URL
export interface ImageFile extends File {
  preview?: string;
}

// Form mode type
export type FormMode = 'add' | 'edit';
