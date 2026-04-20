// Product Form Components
export { ProductForm } from './components/ProductForm';
export { ImageUpload } from './components/ImageUpload';
export { CategorySelect } from './components/CategorySelect';

// Hooks
export { useProductMutation } from './hooks/useProductMutation';
export { useCategories } from './hooks/useCategories';

// Types
export type { ProductFormData, ProductApiResponse, Category, Subcategory } from './types/product.types';

// Validation
export { productSchema, productSchemaWithValidation } from './validation/product.validation';

// Utilities
export { 
  generateSKU, 
  calculateProfitMargin, 
  calculateDiscount, 
  validateImageFile,
  createImagePreview,
  formatPrice,
  truncateText,
  getProductImageUrl
} from './utils/helpers';
