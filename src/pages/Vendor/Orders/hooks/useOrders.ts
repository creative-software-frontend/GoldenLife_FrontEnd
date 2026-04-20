import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Order, OrderFilters, OrdersApiResponse, OrderTrackingApiResponse, UpdateStatusApiResponse } from '../types/order.types';

export function useOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

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
   * Fetch all orders with filters
   */
  const fetchOrders = useCallback(async (filters?: OrderFilters): Promise<Order[]> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 [API] Fetching orders with filters:', filters);

      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      console.log('🔵 [API] Request params:', params.toString());

      // Try multiple endpoint patterns to find the correct one
      const endpointsToTry = [
        `${baseURL}/api/vendor/order/history`,
        `${baseURL}/api/vendor/orders/history`,
        `${baseURL}/api/order/history`,
        `${baseURL}/api/vendor/orders/list`
      ];

      let lastError: any = null;

      for (const endpoint of endpointsToTry) {
        try {
          console.log(`🔵 [API] Trying endpoint: ${endpoint}`);

          const response = await axios.get<OrdersApiResponse>(
            endpoint,
            {
              headers: { Authorization: `Bearer ${token}` },
              params
            }
          );

          console.log(`🟢 [API] Success with endpoint: ${endpoint}`, response.data);

          if (response.data.status === 'success') {
            const orders = response.data.orders || [];
            console.log('✅ [API] Orders loaded successfully:', orders.length, 'orders');
            return orders;
          } else {
            throw new Error(response.data.message || 'Failed to fetch orders');
          }
        } catch (err: any) {
          console.warn(`⚠️ Failed with endpoint ${endpoint}:`, err.response?.status, err.message);
          lastError = err;

          // If it's not a 404, stop trying other endpoints
          if (err.response?.status !== 404) {
            throw err;
          }
          // Continue to next endpoint pattern
        }
      }

      // All endpoints failed with 404
      console.error('❌ [API] All order endpoints failed with 404');
      throw new Error('Orders endpoint not found. Please check API configuration.');

    } catch (err: any) {
      console.error('❌ [API] Fetch orders error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch orders';
      setError(errorMessage);

      // Handle 404 specifically
      if (err.response?.status === 404) {
        toast.error('Orders endpoint not found. Please contact administrator.');
      } else if (err.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error(errorMessage);
      }

      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  /**
   * Fetch single order details by order number
   */
  const fetchOrderDetails = useCallback(async (orderNo: string): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 [API] Fetching order details for:', orderNo);

      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await axios.get<OrdersApiResponse>(
        `${baseURL}/api/vendor/orders/history`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('🟢 [API] Order details response (from history):', response.data);


      if (response.data.status === 'success') {
        // Filter by order_no to find the specific order
        const order = response.data.orders?.find((o: Order) => o.order_no === orderNo) || null;
        console.log('✅ [API] Order loaded successfully:', order?.order_no);

        if (!order) {
          throw new Error('Order not found in history');
        }

        return order;
      } else {
        throw new Error(response.data.message || 'Failed to fetch order details');
      }
    } catch (err: any) {
      console.error('❌ [API] Fetch order details error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch order details';
      setError(errorMessage);

      // Handle 404 specifically
      if (err.response?.status === 404) {
        toast.error('Order not found. The order number may be invalid.');
      } else {
        toast.error(errorMessage);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update order status - tries multiple endpoint patterns
   * Backend says '/api/updateStatus/order' not found, so we try alternatives
   */
  const updateOrderStatus = useCallback(async (orderId: number | string, status: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 [API] updateStatus called with:', { orderId, status });

      const token = getAuthToken();
      console.log('🔵 [API] Token present:', !!token);
      console.log('🔵 [API] Token value (first 20 chars):', token?.substring(0, 20));

      if (!token) {
        console.error('❌ [API] NO TOKEN FOUND!');
        toast.error('Session expired. Please login again.');
        return false;
      }

      // Possible endpoints to try based on common patterns and Postman collection
      const endpointsToTry = [
        {
          url: `${baseURL}/api/updatetStatus/order`,
          config: {
            params: { id: orderId.toString() },
            body: { status }
          },
          name: 'Pattern 1: /api/updatetStatus/order (with typo)'
        },
        {
          url: `${baseURL}/api/updateStatus/order`,
          config: {
            params: { id: orderId.toString() },
            body: { status }
          },
          name: 'Pattern 2: /api/updateStatus/order (correct spelling)'
        },
        {
          url: `${baseURL}/api/vendor/updateStatus/order`,
          config: {
            params: { id: orderId.toString() },
            body: { status }
          },
          name: 'Pattern 3: /api/vendor/updateStatus/order'
        },
        {
          url: `${baseURL}/api/order/status`,
          config: {
            body: { id: orderId.toString(), status }
          },
          name: 'Pattern 4: /api/order/status (body params)'
        },
        {
          url: `${baseURL}/api/vendor/order/status`,
          config: {
            body: { id: orderId.toString(), status }
          },
          name: 'Pattern 5: /api/vendor/order/status (body params)'
        },
        {
          url: `${baseURL}/api/order/status/${orderId}`,
          config: {
            method: 'PUT',
            body: { status }
          },
          name: 'Pattern 6: PUT /api/order/status/{id}'
        }
      ];

      let lastError: any = null;
      let successfulEndpoint = '';

      for (const endpoint of endpointsToTry) {
        try {
          console.log(`🔵 [API] Trying ${endpoint.name}`);
          console.log(`🔵 [API] Full URL: ${endpoint.url}`);
          console.log(`🔵 [API] Request config:`, endpoint.config);

          const axiosConfig: any = {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          };

          // Add params if present
          if (endpoint.config.params) {
            axiosConfig.params = endpoint.config.params;
          }

          // Determine HTTP method
          const method = endpoint.config.method || 'POST';

          const response = await axios.request<UpdateStatusApiResponse>({
            method,
            url: endpoint.url,
            data: endpoint.config.body,
            ...axiosConfig
          });

          console.log(`🟢 [API] Success with ${endpoint.name}:`, response.data);
          successfulEndpoint = endpoint.name;

          if (response.data.success) {
            toast.success('Order status updated successfully!');
            console.log(`✅ Used endpoint: ${endpoint.name}`);
            console.log('✅ Order list will refresh automatically');
            return true;
          } else {
            throw new Error(response.data.message || 'Failed to update order status');
          }

        } catch (err: any) {
          console.warn(`⚠️ Failed with ${endpoint.name}:`, err.response?.status, err.response?.data);
          lastError = err;

          // If it's not a 404 or 405, stop trying other endpoints
          if (err.response?.status !== 404 && err.response?.status !== 405) {
            console.error(`❌ Stopping at ${endpoint.name} due to error ${err.response?.status}`);
            throw err;
          }
          // Continue to next endpoint pattern
        }
      }

      // All endpoints failed
      if (!successfulEndpoint) {
        console.error('❌ [API] All endpoints failed. Last error:', lastError);
        console.error('❌ [API] Error details:', lastError.response?.data);
        throw new Error(
          `Unable to update order status. Tried ${endpointsToTry.length} endpoints but all failed. ` +
          `Please contact administrator to verify the correct API endpoint. ` +
          `Last error: ${lastError.response?.data?.message || lastError.message}`
        );
      }

      return false;

    } catch (err: any) {
      console.error('❌ [API] Update order status error:', err);
      console.error('❌ [API] Error response:', err.response?.data);
      console.error('❌ [API] Error status:', err.response?.status);

      const errorMessage = err.response?.data?.message || err.message || 'Failed to update order status';
      setError(errorMessage);

      // Handle specific error cases
      if (err.response?.status === 404) {
        console.error('❌ [API] Endpoint not found - Check if backend route exists');
        toast.error('Update endpoint not found. Please contact administrator.');
      } else if (err.response?.status === 401) {
        console.error('❌ [API] Authentication failed - Token may be invalid');
        toast.error('Authentication failed. Please login again.');
      } else if (err.response?.status === 500) {
        console.error('❌ [API] Server error');
        toast.error('Server error. Please try again later.');
      } else if (err.response?.status === 400) {
        console.error('❌ [API] Bad request - Invalid data sent');
        toast.error('Invalid request. Please check the order number and status.');
      } else {
        toast.error(errorMessage);
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  return {
    fetchOrders,
    fetchOrderDetails,
    updateOrderStatus,
    isLoading,
    error,
  };
}
