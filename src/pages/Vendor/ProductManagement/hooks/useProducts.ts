import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Product, ProductFilters, PaginationState } from '../types';
import { LOW_STOCK_THRESHOLD } from '../constants';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 25, // Increased default from 10 to 25
    totalItems: 0,
    totalPages: 0,
  });

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  // Get auth token from session storage
  const getAuthToken = () => {
    const session = sessionStorage.getItem('vendor_session');
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      return parsed.token || null;
    } catch {
      return null;
    }
  };

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsLoading(false);
        toast.error('Please log in to view products');
        return;
      }

      setIsLoading(true);
      setError(null);

      console.log('🔄 [useProducts] Fetching products from API...');
      const response = await axios.get(`${baseURL}/api/vendor/product/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          page: 1,
          limit: 100,  // Request up to 100 products
          all: true    // Try to get all products
        },
      });

      console.log('📦 [useProducts] API Response:', {
        status: response.status,
        data: response.data,
        hasProducts: !!response.data.products,
        hasData: !!response.data.data,
        isArray: Array.isArray(response.data),
        productsLength: response.data.products?.length || 0,
        dataLength: response.data.data?.length || 0,
        total: response.data.total || 0
      });

      // Handle different response structures
      const responseData = response.data;
      let productList: Product[] = [];
      let total = 0;

      if (responseData.products) {
        console.log('✅ [useProducts] Found products array in response.products');
        productList = responseData.products;
        total = responseData.total || responseData.products.length;
      } else if (Array.isArray(responseData)) {
        console.log('✅ [useProducts] Response is direct array');
        productList = responseData;
        total = responseData.length;
      } else if (responseData.data) {
        console.log('✅ [useProducts] Found data object in response.data');
        productList = responseData.data.products || responseData.data;
        total = responseData.data.total || responseData.data.length;
      }

      console.log('📊 [useProducts] Processed data:', {
        productCount: productList.length,
        total,
        firstProduct: productList[0] ? {
          id: productList[0].id,
          title: productList[0].product_title_english,
          sku: productList[0].sku
        } : null
      });

      setProducts(productList);
      setFilteredProducts(productList);
      const newPageSize = 25;
      setPagination((prev: PaginationState) => ({
        ...prev,
        totalItems: productList.length,
        totalPages: Math.ceil(productList.length / prev.pageSize),
      }));

      console.log('✅ [useProducts] Initial state updated - ALL products shown:', {
        productsSet: productList.length,
        filteredProductsSet: productList.length,
        totalItems: productList.length,
        pageSize: newPageSize,
        currentPage: 1
      });

      toast.success(`Loaded ${productList.length} products`);
    } catch (err: any) {
      console.error('❌ [useProducts] Failed to fetch products:', err);
      console.error('[useProducts] Error details:', {
        message: err.message,
        response: err.response?.data,
        code: err.code
      });
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load products';
      setError(errorMessage);
      toast.error(errorMessage);

      // If network error, provide retry option
      if (err.code === 'ERR_NETWORK' || !err.response) {
        toast.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Delete product
  const deleteProduct = async (productId: number): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.delete(`${baseURL}/api/vendor/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      setFilteredProducts(prev => prev.filter(p => p.id !== productId));

      toast.success('Product deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      toast.error(errorMessage);
      return false;
    }
  };

  // Bulk actions
  const bulkDeleteProducts = async (productIds: number[]): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Delete all selected products
      const deletePromises = productIds.map(id =>
        axios.delete(`${baseURL}/api/vendor/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      await Promise.all(deletePromises);

      // Remove from local state
      setProducts(prev => prev.filter(p => !productIds.includes(p.id)));
      setFilteredProducts(prev => prev.filter(p => !productIds.includes(p.id)));

      toast.success(`Deleted ${productIds.length} products successfully`);
      return true;
    } catch (err: any) {
      console.error('Failed to bulk delete products:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete products';
      toast.error(errorMessage);
      return false;
    }
  };

  // Apply filters and sorting
  const applyFilters = useCallback((filters: ProductFilters) => {
    console.log('🔍 [useProducts.applyFilters] Applying filters:', filters);
    console.log('📦 [useProducts.applyFilters] Total products in state:', products.length);

    let result = [...products];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product =>
        product.product_title_english.toLowerCase().includes(searchTerm) ||
        product.product_title_bangla.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm)
      );
      console.log('🔎 [applyFilters] After search filter:', result.length, 'products');
    }

    // Status filter - IMPORTANT: Only filter if NOT 'all'
    console.log('🔵 [Status Filter] Current status filter value:', filters.status);
    if (filters.status === 'active') {
      const beforeCount = result.length;
      console.log('🔵 [Status Filter] Filtering for ACTIVE products...');
      console.log('🔵 [Status Filter] Products before filter:', beforeCount);

      result = result.filter(product => {
        const isActive = product.status === 1 || product.status === "1";
        console.log(`🔵 [Status Filter] Product ID ${product.id}: status="${product.status}" (${typeof product.status}), isActive=${isActive}`);
        return isActive;
      });

      console.log('🔎 [applyFilters] After ACTIVE filter:', result.length, 'products (removed', beforeCount - result.length, ')');
    } else if (filters.status === 'inactive') {
      const beforeCount = result.length;
      console.log('🔵 [Status Filter] Filtering for INACTIVE products...');
      console.log('🔵 [Status Filter] Products before filter:', beforeCount);

      result = result.filter(product => {
        const isInactive = product.status === 0 || product.status === "0";
        console.log(`🔵 [Status Filter] Product ID ${product.id}: status="${product.status}" (${typeof product.status}), isInactive=${isInactive}`);
        return isInactive;
      });

      console.log('🔎 [applyFilters] After INACTIVE filter:', result.length, 'products (removed', beforeCount - result.length, ')');
    } else {
      console.log('✅ [applyFilters] Status filter is "all" - showing all statuses');
    }

    // Stock filter - IMPORTANT: Only filter if NOT 'all'
    if (filters.stock === 'low_stock') {
      const beforeCount = result.length;
      result = result.filter(product => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD);
      console.log('🔎 [applyFilters] After LOW_STOCK filter:', result.length, 'products (removed', beforeCount - result.length, ')');
    } else if (filters.stock === 'out_of_stock') {
      const beforeCount = result.length;
      result = result.filter(product => product.stock === 0);
      console.log('🔎 [applyFilters] After OUT_OF_STOCK filter:', result.length, 'products (removed', beforeCount - result.length, ')');
    } else {
      console.log('✅ [applyFilters] Stock filter is "all" - showing all stock levels');
    }

    // Sorting
    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => a.offer_price - b.offer_price);
        console.log('📊 [applyFilters] Sorted by price ascending');
        break;
      case 'price_desc':
        result.sort((a, b) => b.offer_price - a.offer_price);
        console.log('📊 [applyFilters] Sorted by price descending');
        break;
      case 'stock_asc':
        result.sort((a, b) => a.stock - b.stock);
        console.log('📊 [applyFilters] Sorted by stock ascending');
        break;
      case 'stock_desc':
        result.sort((a, b) => b.stock - b.stock);
        console.log('📊 [applyFilters] Sorted by stock descending');
        break;
      case 'date_asc':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        console.log('📊 [applyFilters] Sorted by date ascending');
        break;
      case 'date_desc':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        console.log('📊 [applyFilters] Sorted by date descending (default)');
        break;
    }

    console.log('🎯 [applyFilters] Final filtered count:', result.length, 'out of', products.length);

    setFilteredProducts(result);
    setPagination((prev: PaginationState) => ({
      ...prev,
      currentPage: 1, // Reset to first page when filters change
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.pageSize),
    }));
  }, [products]);

  // Update page size
  const updatePageSize = useCallback((pageSize: number) => {
    setPagination((prev: PaginationState) => ({
      ...prev,
      pageSize,
      currentPage: 1,
      totalPages: Math.ceil(filteredProducts.length / pageSize),
    }));
  }, [filteredProducts.length]);

  // Update ebook status
  const updateEbookStatus = async (productId: number, isEbook: boolean): Promise<void> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.post(
        `${baseURL}/api/vendor/product/${productId}/ebook`,
        { ebook: isEbook ? '1' : '0' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Update local state
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, ebook: isEbook ? '1' : '0' } : p
      ));
      setFilteredProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, ebook: isEbook ? '1' : '0' } : p
      ));
    } catch (err: any) {
      console.error('Failed to update ebook status:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update ebook status';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update video link
  const updateVideoLink = async (productId: number, videoLink: string): Promise<void> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.post(
        `${baseURL}/api/vendor/product/${productId}/video-link`,
        { video_link: videoLink },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Update local state
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, video_link: videoLink } : p
      ));
      setFilteredProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, video_link: videoLink } : p
      ));
    } catch (err: any) {
      console.error('Failed to update video link:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update video link';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Get paginated products
  const getPaginatedProducts = useCallback(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedResult = filteredProducts.slice(startIndex, endIndex);

    console.log('📄 [useProducts.getPaginatedProducts] Pagination info:', {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      totalFiltered: filteredProducts.length,
      startIndex,
      endIndex,
      showingCount: paginatedResult.length,
      productIds: paginatedResult.map(p => p.id)
    });

    return paginatedResult;
  }, [filteredProducts, pagination.currentPage, pagination.pageSize]);

  return {
    products: getPaginatedProducts(),
    allProducts: products,
    filteredProducts,
    isLoading,
    error,
    pagination,
    fetchProducts,
    deleteProduct,
    bulkDeleteProducts,
    applyFilters,
    updatePageSize,
    setPagination,
    updateEbookStatus,
    updateVideoLink,
  };
}
