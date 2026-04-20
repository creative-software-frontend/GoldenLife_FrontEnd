// Mock product data for demo/fallback mode

export interface ProductDetailsData {
  id: number;
  product_title_english: string;
  product_title_bangla: string;
  sku: string;
  seller_price: number;
  regular_price: number;
  offer_price: number;
  stock: number;
  status: 0 | 1;
  product_image: string;
  gallery_images?: string[];
  category_name?: string;
  subcategory_name?: string;
  short_description_english?: string;
  short_description_bangla?: string;
  long_description_english?: string;
  long_description_bangla?: string;
  video_link?: string;
  created_at: string;
}

// Import ProductFormData type reference
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
  status: 0 | 1;
  images: File[];
  existing_images?: string[];
  removed_images?: string[];
}

/**
 * Generate mock product data for demo mode (Details view)
 */
export const getMockProduct = (productId?: number): ProductDetailsData => ({
  id: productId || 1,
  product_title_english: "Premium Wireless Headphones - Demo Model",
  product_title_bangla: "প্রিমিয়াম ওয়্যারলেস হেডফোন - ডেমো মডেল",
  sku: "DEMO-WH-001",
  seller_price: 850.00,
  regular_price: 1200.00,
  offer_price: 999.00,
  stock: 45,
  status: 1,
  product_image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
  gallery_images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1524678606372-987d780461d5?w=500&h=500&fit=crop"
  ],
  category_name: "Electronics & Gadgets",
  subcategory_name: "Audio Devices",
  short_description_english: "High-quality wireless headphones with noise cancellation and premium sound quality.",
  short_description_bangla: "নয়েজ ক্যান্সেলেশন এবং প্রিমিয়াম সাউন্ড কোয়ালিটি সহ উচ্চ মানের ওয়্যারলেস হেডফোন।",
  long_description_english: `Experience premium audio quality with these professional wireless headphones. Features include:

• Active Noise Cancellation (ANC)
• 40mm dynamic drivers
• 30-hour battery life
• Bluetooth 5.0 connectivity
• Premium comfort ear cushions
• Foldable design with carrying case
• Built-in microphone for calls
• Multi-device pairing

Perfect for music lovers, professionals, and audiophiles who demand the best sound quality.`,
  
  long_description_bangla: `পেশাদার ওয়্যারলেস হেডফোনের সাথে প্রিমিয়াম অডিও অভিজ্ঞতা উপভোগ করুন। বৈশিষ্ট্যসমূহ:

• সক্রিয় নয়েজ ক্যান্সেলেশন (ANC)
• ৪০ মিমি ডায়নামিক ড্রাইভার
• ৩০ ঘণ্টা ব্যাটারি লাইফ
• ব্লুটুথ ৫.০ সংযোগ
• প্রিমিয়াম আরামদায়ক ইয়ার কাশন
• ক্যারিং কেইস সহ ফোল্ডেবল ডিজাইন
• কলের জন্য বিল্ট-ইন মাইক্রোফোন
• মাল্টি-ডিভাইস পেয়ারিং

সঙ্গীত প্রেমী, পেশাদার এবং সেরা সাউন্ড কোয়ালিটি চাইদের জন্য আদর্শ।`,
  
  video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  created_at: new Date().toISOString()
});

/**
 * Generate mock product form data for edit mode
 * Converts from ProductDetailsData to ProductFormData format
 */
export const getMockProductFormData = (productId?: number): ProductFormData => {
  const details = getMockProduct(productId);
  
  return {
    product_title_english: details.product_title_english,
    product_title_bangla: details.product_title_bangla,
    category_id: 1, // Mock category ID
    subcategory_id: 1, // Mock subcategory ID
    short_description_english: details.short_description_english || '',
    short_description_bangla: details.short_description_bangla || '',
    long_description_english: details.long_description_english || '',
    long_description_bangla: details.long_description_bangla || '',
    seller_price: details.seller_price,
    regular_price: details.regular_price,
    offer_price: details.offer_price,
    sku: details.sku,
    stock: details.stock,
    video_link: details.video_link,
    status: details.status,
    images: [], // Empty File array for form
    existing_images: details.gallery_images || [details.product_image], // Use image URLs as existing images
    removed_images: []
  };
};

/**
 * Generate multiple mock products for list view
 */
export const getMockProducts = (count: number = 10) => {
  return Array.from({ length: count }, (_, i) => getMockProduct(i + 1));
};

/**
 * Check if we should use demo mode
 * Can be overridden by setting DEMO_MODE=true in localStorage
 */
export const isDemoMode = (): boolean => {
  // Check localStorage override
  const localStorageOverride = localStorage.getItem('DEMO_MODE');
  if (localStorageOverride === 'true') return true;
  if (localStorageOverride === 'false') return false;
  
  // Default: not in demo mode
  return false;
};

/**
 * Enable demo mode
 */
export const enableDemoMode = () => {
  localStorage.setItem('DEMO_MODE', 'true');
  window.location.reload();
};

/**
 * Disable demo mode
 */
export const disableDemoMode = () => {
  localStorage.setItem('DEMO_MODE', 'false');
  window.location.reload();
};
