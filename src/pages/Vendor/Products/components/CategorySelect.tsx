import { Loader2, RefreshCcw } from 'lucide-react';
import { useProductCategories } from '../hooks/useProductCategories';
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
    isLoadingCategories,
    categoriesError,
    refetchCategories,
    getSubcategoriesQuery
  } = useProductCategories();

  // This automatically fetches subcategories when categoryId changes or is set initially
  const {
    data: subcategories = [],
    isLoading: isLoadingSubcategories
  } = getSubcategoriesQuery(categoryId);

  const isLoading = isLoadingCategories || isLoadingSubcategories;

  // Handle category change
  const handleCategoryChange = (value: string) => {
    const selectedCategoryId = Number(value);
    onCategoryChange(selectedCategoryId);
    
    // Reset subcategory when category changes
    onSubcategoryChange(0);
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
        <Label htmlFor="category" className="font-semibold text-[10px] uppercase tracking-widest text-slate-500 ml-1">
          Category <span className="text-rose-500">*</span>
        </Label>
        <Select
          value={categoryId?.toString() || ''}
          onValueChange={handleCategoryChange}
          disabled={disabled || isLoadingCategories}
        >
          <SelectTrigger
            id="category"
            className={`h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-bold text-slate-900 ${errors?.category_id ? 'border-rose-500 bg-rose-50/30' : ''}`}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
            {isLoadingCategories && categories.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-secondary" />
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()} className="font-bold py-3 px-4 rounded-xl focus:bg-slate-50 focus:text-secondary cursor-pointer">
                  {category.category_name}
                  {category.category_name_bangla && (
                    <span className="text-slate-400 ml-2 font-medium">({category.category_name_bangla})</span>
                  )}
                </SelectItem>
              ))
            ) : (
              <div className="p-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                No categories available
              </div>
            )}
          </SelectContent>
        </Select>
        {errors?.category_id && (
          <p className="px-1 mt-1 text-[10px] font-bold text-rose-500 uppercase tracking-tight">{errors.category_id.message}</p>
        )}
        {categoriesError && !isLoadingCategories && (
          <div className="mt-2 flex items-center gap-2 px-1">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">
              ⚠️ Unable to load categories
            </p>
            <button
              onClick={() => refetchCategories()}
              className="text-[10px] font-black text-secondary hover:underline flex items-center gap-1 uppercase"
            >
              <RefreshCcw size={10} />
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Subcategory Selection */}
      <div>
        <Label htmlFor="subcategory" className="font-semibold text-[10px] uppercase tracking-widest text-slate-500 ml-1">
          Subcategory <span className="text-rose-500">*</span>
        </Label>
        <Select
          value={subcategoryId?.toString() || ''}
          onValueChange={handleSubcategoryChange}
          disabled={disabled || isLoadingSubcategories || !categoryId || categoryId === '0' || categoryId === 0}
        >
          <SelectTrigger
            id="subcategory"
            className={`h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-secondary transition-all font-bold text-slate-900 ${errors?.subcategory_id ? 'border-rose-500 bg-rose-50/30' : ''}`}
          >
            <SelectValue placeholder="Select a subcategory" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
            {isLoadingSubcategories && subcategories.length === 0 && categoryId ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-secondary" />
              </div>
            ) : subcategories.length > 0 ? (
              subcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id.toString()} className="font-bold py-3 px-4 rounded-xl focus:bg-slate-50 focus:text-secondary cursor-pointer">
                  {subcategory.subcategory_name}
                  {subcategory.subcategory_name_bangla && (
                    <span className="text-slate-400 ml-2 font-medium">({subcategory.subcategory_name_bangla})</span>
                  )}
                </SelectItem>
              ))
            ) : categoryId ? (
              <div className="p-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                No subcategories available
              </div>
            ) : (
              <div className="p-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Select a category first
              </div>
            )}
          </SelectContent>
        </Select>
        {errors?.subcategory_id && (
          <p className="px-1 mt-1 text-[10px] font-bold text-rose-500 uppercase tracking-tight">{errors.subcategory_id.message}</p>
        )}
      </div>
    </div>
  );
}
