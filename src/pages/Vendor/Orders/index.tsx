import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, Search, RefreshCw } from 'lucide-react';
import { useOrders } from './hooks/useOrders';
import { Order, OrderStatus, OrderFilters } from './types/order.types';
import { OrderTable } from './components/OrderTable';
import { StatusUpdateModal } from './components/StatusUpdateModal';


export default function Orders() {
  const navigate = useNavigate();
  const { fetchOrders, updateOrderStatus, isLoading } = useOrders();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'All',
    page: 1,
    limit: 10
  });
  
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{ orderNo: string; status: OrderStatus } | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadOrders = useCallback(async () => {
    try {
      console.log('🔵 [Orders] Loading orders with filters:', filters);
      const data = await fetchOrders(filters);
      console.log('🟢 [Orders] Orders loaded:', data.length, 'orders');
      setOrders(data);
      applyFilters(data, filters);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('❌ [Orders] Failed to load orders:', error);
    }
  }, [filters, fetchOrders]);

  const applyFilters = (data: Order[], currentFilters: OrderFilters) => {
    let filtered = [...data];

    // Apply status filter
    if (currentFilters.status && currentFilters.status !== 'All') {
      if (currentFilters.status === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(order => 
          new Date(order.created_at).toISOString().split('T')[0] === today
        );
      } else {
        filtered = filtered.filter(order => order.status === currentFilters.status);
      }
    }

    // Apply search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(order =>
        order.order_no.toLowerCase().includes(searchTerm) ||
        order.user_name.toLowerCase().includes(searchTerm) ||
        order.user_phone.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadOrders]);

  // Initial load
  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters(orders, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearch = (value: string) => {
    setFilters((prev: OrderFilters) => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev: OrderFilters) => ({ ...prev, status: value as OrderStatus | 'All', page: 1 }));
  };

  const handleLimitChange = (value: string) => {
    setFilters((prev: OrderFilters) => ({ ...prev, limit: parseInt(value), page: 1 }));
  };

  const handleViewDetails = (orderNo: string) => {
    navigate(`/vendor/dashboard/orders/${orderNo}`);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder({ orderNo: order.order_no, status: order.status });
    setIsStatusModalOpen(true);
    // Store the order ID for status update
    (window as any).__selectedOrderId = order.id;
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    
    // Use order.id (primary key) for status update, not order_no
    const orderId = (window as any).__selectedOrderId || selectedOrder.orderNo;
    console.log('🔵 [Orders] Updating status:', { orderId, orderNo: selectedOrder.orderNo, newStatus });
    const success = await updateOrderStatus(orderId, newStatus);
    console.log('🟢 [Orders] Update result:', success);
    if (success) {
      await loadOrders();
    }
    // Clean up
    delete (window as any).__selectedOrderId;
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-light/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-light" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-sm text-gray-500">Track and manage customer orders</p>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          Last updated: {lastRefreshed.toLocaleTimeString()}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search Orders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by order number or customer name..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Filter by Status
              </label>
              <Select value={filters.status} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="today">Today's Orders</SelectItem>
                  <SelectItem value="Order Placed">Order Placed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count and limit */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredOrders.length}</span> orders
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Per page:</label>
              <Select value={filters.limit?.toString() || '10'} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-light" />
            </div>
          ) : (
            <OrderTable
              orders={filteredOrders}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </CardContent>
      </Card>

      {/* Status Update Modal */}
      {selectedOrder && (
        <StatusUpdateModal
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setSelectedOrder(null);
          }}
          currentStatus={selectedOrder.status}
          onUpdate={handleStatusUpdate}
          orderNo={selectedOrder.orderNo}
        />
      )}


    </div>
  );
}
