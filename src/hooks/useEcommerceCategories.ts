import { useState, useEffect } from 'react';
import axios from 'axios';

export interface EcommerceCategory {
  id: number;
  category_name: string;
  category_slug: string;
  category_discription: string;
  category_image: string;
  category_icon: string;
  status: string;
}

interface UseCategoriesReturn {
  categories: EcommerceCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useEcommerceCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<EcommerceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get token
      const session = sessionStorage.getItem('vendor_session');
      let token = '';
      if (session) {
        try {
          const parsed = JSON.parse(session);
          token = parsed.token || '';
          console.log('Token found:', token ? `${token.substring(0, 20)}...` : 'No token');
        } catch {
          console.warn('Failed to parse session');
          token = '';
        }
      } else {
        console.warn('No vendor_session found in sessionStorage');
      }

      // Make API call with timeout
      console.log('Fetching categories from API...');
      const response = await axios.get(
        'https://admin.goldenlifeltd.com/api/vendor/ecommerce/categories',
        {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          } : {},
          timeout: 15000, // 15 second timeout
        }
      );

      console.log('API Response Status:', response.status);
      console.log('API Response Data:', response.data);

      // Check response structure
      if (response.data?.status === true) {
        if (Array.isArray(response.data?.data)) {
          console.log(`Successfully loaded ${response.data.data.length} categories`);
          const sorted = [...response.data.data].sort((a, b) => a.id - b.id);
          setCategories(sorted);
        } else {
          console.warn('Response data is not an array:', response.data?.data);
          setCategories([]);
          setError('Invalid data format received from server');
        }
      } else {
        console.warn('API returned status false or invalid:', response.data);
        setCategories([]);
        setError(response.data?.message || 'Failed to load categories');
      }
    } catch (err: any) {
      console.error('API Error Details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
        }
      });

      // Handle specific error types
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your internet connection.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login as vendor and try again.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. You don\'t have permission to access categories.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check the URL.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check if the API server is running.');
      } else {
        setError(err.response?.data?.message || 'Unable to load categories. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};
