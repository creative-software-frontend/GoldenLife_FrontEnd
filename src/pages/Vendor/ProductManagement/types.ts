// Product interface matching API structure
import { Category } from '../Products/types/product.types';

export interface Product {
  id: number;
  product_title_english: string;
  product_title_bangla: string;
  sku: string;
  seller_price: number;
  regular_price: number;
  offer_price: number;
  category_id: number;
  subcategory_id: number;
  stock: number;
  status: 0 | 1 | string; // 0 = Inactive, 1 = Active (can be string from API)
  product_image: string;
  created_at: string;
  video_link?: string | null;
  ebook?: string | '0' | '1'; // '0' = regular product, '1' = ebook
}

// API Response type
export interface ProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  per_page?: number;
}

// Filter and sort types
export type StatusFilter = 'all' | 'active' | 'inactive';
export type StockFilter = 'all' | 'low_stock' | 'out_of_stock';
export type SortOption = 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc' | 'date_asc' | 'date_desc';

export interface ProductFilters {
  search: string;
  status: StatusFilter;
  stock: StockFilter;
  sort: SortOption;
}

// Pagination type
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// View mode type
export type ViewMode = 'table' | 'grid';

// Component props types
export interface ProductStatusBadgeProps {
  status: 0 | 1 | string;
}

export interface ProductActionsProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onToggleStatus?: (product: Product) => void; // Optional - toggle functionality removed
  onDelete?: (product: Product) => void; // Optional - delete functionality removed
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isDeleting?: boolean;
}

export interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddProduct: () => void;
}

export interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  selectedProducts: number[];
  onSelectionChange: (ids: number[]) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onToggleStatus?: (product: Product) => void; // Optional - toggle functionality removed
  onDelete?: (product: Product) => void; // Optional - delete functionality removed
  categories?: Category[]; // For category name lookup
}

export interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  selectedProducts: number[];
  onSelectionChange: (ids: number[]) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onToggleStatus?: (product: Product) => void; // Optional - toggle functionality removed
  onDelete?: (product: Product) => void; // Optional - delete functionality removed
}

export interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
