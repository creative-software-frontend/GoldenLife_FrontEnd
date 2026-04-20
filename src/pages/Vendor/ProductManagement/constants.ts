import { StatusFilter, StockFilter, SortOption } from './types';

// Status filter options
export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// Stock filter options
export const STOCK_OPTIONS: { value: StockFilter; label: string }[] = [
  { value: 'all', label: 'All Stock' },
  { value: 'low_stock', label: 'Low Stock (< 10)' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

// Sort options
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'stock_asc', label: 'Stock: Low to High' },
  { value: 'stock_desc', label: 'Stock: High to Low' },
];

// Page size options (added "All" as 9999)
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 9999];

// Low stock threshold
export const LOW_STOCK_THRESHOLD = 10;
