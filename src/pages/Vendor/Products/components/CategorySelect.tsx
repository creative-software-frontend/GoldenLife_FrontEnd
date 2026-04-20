// CategorySelector.tsx


import { useEffect } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategorySelectProps {
  categoryId: number | string;
  subcategoryId: number | string;
  onCategoryChange: (categoryId: number) => void;
  onSubcategoryChange: (subcategoryId: number) => void;
  errors?: any;
  disabled?: boolean;
}

export function CategorySelect({
  categoryId,
  subcategoryId,
  onCategoryChange,
  onSubcategoryChange,
  errors,
  disabled = false
}: CategorySelectProps) {
  const {
    categories,
    subcategories,
    isLoading,
    error,
    fetchCategories,
    fetchSubcategories,
    clearSubcategories
  } = useCategories();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    const selectedCategoryId = Number(value);
    onCategoryChange(selectedCategoryId);
    
    // Clear subcategory when category changes
    onSubcategoryChange(0);
    clearSubcategories();
    
    // Fetch subcategories for selected category
    if (selectedCategoryId > 0) {
      fetchSubcategories(selectedCategoryId);
    }
  };

  // Handle subcategory change
  const handleSubcategoryChange = (value: string) => {
    const selectedSubcategoryId = Number(value);
    onSubcategoryChange(selectedSubcategoryId);
  };

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div>
        <Label htmlFor="category" className="font-semibold">
          Category *
        </Label>
        <Select
          value={categoryId?.toString() || ''}
          onValueChange={handleCategoryChange}
          disabled={disabled || isLoading}
        >
          <SelectTrigger
            id="category"
            className={`w-full ${errors?.category_id ? 'border-red-500' : ''}`}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {isLoading && categories.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-primary-light" />
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.category_name}
                  {category.category_name_bangla && (
                    <span className="text-gray-500 ml-2">
                      ({category.category_name_bangla})
                    </span>
                  )}
                </SelectItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No categories available
              </div>
            )}
          </SelectContent>
        </Select>
        {errors?.category_id && (
          <p className="mt-1 text-xs text-red-500">{errors.category_id.message}</p>
        )}
        {error && !isLoading && categories.length === 0 && (
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xs text-amber-600">
              ⚠️ Unable to load categories
            </p>
            <button
              onClick={fetchCategories}
              className="text-xs text-primary-light hover:text-primary-dark font-medium flex items-center gap-1"
            >
              <RefreshCcw size={12} />
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Subcategory Selection */}
      <div>
        <Label htmlFor="subcategory" className="font-semibold">
          Subcategory *
        </Label>
        <Select
          value={subcategoryId?.toString() || ''}
          onValueChange={handleSubcategoryChange}
          disabled={disabled || isLoading || !categoryId}
        >
          <SelectTrigger
            id="subcategory"
            className={`w-full ${errors?.subcategory_id ? 'border-red-500' : ''}`}
          >
            <SelectValue placeholder="Select a subcategory" />
          </SelectTrigger>
          <SelectContent>
            {isLoading && subcategories.length === 0 && categoryId ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-primary-light" />
              </div>
            ) : subcategories.length > 0 ? (
              subcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                  {subcategory.subcategory_name}
                  {subcategory.subcategory_name_bangla && (
                    <span className="text-gray-500 ml-2">
                      ({subcategory.subcategory_name_bangla})
                    </span>
                  )}
                </SelectItem>
              ))
            ) : categoryId ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No subcategories available
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                Select a category first
              </div>
            )}
          </SelectContent>
        </Select>
        {errors?.subcategory_id && (
          <p className="mt-1 text-xs text-red-500">{errors.subcategory_id.message}</p>
        )}
      </div>
    </div>
  );
}
