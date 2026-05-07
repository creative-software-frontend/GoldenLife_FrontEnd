import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Order, 
  OrderFilters, 
  OrdersApiResponse, 
  OrderTrackingApiResponse, 
  UpdateStatusApiResponse,
  OrderStatus 
} from '../types/instructor_order.types';

export function useInstructorOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  const getAuthToken = () => {
    const session = sessionStorage.getItem('instructor_session');
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      return parsed.token || null;
    } catch {
      return null;
    }
  };

  /**
   * Fetch all instructor orders with filters
   */
  const fetchOrders = useCallback(async (filters?: OrderFilters): Promise<Order[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status && filters.status !== 'All') {
        params.append('status', filters.status);
      }
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get<OrdersApiResponse>(
        `${baseURL}/api/instructor/orders/history`,
        {
          headers: { 'X-Auth-Token': `Bearer ${token}` },
          params
        }
      );

      if (response.data.status) {
        return response.data.orders || [];
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('❌ [API] Fetch instructor orders error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  /**
   * Fetch order tracking details
   */
  const fetchOrderTracking = useCallback(async (orderNo: string): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.get<OrderTrackingApiResponse>(
        `${baseURL}/api/instructor/order/tracking`,
        {
          headers: { 'X-Auth-Token': `Bearer ${token}` },
          params: { order_no: orderNo }
        }
      );

      if (response.data.status && response.data.order) {
        const order = response.data.order;
        // Ensure products is always an array to prevent frontend crashes
        if (!order.products) {
          order.products = [];
        }
        return order;
      } else {
        throw new Error(response.data.message || 'Failed to fetch tracking data');
      }
    } catch (err: any) {
      console.error('❌ [API] Fetch tracking error:', err);
      toast.error(err.message || 'Failed to fetch tracking data');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  /**
   * Update order status
   */
  const updateOrderStatus = useCallback(async (orderId: number | string, status: OrderStatus): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      // Use the endpoint provided in the request
      const response = await axios.post<UpdateStatusApiResponse>(
        `${baseURL}/api/updatetStatus/order`,
        { status },
        {
          headers: { 
            'X-Auth-Token': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: { id: orderId.toString() }
        }
      );

      if (response.data.success || (response.data as any).status === true) {
        toast.success('Order status updated successfully!');
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to update order status');
      }
    } catch (err: any) {
      console.error('❌ [API] Update order status error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update order status';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  return {
    fetchOrders,
    fetchOrderTracking,
    updateOrderStatus,
    isLoading,
    error,
  };
}
