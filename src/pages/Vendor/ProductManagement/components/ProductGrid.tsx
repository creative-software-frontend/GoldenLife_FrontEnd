import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductStatusBadge } from './ProductStatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductGridProps } from '../types';
import { LOW_STOCK_THRESHOLD } from '../constants';
import { getProductImageUrl, handleImageError } from '@/utils/imageHelpers';

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  selectedProducts,
  onSelectionChange,
  onView,
  onEdit,
}) => {
  // Handle individual product selection
  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProducts, productId]);
    } else {
      onSelectionChange(selectedProducts.filter(id => id !== productId));
    }
  };

  // Format price with BDT symbol
  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden rounded-xl border-border">
            <div className="aspect-square bg-muted">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">No products found</h3>
          <p className="text-muted-foreground">
            Start by adding your first product to your catalog.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className={`
            group overflow-hidden rounded-xl border-border transition-all duration-200
            ${selectedProducts.includes(product.id) 
              ? 'ring-2 ring-primary shadow-md' 
              : 'hover:shadow-lg hover:border-primary/30'
            }
          `}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={getProductImageUrl(product.product_image)}
              alt={product.product_title_english}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => handleImageError(e, 'product')}
            />
            
            {/* Selection Checkbox Overlay */}
            <div className="absolute top-3 left-3">
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-md"
              />
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <ProductStatusBadge status={product.status} />
            </div>
          </div>

          {/* Card Content */}
          <CardContent className="p-4 space-y-3">
            {/* Product Title and SKU */}
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">
                {product.product_title_english}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                SKU: {product.sku}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.offer_price)}
                </span>
                {product.regular_price > product.offer_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Level */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                product.stock === 0 
                  ? 'text-red-600' 
                  : product.stock <= LOW_STOCK_THRESHOLD
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}>
                {product.stock} in stock
              </span>
              {product.stock === 0 && (
                <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
                  Out of Stock
                </span>
              )}
              {product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                  Low Stock
                </span>
              )}
            </div>
          </CardContent>

          {/* Card Footer - Actions */}
          <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(product)}
              className="flex-1 h-9 text-xs"
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              View
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {product.status === '0' && (
                  <DropdownMenuItem onClick={() => onEdit(product)} className="cursor-pointer">
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
