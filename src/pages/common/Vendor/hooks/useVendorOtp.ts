import { useState, useCallback } from 'react';
import axios from 'axios';

interface VendorOtpResponse {
  success: boolean;
  user_id?: number;
  message?: string;
  token?: string;
  user?: any;
}

export const useVendorOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

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

  /**
   * Send OTP to vendor's email or mobile
   */
  const sendOtp = useCallback(async (credential: string, type: 'email' | 'mobile'): Promise<VendorOtpResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔵 [useVendorOtp] Sending OTP to:', { credential, type });

      const endpoint = `${baseURL}/api/vendor/login/send-otp`;
      const queryParams = type === 'mobile' ? `?mobile=${encodeURIComponent(credential)}` : `?email=${encodeURIComponent(credential)}`;

      console.log('📍 [useVendorOtp] Request URL:', endpoint + queryParams);

      const response = await axios.post(endpoint + queryParams, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      console.log('🟢 [useVendorOtp] Full Response:', {
        status: response.status,
        data: response.data,
        success: response.data.success,
        user_id: response.data.user_id
      });

      if (response.data.success && response.data.user_id) {
        setUserId(response.data.user_id);
      }

      return response.data;
    } catch (err: any) {
      console.error('❌ [useVendorOtp] Failed to send OTP:', err);
      console.error('[useVendorOtp] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });

      const errorMessage = err.response?.data?.message || err.message || 'Failed to send OTP';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  /**
   * Verify OTP and login vendor
   */
  const verifyOtp = useCallback(async (otpCode: string): Promise<VendorOtpResponse> => {
    if (!userId) {
      throw new Error('User ID not found. Please request OTP first.');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔵 [useVendorOtp] Verifying OTP:', { userId, otp: otpCode });

      const endpoint = `${baseURL}/api/vendor/login/verify-otp`;
      const queryParams = `?user_id=${userId}&otp=${encodeURIComponent(otpCode)}`;

      const response = await axios.post(endpoint + queryParams, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      console.log('🟢 [useVendorOtp] OTP verified successfully:', response.data);

      if (response.data.success && response.data.token) {
        // Store token in sessionStorage
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours

        sessionStorage.setItem('vendor_session', JSON.stringify({
          token: response.data.token,
          user: response.data.user,
          expiry: expirationDate.getTime()
        }));

        console.log('✅ [useVendorOtp] Session stored successfully');
      }

      return response.data;
    } catch (err: any) {
      console.error('❌ [useVendorOtp] Failed to verify OTP:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Invalid OTP';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [baseURL, userId]);

  /**
   * Alternative: Direct login with OTP (single step)
   */
  const loginWithOtp = useCallback(async (mobile: string, otpCode: string): Promise<VendorOtpResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔵 [useVendorOtp] Direct login with OTP:', { mobile, otp: otpCode });

      const endpoint = `${baseURL}/api/vendor/loginWithOTP`;
      const queryParams = `?mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otpCode)}`;

      const response = await axios.post(endpoint + queryParams, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      console.log('🟢 [useVendorOtp] Direct OTP login successful:', response.data);

      if (response.data.success && response.data.token) {
        // Store token in sessionStorage
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours

        sessionStorage.setItem('vendor_session', JSON.stringify({
          token: response.data.token,
          user: response.data.user,
          expiry: expirationDate.getTime()
        }));

        console.log('✅ [useVendorOtp] Session stored successfully');
      }

      return response.data;
    } catch (err: any) {
      console.error('❌ [useVendorOtp] Failed direct OTP login:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset user ID (for logout or retry)
   */
  const resetUserId = useCallback(() => {
    setUserId(null);
  }, []);

  return {
    sendOtp,
    verifyOtp,
    loginWithOtp,
    isLoading,
    error,
    userId,
    clearError,
    resetUserId,
  };
};
