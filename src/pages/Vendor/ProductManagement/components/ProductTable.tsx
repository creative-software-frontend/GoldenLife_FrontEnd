// ProductTable.tsx

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductStatusBadge } from './ProductStatusBadge';
import { ProductActions } from './ProductActions';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductTableProps } from '../types';
import { LOW_STOCK_THRESHOLD } from '../constants';
import { getProductImageUrl, handleImageError } from '@/utils/imageHelpers';
import { getCategoryNameById } from '../utils/categoryHelpers';

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  selectedProducts,
  onSelectionChange,
  onView,
  onEdit,
  onToggleStatus,
  categories = [],
}) => {
  // Debug logging for categories
  console.log('📋 [ProductTable] Render with:', {
    productsCount: products.length,
    categoriesCount: categories.length,
    categories: categories.map(c => ({ id: c.id, name: c.category_name })),
    firstProductCategory: products[0]?.category_id
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(products.map((p) => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProducts, productId]);
    } else {
      onSelectionChange(selectedProducts.filter((id) => id !== productId));
    }
  };

  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[50px] h-12"><Checkbox disabled /></TableHead>
              <TableHead className="w-[120px] h-12">Image</TableHead>
              <TableHead className="h-12 min-w-[280px]">Product Details</TableHead>
              <TableHead className="h-12 min-w-[180px]">Category</TableHead>
              <TableHead className="h-12 w-[140px] text-right">Price</TableHead>
              <TableHead className="h-12 w-[120px] text-center">Stock</TableHead>
              <TableHead className="h-12 w-[120px] text-center">Status</TableHead>
              <TableHead className="h-12 w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="hover:bg-muted/30">
                <TableCell className="py-4"><Checkbox disabled /></TableCell>
                <TableCell className="py-4"><Skeleton className="h-10 w-10 rounded-xl" /></TableCell>
                <TableCell className="py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="py-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                <TableCell className="py-4"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="py-4 text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                <TableCell className="py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-foreground">
            No products found
          </h3>

          <p className="text-muted-foreground">
            Start by adding your first product to your catalog.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
            <TableHead className="w-[50px] h-14">
              <Checkbox
                checked={selectedProducts.length === products.length && products.length > 0}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </TableHead>
            <TableHead className="w-[120px] h-14 font-bold text-foreground">Image</TableHead>
            <TableHead className="h-14 min-w-[280px] font-bold text-foreground">Product Details</TableHead>
            <TableHead className="h-14 min-w-[180px] font-bold text-foreground">Category</TableHead>
            <TableHead className="h-14 w-[140px] text-left font-bold text-foreground">Price</TableHead>
            <TableHead className="h-14 w-[120px] text-center font-bold text-foreground">Stock</TableHead>
            <TableHead className="h-14 w-[120px] text-center font-bold text-foreground">Status</TableHead>
            <TableHead className="h-14 w-[100px] text-right font-bold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {products.map((product) => (
            <TableRow
              key={product.id}
              className={`group transition-all duration-200 ${
                selectedProducts.includes(product.id)
                  ? 'bg-primary/5 hover:bg-primary/10'
                  : 'hover:bg-muted/40'
              }`}
            >
              <TableCell className="py-4 px-4">
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </TableCell>

              {/* Product Image */}
              <TableCell className="py-4 px-4">
                <div className="h-10 w-10 rounded-xl overflow-hidden border border-border shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={getProductImageUrl(product.product_image)}
                    alt={product.product_title_english}
                    className="h-full w-full object-cover"
                    onError={(e) => handleImageError(e, 'product')}
                  />
                </div>
              </TableCell>

              {/* Product Details */}
              <TableCell className="py-4 px-4">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-foreground line-clamp-1 text-sm group-hover:text-primary transition-colors">
                    {product.product_title_english}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono bg-muted/50 inline-block px-2 py-0.5 rounded-md w-fit">
                    SKU: {product.sku}
                  </span>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell className="py-4 px-4">
                {(() => {
                  const catId = product.category_id;
                  const categoryName = getCategoryNameById(catId, categories);
                  console.log('🏷️ [ProductTable.Category] Product:', product.product_title_english, '| Category ID:', catId, '(type:', typeof catId, ')', '| Category Name:', categoryName);
                  
                  // Show loading indicator if categories are empty
                  if (categories.length === 0) {
                    return (
                      <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-xs font-medium">Loading...</span>
                      </span>
                    );
                  }
                  
                  return (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-semibold hover:bg-secondary/20 transition-colors">
                      {categoryName}
                    </span>
                  );
                })()}
              </TableCell>

              {/* Price */}
              <TableCell className="py-4 px-4">
                <div className="flex flex-row items-center gap-2 text-left">
                  <span className="font-bold text-primary text-sm whitespace-nowrap">
                    {formatPrice(product.offer_price)}
                  </span>
                  {product.regular_price > product.offer_price && (
                    <span className="text-xs text-muted-foreground line-through font-medium whitespace-nowrap">
                      {formatPrice(product.regular_price)}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Stock */}
              <TableCell className="py-4 px-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-sm font-bold ${
                    product.stock === 0 
                      ? 'text-red-600 dark:text-red-500' 
                      : product.stock <= LOW_STOCK_THRESHOLD
                      ? 'text-amber-600 dark:text-amber-500'
                      : 'text-emerald-600 dark:text-emerald-500'
                  }`}>
                    {product.stock}
                  </span>
                  {product.stock === 0 ? (
                    <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      Out of Stock
                    </span>
                  ) : product.stock <= LOW_STOCK_THRESHOLD ? (
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      Low Stock
                    </span>
                  ) : null}
                </div>
              </TableCell>

              {/* Status */}
              <TableCell className="py-4 px-4 text-center">
                <ProductStatusBadge status={product.status} />
              </TableCell>

              {/* Actions */}
              <TableCell className="py-4 px-4 text-right">
                <ProductActions
                  product={product}
                  onView={onView}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};