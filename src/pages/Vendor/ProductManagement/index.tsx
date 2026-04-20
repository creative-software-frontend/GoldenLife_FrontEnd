import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductFilters } from './components/ProductFilters';
import { ProductTable } from './components/ProductTable';
import { ProductGrid } from './components/ProductGrid';
import { BulkActionsBar } from './components/BulkActionsBar';
import { Pagination } from './components/Pagination';
import { useProducts } from './hooks/useProducts';
import { useCategories } from '../Products/hooks/useCategories';
import { Product, ProductFilters as ProductFiltersType, ViewMode, PaginationState } from './types';

const Products: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [filters, setFilters] = useState<ProductFiltersType>({
    search: '',
    status: 'all',
    stock: 'all',
    sort: 'date_desc',
  });

  // Custom hook
  const {
    products,
    isLoading,
    error,
    pagination,
    fetchProducts,
    applyFilters,
    updatePageSize,
    setPagination,
  } = useProducts();

  // Debug logging - log products count when it changes
  React.useEffect(() => {
    console.log('📊 [ProductManagement] Products updated:', {
      totalProducts: products.length,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      totalItems: pagination.totalItems,
      totalPages: pagination.totalPages,
      showing: `${products.length} of ${pagination.totalItems} products`
    });
  }, [products, pagination]);

  // Additional debug: Log filter state
  React.useEffect(() => {
    console.log('🔍 [ProductManagement] Current filters:', filters);
  }, [filters]);

  // Load categories for category name lookup
  const {
    categories,
    fetchCategories,
  } = useCategories();

  // Fetch categories on mount
  React.useEffect(() => {
    console.log('🚀 [ProductManagement] Component mounted, fetching categories...');
    fetchCategories();
  }, [fetchCategories]);

  // Handle filters change
  const handleFiltersChange = useCallback((newFilters: ProductFiltersType) => {
    console.log('🔵 [ProductManagement.index] Filters changed:', newFilters);
    setFilters(newFilters);
    applyFilters(newFilters);
  }, [applyFilters]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Handle product selection
  const handleSelectionChange = useCallback((ids: number[]) => {
    setSelectedProducts(ids);
  }, []);

  // Handle individual product actions
  const handleViewProduct = useCallback((product: Product) => {
    console.log('Viewing product:', product);
    console.log('Product ID:', product.id);
    toast.info(`Viewing product: ${product.product_title_english}`);
    // Navigate to product detail page
    navigate(`/vendor/dashboard/products/${product.id}`);
  }, [navigate]);

  const handleEditProduct = useCallback((product: Product) => {
    console.log('Editing product:', product);
    console.log('Product ID:', product.id);
    navigate(`/vendor/dashboard/products/edit/${product.id}`);
  }, [navigate]);

  const handleClearSelection = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setPagination((prev: PaginationState) => ({ ...prev, currentPage: page }));
  }, [setPagination]);

  const handlePageSizeChange = useCallback((size: number) => {
    updatePageSize(size);
  }, [updatePageSize]);

  // Handle add product
  const handleAddProduct = useCallback(() => {
    navigate('/vendor/dashboard/products/add');
  }, [navigate]);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1920px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Product Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your product catalog, inventory, and pricing
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-destructive mb-1">Failed to load products</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRetry}
            className="shrink-0"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Filters and Search */}
      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onAddProduct={handleAddProduct}
      />


      {/* Products Content */}
      {!error && (
        <>
          {/* View Component based on mode */}
          {viewMode === 'table' ? (
            <ProductTable
              products={products}
              isLoading={isLoading}
              selectedProducts={selectedProducts}
              onSelectionChange={handleSelectionChange}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              categories={categories}
            />
          ) : (
            <ProductGrid
              products={products}
              isLoading={isLoading}
              selectedProducts={selectedProducts}
              onSelectionChange={handleSelectionChange}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
            />
          )}

          {/* Pagination */}
          {!isLoading && products.length > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}

          {/* Bulk Actions Bar */}
      {selectedProducts.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedProducts.length}
          onClearSelection={handleClearSelection}
        />
      )}
    </div>
  );
};

export default Products;
