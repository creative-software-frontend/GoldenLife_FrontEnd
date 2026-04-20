import { Category } from '../../Products/types/product.types';

/**
 * Get category name by ID from categories array
 * @param categoryId - The category ID to look up (can be string or number)
 * @param categories - Array of categories to search in
 * @returns Category name if found, otherwise shows "ID: X" or "N/A"
 */
export const getCategoryNameById = (
  categoryId: number | string | undefined,
  categories: Category[]
): string => {
  // Debug logging
  console.log('🔍 [getCategoryNameById] Called with:', {
    categoryId,
    categoryIdType: typeof categoryId,
    categoriesCount: categories.length,
    categories: categories.map(c => ({ id: c.id, name: c.category_name }))
  });

  // Handle undefined/null/empty categoryId
  if (!categoryId && categoryId !== 0) {
    console.warn('⚠️ [getCategoryNameById] No category ID provided');
    return 'N/A';
  }

  // Convert to string for comparison to handle both string and number IDs
  const searchId = String(categoryId);
  
  console.log('[getCategoryNameById] Searching for ID (as string):', searchId);

  // Try to find matching category (compare as strings to handle type differences)
  const category = categories.find(cat => {
    const catId = String(cat.id);
    const matches = catId === searchId;
    console.log(`[getCategoryNameById] Comparing: ${catId} === ${searchId} = ${matches}`);
    return matches;
  });
  
  if (!category) {
    console.warn('⚠️ [getCategoryNameById] Category not found for ID:', searchId);
    console.log('[getCategoryNameById] Available category IDs:', categories.map(c => String(c.id)));
    return `ID: ${categoryId}`;
  }

  console.log('✅ [getCategoryNameById] Found category:', category.category_name);
  return category.category_name || 'N/A';
};

/**
 * Get category name by ID with fallback to ID if not found
 * Simpler version that always returns something
 */
export const getCategoryNameOrId = (
  categoryId: number | string | undefined,
  categories: Category[]
): string => {
  if (!categoryId && categoryId !== 0) {
    return 'N/A';
  }

  const searchId = String(categoryId);
  const category = categories.find(cat => String(cat.id) === searchId);
  
  return category?.category_name || `ID: ${categoryId}`;
};
