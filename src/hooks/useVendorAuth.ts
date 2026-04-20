import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for vendor authentication operations
 * Provides logout, token management, and session handling
 */
export function useVendorAuth() {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  /**
   * Get auth token from session storage
   */
  const getAuthToken = useCallback(() => {
    const session = sessionStorage.getItem('vendor_session');
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      return parsed.token || null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Logout vendor - calls API and clears session
   */
  const handleLogout = useCallback(async () => {
    try {
      const token = getAuthToken();

      if (token) {
        // Call logout API to invalidate token on server
        await axios.post(
          `${baseURL}/api/vendor/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ [useVendorAuth] Logout API call successful');
      }
    } catch (error: any) {
      // Log error but continue with cleanup
      console.error('❌ [useVendorAuth] Logout error:', error.response?.data || error.message);
    } finally {
      // Clear session regardless of API success/failure
      sessionStorage.removeItem('vendor_session');

      // Clear any vendor-related cookies
      document.cookie = 'vendor_token=; path=/; max-age=0; SameSite=Strict';

      // Show success message
      toast.success('Logged out successfully');

      // Redirect to login page
      navigate('/vendor/login');
    }
  }, [baseURL, getAuthToken, navigate]);

  /**
   * Check if vendor is authenticated
   */
  const isAuthenticated = useCallback(() => {
    const token = getAuthToken();
    return !!token;
  }, [getAuthToken]);

  /**
   * Get current vendor info from session
   */
  const getCurrentVendor = useCallback(() => {
    const session = sessionStorage.getItem('vendor_session');
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      return parsed.user || null;
    } catch {
      return null;
    }
  }, []);

  return {
    handleLogout,
    getAuthToken,
    isAuthenticated,
    getCurrentVendor,
  };
}
