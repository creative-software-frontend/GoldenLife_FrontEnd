import React from 'react';
import { Search, Plus, Grid3X3, Table } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductFiltersProps } from '../types';
import { STATUS_OPTIONS, STOCK_OPTIONS, SORT_OPTIONS } from '../constants';

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  onAddProduct,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    console.log('🔵 [ProductFilters] Status filter changed to:', value);
    console.log('🔵 [ProductFilters] Current filters before change:', filters);
    const newFilters = { ...filters, status: value as any };
    console.log('🔵 [ProductFilters] New filters object:', newFilters);
    onFiltersChange(newFilters);
  };

  const handleStockChange = (value: string) => {
    console.log('🔵 [ProductFilters] Stock filter changed to:', value);
    onFiltersChange({ ...filters, stock: value as any });
  };

  const handleSortChange = (value: string) => {
    console.log('🔵 [ProductFilters] Sort filter changed to:', value);
    onFiltersChange({ ...filters, sort: value as any });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Search and Add Button Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by product name or SKU..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10 h-10 rounded-xl border-input bg-background focus-visible:ring-primary/20"
            />
          </div>
          
          <Button 
            onClick={onAddProduct}
            className="h-10 px-6 rounded-xl font-semibold shadow-md bg-primary-light hover:bg-primary-default transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters and View Toggle Row */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Stock Filter */}
            <Select
              value={filters.stock}
              onValueChange={handleStockChange}
            >
              <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl">
                <SelectValue placeholder="Stock Level" />
              </SelectTrigger>
              <SelectContent>
                {STOCK_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select
              value={filters.sort}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className={`h-9 px-3 rounded-lg ${
                viewMode === 'table' 
                  ? 'bg-primary-light shadow-sm' 
                  : 'hover:bg-background'
              }`}
            >
              <Table className="w-4 h-4 mr-2" />
              Table
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={`h-9 px-3 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-primary-light shadow-sm' 
                  : 'hover:bg-background'
              }`}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
